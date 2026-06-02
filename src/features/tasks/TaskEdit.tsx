import { ChangeEvent, useState } from 'react';
import styles from '../../shared/styles/forms.module.sass'
import Under_category_list from '../../shared/ui/under_category_list/Under_category_list'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore';
import { global_store_type, SelectType } from '../../App/store/global_store.types';
import { i_ceate_task_data, marksTask, statusTask ,form_data, i_active_btn} from '../../shared/types';
import Marks_button from '../../shared/ui/mrks_button/mrks_button';
import { useSelector } from 'react-redux';
import { ceate_task_fn } from './model/task.module';
//  GIT НАДО ОТРЕФАКТОРИТЬ STATE И ФУНКЦИИ  
export  interface TaskEditProps{
    taskId:string|undefined
}
export default function TaskEdit({taskId}:TaskEditProps){
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

        <form className={styles.category_form} >
            
        <div className={styles.category_form__item}>
        <label className={styles.category_form__item_lebel} htmlFor="title">Что нужно сделать ?: </label>
        <input name="title" id="title" type="text" placeholder="укажите задачу" value={form_data.title}onChange={handleChange} />
    
                </div>
              
                <div className={styles.category_form__item}>
                    <div className={styles.category_form__item}>
                    <label className={styles.category_form__item_lebel_19} htmlFor="category_name">выбранная метка <Marks_button mark_type='Attention' click={()=> null}  /></label>
                    <div className={styles.category_form__item__marks_btn_list}>
<Marks_button mark_type='Attention' click={()=>{select_marks('Attention'),set_active_btn_fn(1) }} 
 active={active_btn.btn_id==1?true:false}/>
<Marks_button mark_type='Important' click={()=>{select_marks('Important'), set_active_btn_fn(2)}} active={active_btn.btn_id==2?true:false}/>
<Marks_button mark_type='Urgently' click={()=>{select_marks('Urgently'), set_active_btn_fn(3)}}  active={active_btn.btn_id==3?true:false} />
                    </div>
                    </div>
               
                        
            <div className={styles.category_form__item__marks_btn_list}>
    {/* <Marks_button mark_type='Attention'/> 
     active={active_btn.btn_id==1?true:false}/>
    <Marks_button mark_type='Important' click={()=>{select_marks('Important'), set_active_btn_fn(2)}} active={active_btn.btn_id==2?true:false}/>
    <Marks_button mark_type='Urgently' click={()=>{select_marks('Urgently'), set_active_btn_fn(3)}}  active={active_btn.btn_id==3?true:false} /> */}
            </div>
            </div>
           
    
            <div className={styles.category_form__item}>
    <h3>Выбранная категория  </h3>
    <select name="type_category" id="" onChange={handleChange} value={form_data.type_category} >
                    <option value="task">задачи</option>
                    <option value="not_selected">выберете категорию</option>
                </select>
    
            </div>
            <div className={styles.category_form__item}>
             <Under_category_list type_category={form_data.type_category} /> 
            </div>
    
            {/* <Under_category_list type_category={form_data.type_category} /> */}
            <button type="submit">Создать задачу</button>
    
        </form>
    </div >
    )
}