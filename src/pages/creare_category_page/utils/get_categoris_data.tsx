import { invoke } from "@tauri-apps/api/core"
import { I_ginerik_category, I_workspace_types } from "../../../shared/types"
import { select_types_category_enum, types_categorys_table_db, types_create_category_table_db } from "../create_category_page_types"
import { useEffect, useState } from "react"
import { global_store_type } from "../../../App/store/global_store.types"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch } from "../../../App/store/store"
import get_active_worspase_from_localStore from "../../../shared/hooks/useGet_active_worspase_from_localStore"


async function get_task_categories_by_id(task_category_id:number){
  const category_data:I_ginerik_category =  await invoke("get_task_categories_by_id",{taskCategoryId:task_category_id})
  return category_data
}
async function get_folder_categories_by_id(folder_category_id:number){
    const category_data:I_ginerik_category =  await invoke("get_folder_categories_by_id",{folderCategoryId:folder_category_id})
    return category_data
  }
  async function get_globol_categories_by_id(globol_category_id:number){
    const category_data:I_ginerik_category =  await invoke("get_globol_categories_by_id",{globolCategoryId:globol_category_id})
    return category_data
  }
  async function get_note_categories_by_id(note_category_Id:number){
    const category_data:I_ginerik_category =  await invoke("get_note_categories_by_id",{noteCategoryId:note_category_Id})
    return category_data
  }
  async function get_app_categories_by_id(app_category_Id:number){
    const category_data:I_ginerik_category =  await invoke("get_app_categories_by_id",{appCategoryId:app_category_Id})
    return category_data
  }
export async  function get_all_category(type_category:types_categorys_table_db, workspace_id:number){
const data:I_ginerik_category[]= await invoke(`get_${type_category}_by_workspace`, {workspaceId:workspace_id})
return data
}

export async function create_category(type_category:types_create_category_table_db,
   name:string,color:string|null,parent_id:number|null,  workspace_id:number
 ) {
  await invoke(`${type_category}`, {name, color, parentId:parent_id, workspaceId:workspace_id})
}
