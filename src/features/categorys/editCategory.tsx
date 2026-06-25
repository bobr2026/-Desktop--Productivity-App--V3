import { invoke } from "@tauri-apps/api/core"
import { global_store_type, i_globol_categorys, SelectType, type_page_enum } from "../../App/store/global_store.types"
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils"
import styles from '../../shared/styles/forms.module.sass'
// import { select_types_category_enum } from "./create_category_page_types"
import { useState, useEffect } from "react"
import { I_ginerik_category, TostStateType } from "../../shared/types"
import get_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore"
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore"

import useGet_categorys_data_by_workspase from "../../shared/hooks/useGet_categorys_data_by_workspase"
import Tost_state from "../../shared/ui/tost_state/tost_state"
import { useSelector } from "react-redux"
import Under_category_list from "../../shared/ui/under_category_list/Under_category_list"
import { update_category } from "../../pages/creare_category_page/utils/get_categoris_data"
import { useParams } from "react-router-dom"
import { select_types_category_enum } from "../../pages/creare_category_page/create_category_page_types"

interface form_data {
    category_name: string,
    category_color: string
    under_category: boolean
    perent_id: number | null

}
interface show_tost_data{
tost_type:TostStateType
swoh:boolean
tost_text:string
}
interface EditCategoryProops{
    category_id:string|undefined
    type_category:string|undefined
}

export default function EditCategory({category_id, type_category}:EditCategoryProops) {
   
    active_page_hendler(type_page_enum.edit_category, "/creare_category_page", "Edit category")
    const [show_tost, seTshow_tost]= useState<show_tost_data>({
        tost_type:"Success", 
        swoh:false, tost_text:"категория успешно создана"})
    const [form_data, setForm_data] = useState<form_data>({
        category_name: "",
        category_color: "#000000",
        under_category: false,
        perent_id: null
    })

    let selected_category = useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.folder)


        // switch (form_data.type_category) {
        //         case "app":
        //             selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.app)
        //             break;
        //         case "folder":
        //             selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.folder)
        //             break;
        //         case "global":
        //             selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.global)
        //             break;
        //         case "note":
        //             selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.note)
        //             break;
        //         case "task":
        //             selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.task)
        //             break;
        //         default:
        //             break;
        //     }
  useEffect(()=>{
async function get_data() {
    if(category_id!=undefined){

        switch (type_category) {
            case 'app':
                const id = parseInt(category_id)
           const data:I_ginerik_category[] =     await invoke("get_app_categories_by_id", {appCategoryId:id})
           setForm_data((prev)=>(
            {...prev,
                category_name:data[0].name,
                category_color: data[0].color!=null?data[0].color:"#000000",
                 type_category:"app"
                 
            }
           ))
                break;
            case "folder":
                const id1 = parseInt(category_id)
                const data1:I_ginerik_category[] =     await invoke("get_folder_categories_by_id", {folderCategoryId:id1})
                setForm_data((prev)=>(
                 {...prev,
                     category_name:data1[0].name,
                     category_color: data1[0].color!=null?data1[0].color:"#000000",
                      type_category:'folder'
                      
                 }
                ))
                break
            case "note":
                const id2 = parseInt(category_id)
                const data2:I_ginerik_category[] =     await invoke('get_note_categories_by_id', {noteCategoryId:id2})
                setForm_data((prev)=>(
                 {...prev,
                     category_name:data2[0].name,
                     category_color: data2[0].color!=null?data2[0].color:"#000000",
                      type_category:'note'
                      
                 }
                ))
            
                break
            case "task":
                const id3 = parseInt(category_id)
                const data3:I_ginerik_category[] =     await invoke('get_task_categories_by_id', {taskCategoryId:id3})
                setForm_data((prev)=>(
                 {...prev,
                     category_name:data3[0].name,
                     category_color: data3[0].color!=null?data3[0].color:"#000000",
                      type_category:'task'
                      
                 }
                ))
                break
            case "global":
                const id4 = parseInt(category_id)
                const data4:I_ginerik_category[] =     await invoke('get_globol_categories_by_id', {taskCategoryId:id4})
                setForm_data((prev)=>(
                 {...prev,
                     category_name:data4[0].name,
                     category_color: data4[0].color!=null?data4[0].color:"#000000",
                      type_category:'task'
                      
                 }
                ))
                break
            default:
                break;
           }
    }

}
get_data()
  },[category_id])
    // const category_arr = useGet_categorys_data_by_workspase(form_data.type_category)
    useEffect(()=>{
        setForm_data(prev => ({
            ...prev,
            perent_id: selected_category
    }))
    console.log(form_data)

    }, [selected_category])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, type, value, checked } = e.target as HTMLInputElement;

        setForm_data(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
   


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form_data);
        // console.log(category_arr);
     
        if(form_data.category_name==""){
        
            seTshow_tost(prev=>({
                ...prev,
                swoh:true,
                tost_text:"заполни поле `Названия катигории`",
                tost_type:"Error"
            }))
            setTimeout(()=>{
    seTshow_tost(prev=>({
        ...prev,
        swoh:false
    }))
            }, 2000)
        }else{
            seTshow_tost(prev=>({
                ...prev,
                tost_type:"Success", 
        tost_text:"категория успешно создана",
                swoh:true
            }))
    setTimeout(()=>{
        seTshow_tost(prev=>({
            ...prev,
            swoh:false
        }))
    }, 2000)
    if(category_id!=undefined){

        switch (type_category) {
            case "folder":
                update_category('update_folder_category', form_data.category_name, form_data.category_color, form_data.perent_id,
                 parseInt(category_id))
                break;
            case "app":
                update_category('update_app_category', form_data.category_name, form_data.category_color, form_data.perent_id,
                    parseInt(category_id)  )
                break;
            case "task":
                update_category('update_task_category',  form_data.category_name, form_data.category_color, form_data.perent_id,
                    parseInt(category_id) )
                break;
            case "global":
                update_category('update_global_category', form_data.category_name, form_data.category_color, form_data.perent_id,
                    parseInt(category_id))
                break;
            case "note":
                update_category('update_task_category', form_data.category_name, form_data.category_color, form_data.perent_id,
                    parseInt(category_id))
                break;
    
        }
    }

}
    };


    
    return <div className={styles.main_conteiner}>

        <form className={styles.category_form} onSubmit={handleSubmit}>
            {/* <div className={styles.category_form__item}>
                <label htmlFor="select_type_category" className={styles.category_form__item_lebel}>выберете тип категории:</label>
                <select name="type_category" id="select_type_category" onChange={handleChange} value={form_data.type_category}>
                    <option value="folder">Папки</option>
                    <option value="app">Приложения </option>
                    <option value="task">Задачи</option>
                  
                    <option value="note">Заметки</option>

                </select>
            </div> */}
            <div className={styles.category_form__item}>

                <label className={styles.category_form__item_lebel} htmlFor="category_name">укажите название категории: </label>
                <input name="category_name" id="category_name" type="text" placeholder="Названия катигории" value={form_data.category_name} onChange={handleChange} />

            </div>
            <div className={styles.category_form__item}>

                <label className={styles.category_form__item_lebel} htmlFor="category_color">укажите цвет категории: </label>
                <input name="category_color" type="color" id="category_color" value={form_data.category_color} onChange={handleChange} />

            </div>

            <div className={styles.category_form__item}>

                {/* {category_arr.length == 0 ? null : <div className={`${styles.category_form__item} ${styles.checkbox_row}`}>
                    <input type="checkbox" id="under_category" name="under_category" checked={form_data.under_category} onChange={handleChange} />
                    <label htmlFor="under_category" className={styles.category_form__item_lebel}>
                        создать подкатегорию?
                    </label>
                </div>
                }           */}
            {/* {category_arr.length!=0?<p>выберете подкатегорию (необезательно)</p>:null} */}
             {/* <Under_category_list type_category={form_data.type_category} /> */}
           
        
        


            </div><button type="submit">Изменить  категорию</button>

        </form>
        {show_tost.tost_type=="Success"?  <Tost_state type_tost="Success" text={show_tost.tost_text} swoh={show_tost.swoh}/>
        : show_tost.tost_type=="Error"?<Tost_state type_tost="Error" text={show_tost.tost_text} swoh={show_tost.swoh}/>:<Tost_state type_tost="Warning" text={show_tost.tost_text} swoh={show_tost.swoh}/>}
        {/* <Tost_state type_tost="Error" text="категория успешно создана" swoh={show_tost}/>
        <Tost_state type_tost="Warning" text="категория успешно создана" swoh={show_tost}/> */}
            </div >}



