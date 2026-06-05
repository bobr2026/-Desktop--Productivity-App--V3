import { SelectType } from "../../App/store/global_store.types"

export interface I_folder{
    id:number,
    icon_id:number,
    path:string
    title:string
    hotkey:string|null
    folder_category_id:number|null
    globol_category_id:number|null
    workspace_id:number

}
export interface folder_form_data{
    icon_id:number,
    title:string,
    path:string,
    hotkey:string|null,
    folder_category_id:number|null,
    globol_category_id:number|null,
       type_category:SelectType

}
export interface Ifolder_icons{
    id:number,
    icon_path:string
}
export interface Iselect_folder{
    id:number
selet:boolean
}