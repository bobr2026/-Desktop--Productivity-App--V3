import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './styles/task_item.module.sass'
import { marksTask, statusTask } from "../../shared/types";
import { ReactNode, useState } from "react";
import strelka1 from './task_icon/strelka.svg'
import strelka2 from './task_icon/strelka2.svg'
import complete from './task_icon/complete.png'
import not_completed from './task_icon/not complete.png'
import in_work from './task_icon/in work.png'
import pase from './task_icon/pase.png'
import postponed from './task_icon/Group 152.png'
interface task_item_props{
    status:statusTask
    title:string
    mark_type:marksTask|null
    children?:ReactNode
}
export default function Task_item({status, title, mark_type, children}:task_item_props){
    let task_status_icon =  <img className={styles.task_item__block__img} src={not_completed} alt="" />
    switch (status) {
        case 'completed':
             task_status_icon =  <img className={styles.task_item__block__img} src={complete} alt="" />
            break;
    case "not completed":
        task_status_icon =  <img className={styles.task_item__block__img} src={not_completed} alt="" />
        break
    case "in work":
        task_status_icon =  <img className={styles.task_item__block__img} src={in_work} alt="" />
        break
    case "postponed":
         task_status_icon =  <img className={styles.task_item__block__img} src={pase} alt="" />
 break

    }
   const [show_subtask, set_show_subtask]=useState<boolean>(false)
   return <div className={styles.task_item__main_conteiner}>
    <img className={styles.task_item_togel_subtask} src={show_subtask==false?strelka1:strelka2} onClick={()=>set_show_subtask(!show_subtask)}  alt="" />
    <div className={styles.task_item__block}>
        {task_status_icon}
        <h3>{title}</h3>
        <h3>{status}</h3>
        {mark_type!=null? <Marks_button click={()=>null} mark_type={mark_type}/>:null}
        <div className={styles.task_item__subtasks_container}>
                {children}
            </div>
    </div>

   </div>
}