import { i_note } from "../../shared/types";
import Marks_button from "../../shared/ui/mrks_button/mrks_button";
import styles from './note_item.module.sass' 
export function Note_item({note_id, workspace_id, title, marks,
     status, created_at, updated_at, note_category_id, globol_category_id}:i_note){
    return <div className={styles.note_item_main_block}>
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
    </div>
}