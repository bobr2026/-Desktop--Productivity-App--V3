import { ReactNode, useEffect } from "react";
import task_icon from "../icons/tasks.svg"
import app_icon from "../icons/apps.svg"
import note_icon from "../icons/notes.svg"
import grub_icon from "../icons/Group.svg"
import folder_icon from "../icons/folders.svg"
import { useNavigate } from "react-router-dom";
import CategoryButton from "../components/CategoryButton/CategoryButton";


interface Ilist_category{
    title:string
    icon: string,
    click:()=> void|Promise<void>
}
export function get_list_category_btns(){
    const navigate= useNavigate()
    const list_category:Ilist_category[]=[
        {title:"Папки\n быстрого\n доступа", icon:folder_icon, click:()=>navigate("/folder_list")},
        {title:"Приложения\nбыстрого\n доступа", icon:app_icon, click:()=>navigate("/apps_list")},
        {title:"Заметки", icon:note_icon, click:()=>navigate("/notes_list")},
        {title:"Группы и\nкатегории", icon:grub_icon, click:()=>navigate("/grubs_and_category")},
        {title:"Задачи", icon:task_icon, click:()=>navigate("/tasks_list")},
        
    ]
  return  list_category.map((category, index)=> {return <CategoryButton key={index} title={category.title} icon={category.icon} click={category.click} />} )
   
}   

