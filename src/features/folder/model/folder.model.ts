import { invoke } from "@tauri-apps/api/core";
interface i_add_folder{
    icon_id:number,
    title:string, 
    path:string
    hotkey:string|null
    folder_category_id:number|null
    globol_category_id:number|null
    workspace_id:number
}
export async function add_folder(icon_id:number, title:string, path:string, hotkey:string|null,
    folder_category_id:number|null, globol_category_id:number|null, workspace_id:number|null){
await invoke("add_folder",{iconId:icon_id, title:title, path:path,
    hotkey:hotkey, folderCategoryId:folder_category_id,
    globolCategoryId:globol_category_id, workspaceId:workspace_id

 })
}
