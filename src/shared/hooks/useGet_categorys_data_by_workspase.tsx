import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { select_types_category_enum } from "../../pages/creare_category_page/create_category_page_types";
import { I_ginerik_category } from "../types";
import useGet_active_worspase_from_localStore from "./useGet_active_worspase_from_localStore";
import { SelectType } from "../../App/store/global_store.types";

export default function useGet_categorys_data_by_workspase(type_category: SelectType) {
    const [category_arr, seTcategory_arr] = useState<I_ginerik_category[]>([])
    const active_workspase_local_store = useGet_active_worspase_from_localStore()
    useEffect(() => {

        async function get_data(item: SelectType) {
            const workspaceId = active_workspase_local_store?.workspace_id;
            if (item == "app") {
                const data: I_ginerik_category[] = await invoke("get_app_categories_by_workspace", { workspaceId:active_workspase_local_store.workspace_id })
                seTcategory_arr(data)
            }
            if (item == "folder") {
                const data: I_ginerik_category[] = await invoke("get_folder_categories_by_workspace", { workspaceId: active_workspase_local_store?.workspace_id })
                seTcategory_arr(data)
            }
            if (item == "note") {
                const data: I_ginerik_category[] = await invoke("get_categories_by_workspace", { workspaceId: active_workspase_local_store?.workspace_id })
                seTcategory_arr(data)
            }
            if (item =="task") {
                const data: I_ginerik_category[] = await invoke("get_task_categories_by_workspace", { workspaceId: active_workspase_local_store?.workspace_id })
                seTcategory_arr(data)
            }
            if (item == "global") {
                const data: I_ginerik_category[] = await invoke("get_global_category_by_workspace", { workspaceId: active_workspase_local_store?.workspace_id })
                seTcategory_arr(data)
            }
        }
        get_data(type_category)
    }, [type_category ])
    return category_arr
}