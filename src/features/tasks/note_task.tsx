import { useEffect, useState } from 'react'
import { marksTask, STATUS_COLORS, statusTask } from '../../shared/types'
import Marks_button from '../../shared/ui/mrks_button/mrks_button'
import styles from './styles/note_task_item.module.sass'
import { invoke } from '@tauri-apps/api/core'
import { AppDispatch } from '../../App/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { set_rerender_task_list, set_select_element_id } from './store/task_ui_slise_store'
import { global_store_type } from '../../App/store/global_store.types'
import note_icon from './task_icon/notes.svg'
import { unlink_elements } from './model/task.module'
import Context_menu from '../../shared/ui/context_munu/context_munu'
import { setOpenedStatusMenu, setOpenedContextMenu } from './store/task_list_ui_store'
import { set_context_munu_point } from '../../App/store/context_munu_slise'
export interface Note_task_item_props {
    note_id:number
    title:string
    status:statusTask
    mark?:marksTask
    creaded:string
    update:string
    category_id:number|null
    element_id:number
    perent_id?:number
    render_type:"madal_list"|"sub_list"


}

// 1. Выносим маппинг цветов за пределы компонента

export default function Note_task_item({ 
    title, status, render_type,  mark, category_id, creaded, update, element_id, perent_id , note_id
}: Note_task_item_props) {
    const dispatch = useDispatch<AppDispatch>()
    const [category_name, set_category_name] = useState<string>("НЕТ")
    const [select, set_select]=useState<boolean>(false)
    const select_element_id = useSelector((stete: global_store_type) => stete.ui_task_list)
    const {openedContextMenuId, contextMenuX, contextMenuY} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
   
    
   
    // 2. Вычисляем цвет на лету без useState!
    const color_status = STATUS_COLORS[status] || "transparent";
    
   const context_munu_itens=  [
        {
            label: "Oтвязать заметку",
            onClick: () => {
                dispatch(set_rerender_task_list())
                                  unlink_elements(perent_id!=undefined?perent_id:0, note_id)
            }
        },
        {
            label: "Удалить",
            onClick: () =>{
                // dispatch(delete_task(id))
                // delete_task_from_db(id)   
         
            }
        }
    
    ]

    useEffect(() => {
        
        async function get_category() {
            if (category_id === null) return; // Защита от пустых ID
            const fetched_category_name: string = await invoke("get_note_Category_name_ById", { categoryId: category_id })
            set_category_name(fetched_category_name)
        }
        if(category_id!=null){

            get_category()
        }
    }, [category_id]) // 3. Хорошей практикой считается указывать переменные в массиве зависимостей
    const fullClassName = `${styles.note_task_item_conteiner}  ${select==false?styles.base:styles.active}`;

    return (
        <div style={{ 'borderLeft': `6px solid ${color_status}` }} className={fullClassName} 
        onClick={
            ()=>{dispatch(set_select_element_id(select_element_id.select_element_id!=element_id?element_id:note_id)), console.log(select_element_id),  set_select(!select) }
            

        } onContextMenu={(e)=>{
            e.preventDefault()
            e.stopPropagation()
              dispatch(setOpenedStatusMenu(null))
                        
                            dispatch(
                                setOpenedContextMenu(
                                   openedContextMenuId === note_id? null : note_id
                                )
                            )
                       
                        dispatch(set_context_munu_point("reset"))
                                        dispatch(set_context_munu_point({
                                            x: e.clientX,
                                            y: e.clientY,
                                        
                                        }))
                           
        }}>
            <div className={styles.note_task_item_conteiner_main}>
                <div className={styles.note_task_item_conteiner_main_1}>
<img style={{display:render_type=='madal_list'?'none':'block'}} className={styles.note_task_item_img} src={note_icon} alt="" />
                </div>
                <div className={styles.note_task_item_conteiner_main_2}>
                <h2>{title}</h2>
                <h3>статус {status}</h3>

                </div>
            </div>
            <div className={styles.note_task_item_conteiner__data_div}>
                <div className={styles.note_task_item_conteiner__data_div_1}>
                    <h3>группа {category_name}</h3>
                    {mark != undefined ? <Marks_button click={() => null} mark_type={mark} /> : null}
                </div>
                <div className={styles.note_task_item_conteiner__data_div_2}>
                    <h3>создан: {creaded}</h3>
                    <h3>обновлен: {update}</h3>
                </div>
            </div>
            
          <Context_menu items={context_munu_itens} open={openedContextMenuId==note_id} x={contextMenuX} y={contextMenuY}/>
        </div>
    )
}