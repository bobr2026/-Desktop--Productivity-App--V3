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
import { get_app_category_by_category_id, get_app_icon, get_app_path, get_appsByID, update_app } from "./model/app.model"
import { add_app, get_all_appsBy_workspace_id } from "./store/app_slise_store"
interface AppEditProps{
    appId: string|undefined
}
export function AppEdit({appId}:AppEditProps){
    const [category_title,set_category_title ]=useState<string>("")
    const [hotkey, set_hotkey]= useState<string>("")
    const [active_app_workspase_id, set_active_app_workspase_id]= useState<number>(0)
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
   useEffect(()=>{
        async function get_data() {
            if(appId!=undefined){
                const task_data= await get_appsByID(parseInt(appId))
             setForm_data((prev)=>({
                   ...prev,
                   app_name:task_data[0].title,
                   icon_path:task_data[0].icon_path,
                   hotkey:task_data[0].hotkey,
                   path:task_data[0].path,
                   app_category_id:task_data[0].app_category_id,
                   global_category_id:task_data[0].globol_category_id
                })) 
             set_hotkey(task_data[0].hotkey==null?"нет":task_data[0].hotkey)
setPath(task_data[0].path)
             console.log("APP_ID: "+appId)
             console.log(form_data)
             set_active_app_workspase_id(task_data[0].workspace_id)

    
            }
            
        }
        get_data()
    }, [appId])
    useEffect(()=>{
        async function get_data() {
            if(form_data.app_category_id!=undefined){
                const task_data= await get_app_category_by_category_id(form_data.app_category_id)
                console.log(task_data[0].name)
            set_category_title(task_data[0].name)
    
            }
            
        }
        get_data()
    },[form_data.app_category_id])
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
    //    console.log(selected_category_app)
    //    console.log(selected_hotkey)
    //     setForm_data((prev)=>({
    //         ...prev,
    //         hotkey:selected_hotkey,
    //         path:path,
    //         app_category_id:selected_category_app,
    //         global_category_id:selected_category_global
        
    //     }))
    //     console.log(form_data)
     
           
        
        const updatedForm = {
            ...form_data,
            hotkey: selected_hotkey,
            path,
            app_category_id: selected_category_app,
            global_category_id: selected_category_global,
        };
        
        console.log(updatedForm);
        setForm_data(updatedForm);
         await update_app(form_data.app_name as string, form_data.path as string, form_data.icon_path as string ,
             form_data.hotkey, form_data.app_category_id, form_data.global_category_id, active_app_workspase_id, parseInt(appId!))
    dispatch(get_all_appsBy_workspace_id(active_app_workspase_id))
        
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
            <h4>Выбранный хоткей {hotkey}</h4>       
        <div className={styles_create_app.from_item_munu_and_recorder}>
  
        <ShortcutRecorder />
            <select name="type_category" id="" onChange={handleChange} value={form_data.type_category}>
                <option value="app">Приложения</option>
                <option value="global">Общие</option>
            </select>

        </div>
        </div>
        <div className={styles.category_form__item}>
<h4>Выбранная категория {category_title!=null?category_title:"нет"}</h4>
        <Under_category_list type_category={form_data.type_category} />

        </div>

        <button type="submit">Изминить  Приложение</button>

    </form>
</div >

}