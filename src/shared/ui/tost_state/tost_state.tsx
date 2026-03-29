// import styles from './tost_state.module.sass'
// type tost_state_tupe="Success"|"Error"|"Warning"
// interface Tost_state_props{
    //     type_tost:tost_state_tupe
    //     text:string
    //     swoh:boolean
    
// }
// export default function Tost_state({type_tost , text, swoh}:Tost_state_props){
    //     const stylesbtn={
//         opacity:swoh==true?1:0
//     }
//   return  <div  style={stylesbtn} className={type_tost=="Success"?
//     styles.tost_state__Success:type_tost=="Warning"
//     ?styles.tost_state__Warning: styles.tost_state__Error
// } >
//         <p className=    {type_tost=="Success"?
//                 styles.tost_state__Success_text:type_tost=="Warning"
//                 ?styles.tost_state__Warning_text: styles.tost_state_Error_text
//             } 

//         >{text}</p>
//     </div>


  
// }

{/* <h2 className={`${styles.LeftBar_category_title} 
  ${styles.LeftBar_category_margin_bottom}`} onClick={()=>   dispatch(set_active_workspase({ */}
  
  import { createPortal } from "react-dom"
  import { TostStateType } from '../../types';
  import styles from './tost_state.module.sass';
  import cn from 'classnames';
  


interface TostStateProps {
  type_tost: TostStateType;
  text: string;
  swoh: boolean;
}

export default function TostState({ type_tost, text, swoh }: TostStateProps) {
  const inlineStyles = { opacity: swoh ? 1 : 0 };

  // Объединяем базовый класс и модификатор
  const toastClass = cn(
    styles.tost_state,
    {
      [styles.tost_state__Success]: type_tost === 'Success',
      [styles.tost_state__Warning]: type_tost === 'Warning',
      [styles.tost_state__Error]: type_tost === 'Error',
    }
  );

  return (
    <div style={inlineStyles} className={toastClass} >
      <p>{text}</p>
    </div>
  );
}
