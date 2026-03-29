import { useEffect, useState } from 'react'
import styles from './Under_category_list.module.sass'
import strelka1 from './icons/strelka.svg'
import strelka2 from './icons/strelka2.svg'
import { select_types_category_enum } from '../../../pages/creare_category_page/create_category_page_types'
import useGet_categorys_data_by_workspase from '../../hooks/useGet_categorys_data_by_workspase'
import get_cildren_category from '../../utils/get_cildren_category.itils.ts'
import { useDispatch, useSelector } from 'react-redux'
import { global_store_type, SelectType } from '../../../App/store/global_store.types.ts'
import { AppDispatch } from '../../../App/store/store.ts'
import { removeSelectedCategory, setSelectedCategory,
 setSelectedHotkey, removeSelectedHotkey} from '../../../App/store/hotkey_and_category_slise.ts'
import { CategoryNode } from './ui/CategoryNode.tsx'
import { I_ginerik_category } from '../../types/categorys.ts'

interface Under_category_list {
    type_category: SelectType,
}
export default function Under_category_list({  type_category,  }: Under_category_list) {
    const selected_category = useSelector((state:global_store_type)=>state.hotkey_and_category.selectedHotkey)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
        dispatch(removeSelectedCategory(type_category))
    }, [])
    const [show_under_category, seTshow_under_category] = useState<boolean>(false)
    const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({})
   

    const toggleCategory = (id: number) => {
        setOpenCategories(prev => ({
          ...prev,
          [id]: !prev[id]
          
        }))
        seTshow_under_category(show_under_category==true?false:true)
      }
    const category_arr = useGet_categorys_data_by_workspase(type_category)
    const underlist_styles = {
        display: show_under_category  == true ? "block" : "none",
        opacity: show_under_category == true ? 1 : 0
    }
    const root_categories = category_arr.filter(
        (category) => category.parent_id === null
      )
      
    const category_list_elements=  root_categories.map((category)=>{
        const isOpen = openCategories[category.id]
       const  cildren = get_cildren_category(category_arr, category.id) 
        if(cildren.length==0){
          return  <div className={styles.under_category_list_item}>
            <div className={styles.under_category_list_item__title}>
                <h3 className={styles.under_category_list_item__title_h3} onClick={() => dispatch( dispatch(setSelectedCategory({id:category.id, type:type_category})))}>{category.name}</h3>
            </div>
            </div>
        }else{
   return        <div className={styles.under_category_list_item}>
            <div className={styles.under_category_list_item__title}>
                <img className={styles.under_category_list_item__title_ing}
                    src={isOpen == true ? strelka1 : strelka2} alt="" onClick={() => toggleCategory(category.id)} />
                <h3 className={styles.under_category_list_item__title_h3} onClick={() =>  dispatch(setSelectedCategory({id:category.id, type:type_category}))} >{category.name}</h3>
            </div>
            <div  className={`${styles.under_category_list_item__under_list} ${
    isOpen ? styles.open : ""
  }`}>
                {cildren.map((category)=>{
             return    <h3 className={styles.under_category_list_item__under_list_h3} 
             onClick={() =>  dispatch(setSelectedCategory({id:category.id, type:type_category}))}  >{category.name}</h3>
                })}
                
            </div>
        </div>
        }
    })
   
    return <ul className={styles.under_category_list}>
{/* {category_list_elements} */}
<ul className={styles.under_category_list}>
    {root_categories.map((category) => (
      <CategoryNode
        key={category.id}
        category={category}
        allCategories={category_arr}
        category_type={type_category}
      />
    ))}
  </ul>
    </ul>
}

// return <ul className={styles.under_category_list}>
//     <div className={styles.under_category_list_item}>
//         <div className={styles.under_category_list_item__title}>
//             <img className={styles.under_category_list_item__title_ing}
//                 src={show_under_category == false ? strelka1 : strelka2} alt="" onClick={() => seTshow_under_category(show_under_category == false ? true : false)} />
//             <h3 className={styles.under_category_list_item__title_h3} onClick={() => onClickSelet()}>title_main_category</h3>
//         </div>
//         <div style={underlist_styles} className={styles.under_category_list_item__under_list}>
//             <h3 className={styles.under_category_list_item__under_list_h3}>5675685</h3>
//             <h3 className={styles.under_category_list_item__under_list_h3}>7777777777</h3>
//             <h3 className={styles.under_category_list_item__under_list_h3}>7777777777</h3>
//             <h3 className={styles.under_category_list_item__under_list_h3}>7777777777</h3>
//         </div>
//     </div>
// </ul>