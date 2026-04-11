import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import {folder_item_props} from './folder.types';
import { openApp, openFolder, registerHotkey } from "../../tauri-services/services";
import styles from '../../shared/styles/litem_element_list.module.sass'
import { useEffect, useState } from "react";
import folder_dark1_icon from './folder_icons/ficon-folder-dark1.png'
import folder_blue_icon from './folder_icons/icon-folder-blue.png'
import icon_folder_black from './folder_icons/icon-folder-black.png'
// get_global_Category_name_and_color_ById,
// get_app_Category_name_and_color_ById

 interface categories_data{
    color:string|null
    name:string|null
 }

//  export const folder_icons:Ifolder_icons[]=[
//     {id:-1,icon_path:folder_dark1_icon},
//     {id:-2,icon_path:folder_blue_icon},
//     {id:-3,icon_path:icon_folder_black}
    
// ]
type folder_item_delect_color_category_types = "folder_category"|"globol_category"
export  function Folder_item({icon_id , path, hotkey, title, globol_category_id, folder_category_id , swoh_color_grub}:folder_item_props){
    let icon= <img className={styles.list__item_block__img} src={folder_dark1_icon} alt="" />
    const [app_category , setApp_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [global_category , setGlobal_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [category_color, set_category_color] = useState<folder_item_delect_color_category_types>("folder_category")

  
   useEffect(()=>{
    async function get_data() {
        if(folder_category_id!=null){
            const data:categories_data =  await invoke("get_folder_Category_name_and_color_ById", {categoryId:folder_category_id})
              console.log(data)
              setApp_category(data)
              if(swoh_color_grub==="folder_category"){
                data.color!=null? set_category_color(data.color as folder_item_delect_color_category_types  ):null
    
            }

        }if(globol_category_id!=null){
            const data1:categories_data =  await invoke("get_global_Category_name_and_color_ById", {categoryId:globol_category_id})
            console.log(data1)
            setGlobal_category(data1)

        if(swoh_color_grub==="globol_category"){
            data1.color!=null? set_category_color(data1.color as folder_item_delect_color_category_types ):null

        }
    
        
    }
    }
get_data()
       if(hotkey==undefined){
   null
       }else{
   
           registerHotkey(hotkey,path,  "folder")
       }

   }, [globol_category_id, folder_category_id, swoh_color_grub])

    switch (icon_id) {
      case -1:
        icon= <img   className={styles.list__item_block__img} src={folder_dark1_icon} alt="" />
        break;
        case -2:
          icon=  <img   className={styles.list__item_block__img} src={folder_blue_icon} alt="" />
          break;
        case -3:
          icon= <img  className={styles.list__item_block__img} src={icon_folder_black} alt="" />
               break;
    }
 console.log(category_color)
    return <div  className={styles.list__item_block} onClick={()=>openFolder(path)} >
    {icon}
    <h3>{hotkey}</h3>
    <h3>{title}</h3>
    <h3>{app_category.name!=null?app_category.name:"Пусто"}</h3>
    <h3>{global_category.name!=null?global_category.name:"Пусто"}</h3>
    <div style={{
        background:category_color
    }} className={styles.list__item_block__category_color}></div>
</div>
}
