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
export async function delete_task_from_db(task_id: number) {
    await invoke("delete_task", { taskId: task_id, })
}
type ty = {
    link_id:number
    perent_element_id:number
    sub_element_id:number
    swoh_type:string
}

 export async function unlink_elements(perent_id:number, sub_id:number) {
    await invoke("unlink_elements", { perentId: perent_id, subId:sub_id })
    console.log("получаем id сылки")
    const ntl_object:ty= await invoke("get_perent_elements", {subId:sub_id},)
        await invoke("delete_element_link", {linkId:ntl_object.link_id})

}