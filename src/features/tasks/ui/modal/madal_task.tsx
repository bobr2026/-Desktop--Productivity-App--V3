import { useSelector, useDispatch } from 'react-redux'
import { global_store_type, task_ui_madal_type } from '../../../../App/store/global_store.types'
import { AppDispatch } from '../../../../App/store/store'
import model_cloused_icon from '../../task_icon/modal_closed_icon.png'
import styles from './madal_task.module.sass'
import { useEffect, useState } from 'react'
import useGet_active_worspase_from_localStore from '../../../../shared/hooks/useGet_active_worspase_from_localStore'
import Note_task_item from '../../note_task'
import { remove_rerender_sub_elements, remove_show_elelemts_madal, set_rerender_sub_elements, set_rerender_task_list } from '../../store/task_ui_slise_store'
import { delete_Sub_task, get_all_Sub_sub_tasksBy_workspace_id, removeManySubTasks } from '../../store/sub_task_list_store'
import { delete_note, get_all_notesBy_workspace_id } from '../../../../App/store/note_list_slise_store'
import { invoke } from '@tauri-apps/api/core'
import Sub_task_item from '../../sub_task_item'
import {  use_filter_sub_notes_elements, use_filter_sub_task_elements } from './madal.model'
import { i_note, i_task } from '../../../../shared/types'
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
    const [sub_elements_id_arr, set_sub_elements_id_arr]= useState<{sub_element_id:number}[]>([])
    useEffect(()=>{
        dispatch( get_all_notesBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
            dispatch( get_all_Sub_sub_tasksBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
}, [])
console.log(tasks)

    console.log("hello world !")
    async function update_data() {
        if(type_madal=='create_link_task_to_note'){
      await invoke("add_element_link", {perentId:parent_element_id,
        subId:select_element_id,swohType:"task_to_note"  })
        dispatch(set_rerender_sub_elements())
        dispatch(delete_note(select_element_id))
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



// useEffect(() => {
//     async function filter_data() {
//         const sub_elements_id: { sub_element_id: number }[] =
//             await invoke("get_all_sub_elements_by_swoh_type", {
//                 swohType: "task_to_note",
//             });

//         dispatch(
//             removeManySubTasks(
//                 sub_elements_id.map(item => item.sub_element_id)
//             )
//         );
//     }

//     if (tasks.length > 0) {
//         filter_data();
//     }
// }, [tasks.length, dispatch]);
useEffect(() => {
    async function filter_data(type:"task_to_task"|"task_to_note") {
        const sub_elements_id: { sub_element_id: number }[] =
            await invoke("get_all_sub_elements_by_swoh_type", {
                swohType: type,
            });
console.log(select_element_id)
        const idsToRemove = new Set(
            sub_elements_id.map(item => item.sub_element_id)
        );
console.log(idsToRemove)
if(type=='task_to_task'){
    tasks.forEach(task => {
        if (idsToRemove.has(task.task_id)) {
            dispatch(delete_Sub_task(task.task_id));
        }
    });
    dispatch(delete_Sub_task(parent_element_id))

}
else{
    notes.forEach(task => {
        if (idsToRemove.has(task.note_id)) {
            dispatch(delete_note(task.note_id));
        }
    });



}
    }

    if (tasks.length > 0|| notes.length>0) {
        filter_data(type_madal=='create_link_task_to_task'?"task_to_task":"task_to_note");
    }

 }, [tasks, dispatch]);
const title_text = type_madal=='create_link_task_to_task'?"Такс,  какую задачу свяжем с задачей ?":"Такс,  какую заметку свяжем с задачей ?"
const note_task_items= notes.map((note)=>{
    return <Note_task_item title={note.title} category_id={note.note_category_id} creaded={note.created_at}
    update={note.updated_at} element_id={note.note_id} mark={note.marks!=null?note.marks:undefined} 
    status={note.status} render_type='madal_list' note_id={note.note_id}
    />
})
const sub_task_itens = tasks.map((task)=>{
 return  <Sub_task_item id={task.task_id} title={task.title} mark_type={task.marks} status={task.status}/>
})
console.log(tasks)
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