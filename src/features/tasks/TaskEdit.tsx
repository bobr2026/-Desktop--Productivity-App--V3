import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../../shared/styles/forms.module.sass'
import Under_category_list from '../../shared/ui/under_category_list/Under_category_list'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore';
import { global_store_type, SelectType } from '../../App/store/global_store.types';
import { i_ceate_task_data, marksTask, statusTask ,form_data, i_active_btn} from '../../shared/types';
import Marks_button from '../../shared/ui/mrks_button/mrks_button';
import { useDispatch, useSelector } from 'react-redux';
import { ceate_task_fn, get_task_category_by_category_id, get_task_data_by_id, update_full_task } from './model/task.module';

import complete from './task_icon/complete.png'
import not_completed from './task_icon/not complete.png'
import in_work from './task_icon/in work.png'
import pase from './task_icon/pase.png'
import postponed from './task_icon/Group 152.png'
import { get_all_tasksBy_workspace_id } from './store/task_list_store';
import { AppDispatch } from '../../App/store/store';
//  GIT НАДО ОТРЕФАКТОРИТЬ STATE И ФУНКЦИИ  
export  interface TaskEditProps{
    taskId:string|undefined
}
export default function TaskEdit({taskId}:TaskEditProps){
    const [task_category_title,set_task_category_title ]=useState<string>("")
    const dispatch = useDispatch<AppDispatch>()
    const [active_btn, set_active_btn]= useState<i_active_btn>({
        btn_id:0,
        active:false
    })
    const [form_data,set_form_data ]= useState<form_data>({
        title:"",
        status:"not completed",
        marks:null,
        task_category_id:null,
        parent_id:null, 
        workspace_id:1, 
        type_category: "task" 
        

    })

    useEffect(()=>{
        async function get_data() {
            if(taskId!=undefined){
                const task_data= await get_task_data_by_id(parseInt(taskId))
                set_form_data((prev)=>({
                   ...prev,
                   title: task_data.title,
                   status:task_data.status,
                   marks:task_data.marks,
                   task_category_id:task_data.task_category_id,
                   parent_id:task_data.parent_id, 
                   workspace_id:task_data.workspace_id, 
                   type_category: "task" 
                })) 
    
            }
            
        }
        get_data()
    }, [taskId])
    useEffect(()=>{
        async function get_data() {
            if(form_data.task_category_id!=undefined){
                const task_data= await get_task_category_by_category_id(form_data.task_category_id)
            set_task_category_title(task_data.name)
    
            }
            
        }
        get_data()
    },[form_data.task_category_id])
    let selected_category_task = useSelector((state:global_store_type)=>state.hotkey_and_category.selectedCategories.task)
      const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
           const task_data:i_ceate_task_data={
            title:form_data.title, 
            status:form_data.status,
            marks:form_data.marks,
            parentId:form_data.parent_id, 
            taskCategoryId:selected_category_task, 
            workspaceId:form_data.workspace_id
           }
           console.log(task_data)
           await update_full_task(parseInt(taskId!), form_data.title, form_data.marks, form_data.status, 
            form_data.parent_id,form_data.task_category_id, form_data.workspace_id)
            console.log("update_task")
              dispatch(get_all_tasksBy_workspace_id(form_data.workspace_id))
            }
       const select_marks=(mark_type:marksTask)=>{
        set_form_data((prev)=>({
            ...prev,
            marks:mark_type
        }))
    }
     
    
    const set_active_btn_fn=(id:number)=>{
        set_active_btn({active:active_btn.active==false?true:false, btn_id:id})
    }
    const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {value, name, checked , type} =e.target as HTMLInputElement
     
   set_form_data((prev)=>({
       ...prev,
       [name]: value
       
    }))
}
    return(
     <div className={styles.main_conteiner}>

        <form className={styles.category_form} onSubmit={handleSubmit}>
            
        <div className={styles.category_form__item}>
        <label className={styles.category_form__item_lebel} htmlFor="title">Что нужно сделать ?: </label>
        <input name="title" id="title" type="text" placeholder="укажите задачу" value={form_data.title}onChange={handleChange} />
    

            </div>

                <div className={styles.category_form__item}>
                    <div className={styles.category_form__item}>
                    <label className={styles.category_form__item_lebel_19} htmlFor="category_name">выбранная метка{form_data.marks!=null?<Marks_button mark_type={form_data.marks} click={()=> null}/>:"Нет" }</label>
                    <div className={styles.category_form__item__marks_btn_list}>
<Marks_button mark_type='Attention' click={()=>{select_marks('Attention'),set_active_btn_fn(1) }} 
 active={active_btn.btn_id==1?true:false}/>
<Marks_button mark_type='Important' click={()=>{select_marks('Important'), set_active_btn_fn(2)}} active={active_btn.btn_id==2?true:false}/>
<Marks_button mark_type='Urgently' click={()=>{select_marks('Urgently'), set_active_btn_fn(3)}}  active={active_btn.btn_id==3?true:false} />
                    </div>
                    </div>
               
                        
            <div className={styles.category_form__item}>
    <select name="status" id="" onChange={handleChange} value={form_data.status} >
                    <option value='not completed'>Не выполнено</option>
                    <option value="completed">Выполнено</option>
                    <option value="in work">В работе</option>
                    <option value="postponed">Отложено</option>
                </select>
    
            </div>
            <div className={styles.category_form__item__marks_btn_list}>
    {/* <Marks_button mark_type='Attention'/> 
     active={active_btn.btn_id==1?true:false}/>
    <Marks_button mark_type='Important' click={()=>{select_marks('Important'), set_active_btn_fn(2)}} active={active_btn.btn_id==2?true:false}/>
    <Marks_button mark_type='Urgently' click={()=>{select_marks('Urgently'), set_active_btn_fn(3)}}  active={active_btn.btn_id==3?true:false} /> */}
            </div>
            </div>
           
    
            <div className={styles.category_form__item}>
    <h3>Выбранная категория {task_category_title!=""?task_category_title:"нет"} </h3>
    <select name="type_category" id="" onChange={handleChange} value={form_data.type_category} >
                    <option value="task">задачи</option>
                    <option value="not_selected">выберете категорию</option>
                </select>
    
            </div>
            <div className={styles.category_form__item}>
             <Under_category_list type_category={form_data.type_category} /> 
            </div>
    
            {/* <Under_category_list type_category={form_data.type_category} /> */}
            <button type="submit">Изминить задачу</button>
    
        </form>
    </div >
    )
}