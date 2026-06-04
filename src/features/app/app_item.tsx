import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { app_item_props } from "./app.types";
import { openApp, registerHotkey } from "../../tauri-services/services";
// import styles from './styles/app_item.module.sass'
import { useEffect, useState } from "react";
import styles from '../../shared/styles/litem_element_list.module.sass'
import { useDispatch, useSelector } from "react-redux";
import { global_store_type } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { set_context_munu_point, setOpenedContextMenu } from "../../App/store/context_munu_slise";
import Context_menu from "../../shared/ui/context_munu/context_munu";
import { delete_app } from "./store/app_slise_store";
import { delete_app_from_db } from "./model/app.model";
import { useNavigate } from "react-router-dom";
// get_global_Category_name_and_color_ById,
// get_app_Category_name_and_color_ById

 interface categories_data{
    color:string|null
    name:string|null
 }
export  function App_item({  icon_path , app_path, hotkey, title, globol_category_id, app_category_id, swoh_color_grub, id}:app_item_props){
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const{contextMenuX, contextMenuY, openedContextMenuId} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
  
    const [app_category , setApp_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [global_category , setGlobal_category]= useState<categories_data>({
        color:null,
        name:null
    })
    const [category_color, set_category_color] = useState<string>("")
const context_munu_items= [{
            label: "Изменить",
            onClick: () => {
              navigate(`/edit_app_page/${id}`)
            }
        },
        {
            label: "Удалить",
            onClick: () => {
                dispatch(delete_app(id))
                delete_app_from_db(id)

            }
        }
    ]
  
   useEffect(()=>{
    async function get_data() {
        if(app_category_id!=null){
            const data:categories_data =  await invoke("get_app_Category_name_and_color_ById", {categoryId:app_category_id})
              console.log(data)
              setApp_category(data)
              if(swoh_color_grub==="app_category"){
                data.color!=null? set_category_color(data.color ):null
    
            }

        }
        if(globol_category_id!=null){

            const data1:categories_data =  await invoke("get_global_Category_name_and_color_ById", {categoryId:globol_category_id})
            console.log(data1)
            setGlobal_category(data1)
            if(swoh_color_grub==="globol_category"){
                data1.color!=null? set_category_color(data1.color ):null
            }
        }
        
    }

get_data()
       if(hotkey==undefined){
   null
       }else{
   
           registerHotkey(hotkey,app_path,  "app")
       }

   }, [globol_category_id, app_category_id, swoh_color_grub])

    return <div  className={styles.list__item_block} onClick={
        
        ()=>{ if(openedContextMenuId==id){

        }else{
            openApp(app_path)
        }
        }
    

    } 
     onContextMenu={(e: React.MouseEvent) => {
        e.stopPropagation()
                    e.preventDefault()
    
                    dispatch(
                        setOpenedContextMenu(
                            openedContextMenuId === id ? null : id
                        )
                    )
                    dispatch(set_context_munu_point("reset"))
                    dispatch(set_context_munu_point({x:e.clientX, y:e.clientY}))
    
                   
                }}
                >
    <img className={styles.list__item_block__img} src={convertFileSrc(icon_path)} alt="" />
    <h3>{hotkey}</h3>
    <h3>{title}</h3>
    <h3>{app_category.name!=null?app_category.name:"Пусто"}</h3>
    <h3>{global_category.name!=null? global_category.name:"Пусто"}</h3>
    <div style={{
        background:category_color
    }} className={styles.list__item_block__category_color}></div>
    <Context_menu open={openedContextMenuId==id} x={contextMenuX} y={contextMenuY} items={context_munu_items}/> 
</div>
}
