import { useDispatch, useSelector } from 'react-redux'
import { global_store_type } from '../../App/store/global_store.types'
import { Category_item } from './category_item'
import styles from './styles/category_list.module.sass'
import { ChangeEvent, JSX, useEffect, useMemo, useState } from 'react'
import { useGet_all_itemCategoryByWorkspase } from './hooks/useGet_all_itemCategoryByWorkspase'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore'
import { I_ginerik_category, I_workspace_types } from '../../shared/types'
import { Workspase_item } from './workspase_item'
import { get_all_appsBy_workspace_id } from '../app/store/app_slise_store'
import { AppDispatch } from '../../App/store/store'
import { get_all_notesBy_workspace_id } from '../../App/store/note_list_slise_store'
import { get_all_foldersBy_workspace_id } from '../folder/store/folder_slise_store'
import { get_all_tasksBy_workspace_id } from '../tasks/store/task_list_store'
import { App_item } from '../app/app_item'
import Note_task_item from '../tasks/note_task'
import { Folder_item } from '../folder/folder_item'
import Task_item from '../tasks/task_item'
import strelka1 from './icons/strelka.svg'
import strelka2 from './icons/strelka2.svg'
type Category_list_data_types ="app"|"note"|"folder"|"task"|"workspase"

export function Category_list(){
    const active_workspase= useGet_active_worspase_from_localStore()
    const [category_list_data_types, set_ategory_list_data_types]=useState<Category_list_data_types>("app")
    const [category_items, set_category_items]= useState<JSX.Element[]>([])
    const [open_cildrren_item, set_open_cildrren_item] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
const data:I_ginerik_category[]|I_workspace_types[] = useGet_all_itemCategoryByWorkspase(category_list_data_types, active_workspase.workspace_id)
const [show_not_category_elements, set_show_not_category_elements]=useState(false)
// const [not_category_elements, set_not_category_elements]=useState<JSX.Element[]>([])
const apps = useSelector((stete: global_store_type) => stete.apps_list.apps)
const tasks = useSelector((stete: global_store_type) => stete.task_list.tasks)
const folders = useSelector((stete: global_store_type) => stete.folder_list.folders)
const notes = useSelector((stete: global_store_type) => stete.note_list.notes)

useEffect(() => {
    if (!active_workspase.workspace_id) return;

    switch (category_list_data_types) {
        case 'app':
            dispatch(get_all_appsBy_workspace_id(active_workspase.workspace_id))
            break;
        case 'note':
            dispatch(get_all_notesBy_workspace_id(active_workspase.workspace_id))
            break;
        case 'folder':
            dispatch(get_all_foldersBy_workspace_id(active_workspase.workspace_id))
            break;
        case 'task':
            dispatch(get_all_tasksBy_workspace_id(active_workspase.workspace_id))
            break;
        default:
            break;
    }
}, [category_list_data_types, active_workspase.workspace_id, dispatch])

// 2. Динамический расчет элементов без категории (вычисляется автоматически при обновлении стора)
const not_category_elements = useMemo(() => {
    if (!show_not_category_elements) return [];

    switch (category_list_data_types) {
        case 'app':
            return apps
                .filter(app => app.app_category_id == null)
                .map(app => (
                    <App_item 
                        key={app.id} // Добавлен key
                        id={app.id} 
                        icon_path={app.icon_path} 
                        app_path={app.path} 
                        hotkey={app.hotkey}
                        app_category_id={app.app_category_id} 
                        globol_category_id={app.globol_category_id}
                        title={app.title} 
                        swoh_color_grub={'app_category'} 
                    />
                ));
        case 'note':
            return notes
                .filter(note => note.note_category_id == null)
                .map(note => (
                    <Note_task_item
                        key={note.note_id}
                        title={note.title}
                        category_id={note.note_category_id}
                        creaded={note.created_at}
                        update={note.updated_at}
                        element_id={note.note_id}
                        mark={note.marks != null ? note.marks : undefined}
                        status={note.status}
                        render_type='sub_list'
                        note_id={note.note_id}
                    />
                ));
        case 'folder':
            return folders
                .filter(folder => folder.folder_category_id == null)
                .map(folder => (
                    <Folder_item 
                        key={folder.id} 
                        id={folder.id} 
                        icon_id={folder.icon_id} 
                        path={folder.path} 
                        hotkey={folder.hotkey}
                        folder_category_id={folder.folder_category_id} 
                        globol_category_id={folder.globol_category_id}
                        title={folder.title} 
                        swoh_color_grub={"folder_category"}
                    />
                ));
        case 'task':
            return tasks
                .filter(task => task.task_category_id == null)
                .map(task => (
                    <Task_item 
                        key={task.task_id} 
                        id={task.task_id} 
                        title={task.title} 
                        status={task.status} 
                        mark_type={task.marks} 
                        workspase={task.workspace_id} 
                    />
                ));
        default:
            return [];
    }
}, [category_list_data_types, show_not_category_elements, apps, notes, folders, tasks]);

// useEffect(()=>{
//    switch (category_list_data_types) {
//     case 'app':
//             dispatch(get_all_appsBy_workspace_id(active_workspase.workspace_id))
//             const app_list = apps.map(app => {
//                 if(app.app_category_id==null){

//                     return <App_item id={app.id} icon_path={app.icon_path} app_path={app.path} hotkey={app.hotkey}
//                         app_category_id={app.app_category_id} globol_category_id={app.globol_category_id}
//                         title={app.title} swoh_color_grub={'app_category'} />
//                 }
//                })
//                set_not_category_elements(app_list as JSX.Element[])
//         break;
//         case 'note':
//             dispatch(get_all_notesBy_workspace_id(active_workspase.workspace_id))
//              const note_list= notes.map((note) => {
//                 if(note.note_category_id==null){

//                     return   <Note_task_item
//                                     key={note.note_id} // Обязательный ключ для React
//                                     title={note.title}
//                                     category_id={note.note_category_id}
//                                     creaded={note.created_at}
//                                     update={note.updated_at}
//                                     element_id={note.note_id}
//                                     mark={note.marks != null ? note.marks : undefined}
//                                     status={note.status}
//                                     render_type='sub_list'
//                                     note_id={note.note_id}
//                                 />
//                 }
//                             })
//                             set_not_category_elements(note_list as JSX.Element[])
//         case 'folder':
//             dispatch(get_all_foldersBy_workspace_id(active_workspase.workspace_id))

//                const folder_list = folders.map(app => {
//                 if(app.folder_category_id==null){

//                     return <Folder_item id={app.id}  key={app.id} icon_id={app.icon_id} path={app.path} hotkey={app.hotkey}
//                         folder_category_id={app.folder_category_id} globol_category_id={app.globol_category_id}
//                         title={app.title}  swoh_color_grub={"folder_category"}/>
//                 }
//                 })
      
//                 set_not_category_elements(folder_list as JSX.Element[])
//         case 'task':
//             dispatch(get_all_tasksBy_workspace_id(active_workspase.workspace_id))
//                const task_list = tasks.map(app => {
//                 if(app.task_category_id==null){
//                     return <Task_item key={app.task_id} id={app.task_id} title={app.title} status={app.status} mark_type={app.marks} workspase={app.workspace_id} />

//                 }

//                 })
//                 set_not_category_elements(task_list as JSX.Element[])
//         case 'workspase':
//             break
   
//     default:
//         break;
//    }
  
// }, [category_list_data_types, active_workspase.workspace_id])




   
    const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {value, name, checked , type} =e.target as HTMLInputElement
//    setForm_data((prev)=>({
//        ...prev,
//        [name]: value
       set_show_not_category_elements(checked)
//     }))

}
useEffect(()=>{
    if(category_list_data_types=='workspase'){
        const workspase_data  = data as I_workspace_types[]
    
        let items= workspase_data.map((data)=>{
            return <Workspase_item  workspase_id={data.workspace_id} name={data.name}  color={data.color}/>
        })
  
        set_category_items(items)

       }else{
       const category_data= data as I_ginerik_category[]
       const items= category_data.map((data)=>{
           return <Category_item id={data.id} title={data.name} type={category_list_data_types} color={data.color==null?"":data.color}/>
       })
       set_category_items(items)
       }
}, [category_list_data_types, data])

    return <div className={styles.conteiner}>
<div className={styles.conteiner__header}>
    <div className={styles.conteiner__header_btn_list}>
    <button onClick={()=>set_ategory_list_data_types("note")}>Заметки</button>
    <button onClick={()=>set_ategory_list_data_types("app")}>Приложения</button>
    <button onClick={()=>set_ategory_list_data_types("folder")}>Папки</button>
    <button onClick={()=>set_ategory_list_data_types("task")}>Задачи</button>
    <button onClick={()=>set_ategory_list_data_types("workspase")}>Окружения</button>
    <div className="">
        <input type="checkbox" onChange={handleChange} />
        <label htmlFor=""> паказать элементы без катигории</label>
        </div>
    </div>
    <div className={styles.conteiner__header_filter_block}>
       
   
    <input type="text" placeholder='катигории.... '/>

    </div>

</div>
<div className={styles.conteiner__categoy_itenms}>

    {show_not_category_elements==false?null:
    <div className={styles.main_item_category_elements_wraper_1}>

    <div className={styles.main_item_category_elements_wraper}>
    <img src={open_cildrren_item == false ? strelka1 : strelka2} alt="" onClick={() => set_open_cildrren_item(!open_cildrren_item)} />
    <div className={styles.main_item_category_elements} >
        <h2>без категории</h2>
        <h2>КОЛИЧЕСТВО ЭЛЕМЕНТОВ: {not_category_elements.length}</h2>
        </div>
    </div>
        {open_cildrren_item==true?not_category_elements:null}
    </div>
        }
{category_items}
</div>
    </div>
}