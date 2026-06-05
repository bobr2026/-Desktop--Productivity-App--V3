import { invoke } from "@tauri-apps/api/core";
import { i_categories_task, I_folder } from "../../../shared/types";
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
export async function delete_folder_from_db(folder_id:number) {
    await invoke("delete_folder", {folderId:folder_id})
}
export async function get_foldersByID(folder_id:number) {
  const folder:I_folder[]=  await invoke("get_foldersByID", {folderId:folder_id})
  return folder[0]
}
export const update_folder = async (
    iconId: number,
    path: string,
    hotkey: string,
    title: string,
    folderCategoryId: number | null,
    globolCategoryId: number | null,
    workspaceId: number,
    folderId: number,
  ): Promise<number> => {
    return await invoke<number>("update_folder", {
      iconId: iconId,
      path: path,
      hotkey: hotkey,
      title: title,
      folderCategoryId: folderCategoryId,
      globolCategoryId: globolCategoryId,
      workspaceId: workspaceId,
      folderId: folderId,
    });
  };
      export async function get_folder_category_by_category_id(category_id:number) {
         const data:i_categories_task[]  = await invoke("get_folder_categories_by_id", {folderCategoryId:category_id})
         return data[0]
      }