import { ChangeEvent, useEffect, useState } from "react"
import { Folder_item } from "./folder_item"
import { useSelector, useDispatch } from "react-redux"
import { global_store_type } from "../../App/store/global_store.types"
import { AppDispatch } from "../../App/store/store"
import { get_all_foldersBy_workspace_id } from "./store/folder_slise_store"
import styles from '../../shared/styles/list-base.module.sass'
import { Link } from "react-router-dom"

function Folder_list() {

    const folders = useSelector((stete: global_store_type) => stete.folder_list.folders)
    const active_wokspase = useSelector((state: global_store_type) => state.global_category.active_worspase)
    const [color_category_type , set_color_category_type ]= useState<"folder_category"| "globol_category">("folder_category")
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        console.log(active_wokspase)
        dispatch(get_all_foldersBy_workspace_id(active_wokspase != null ? active_wokspase?.workspace_id : 1))


    }, [active_wokspase])
    console.log(folders)
    const app_list = folders.map(app => {
        return <Folder_item  key={app.id} icon_id={app.icon_id} path={app.path} hotkey={app.hotkey}
            folder_category_id={app.folder_category_id} globol_category_id={app.globol_category_id}
            title={app.title}  swoh_color_grub={color_category_type}/>
    })
    const selectHendel=(e:ChangeEvent<HTMLSelectElement>)=>{
 const  {value, name}= e.target 
 set_color_category_type(value as "folder_category"| "globol_category")
    }

    return <div className={styles.list_base_block}>
        <div className={styles.list_base_header}>
           <h3>folder_icon</h3>
            <h3>folder_hotkey</h3>
            <h3>folder_title</h3>
            <h3>folder_category_title</h3>
            <h3>folder_category_title</h3>
            <div className="">
            <h3>color category</h3>
            <select name="" id="" value={color_category_type} onChange={selectHendel}>
                <option value="folder_category">Приложения</option>
                <option value="globol_category">Общие</option>
            </select>
            </div>
        </div>
        <div className={styles.list_base}>
        {app_list.length==0?<h2>Список пуст, <Link className={styles.main_conteiner__link} to={"/creare_folder_page"}>  Добавите папку  </Link> </h2>:app_list}
        </div>
       </div>
}
export default Folder_list