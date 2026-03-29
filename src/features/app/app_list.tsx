import { useDispatch, useSelector } from "react-redux"
import { ChangeEvent, useEffect, useState } from "react"
import { AppDispatch } from "../../App/store/store"

import { global_store_type } from "../../App/store/global_store.types"
import { App_item } from "./app_item"
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore"
import { get_all_appsBy_workspace_id } from "./store/app_slise_store"
import styles from './styles/app_list.module.sass'
// import SelectEnvironmentMessage from "../../shared/ui/SelectEnvironmentMessage/SelectEnvironmentMessage"


// async function add_workspace(name:string, color:null|string) {
//     await invoke("add_workspace", {name:name,
//         color:color
//     })
// }
function App_list() {

    const apps = useSelector((stete: global_store_type) => stete.apps_list.apps)
    const active_wokspase = useSelector((state: global_store_type) => state.global_category.active_worspase)
    const [color_category_type , set_color_category_type ]= useState<"app_category"| "globol_category">("app_category")
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        console.log(active_wokspase)
        dispatch(get_all_appsBy_workspace_id(active_wokspase != null ? active_wokspase?.workspace_id : 1))


    }, [active_wokspase])
    console.log(apps)
    const app_list = apps.map(app => {
        return <App_item icon_path={app.icon_path} app_path={app.path} hotkey={app.hotkey}
            app_category_id={app.app_category_id} globol_category_id={app.globol_category_id}
            title={app.title} swoh_color_grub={color_category_type} />
    })
    const selectHendel=(e:ChangeEvent<HTMLSelectElement>)=>{
 const  {value, name}= e.target 
 set_color_category_type(value as "app_category"| "globol_category")
    }

    return <div className={styles.app_list_block}>
        <div className={styles.app_list_header}>
           <h3>app_icon</h3>
            <h3>app_hotkey</h3>
            <h3>app_title</h3>
            <h3>app_category_title</h3>
            <h3>dok_category_title</h3>
            <div className="">
            <h3>color category</h3>
            <select name="" id="" value={color_category_type} onChange={selectHendel}>
                <option value="app_category">Приложения</option>
                <option value="globol_category">Общие</option>
            </select>
            </div>
        </div>
        <div className={styles.app_list}>
        {app_list}
        </div>
       </div>
}
export default App_list