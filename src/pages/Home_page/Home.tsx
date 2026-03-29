import { useEffect } from 'react'
import styles from'./Home.module.sass'
import { useDispatch,useSelector  } from 'react-redux'
import { AppDispatch } from '../../App/store/store'
import { global_store_type, type_page_enum } from '../../App/store/global_store.types'
import { add_active_page } from '../../layouts/root_layout/ui/header/store/Header.store'
import { active_page_hendler } from '../../shared/utils/active_page_hendler.utils'
export function Home(){
   active_page_hendler(type_page_enum.home,  "/", "Home")
return (<><p className={styles.home}>Home page</p></>)
}