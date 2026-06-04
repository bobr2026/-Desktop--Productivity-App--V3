import { useState, useEffect, ChangeEvent } from "react";
import { get_app_icon, add_app, get_app_path } from "./model/app.model";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import styles_create_app from "./styles/create_app.module.sass"
import { i_app_data } from "./app.types";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { ShortcutRecorder } from "../../shared/ui/ShortcutRecorder/ShortcutRecorder";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../App/store/store";
import { global_store_type, SelectType } from "../../App/store/global_store.types";
import { Appform_data, shortcutRecorder_item_type_enum } from "../../shared/types";
import styles from '../../shared/styles/forms.module.sass'
import Under_category_list from "../../shared/ui/under_category_list/Under_category_list";
import { select_types_category_enum } from "../../pages/creare_category_page/create_category_page_types";
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore";
import { read_selected_category } from "../../App/store/hotkey_and_category_slise";

 const log_key=()=>{
    console.log("key press")
 }



export default function Create_app(){
    const active_workspase_local_store = useGet_active_worspase_from_localStore()
    const [form_data, setForm_data]= useState<Appform_data>({
        path:null,
        app_name:null,
        icon_path:null,
        type_category:"app",
        app_category_id:null,
        global_category_id:null,
        hotkey:null


    })
    const [path, setPath]= useState<string|null>(null)

    const dispatch= useDispatch<AppDispatch>()
    const active_wokspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
    console.log(active_wokspase)
    useEffect(()=>{
    async function setData (){
        if(path!=null){
            const data:i_app_data =  await get_app_icon(path, 64)
          setForm_data((prev)=>({
            ...prev,
            app_name:data.app_name,
            icon_path:data.icon_path

          }))
           }
     }
     setData()
    
    }, [path])
      
    const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {value, name, checked , type} =e.target as HTMLInputElement
   setForm_data((prev)=>({
       ...prev,
       [name]: value
       
    }))
}

    // switch (form_data.type_category) {
    //     case "app":
    //         selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.app)
    //         console.log("app")
    //         break;
    //     case "folder":
    //         selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.folder)
            
    //         break;
    //     case "global":
    //         selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.global)
    //        console.log("global")
    //         break;
    //     case "note":
    //         selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.note)
    //         break;
    //     case "task":
    //         selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.task)
    //         break;
    //     default:
    //         break;
    // }


//  const selected_data=form_data.type_category=="globol_categorys"?{global_category_id:selected_category}
//  :{app_category_id:selected_category}

let selected_category_app = useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.app)
let selected_category_global =useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.global)
const selected_hotkey= useSelector((state:global_store_type)=>state.hotkey_and_category.selectedHotkey)

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        dispatch(read_selected_category())
        setForm_data((prev)=>({
            ...prev,
            hotkey:selected_hotkey,
            path:path,
            app_category_id:selected_category_app,
            global_category_id:selected_category_global
        
        }))
        console.log(form_data)
        await add_app(form_data.app_name as string, form_data.path as string, form_data.icon_path as string, form_data.hotkey,
            form_data.app_category_id, form_data.global_category_id , active_workspase_local_store.workspace_id
        )
     
           
        
        console.log(active_wokspase)
       
        
    }
    return <div className={styles.main_conteiner}>

    <form className={styles.category_form} onSubmit={handleSubmit}>
        
    <div className={styles.category_form__item}>
    {form_data.icon_path!=null?<img className={styles_create_app.form__item_app_icon} src={convertFileSrc( form_data.icon_path)} alt="" />:<p> Укажите приложение </p>}  
              <p>{form_data.app_name!=null?form_data.app_name:null}</p>
              <p>{path}</p> 
        <button type='button' onClick={async()=>{
           setPath( await get_app_path())
          }}>укажите приложение</button>
            </div>
          
     
        {/* <div className={styles.category_form__item}>

            <label className={styles.category_form__item_lebel} htmlFor="category_name">укажите название категории: </label>
            <input name="category_name" id="category_name" type="text" placeholder="Названия катигории "/>

        </div>
        */}
        <div className={styles_create_app.from_item_munu_and_recorder}>
        <ShortcutRecorder />
            <select name="type_category" id="" onChange={handleChange} value={form_data.type_category}>
                <option value="app">Приложения</option>
                <option value="global">Общие</option>
            </select>

        </div>


        <Under_category_list type_category={form_data.type_category} />
        <button type="submit">Создать Приложение</button>

    </form>
</div >
}

