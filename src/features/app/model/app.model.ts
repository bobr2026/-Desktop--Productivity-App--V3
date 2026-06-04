import { invoke } from "@tauri-apps/api/core";
import { i_app_data } from "../app.types";

import { open } from "@tauri-apps/plugin-dialog";
import { i_categories_task, Iapp } from "../../../shared/types";
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
 export async function get_app_path(){
    const path = open({
        multiple: false,
        directory: false
    })
    return path
    }
    
    export async function get_appsByID(app_id:number) {
      const data:Iapp[] = await invoke("get_appsByID", {appId:app_id})
      console.log("++++++++++++")
console.log(data)
      console.log("++++++++++++")
      return data
    }
    export async function get_app_category_by_category_id(category_id:number) {
       const data:i_categories_task[]  = await invoke("get_app_categories_by_id", {appCategoryId:category_id})
       return data
    }
// export interface UpdateApp {
//     title: string;
//     path: string;
//     iconPath: string;
//     hotkey: string;
//     appCategoryId: number | null;
//     globolCategoryId: number | null;
//     workspaceId: number;
//     appId: number;
//   }
  
  export const update_app = async (
    title: string,
    path: string,
    iconPath: string,
    hotkey: string|null,
    appCategoryId: number | null,
    globolCategoryId: number | null,
    workspaceId: number,
    appId: number,
  ): Promise<number> => {
    return await invoke<number>("update_app", {
      title: title,
      path: path,
      iconPath: iconPath,
      hotkey: hotkey,
      appCategoryId: appCategoryId ,
      globolCategoryId: globolCategoryId,  
      workspaceId: workspaceId,
      appId: appId,
    });
}
