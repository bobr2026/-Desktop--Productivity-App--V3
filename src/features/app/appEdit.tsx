import styles_create_app from "./styles/create_app.module.sass"
import styles from '../../shared/styles/forms.module.sass'
import { convertFileSrc } from "@tauri-apps/api/core"
import { useState, useEffect, ChangeEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { global_store_type } from "../../App/store/global_store.types"
import { read_selected_category } from "../../App/store/hotkey_and_category_slise"
import { AppDispatch } from "../../App/store/store"
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore"
import { Appform_data } from "../../shared/types"
import { ShortcutRecorder } from "../../shared/ui/ShortcutRecorder/ShortcutRecorder"
import Under_category_list from "../../shared/ui/under_category_list/Under_category_list"
import { i_app_data } from "./app.types"
import { get_app_icon, get_app_path } from "./model/app.model"
import { add_app } from "./store/app_slise_store"
interface AppEditProps{
    appId: string|undefined
}
export function AppEdit({appId}:AppEditProps){
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
          
     
            <div className={styles.category_form__item}>
            <h4>Выбранный хоткей</h4>       
        <div className={styles_create_app.from_item_munu_and_recorder}>
  
        <ShortcutRecorder />
            <select name="type_category" id="" onChange={handleChange} value={form_data.type_category}>
                <option value="app">Приложения</option>
                <option value="global">Общие</option>
            </select>

        </div>
        </div>
        <div className={styles.category_form__item}>
<h4>Выбранная категория</h4>
        <Under_category_list type_category={form_data.type_category} />

        </div>

        <button type="submit">Создать Приложение</button>

    </form>
</div >

}