import { useDispatch, useSelector } from "react-redux";
import { global_store_type } from "../../App/store/global_store.types";
import { i_note } from "../../shared/types";
import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './note_item.module.sass' 
import { AppDispatch } from "../../App/store/store";
import Context_menu from "../../shared/ui/context_munu/context_munu";
import { set_context_munu_point, setOpenedContextMenu } from "../../App/store/context_munu_slise";
import { delete_note_from_db } from "./model/note.model";
import { delete_note } from "../../App/store/note_list_slise_store";
// import { delete_task_from_db } from "../tasks/model/task.module";
// import { delete_task } from "../tasks/store/task_list_store";
export function Note_item({note_id, workspace_id, title, marks,
     status, created_at, updated_at, note_category_id, globol_category_id}:i_note){
      const dispatch = useDispatch<AppDispatch>()
      const {openedContextMenuId, contextMenuX, contextMenuY} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
    const context_munu_itens=[
           {
                  label: "Удалить",
                  onClick: () => {
                      dispatch(delete_note(note_id))
                      delete_note_from_db(note_id)
      
                  }
              }
    ]
    return <div className={styles.note_item_main_block} onContextMenu={(e: React.MouseEvent) => {
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
    <p>{title}</p>
    <p>{status}</p>
  </div>
  <div className={styles.note_item__content_block}>
  <div className={styles.note_item__content_block_item}>
      <p>категория:base</p>  
     <Marks_button mark_type='Attention' click={()=>null}/>
    </div>
    <div className={styles.note_item__content_block_item}>
    <p>Создан: {created_at}</p>
    <p>Обновлён: {updated_at}</p>
    </div>
      </div>
       <Context_menu open={openedContextMenuId === note_id} x={contextMenuX} y={contextMenuY} items={context_munu_itens} />
    </div>
}