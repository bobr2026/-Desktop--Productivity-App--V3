import { useState } from 'react'
import styles from './colorBar.module.sass'
export function ColorBar(){
  const [open_color_list, set_open_color_list]= useState(false)
   return (<div className={styles.ColorBar} style={{left:open_color_list==false?0:"-370%"}}>


 <div className={styles.main_crug} onClick={()=>set_open_color_list(!open_color_list)}></div>
 <div className={styles.Colors_list} style={{display:open_color_list==false?'none':'flex'}}>
  <div className={styles.color_item}></div>
  <div className={styles.color_item}></div>
  <div className={styles.color_item}></div>
 </div> 
   </div>

 )
}