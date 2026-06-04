import { invoke } from "@tauri-apps/api/core";
import { i_app_data } from "../app.types";


export async function get_app_icon(path:string, size:number) {
   const app_data:i_app_data = await invoke("extract_icon_and_save", {path:path,size:size})
   return({
    app_name:app_data.app_name, 
    icon_path:app_data.icon_path
   })
}
export async function add_app(  title:string, path:string,
    iconPath:string,
    hotkey:string|null,
    app_category_id:number|null,
    globol_category_id:number|null,
    workspace_id:number
) {
    await invoke("add_app", {
        title:title,
        path:path,
        iconPath:iconPath, 
        hotkey:hotkey,
        appCategoryId:app_category_id,
        globolCategoryId:globol_category_id,
        workspaceId:workspace_id


    })
}
export async function delete_app_from_db(app_id:number) {
    await invoke("delete_app", {appId:app_id})
}