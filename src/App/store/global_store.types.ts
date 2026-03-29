import { I_workspace_types , Iapp} from "../../shared/types"

export interface I_apps_store_type{
    apps:Iapp[]
    created_app_hotkey:null|string
}

export type SelectType = "app" | "folder" | "note" | "task" | "global"

type CategoriesState = Record<SelectType, number | null>

export interface I_hotkey_and_category_slise_type {
  selectedCategories: CategoriesState
  selectedHotkey: string | null
}

export interface global_store_type{
    apps_list:I_apps_store_type
    header:I_header_store_types
    global_category:I_categorys_store
    hotkey_and_category:I_hotkey_and_category_slise_type
}

 export  enum type_page_enum{
    "create_item"="create_item",
    "notes_list"="notes_list",
    "folder_list"= "folder_list",
    "app_list"="app_list", 
    "task_list"= "task_list",
    "setings"= "setings",
    "home"="home", 
    "create_app"= "create_app", 
    "create_note"="create_note",
    "create_folder"= " create_folder",
    "grubs_list"="grubs_list",
    "dok_list"=   "dok_list",
    "workspase_list"="workspase_list",
    "create_category"="create_category"
   }
    

export interface active_page_type{
    active_page_id:number
    active_page_title:string
    active_page_type: type_page_enum
    element: string|null

}
export interface I_header_store_types{
    active_page: active_page_type[]
}
export interface I_categorys_store{
    worspases:I_workspace_types[]
    global_categorys: i_globol_categorys[]
    active_worspase:I_workspace_types|null
}

export interface i_globol_categorys{
    id:number,
    name:string,
    color:string|null,
    parent_id:number|null,
    workspace_id:number
}
