import { SelectType } from "../../App/store/global_store.types"

export interface Iapp{
    id:number
    title:string,
    path:string,
    icon_path:string,
    hotkey:string|null,
    app_category_id:number|null
    globol_category_id:number|null
    workspace_id:number

}

export interface Appform_data{
    path:string|null,
    app_name:string|null,
    icon_path:string|null,
     type_category:SelectType
     app_category_id:number|null
     global_category_id:number|null
     hotkey:string|null
    

}