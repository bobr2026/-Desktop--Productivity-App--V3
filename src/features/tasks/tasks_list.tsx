import { useDispatch, useSelector } from "react-redux"
import { ChangeEvent, useEffect, useState } from "react"
import { AppDispatch } from "../../App/store/store"

import { global_store_type } from "../../App/store/global_store.types"
import Task_item from "./task_item"
import useGet_active_worspase_from_localStore from "../../shared/hooks/useGet_active_worspase_from_localStore"
import {get_all_tasksBy_workspace_id} from './store/task_list_store'
import styles from '../../shared/styles/list-base.module.sass'
import { Link } from "react-router-dom"
// import SelectEnvironmentMessage from "../../shared/ui/SelectEnvironmentMessage/SelectEnvironmentMessage"


// async function add_workspace(name:string, color:null|string) {
//     await invoke("add_workspace", {name:name,
//         color:color
//     })
// }
function Task_list() {

    const apps = useSelector((stete: global_store_type) => stete.task_list.tasks)
    const active_wokspase = useSelector((state: global_store_type) => state.global_category.active_worspase)
    const [color_category_type , set_color_category_type ]= useState<"app_category"| "globol_category">("app_category")
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        console.log(active_wokspase)
        dispatch(get_all_tasksBy_workspace_id(active_wokspase != null ? active_wokspase?.workspace_id : 1))


    }, [active_wokspase])
    console.log(apps)
    const app_list = apps.map(app => {
        return <Task_item  id={app.task_id} title={app.title} status={app.status} mark_type={app.marks} />
    })
    return <div className={styles.list_base_block}>
        <div className={styles.list_base_header}>
           <h3>app_icon</h3>
            <h3>app_hotkey</h3>
            <h3>app_title</h3>
            <h3>app_category_title</h3>
            <h3>dok_category_title</h3>
          
        </div>
        <div className={styles.list_base}>
        {app_list.length==0?<h2>Список пуст, <Link className={styles.main_conteiner__link} to={"/create_task"}>  Добавите задачу   </Link> </h2>:app_list}
        </div>
       </div>
}
export default Task_list