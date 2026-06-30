import { useDispatch, useSelector } from "react-redux";
import { global_store_type } from "../../App/store/global_store.types";
import { i_note, STATUS_COLORS } from "../../shared/types";
import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './note_item.module.sass' 
import { AppDispatch } from "../../App/store/store";
import Context_menu from "../../shared/ui/context_munu/context_munu";
import { set_context_munu_point, setOpenedContextMenu } from "../../App/store/context_munu_slise";
import { delete_note_from_db, get_note_categories_by_id } from "./model/note.model";
import { delete_note } from "../../App/store/note_list_slise_store";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
// import { delete_task_from_db } from "../tasks/model/task.module";
// import { delete_task } from "../tasks/store/task_list_store";
export function Note_item({note_id, workspace_id, title, marks,
     status, created_at, updated_at, note_category_id, globol_category_id}:i_note){
      const dispatch = useDispatch<AppDispatch>()
      const [category_name, set_category_name]=useState<string>("Нет")
      const {openedContextMenuId, contextMenuX, contextMenuY} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
    useEffect(()=>{
   
        async function get_data() {
          if(note_category_id!=null){
      const data =   await get_note_categories_by_id(note_category_id)
      set_category_name(data.name)

    }else{ set_category_name("Нет") }

      }
      get_data()
    }, [note_id, note_category_id])
    const color_status = STATUS_COLORS[status] || "transparent";
    console.log(status);
    const context_munu_itens=[
           {
                  label: "Удалить",
                  onClick: () => {
                      dispatch(delete_note(note_id))
                      delete_note_from_db(note_id)
      
                  }
              }
    ]
    return <div className={styles.note_item_main_block} style={{"borderLeft":`10px solid ${color_status}`}} onContextMenu={(e: React.MouseEvent) => {
                    e.preventDefault()
    
                    dispatch(
                        setOpenedContextMenu(
                            openedContextMenuId === note_id? null : note_id
                        )
                    )
    dispatch(set_context_munu_point("reset"))
                    dispatch(set_context_munu_point({
                        x: e.clientX,
                        y: e.clientY,
                    
                    }))
                }}>
  <div className={styles.note_item__title_block}>
    <h2>{title}</h2>
    <h3>{status}</h3>
  </div>
  <div className={styles.note_item__content_block}>
  <div className={styles.note_item__content_block_item}>
      <h3>категория:{category_name}</h3>  
    { marks!=null? <Marks_button mark_type={marks} click={()=>null}/>:null}
    </div>
    <div className={styles.note_item__content_block_item}>
    <h4>Создан: {created_at}</h4>
    <h4>Обновлён: {updated_at}</h4>
    </div>
      </div>
       <Context_menu open={openedContextMenuId === note_id} x={contextMenuX} y={contextMenuY} items={context_munu_itens} />
    </div>
}