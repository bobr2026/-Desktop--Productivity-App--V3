import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { app_item_props } from "./app.types";
import { openApp, registerHotkey } from "../../tauri-services/services";
import styles from './styles/app_item.module.sass'
import { useEffect, useState } from "react";
// get_global_Category_name_and_color_ById,
// get_app_Category_name_and_color_ById

 interface categories_data{
    color:string|null
    name:string|null
 }
export  function App_item({icon_path , app_path, hotkey, title, globol_category_id, app_category_id, swoh_color_grub}:app_item_props){
    const [app_category , setApp_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [global_category , setGlobal_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [category_color, set_category_color] = useState<string>("")

  
   useEffect(()=>{
    async function get_data() {
      const data:categories_data =  await invoke("get_app_Category_name_and_color_ById", {categoryId:app_category_id})
        console.log(data)
        setApp_category(data)
        const data1:categories_data =  await invoke("get_global_Category_name_and_color_ById", {categoryId:globol_category_id})
        console.log(data1)
        setGlobal_category(data1)
        if(swoh_color_grub==="app_category"){
            data.color!=null? set_category_color(data.color ):null

        }else{
            data1.color!=null? set_category_color(data1.color ):null
        }
        
    }

get_data()
       if(hotkey==undefined){
   null
       }else{
   
           registerHotkey(hotkey,app_path,  "app")
       }

   }, [globol_category_id, app_category_id, swoh_color_grub])

    return <div  className={styles.app__item_block} onClick={()=>openApp(app_path)} >
    <img className={styles.app__item_block__img} src={convertFileSrc(icon_path)} alt="" />
    <h3>{hotkey}</h3>
    <h3>{title}</h3>
    <h3>{app_category.name}</h3>
    <h3>{global_category.name}</h3>
    <div style={{
        background:category_color
    }} className={styles.app__item_block__category_color}></div>
</div>
}
