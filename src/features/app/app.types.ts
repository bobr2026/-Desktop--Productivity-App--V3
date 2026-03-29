

export interface app_item_props{
    icon_path:string 
     app_path:string,
     hotkey:string|null,
     app_category_id:number|null
     globol_category_id:number|null
     title:string,
     swoh_color_grub:"app_category"| "globol_category"

}


export interface i_app_data{
    app_name:string,
    icon_path:string
}