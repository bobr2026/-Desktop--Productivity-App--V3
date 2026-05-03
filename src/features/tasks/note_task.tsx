import { useEffect, useState } from 'react'
import { marksTask, statusTask } from '../../shared/types'
import Marks_button from '../../shared/ui/mrks_button/mrks_button'
import styles from './styles/note_task_item.module.sass'
import { invoke } from '@tauri-apps/api/core'
import { AppDispatch } from '../../App/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { set_select_element_id } from './store/task_ui_slise_store'
import { global_store_type } from '../../App/store/global_store.types'
import note_icon from './task_icon/notes.svg'
export interface Note_task_item_props {
    title:string
    status:statusTask
    mark?:marksTask
    creaded:string
    update:string
    category_id:number|null
    element_id:number
    perent_id?:number
    render_type:"madal_list"|"sub_list"


}

// 1. Выносим маппинг цветов за пределы компонента
const STATUS_COLORS: Record<string, string> = {
    'not completed': 'red',
    'completed': 'green', // Исправил опечатку: 'gren' -> 'green'
    'in work': '#FF6200',
}

export default function Note_task_item({ 
    title, status, render_type,  mark, category_id, creaded, update, element_id, perent_id 
}: Note_task_item_props) {
    const dispatch = useDispatch<AppDispatch>()
    const [category_name, set_category_name] = useState<string>("НЕТ")
    const [select, set_select]=useState<boolean>(false)
    const select_element_id = useSelector((stete: global_store_type) => stete.ui_task_list)
    // 2. Вычисляем цвет на лету без useState!
    const color_status = STATUS_COLORS[status] || "transparent";

    useEffect(() => {
        async function get_category() {
            if (category_id === null) return; // Защита от пустых ID
            const fetched_category_name: string = await invoke("get_note_Category_name_ById", { categoryId: category_id })
            set_category_name(fetched_category_name)
        }
        get_category()
    }, [category_id]) // 3. Хорошей практикой считается указывать переменные в массиве зависимостей
    const fullClassName = `${styles.note_task_item_conteiner}  ${select==false?styles.base:styles.active}`;

    return (
        <div style={{ 'borderLeft': `6px solid ${color_status}` }} className={fullClassName} 
        onClick={
            ()=>{dispatch(set_select_element_id(select_element_id.select_element_id!=element_id?element_id:-1)), console.log(select_element_id),  set_select(!select) }
            

        }>
            <div className={styles.note_task_item_conteiner_main}>
                <div className={styles.note_task_item_conteiner_main_1}>
<img style={{display:render_type=='madal_list'?'none':'block'}} className={styles.note_task_item_img} src={note_icon} alt="" />
                </div>
                <div className={styles.note_task_item_conteiner_main_2}>
                <h2>{title}</h2>
                <h3>статус {status}</h3>

                </div>
            </div>
            <div className={styles.note_task_item_conteiner__data_div}>
                <div className={styles.note_task_item_conteiner__data_div_1}>
                    <h3>группа {category_name}</h3>
                    {mark != undefined ? <Marks_button click={() => null} mark_type={mark} /> : null}
                </div>
                <div className={styles.note_task_item_conteiner__data_div_2}>
                    <h3>создан: {creaded}</h3>
                    <h3>обновлен: {update}</h3>
                </div>
            </div>
        </div>
    )
}