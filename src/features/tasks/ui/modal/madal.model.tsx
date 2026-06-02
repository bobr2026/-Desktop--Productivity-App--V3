import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { global_store_type } from "../../../../App/store/global_store.types";
import { AppDispatch } from "../../../../App/store/store";
import { get_all_tasksBy_workspace_id } from "../../store/task_list_store";
import useGet_active_worspase_from_localStore from "../../../../shared/hooks/useGet_active_worspase_from_localStore";
import { delete_note, get_all_notesBy_workspace_id } from "../../../../App/store/note_list_slise_store";
import { delete_Sub_task, get_all_Sub_sub_tasksBy_workspace_id } from "../../store/sub_task_list_store";
import { set_rerender_task_list } from "../../store/task_ui_slise_store";
import { i_task } from "../../../../shared/types";

//     export  function use_filter_sub_elements(swohType:"task_to_task"|"task_to_note"){
//         console.log("filter rest")
//           const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
//           const parent_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.parent_element_id)
//             const active_workspase_local_store = useGet_active_worspase_from_localStore()
//         const [sub_elements_id_arr, set_sub_elements_id_arr]= useState<{sub_element_id:number}[]>([])
//            const dispatch = useDispatch<AppDispatch>()
//             const notes = useSelector((state:global_store_type)=>state.note_list.notes)
//             const sub_tasks = useSelector((state:global_store_type)=>state.sub_task_list.sub_tasks)
//             // dispatch( get_all_Sub_sub_tasksBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
//         useEffect(()=>{
//             dispatch(get_all_Sub_sub_tasksBy_workspace_id(active_wokspase != null ? active_wokspase?.workspace_id : 1))
 
//             async function get_sub_id_arr() {
//                 const sub_elements_id:{sub_element_id:number}[] = await invoke("get_all_sub_elements_by_swoh_type", {swohType:swohType})
//                 console.log(sub_elements_id)
//                 set_sub_elements_id_arr(sub_elements_id)
//             }
//             get_sub_id_arr()
//         },[])
//         let flag_number=0
//     const intervalId=    setInterval(()=>{
// flag_number++
// if(flag_number==20){
//     clearInterval(intervalId)
// }
//         },300)
    
//         useEffect(()=>{
//             // dispatch(get_all_notesBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
         
            
//             if(swohType=='task_to_note'){
              
//                 notes.forEach(note=>{
//                     sub_elements_id_arr.forEach((id)=>{
//                  if(note.note_id===id.sub_element_id){dispatch(delete_note(note.note_id))}
              
//                     })
//                 })
                
                
//             }else{
                
//                 sub_tasks.forEach(note=>{
//                     sub_elements_id_arr.forEach((id)=>{
//                         if(note.task_id===id.sub_element_id){dispatch(delete_Sub_task(note.task_id))}
              
//                     })
            
//                 })
//             }
            
//             dispatch(delete_Sub_task(parent_element_id))
//         },[swohType, sub_elements_id_arr,flag_number])
//         console.log(sub_tasks)
    
//         return [sub_tasks, notes]


//         }
        

        export  function use_filter_sub_task_elements(sub_tasks:i_task[]){
            console.log("filter rest")
              const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
              const parent_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.parent_element_id)
                const active_workspase_local_store = useGet_active_worspase_from_localStore()
            const [sub_elements_id_arr, set_sub_elements_id_arr]= useState<{sub_element_id:number}[]>([])
               const dispatch = useDispatch<AppDispatch>()
                const notes = useSelector((state:global_store_type)=>state.note_list.notes)
             
            useEffect(()=>{
            
             
     
                async function get_sub_id_arr() {
                    const sub_elements_id:{sub_element_id:number}[] = await invoke("get_all_sub_elements_by_swoh_type", {swohType:"task_to_task"})
                    console.log(sub_elements_id)
                    set_sub_elements_id_arr(sub_elements_id)
                }
                get_sub_id_arr()
            },[sub_tasks])
            let flag_number=0
        const intervalId=    setInterval(()=>{
    flag_number++
    if(flag_number==20){
        clearInterval(intervalId)
    }
            },300)
        
            useEffect(()=>{
                // dispatch(get_all_notesBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
             
            
                  
                   
                sub_tasks.forEach(note=>{
                    sub_elements_id_arr.forEach((id)=>{
                        if(note.task_id===id.sub_element_id){dispatch(delete_Sub_task(note.task_id))}
              
                    })
            
                })
                // dispatch(delete_Sub_task(parent_element_id))
                    
                },[sub_elements_id_arr,flag_number, sub_tasks])
                return sub_tasks
                }
                export  function use_filter_sub_notes_elements(){
                    console.log("filter rest")
                      const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
                      const parent_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.parent_element_id)
                        const active_workspase_local_store = useGet_active_worspase_from_localStore()
                
                       const dispatch = useDispatch<AppDispatch>()
                        const notes = useSelector((state:global_store_type)=>state.note_list.notes)
                        const sub_tasks = useSelector((state:global_store_type)=>state.sub_task_list.sub_tasks)
                        // dispatch( get_all_Sub_sub_tasksBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
                        dispatch(get_all_notesBy_workspace_id(active_workspase_local_store.workspace_id != null ? active_workspase_local_store?.workspace_id : active_workspase_local_store.workspace_id))
                    useEffect(()=>{
                       
             
                        async function get_sub_id_arr() {
                            const sub_elements_id:{sub_element_id:number}[] = await invoke("get_all_sub_elements_by_swoh_type", {swohType:"task_to_note"})
                            console.log(sub_elements_id)
                            set_sub_elements_id_arr(sub_elements_id)
                        }
                        get_sub_id_arr()
                    },[])
                    let flag_number=0
                const intervalId=    setInterval(()=>{
            flag_number++
            if(flag_number==20){
                clearInterval(intervalId)
            }
                    },300)
                
                    useEffect(()=>{
                        // dispatch(get_all_notesBy_workspace_id(active_wokspase?.workspace_id!=null?active_wokspase?.workspace_id:active_workspase_local_store.workspace_id))
                     
                    
                          
                           
                        notes.forEach(note=>{
                            sub_elements_id_arr.forEach((id)=>{
                                if(note.note_id===id.sub_element_id){dispatch(delete_note(note.note_id))}
                      
                            })
                    
                        })
                       
                            
                        },[sub_elements_id_arr,flag_number])
                        return notes 
                        }
                        
               
          
        
           
    
    
            
            
    
        
    