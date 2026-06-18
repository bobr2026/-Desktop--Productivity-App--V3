import { useSelector } from 'react-redux'
import { global_store_type } from '../../App/store/global_store.types'
import { Category_item } from './category_item'
import styles from './styles/category_list.module.sass'
import { JSX, useEffect, useState } from 'react'
import { useGet_all_itemCategoryByWorkspase } from './hooks/useGet_all_itemCategoryByWorkspase'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore'
import { I_ginerik_category, I_workspace_types } from '../../shared/types'
type Category_list_data_types ="app"|"note"|"folder"|"task"|"workspase"
export function Category_list(){
    const active_workspase= useGet_active_worspase_from_localStore()
    const [category_list_data_types, set_ategory_list_data_types]=useState<Category_list_data_types>("app")
    const [category_items, set_category_items]= useState<JSX.Element[]>([])
const data:I_ginerik_category[]|I_workspace_types[] = useGet_all_itemCategoryByWorkspase(category_list_data_types, active_workspase.workspace_id)

useEffect(()=>{
    if(category_list_data_types=='workspase'){
        const workspase_data  = data as I_workspace_types[]
        
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

    </div>
    <div className={styles.conteiner__header_filter_block}>
    <input type="text" placeholder='катигории.... '/>

    </div>

</div>
<div className={styles.conteiner__categoy_itenms}>
    
{category_items}
</div>
    </div>
}