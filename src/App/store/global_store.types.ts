import { I_folder, i_note, i_task, I_workspace_types , Iapp} from "../../shared/types"

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


export interface categoryUi_types{
    rerender_category_list:boolean
}
export interface global_store_type{
    apps_list:I_apps_store_type
    header:I_header_store_types
    global_category:I_categorys_store
    hotkey_and_category:I_hotkey_and_category_slise_type
    folder_list:folder_list_ctore_type
    task_list:task_list_store_type
    sub_task_list:sub_task_list_store_type
    ui_task_list:ui_task_list_ctore_type
    note_list:note_list_store_type
    task_list_ui:task_list_ui_store_types
    context_munu_ui:context_munu_ui_store_types
    categoryUI:categoryUi_types

}
export type task_ui_madal_type="create_link_task_to_note"|"create_link_task_to_task"
export interface task_list_ui_store_types{
    openedContextMenuId: number | null
    openedStatusMenuId: number | null
    contextMenuX: number,
    contextMenuY: number
}
export interface context_munu_ui_store_types{
    openedContextMenuId: number | null
    contextMenuX: number,
    contextMenuY: number
}
export interface ui_task_list_ctore_type{
   madal_type:task_ui_madal_type
    select_element_id:number
    parent_element_id:number
    show_elelemts_madal:boolean
    rerender_sub_elements:boolean
    rerender_task_list:number
}
export interface task_list_store_type{
    tasks:i_task[]
}
export interface sub_task_list_store_type{
    sub_tasks:i_task[]
}
export interface folder_list_ctore_type{
    folders:I_folder[]
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
    "create_task"= "create_task",
    "edit_task"= "edit_task",
    "edit_app"= "edit_app",
    "edit_folder"= "edit_folder",
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
export interface note_list_store_type{
    notes:i_note[]
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
