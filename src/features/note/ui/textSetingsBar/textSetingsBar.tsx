import { useState } from "react";
import { TextIcon } from "../icons/TextIcon";
import style from  './textSetingsBar.module.sass'

export function TextSetingsBar(){
//   const colorBgArr=["red", "#555"]
  const colorTextArr=["red", "#445" , "#666", '#888', '#999', '#111']
    const [open_color_list, set_open_color_list]= useState(false)
   return( 
      <div className={style.textSetingsBar} style={{left:open_color_list==false?0:"-400%"}}>

   <div className={style.textSetingsBar_munu} style={{display:open_color_list==false?'none':'flex'}}>
      <div className={style.textSetingsBar_munu_colors_block}>
      <button className={style.TextSetingsBar_reset_style_btn}>сброс</button>
      {/* {colorBgArr.map((color)=>{
   return  <div className={style.color_item} style={{background:color}}></div>
})} */}
      </div>

      <input type='number' max={24} min={0}/>
      <div className={style.textSetingsBar_munu_colors_block}>
      {colorTextArr.map((color)=>{
   return  <div className={style.color_item} style={{background:color}}></div>
})}
      </div>

   </div>
   <TextIcon click={()=>set_open_color_list(!open_color_list)}/>
      </div>

   )
}