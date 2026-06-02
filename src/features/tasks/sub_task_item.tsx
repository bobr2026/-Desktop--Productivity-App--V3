import { invoke } from '@tauri-apps/api/core';
import { title } from 'process';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { global_store_type } from '../../App/store/global_store.types';
import { AppDispatch } from '../../App/store/store';
import { statusTask, i_note, marksTask } from '../../shared/types';
import Marks_button from '../../shared/ui/mrks_button/mrks_button';
import styles from './styles/task_item.module.sass'

import complete from './task_icon/complete.png'
import not_completed from './task_icon/not complete.png'
import in_work from './task_icon/in work.png'
import pase from './task_icon/pase.png'
import postponed from './task_icon/Group 152.png'
import { set_madal_type, set_select_element_id, set_show_elelemts_madal } from './store/task_ui_slise_store';
interface Sub_task_item_props {

    id: number
    status: statusTask
    title: string
    mark_type: marksTask | null
   
}


export default  function Sub_task_item({id, status, title, mark_type}:Sub_task_item_props){
    const show_elelemts_madal = useSelector((state: global_store_type) => state.ui_task_list.show_elelemts_madal)
    const parent_element_id = useSelector((state: global_store_type) => state.ui_task_list.parent_element_id)
    const select_element_id = useSelector((state: global_store_type) => state.ui_task_list.select_element_id)
    const rerender_sub_elements = useSelector((state: global_store_type) => state.ui_task_list.rerender_sub_elements)
    const dispatch = useDispatch<AppDispatch>()
    const [show_subtask, set_show_subtask] = useState<boolean>(false)
    const [task_status, set_task_status] = useState<statusTask>(status)
    const [swow_select_status_munu, set_swow_select_status_munu] = useState<boolean>(false)
    const [swow_context_munu, set_swow_context_munu] = useState<boolean>(false)
    const [sub_notes, set_sub_notes] = useState<i_note[]>([])
    const [select, set_select]=useState<boolean>(false)

    // useEffect(() => {
    //     async function get_sub_notes() {
    //         const sub_notes: i_note[] = await invoke('get_notes_for_task', { elementId: id })
    //         set_sub_notes(sub_notes)
    //     }
    //     get_sub_notes()
    // }, [rerender_sub_elements])

    useEffect(() => {
        async function update_status() {
            await invoke("update_task_status", { taskId: id, status: task_status })
        }
        update_status()
    }, [task_status]) // <-- Здесь нужно следить за task_status

    
    let task_status_icon = <img className={styles.task_item__block__img} src={not_completed} alt="" />
    switch (task_status) {
        case 'completed':
            task_status_icon = <img className={styles.task_item__block__img} src={complete} alt=""
                onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation();
                   
                }} />
            break;
        case "not completed":
            task_status_icon = <img className={styles.task_item__block__img} src={not_completed} alt=""
                onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation();
                  
                }} />
            break
        case "in work":
            task_status_icon = <img className={styles.task_item__block__img} src={in_work} alt=""
                onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation();
                 
                }} />
            break
        case "postponed":
            task_status_icon = <img className={styles.task_item__block__img} src={postponed} alt=""
                onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation();
                   
                }} />
            break
    }

    const style_select_status_elements_1 = {
        display: swow_select_status_munu == false ? "none" : "flex"
    }
    const fullClassName = `${styles.task_item__main_conteiner}  ${select==false?styles.base:styles.active}`;

    // ИСПРАВЛЕНО: Добавлена обертка task_item_wrapper, сабтаски вынесены вниз
    return (
        <div className={styles.task_item_wrapper} >
            <div className={fullClassName} onContextMenu={(e) => {
                e.preventDefault();
               
             }}  onClick={
                         ()=>{dispatch(set_select_element_id(select_element_id!=id?id:select_element_id)), console.log(select_element_id),  set_select(!select)}
                         
             
                     }>
                <div className={styles.task_item__block}>
                    <div className={styles.task_item__block_1}>

                        <div className={styles.select_status_conteiner}>
                            {task_status_icon}
                            <div style={style_select_status_elements_1} className={styles.select_status_elements}>
                                <div className={styles.select_status_element} onClick={() => set_task_status("postponed")}>
                                    <img className={styles.task_item__block__} src={postponed} alt="" />
                                    <h2>Отложено</h2>
                                </div>
                                <div className={styles.select_status_element} onClick={() => set_task_status("in work")}>
                                    <img className={styles.task_item__block__} src={in_work} alt="" />
                                    <h2>В работе</h2>
                                </div>
                                <div className={styles.select_status_element} onClick={() => set_task_status("completed")}>
                                    <img className={styles.task_item__block__} src={complete} alt="" />
                                    <h2>Выполнено</h2>
                                </div>
                                <div className={styles.select_status_element} onClick={() => set_task_status("not completed")}>
                                    <img className={styles.task_item__block__} src={not_completed} alt="" />
                                    <h2> Не выполнено</h2>
                                </div>
                            </div>
                        </div>
                        <h3>{title}</h3>
                    </div>
                    <h3>{task_status}</h3>
                    {mark_type != null ? <Marks_button click={() => null} mark_type={mark_type} /> : null}

                    {/* Контекстное меню */}
                    {/* <div style={{ 'display': swow_context_munu == true ? "flex" : 'none' }} className={styles.task_context_munu_conteiner}>
                        <h2 className={styles.task_context_munu_conteiner_h2}
                            onClick={() => {
                                dispatch(set_madal_type("create_link_task_to_note"))
                                dispatch(set_show_elelemts_madal())
                            }}  >привязать заметку</h2>
                        <h2 className={styles.task_context_munu_conteiner_h2}
                            onClick={() => {
                                dispatch(set_madal_type("create_link_task_to_task"))
                                dispatch(set_show_elelemts_madal())
                            }}
                        >привязать задачу</h2>
                        <h2 onClick={async () => {
                       
                        }} className={styles.task_context_munu_conteiner_h2}
                        >удалить</h2>
                    </div> */}
                </div>
            </div>

            {/* Сабтаски вынесены ПОД основной блок */}
        </div>
    )
}