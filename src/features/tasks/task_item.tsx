import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './styles/task_item.module.sass'
import { i_note, i_task, marksTask, statusTask } from "../../shared/types";
import { ReactNode, useEffect, useState } from "react";
import strelka1 from './task_icon/strelka.svg'
import strelka2 from './task_icon/strelka2.svg'
import complete from './task_icon/complete.png'
import not_completed from './task_icon/not complete.png'
import in_work from './task_icon/in work.png'
import pase from './task_icon/pase.png'
import postponed from './task_icon/Group 152.png'
import { update_app } from "../app/store/app_slise_store";
import { invoke } from "@tauri-apps/api/core";
import { global_store_type } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { useDispatch, useSelector } from "react-redux";
import { remove_rerender_sub_elements, set_madal_type, set_perent_element_id, set_rerender_sub_elements, set_rerender_task_list, set_show_elelemts_madal } from "./store/task_ui_slise_store";
import { delete_task, get_all_tasksBy_workspace_id } from "./store/task_list_store";
import Note_task_item from "./note_task";
import { delete_Sub_task } from "./store/sub_task_list_store";
import { delete_task_from_db, unlink_elements } from "./model/task.module";
import Context_menu from "../../shared/ui/context_munu/context_munu";
import { setOpenedContextMenu, setOpenedStatusMenu } from "./store/task_list_ui_store";

interface task_item_props {
    perent_id?:number
    id: number
    status: statusTask
    title: string
    mark_type: marksTask | null
    children?: ReactNode
    workspase:number
}


export default function Task_item({ id, status, title, mark_type, children, perent_id, workspase }: task_item_props) {
    const show_elelemts_madal = useSelector((state: global_store_type) => state.ui_task_list.show_elelemts_madal)
    const parent_element_id = useSelector((state: global_store_type) => state.ui_task_list.parent_element_id)
    const select_element_id = useSelector((state: global_store_type) => state.ui_task_list.select_element_id)
    const rerender_sub_elements = useSelector((state: global_store_type) => state.ui_task_list.rerender_sub_elements)
    const rerender_task_list = useSelector((state: global_store_type) => state.ui_task_list.rerender_task_list)
    const main_task_list = useSelector((state: global_store_type) => state.task_list.tasks)
    const dispatch = useDispatch<AppDispatch>()
    const [show_subtask, set_show_subtask] = useState<boolean>(false)
    const [task_status, set_task_status] = useState<statusTask>(status)
    const [swow_select_status_munu, set_swow_select_status_munu] = useState<boolean>(false)
    const [swow_context_munu, set_swow_context_munu] = useState<{open:boolean,x:number, y:number}>({open:false, x:0,y:0})
    const [sub_notes, set_sub_notes] = useState<i_note[]>([])
    const [sub_task, set_sub_task] = useState<i_task[]>([])
    const openedContextMenuId = useSelector(
        (state: global_store_type) => state.task_list_ui.openedContextMenuId
    )
    
    const openedStatusMenuId = useSelector(
        (state: global_store_type) => state.task_list_ui.openedStatusMenuId
    )
   const context_munu_itens= perent_id==null? [
        {
            label: "Привязать заметку",
            onClick: () => {
                dispatch(set_madal_type("create_link_task_to_note"))
                dispatch(set_show_elelemts_madal())
                dispatch(set_perent_element_id(id))
            }
        },
        {
            label: "Привязать задачу",
            onClick: () => {
                dispatch(set_madal_type("create_link_task_to_task"))
                dispatch(set_show_elelemts_madal())
            }
        },
        {
            label: "Удалить",
            onClick: () =>{
                dispatch(delete_task(id))
                delete_task_from_db(id)   
         
            }
        }
    ]:[
        {label:"отвезать задачу",onClick:()=>{
            console.log("открепить задачу")
            delete_sub_task(id)
            console.log("spase: "+workspase)
            unlink_elements(perent_id!=undefined?perent_id:0, id)
            dispatch(set_rerender_task_list())
            dispatch(get_all_tasksBy_workspace_id(workspase))

        }},
        {
            label: "Удалить",
            onClick: () =>{
                dispatch(delete_task(id))
                delete_task_from_db(id)   
         
            }
        }
    ]

    useEffect(() => {
        async function get_sub_notes() {
            const sub_notes: i_note[] = await invoke('get_notes_for_task', { elementId: id })
            set_sub_notes(sub_notes)
            const sub_task: i_task[] = await invoke('get_tasks_for_note', { elementId: id })
            set_sub_task(sub_task)
            console.log("+++++++++++++++++++")
            console.log("main_task: "+ id)
            console.log(sub_task)
        }
        get_sub_notes()
        

    }, 
    [rerender_sub_elements, rerender_task_list])
    useEffect(()=>{
        
        sub_task.forEach((sub_task)=>{
            main_task_list.forEach(task=>{
                if(sub_task.task_id==task.task_id){
        dispatch(delete_task(task.task_id))
                }
            })
    
     })
    }, [rerender_task_list, rerender_task_list])
    sub_task.forEach((sub_task)=>{
        main_task_list.forEach(task=>{
            if(sub_task.task_id==task.task_id){
    dispatch(delete_task(task.task_id))
            }
        })
})
async function delete_sub_task(id:number){
    sub_task.filter(sub=>sub.task_id!=id)
    dispatch(set_rerender_sub_elements())
    console.log("delete_sub_task")
dispatch(set_rerender_task_list())

 }
    useEffect(() => {
        async function update_status() {
            await invoke("update_task_status", { taskId: id, status: task_status })
        }
        update_status()
    }, [task_status]) // <-- Здесь нужно следить за task_status

    // ИСПРАВЛЕНО: убрал [task_status] из map, добавил key={note.note_id}
    const note_task_items = sub_notes.map((note) => {
        return (
            <Note_task_item
                key={note.note_id} // Обязательный ключ для React
                title={note.title}
                category_id={note.note_category_id}
                creaded={note.created_at}
                update={note.updated_at}
                element_id={note.note_id}
                mark={note.marks != null ? note.marks : undefined}
                status={note.status}
                render_type='sub_list'
                perent_id={id}
                note_id={note.note_id}
            />
        )
    })
    const sub_task_items = sub_task.map((note) => {
        return (
            <Task_item
                key={note.task_id} // Обязательный ключ для React
                title={note.title}
                id={note.task_id}
             mark_type={note.marks != null ? note.marks:null}
                status={note.status}
                perent_id={id}
                workspase={workspase}
            />
        )
    })
//     const context_munu_itens = perent_id==null?<>        <h2 className={styles.task_context_munu_conteiner_h2}
//     onClick={() => {
//         dispatch(set_madal_type("create_link_task_to_note"))
//         dispatch(set_show_elelemts_madal())
//     }}  >привязать заметку</h2>
// <h2 className={styles.task_context_munu_conteiner_h2}
//     onClick={() => {
//         dispatch(set_madal_type("create_link_task_to_task"))
//         dispatch(set_show_elelemts_madal())
//     }}
// >привязать задачу</h2>

// </>
// : <h2 onClick={async () => {
//     console.log("открепить задачу")
//   delete_sub_task(id)
//   console.log("spase: "+workspase)
//   unlink_elements(perent_id!=undefined?perent_id:0, id)
//   dispatch(set_rerender_task_list())
//   dispatch(get_all_tasksBy_workspace_id(workspase))
// }} className={styles.task_context_munu_conteiner_h2}
// >отвезать задачу</h2>
const taskStatusOnClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(setOpenedContextMenu(null))
  

    dispatch(
        setOpenedStatusMenu(
            openedStatusMenuId === id ? null : id
        )
    )
}

    let task_status_icon = <img className={styles.task_item__block__img} src={not_completed} alt="" />
    switch (task_status) {
        case 'completed':
            task_status_icon = <img className={styles.task_item__block__img} src={complete} alt=""
              onClick={taskStatusOnClick}/>
            break;
        case "not completed":
            task_status_icon = <img className={styles.task_item__block__img} src={not_completed} alt=""
            onClick={taskStatusOnClick}/>
            break
        case "in work":
            task_status_icon = <img className={styles.task_item__block__img} src={in_work} alt=""
            onClick={taskStatusOnClick} />
            break
        case "postponed":
            task_status_icon = <img className={styles.task_item__block__img} src={postponed} alt=""
            onClick={taskStatusOnClick}/>
            break
    }

    const style_select_status_elements_1 = {
        display: openedStatusMenuId === id
        ? "flex"
        : "none"
    }

    // ИСПРАВЛЕНО: Добавлена обертка task_item_wrapper, сабтаски вынесены вниз
    return (
        <div className={styles.task_item_wrapper}>
            <div className={styles.task_item__main_conteiner} onContextMenu={(e: React.MouseEvent) => {
                 e.preventDefault()
                 dispatch(setOpenedStatusMenu(null))
             
                 dispatch(
                     setOpenedContextMenu(
                        openedContextMenuId === id ? null : id
                     )
                 )
             
                 set_swow_context_munu({
                     x: e.clientX,
                     y: e.clientY,
                     open: false
                 })
             }} >
                {perent_id==null?  <img className={styles.task_item_togel_subtask} src={show_subtask == false ? strelka1 : strelka2} onClick={() => set_show_subtask(!show_subtask)} alt="" />:null}
              
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
            
                    <Context_menu open={openedContextMenuId === id} x={swow_context_munu.x} y={swow_context_munu.y} items={context_munu_itens}/>
                     {/* <div style={{ 'display': swow_context_munu == true ? "flex" : 'none' }} className={styles.task_context_munu_conteiner}>
                
                {context_munu_itens}
                        
                        <h2 onClick={async () => {
                            dispatch(delete_task(id))
                            delete_task_from_db(id)
                        }} className={styles.task_context_munu_conteiner_h2}
                        >удалить</h2>
                    </div> */}
             </div>
             </div> 

            {/* Сабтаски вынесены ПОД основной блок */}
            <div className={styles.task_item__subtasks_container} style={{ display: show_subtask == false ? "none" : 'flex' }}>
                {note_task_items}
                {sub_task_items}
            </div>
        </div>
    
)
}