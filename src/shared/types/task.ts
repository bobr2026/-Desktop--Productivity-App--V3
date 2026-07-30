import { SelectType } from "../../App/store/global_store.types"

export type marksTask = "Important"|"Urgently"|"Attention" |"NO"
export type statusTask = "not completed"|"completed"|"in work"|"postponed"

export type i_ceate_task_data={
    title:string,
       status:statusTask,
       marks:null|marksTask,
       parentId:null|number
       taskCategoryId:null|number
       workspaceId:number
   
   }

export interface i_task{
    task_id:number
    marks:marksTask|null
    status:statusTask
    parent_id:number|null
    title:string
    task_category_id:number|null
    workspace_id:number




}

export interface form_data{
    title:string,
    status:statusTask,
    marks:null|marksTask,
    parent_id:null|number
    task_category_id:null|number
    workspace_id:number
    type_category:SelectType|"not_selected"
}

export interface i_active_btn{
btn_id:number
active:boolean
}
export interface i_categories_task{
    id:number
    name:string
    color:string|null
    parent_id:number|null
    workspace_id:number
}