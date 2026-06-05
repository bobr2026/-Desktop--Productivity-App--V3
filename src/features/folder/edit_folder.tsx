import { ChangeEvent, useEffect, useState } from "react";
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore";
import { Ifolder_icons, Iselect_folder, folder_form_data } from "../../shared/types";
import { ShortcutRecorder } from "../../shared/ui/ShortcutRecorder/ShortcutRecorder"
import Under_category_list from "../../shared/ui/under_category_list/Under_category_list"
import { open } from "@tauri-apps/plugin-dialog";
import form_style from '../../shared/styles/forms.module.sass'
import create_folder_style from './styles/create_folder.module.sass'
import folder_dark1_icon from './folder_icons/ficon-folder-dark1.png'
import folder_blue_icon from './folder_icons/icon-folder-blue.png'
import icon_folder_black from './folder_icons/icon-folder-black.png'
import { useSelector } from "react-redux";
import { global_store_type } from "../../App/store/global_store.types";
import { get_folder_category_by_category_id, get_foldersByID, update_folder } from './model/folder.model'
interface EditFolderProps{
    folderId:string|undefined
}
const folder_icons:Ifolder_icons[]=[
    {id:-1,icon_path:folder_dark1_icon},
    {id:-2,icon_path:folder_blue_icon},
    {id:-3,icon_path:icon_folder_black}
    
]
export default function EditFolder({folderId}:EditFolderProps){
    const [category_title,set_category_title ]=useState<string>()
    const [hotkey, set_hotkey]= useState<string>("")
            const active_workspase_local_store = useGet_active_worspase_from_localStore()
        const [selet_icon, set_select_icon] = useState<Iselect_folder>({ id: -3, selet: false })
        const [fprm_data, setForm_data]=useState<folder_form_data>({
            icon_id:-3, 
            title:"",
            path:"",
            hotkey: "",
            folder_category_id:null,
            globol_category_id:null ,
            type_category:"folder"
        })
    async function get_folder_path(){
        const path = await open({
           multiple:false,
           directory:true
        })
        console.log(path)
        if(path!=null){
            setForm_data((prev)=>({
               ...prev, 
                path:path
            }))

        }
        }
         useEffect(()=>{
                const path_name_arr = fprm_data.path.split("\\")
           const title =path_name_arr[path_name_arr.length-1]; 
           setForm_data((prev)=>({
               ...prev,
                title: title
            }))
            },[fprm_data.path])

            let selected_category_folder = useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.folder)
let selected_category_global =useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.global)
const selected_hotkey =useSelector((state:global_store_type)=>state.hotkey_and_category.selectedHotkey)

    const hendelChenge=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const { value , name} = e.target 
        setForm_data((prev)=>({
            ...prev,
             [name]:value
        }))
    }
  
     const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
           
            // setForm_data((prev)=>({
            //     ...prev,
            //     folder_category_id:selected_category_folder,
            //     globol_category_id:selected_category_global,
            //     hotkey:selected_hotkey,
            //     icon_id:selet_icon.id
            // }))
    
             
                        
        const updatedForm:folder_form_data = {
            ...fprm_data,
            hotkey: selected_hotkey,
        
            icon_id:selet_icon.id,
            folder_category_id: selected_category_folder,
        };
        setForm_data(updatedForm)
          await    update_folder(fprm_data.icon_id, fprm_data.path, fprm_data.hotkey,
                   fprm_data.title, fprm_data.folder_category_id, fprm_data.globol_category_id,
                     active_workspase_local_store.workspace_id, parseInt(folderId!)
                )

            console.log(fprm_data.hotkey)
                console.log(fprm_data)
            
        }

       useEffect(()=>{
            async function get_data() {
                if(folderId!=undefined){
                    const task_data= await get_foldersByID(parseInt(folderId))
                 setForm_data((prev)=>({
                       ...prev,
                       icon_id:task_data.icon_id, 
            title:task_data.title,
            path:task_data.path,
            hotkey: task_data.hotkey,
            folder_category_id:task_data.folder_category_id,
            globol_category_id:task_data.globol_category_id,
                    })) 
                 set_hotkey(task_data.hotkey==null?"нет":task_data.hotkey)
                 console.log("APP_ID: "+folderId)
                 set_select_icon({id:fprm_data.icon_id, selet:true})
        
                //  set_active_app_workspase_id(task_data.workspace_id)
    
        
                }
                
            }
            get_data()
            console.log(fprm_data)
        }, [folderId])
        useEffect(()=>{
            async function get_data() {
                if(fprm_data.folder_category_id!=null){
                    const task_data= await get_folder_category_by_category_id(fprm_data.folder_category_id)
                    console.log(task_data)
                set_category_title(task_data.name)
        
                }
                
            }
            get_data()
        },[fprm_data.folder_category_id, fprm_data.globol_category_id, fprm_data.type_category])
    const folders_list = folder_icons.map(icon => {
        return <img className={(icon.id == selet_icon.id && selet_icon.selet == true) ? create_folder_style.folder_icon_active: create_folder_style.folder_icon}
            key={icon.id} src={icon.icon_path} alt="" onClick={() => { set_select_icon({ id: icon.id, selet: (selet_icon.selet == false) ? true : false }) }} />
    })
return <div className={form_style.main_conteiner}>

<form className={form_style.category_form} onSubmit={handleSubmit}>
<div className={create_folder_style.folder_list}>

{folders_list}
</div>
    <div className={form_style.category_form__item}>
    <button  type="button" onClick={async()=>{
    ( await get_folder_path())
      setForm_data((prev)=>({
        ...prev,

      }))}}>укажите приложение</button>

    </div>
    <div className={form_style.category_form__item}>
        <p>{fprm_data.path}</p>
        </div>
    <div className={form_style.category_form__item}>

        <label className={form_style.category_form__item_lebel} htmlFor="folder_name">укажите название папки: </label>
        <input name="title" id="folder_name" type="text" placeholder="Названия папки" value={fprm_data.title}  onChange={hendelChenge}  />

    </div>
    <div className={form_style.category_form__item}>
    <h4>Выбранный хоткей {hotkey}</h4>      
    <div className={create_folder_style.from_item_munu_and_recorder}>
    <ShortcutRecorder />
        <select name="type_category" id="" onChange={hendelChenge} value={fprm_data.type_category}>
            <option value="folder">Папки</option>
            <option value="global">Общие</option>
        </select>

    </div>
    </div>



     <div className={form_style.category_form__item}>
     <h4>Выбранная категория {category_title!=null?category_title:"нет"}</h4>
     <Under_category_list type_category={fprm_data.type_category} /> 
    </div><button type="submit">Изминить папку</button>

</form>


    </div >


}