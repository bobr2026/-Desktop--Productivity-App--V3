import  styles from "./LeftBar.module.sass"
import { useState, useEffect } from "react"
import {get_list_category_btns}  from "./model/get_list_category_btns"
import CategoryButton from "./components/CategoryButton/CategoryButton"
import graund_icon from './icons/graund.svg'
import Polygon_1 from './icons/Polygon 1.svg'
import Polygon_2 from './icons/Polygon 2.svg'
import home from './icons/home 1.svg'
import setting from './icons/setting 1.svg'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../../../App/store/store"
import { global_store_type } from "../../../../App/store/global_store.types"
import { get_all_workspaces, set_active_workspase, } from "../../../../App/store/global_category_slise"
import { invoke } from "@tauri-apps/api/core"
import { I_workspace_types } from "../../../../shared/types"
import get_active_worspase_from_localStore from "../../../../shared/hooks/useGet_active_worspase_from_localStore"
function Workspase_list_item({workspace_id, name, color}:I_workspace_types){
   const dispatch= useDispatch<AppDispatch>()  
  return <h2 className={`${styles.LeftBar_category_title} 
  ${styles.LeftBar_category_margin_bottom}`} onClick={()=>   dispatch(set_active_workspase({
   workspace_id:workspace_id,
   name:name, 
   color:color
  }))}>{name} </h2>
}

export function LeftBar(){
    const navigate = useNavigate()
    const [togelleLeftBar,seTtogelleLeftBar ]=useState<boolean>(true)
    const [swoh_workspase_list, seTswoh_workspase_list]= useState<boolean>(true)
   
    const list_item = get_list_category_btns()
    const dispatch= useDispatch<AppDispatch>()
    const workspase_list = useSelector((state:global_store_type)=> state.global_category.worspases)
    const  active_workspase= useSelector((state:global_store_type)=>state.global_category.active_worspase)
    useEffect(()=>{
// async function add_workspase() {
//    await invoke("add_workspace", {name:"Работа", color:"#c45765"})
// }
// add_workspase()
dispatch(get_all_workspaces())
}, [])
const active_workspase_local_store= get_active_worspase_from_localStore()
console.log(workspase_list)
 
const workspase_list_items = workspase_list.map(data =>{
   return <Workspase_list_item key={data.workspace_id} workspace_id={data.workspace_id} color={data.color} name={data.name}/>})

    return (
       <div className={togelleLeftBar==true?styles.LeftBar:styles.LeftBar_hiden}>
        <div className={togelleLeftBar==true?styles.LeftBar_workspase:styles.LeftBar_workspase_hiden}>
         <CategoryButton title="окружения" icon={graund_icon} icon2={swoh_workspase_list==true?Polygon_1:Polygon_2} click={()=>seTswoh_workspase_list(swoh_workspase_list==true?false:true)}/>
<div className={styles.LeftBar_workspase_list}>
 {workspase_list_items}
</div>
        </div>
        <div className={togelleLeftBar==true?styles.LeftBar_category:styles.LeftBar_category_hiden}>
        <h2 className={styles.LeftBar_category_title}>{active_workspase_local_store?.name}</h2>
      <div className={styles.category_btn_list}>

     {list_item}

      </div>
   <div className={styles.settings_grub}>
    <img src={home} alt="" onClick={()=>navigate("/")} />
    <img src={setting} alt=""  />
   </div>
        </div>
       </div>
    )
}