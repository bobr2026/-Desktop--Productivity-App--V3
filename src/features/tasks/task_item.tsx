import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './styles/task_item.module.sass'
import { marksTask, statusTask } from "../../shared/types";
import { ReactNode, useEffect, useState } from "react";
import strelka1 from './task_icon/strelka.svg'
import strelka2 from './task_icon/strelka2.svg'
import complete from './task_icon/complete.png'
import not_completed from './task_icon/not complete.png'
import in_work from './task_icon/in work.png'
import pase from './task_icon/pase.png'
import postponed from './task_icon/Group 152.png'
import { update_app } from "../app/store/app_slise_store";
import { invoke } from "@tauri-apps/api/core";
import { global_store_type } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { useDispatch, useSelector } from "react-redux";
interface task_item_props{
    id:number
    status:statusTask
    title:string
    mark_type:marksTask|null
    children?:ReactNode
}
export default function Task_item({ id, status, title, mark_type, children}:task_item_props){
  
    const [show_subtask, set_show_subtask]=useState<boolean>(false)
    const [task_status, set_task_status ]= useState<statusTask>(status)
    const [swow_select_status_munu,set_swow_select_status_munu ]=useState<boolean>(false)
  
    // const dispatch = useDispatch<AppDispatch>()
  
    useEffect(()=>{

    }, [])
    useEffect(()=>{
async function update_status(){

    await invoke("update_task_status", {taskId:id, status:task_status}) 
}
update_status() 
    }, [task_status])
    let task_status_icon =  <img className={styles.task_item__block__img} src={not_completed} alt="" />
    switch (task_status) {
        case 'completed':
             task_status_icon =  <img className={styles.task_item__block__img} src={complete} alt=""
             onContextMenu={(e)=>{
                e.preventDefault()
                set_swow_select_status_munu(!swow_select_status_munu)}} onClick={()=>set_task_status(task_status)} />
            break;
    case "not completed":
        task_status_icon =  <img className={styles.task_item__block__img} src={not_completed} alt="" 
        onContextMenu={(e)=>{
            e.preventDefault()
            set_swow_select_status_munu(!swow_select_status_munu)}} onClick={()=>set_task_status(task_status)}/>
        break
    case "in work":
        task_status_icon =  <img className={styles.task_item__block__img} src={in_work} alt=""
        onContextMenu={(e)=>{
            e.preventDefault()
            set_swow_select_status_munu(!swow_select_status_munu)}} onClick={()=>set_task_status(task_status)} 
        />
        break
    case "postponed":
         task_status_icon =  <img className={styles.task_item__block__img} src={postponed} alt=""
         onContextMenu={(e)=>{
            e.preventDefault()
            set_swow_select_status_munu(!swow_select_status_munu)}} onClick={()=>set_task_status(task_status)} 
         />
 break

    }
  

   const style_select_status_elements={
    display:swow_select_status_munu==false?"none":"flex"
   }
   return <div className={styles.task_item__main_conteiner} onContextMenu={(e)=>{
    e.preventDefault()
    
   }}>
    <img className={styles.task_item_togel_subtask} src={show_subtask==false?strelka1:strelka2} onClick={()=>set_show_subtask(!show_subtask)}  alt="" />
    <div className={styles.task_item__block}>
        <div className={styles.select_status_conteiner}>
        {task_status_icon}
<div style={style_select_status_elements} className={styles.select_status_elements }>
    <div className={styles.select_status_element}  onClick={()=>set_task_status("postponed")}>
<img className={styles.task_item__block__} src={postponed} alt=""/>
<h2>Отложено</h2>
    </div>
    <div className={styles.select_status_element}  onClick={()=>set_task_status("in work")}>
<img className={styles.task_item__block__} src={in_work} alt=""/>
<h2>В работе</h2>
    </div>
    <div className={styles.select_status_element}  onClick={()=>set_task_status("completed")}>
<img className={styles.task_item__block__} src={complete} alt=""/>
<h2>Выполнено</h2>
    </div>
    <div className={styles.select_status_element}  onClick={()=>set_task_status("not completed")}>
<img className={styles.task_item__block__} src={not_completed} alt=""/>
<h2> Не выполнено</h2>
    </div>

</div>
        </div>
        <h3>{title}</h3>
        <h3>{task_status}</h3>
        {mark_type!=null? <Marks_button click={()=>null} mark_type={mark_type}/>:null}
        <div className={styles.task_item__subtasks_container}>
                {children}
            </div>
    </div>

   </div>
}