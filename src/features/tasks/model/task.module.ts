import { invoke } from "@tauri-apps/api/core";
import { i_ceate_task_data, marksTask, statusTask } from "../../../shared/types";
// title: String,
//     status: String,
//     marks: Option<String>,
//     parent_id: Option<i64>,
//     task_category_id: Option<i64>,
//     workspace_id: i64,
// 

export async function ceate_task_fn(task_data:i_ceate_task_data){
    await invoke("create_task",task_data)
    try{
     console.log("created_task")   
    }
    catch(e){
console.error(`created task error ${e}`)
    }
}