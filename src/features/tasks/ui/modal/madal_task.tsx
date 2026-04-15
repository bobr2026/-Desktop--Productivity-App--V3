import { useSelector, useDispatch } from 'react-redux'
import { global_store_type } from '../../../../App/store/global_store.types'
import { AppDispatch } from '../../../../App/store/store'
import model_cloused_icon from '../../task_icon/modal_closed_icon.png'
import styles from './madal_task.module.sass'
import { useEffect } from 'react'
import useGet_active_worspase_from_localStore from '../../../../shared/hooks/useGet_active_worspase_from_localStore'

export default function Madal_task(){
    const show_context_munu = useSelector((stete: global_store_type) => stete.ui_task_list.show_context_munu)
    const parent_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.parent_element_id)
    const select_element_id = useSelector((stete: global_store_type) => stete.ui_task_list.select_element_id)
    const dispatch = useDispatch<AppDispatch>()
    const active_workspase_local_store = useGet_active_worspase_from_localStore()
    const apps =useSelector((state:global_store_type)=>state.apps_list.apps)
    useEffect(()=>{
    }, [])

    return<div className={styles.modal}>
    <div className={styles.modal__header}>
        <h2 className={styles.modal__header_h2}>Такс,  какую заметку свяжем с задачей ?</h2>
        <img className={styles.modal__header_clozed_img} src={model_cloused_icon} alt="" />
    </div>
    <div className={styles.modal__elements_list}>

    </div>
</div>
}