import { useEffect, useState } from 'react'
import { I_workspace_types, WorkspaceCounters } from '../../shared/types'
import styles from './styles/workspase_item.module.sass'
import { getCounters } from './model/category.model'
interface Workspase_item_props{
    workspase_id:number
    color:string|null
    name:string

}
export function Workspase_item({workspase_id, color, name, }:Workspase_item_props){
    const [workspaceCounters, setWorkspaceCounters]=useState<WorkspaceCounters>({
        apps:0,
        tasks:0,
        notes:0,
        folders:0
    })
    useEffect(()=>{
        async function load() {
            const counters:WorkspaceCounters = await getCounters(workspase_id);
            setWorkspaceCounters(counters)
           
          }
          load()
    }, [workspase_id])
    return <div className={styles.workspase_item}>
        <p>{name}</p>
        <div className={styles.workspase_item_content}>

        <div className={styles.workspase_elemts_len}>
            <p>Папок:{workspaceCounters.folders}</p>
            <p>Приложений:{workspaceCounters.apps}</p>
            <p>Задач:{workspaceCounters.tasks}</p>
            <p>Заметок:{workspaceCounters.notes}</p>
        </div>
        <div className={styles.workspase_item_color_div} style={{background:color!=null?color:""}}></div>
        </div>

    </div>
}