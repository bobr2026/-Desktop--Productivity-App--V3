import { useDispatch, useSelector } from "react-redux"
import { global_store_type } from "../../../../App/store/global_store.types"
import { AppDispatch } from "../../../../App/store/store"
import styles from "./header.module.sass"

import { HeaderButton, HeaderButton_test } from "./ui/HeaderButton/HeaderButton"
import { useNavigate } from "react-router-dom"
import { delete_active_page } from "./store/Header.store"
export function Header(){
   const navigation= useNavigate()
   const dispatch= useDispatch<AppDispatch>()
   const active_pages = useSelector((state:global_store_type)=> state.header.active_page)
const active_pages_list =  active_pages.map((page, index)=>{
      return <HeaderButton_test key={index} title={page.active_page_title} click={()=>{
         if(page.element!=null){
            navigation( page.element)}}
         }
         click2={()=>{
 dispatch(delete_active_page(page.active_page_id))            
         }}
         />
         })
         
    return (
       <div className={styles.Header}>
        <div className={styles.header_btn_block}>
         {active_pages_list}
<HeaderButton title="Создать " click={()=>navigation("create_item")}/>

        </div>

       </div>
    )
}