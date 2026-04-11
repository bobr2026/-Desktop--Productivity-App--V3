import { ChangeEvent, useState } from 'react';
import styles from '../../shared/styles/forms.module.sass'
import Under_category_list from '../../shared/ui/under_category_list/Under_category_list'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore';
import { SelectType } from '../../App/store/global_store.types';
import { marksTask } from '../../shared/types';
import Marks_button from '../../shared/ui/mrks_button/mrks_button';

// title: String,
// status: String,
// marks: Option<String>,
// parent_id: Option<i64>,
// task_category_id: Option<i64>,
// workspace_id: i64,
type statusTask = "not completed"|"completed"|"in work"|"postponed"

interface form_data{
    title:string,
    status:statusTask,
    marks:null|marksTask,
    parent_id:null|number
    task_category_id:null|number
    workspace_id:number
    type_category:SelectType
}

export default function Create_task(){
    const [form_data,set_form_data ]= useState<form_data>({
        title:"",
        status:"not completed",
        marks:null,
        task_category_id:null,
        parent_id:null, 
        workspace_id:1, 
        type_category: "task" 
        

    })
    
    const workspace_id =useGet_active_worspase_from_localStore()
      const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
               set_form_data((prev)=>({
                ...prev

               }))
           console.log(form_data)
            
            }
            const select_marks=(mark_type:marksTask)=>{
                set_form_data((prev)=>({
                    ...prev,
                    marks:mark_type
                }))
            }
             const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
                    const {value, name, checked , type} =e.target as HTMLInputElement
                 
               set_form_data((prev)=>({
                   ...prev,
                   [name]: value
                   
                }))
            }
    return <div className={styles.main_conteiner}>

    <form className={styles.category_form} onSubmit={handleSubmit}>
        
    <div className={styles.category_form__item}>
    <label className={styles.category_form__item_lebel} htmlFor="title">Что нужно сделать ?: </label>
    <input name="title" id="title" type="text" placeholder="укажите задачу" onChange={handleChange} value={form_data.title}/>

            </div>
          
            <div className={styles.category_form__item}>
            <label className={styles.category_form__item_lebel} htmlFor="category_name">поставь метку (необязательно) </label>
        <div className={styles.category_form__item__marks_btn_list}>
<Marks_button mark_type='Attention' click={()=>select_marks('Attention')}/>
<Marks_button mark_type='Important' click={()=>select_marks('Important')}/>
<Marks_button mark_type='Urgently' click={()=>select_marks('Urgently')}/>
        </div>
        </div>
       
        {/* <div className={styles.category_form__item}> */}
        {/* <div className={styles_create_app.from_item_munu_and_recorder}> */}
            {/* <select name="type_category" id="" onChange={handleChange} value={form_data.type_category}>
                <option value="task">задачи</option>

            </select>

        </div> */}

        <div className={styles.category_form__item}>
         <Under_category_list type_category={form_data.type_category} /> 
        </div>

        {/* <Under_category_list type_category={form_data.type_category} /> */}
        <button type="submit">Создать задачу</button>

    </form>
</div >
}
