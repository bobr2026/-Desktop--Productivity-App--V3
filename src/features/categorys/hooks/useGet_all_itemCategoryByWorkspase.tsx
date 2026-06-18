import { useEffect, useState } from "react";
import { Category_list_data_types, filtered_categorys, I_ginerik_category, I_workspace_types } from "../../../shared/types";
import { get_all_workspaces, getAppCategoriesByWorkspace,getFolderCategoriesByWorkspace, getNoteCategoriesByWorkspace, getTaskCategoriesByWorkspace } from "../model/category.model";
import { i_globol_categorys } from "../../../App/store/global_store.types";
import { invoke } from "@tauri-apps/api/core";


export function   useGet_all_itemCategoryByWorkspase(type:Category_list_data_types, id:number){
    const [data, set_data]=useState<i_globol_categorys[]>([])
    const [workspases, set_workspases]=useState<I_workspace_types[]>([])
useEffect(()=>{
    async function get_data() {
        
        switch (type) {
            case 'app':
                const data:I_ginerik_category[]= await getAppCategoriesByWorkspace(id)
                set_data(data)
                break;
                case 'task':
                    const data1:I_ginerik_category[]= await getTaskCategoriesByWorkspace(id)
                    set_data(data1)
                break;
                case 'note':
                    const data2:I_ginerik_category[]= await getNoteCategoriesByWorkspace(id)
                    set_data(data2)
                break;
                case 'folder':
                    const data3:I_ginerik_category[]= await getFolderCategoriesByWorkspace(id)
                    set_data(data3)
                break;
              case "workspase":
                const data4: I_workspace_types[] =
                (await get_all_workspaces()) as I_workspace_types[] ?? [];
            set_workspases(data4)

            default:
                break;
        }
        

    }
    get_data()
}, [type, id])
if(type=="workspase"){
return workspases
}else{
    return data
}


}