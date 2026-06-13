import { useSelector } from 'react-redux'
import { global_store_type } from '../../App/store/global_store.types'
import { Category_item } from './category_item'
import styles from './styles/category_list.module.sass'
import { useState } from 'react'
type Category_list_data_types ="app"|"note"|"folder"|"workspase"
export function Category_list(){

   const [category_list_data_types, set_ategory_list_data_types]=useState<Category_list_data_types>("app")
    return <div className={styles.conteiner}>
<div className={styles.conteiner__header}>
    <div className={styles.conteiner__header_btn_list}>
    <button onClick={()=>set_ategory_list_data_types("note")}>Заметки</button>
    <button onClick={()=>set_ategory_list_data_types("app")}>Приложения</button>
    <button onClick={()=>set_ategory_list_data_types("folder")}>Папки</button>
    <button onClick={()=>set_ategory_list_data_types("workspase")}>Окружения</button>

    </div>
    <div className={styles.conteiner__header_filter_block}>
    <input type="text" placeholder='катигории.... '/>

    </div>

</div>
<div className={styles.conteiner__categoy_itenms}>
<Category_item id={0} title='565'  type={category_list_data_types} color='red'/>
</div>
    </div>
}