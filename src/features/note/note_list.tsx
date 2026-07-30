import { Link } from 'react-router-dom'
import styles from '../../shared/styles/list-base.module.sass'
import { useDispatch, useSelector } from 'react-redux'
import { global_store_type } from '../../App/store/global_store.types'
import { AppDispatch } from '../../App/store/store'
import { useEffect } from 'react'
import { get_all_notesBy_workspace_id } from '../../App/store/note_list_slise_store'
import { Note_item } from './note_item'
export function Note_list(){
    const notes = useSelector((stete: global_store_type) => stete.note_list.notes)
    const active_wokspase = useSelector((state: global_store_type) => state.global_category.active_worspase)
    const dispatch = useDispatch<AppDispatch>()
      useEffect(() => {
            console.log(active_wokspase)
            dispatch(get_all_notesBy_workspace_id(active_wokspase != null ? active_wokspase?.workspace_id : 1))
    
    
        }, [active_wokspase])
        console.log(notes)
          const note_list = notes.map((note)=>{
       return <Note_item key={note.note_id} note_id={note.note_id} 
       created_at={note.created_at} 
       title={note.title} note_category_id={note.note_category_id} 
       status={note.status} marks={note.marks}
        updated_at={note.updated_at}
        globol_category_id={note.globol_category_id} 
        workspace_id={note.workspace_id}/>
          })
    return <div className={styles.list_base_block }>
  <div className={styles.list_base}>
        {note_list.length==0?<h2>Список пуст, <Link className={styles.main_conteiner__link} to={"/create_note_page"}>  Добавите Заметку   </Link> </h2>:note_list}
        </div>
    </div>
}