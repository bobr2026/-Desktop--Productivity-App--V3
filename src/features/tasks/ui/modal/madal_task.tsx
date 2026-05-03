import { useSelector, useDispatch } from 'react-redux'
import { global_store_type, task_ui_madal_type } from '../../../../App/store/global_store.types'
import { AppDispatch } from '../../../../App/store/store'
import model_cloused_icon from '../../task_icon/modal_closed_icon.png'
import styles from './madal_task.module.sass'
import { useEffect } from 'react'
import useGet_active_worspase_from_localStore from '../../../../shared/hooks/useGet_active_worspase_from_localStore'
import Note_task_item from '../../note_task'
import { remove_rerender_sub_elements, remove_show_elelemts_madal, set_rerender_sub_elements } from '../../store/task_ui_slise_store'
import { get_all_Sub_sub_tasksBy_workspace_id } from '../../store/sub_task_list_store'
import { get_all_notesBy_workspace_id } from '../../../../App/store/note_list_slise_store'
import { invoke } from '@tauri-apps/api/core'
export interface Madal_task_props{
    type_madal:task_ui_madal_type

}
export default function Madal_task({type_madal}:Madal_task_props){
    const show_elelemts_madal = useSelector((stete: global_store_type) => stete.ui_task_list.show_elelemts_madal)
    const parent_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.parent_element_id)
    const select_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.select_element_id)
    const dispatch = useDispatch<AppDispatch>()
    const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
    const active_workspase_local_store = useGet_active_worspase_from_localStore()
    const notes =useSelector((state:global_store_type)=>state.note_list.notes)
    const tasks = useSelector((state:global_store_type)=>state.sub_task_list.sub_tasks)
    useEffect(()=>{
// if(type_madal=='create_link_task_to_task'){
//  dispatch( get_all_Sub_sub_tasksBy_workspace_id(active_workspase_local_store.workspace_id))
// }else{
//  dispatch(get_all_notesBy_workspace_id(active_workspase_local_store.workspace_id))
dispatch( get_all_Sub_sub_tasksBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
dispatch(get_all_notesBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
// }
    }, [type_madal])
    async function update_data() {
        if(type_madal=='create_link_task_to_note'){
      await invoke("add_element_link", {perentId:parent_element_id,
        subId:select_element_id,swohType:"task_to_note"  })
        dispatch(set_rerender_sub_elements())
       setTimeout(()=>{
    dispatch(remove_rerender_sub_elements())
       }, 200)
        }else{
            await invoke("add_element_link", {perentId:parent_element_id,
                subId:select_element_id,swohType:"task_to_task"  })
        }
        dispatch(set_rerender_sub_elements())
        setTimeout(()=>{
     dispatch(remove_rerender_sub_elements())
        }, 200)
    }
    console.log(notes)
const title_text = type_madal=='create_link_task_to_task'?"Такс,  какую задачу свяжем с задачей ?":"Такс,  какую заметку свяжем с задачей ?"
const note_task_items= notes.map((note)=>{
    return <Note_task_item title={note.title} category_id={note.note_category_id} creaded={note.created_at}
    update={note.updated_at} element_id={note.note_id} mark={note.marks!=null?note.marks:undefined} 
    status={note.status} render_type='madal_list'
    />
})
const sub_task_itens = tasks.map((task)=>{
 return null
})
    return<div className={styles.modal}>
    <div className={styles.modal__header}>
        <h2 className={styles.modal__header_h2}>{title_text}</h2>
        <img className={styles.modal__header_clozed_img} src={model_cloused_icon} alt=""  onClick={()=>{
            dispatch(remove_show_elelemts_madal())
        }}/>
    </div>
    <div className={styles.modal__elements_list}>
{type_madal=="create_link_task_to_note"?note_task_items:sub_task_itens}
    </div>
    <button className={styles.modal__btn_ok} onClick={()=>update_data()}>связать</button>
</div>
}