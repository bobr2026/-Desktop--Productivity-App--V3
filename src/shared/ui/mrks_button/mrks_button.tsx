import { marksTask } from '../../types'
import styles from './mrks_button.module.sass'
interface mrks_button_props{
  mark_type:marksTask
  active?:boolean
  click: (mark_type: marksTask) => void
}
 function Marks_button1({click, mark_type, active}:mrks_button_props){
    // type marksTask = "Important"|"Urgently"|"Attention" //Важно /Срочно/Внимание
    //styles.mrks_button_Attention
const className= mark_type=="Important"?styles.mrks_button_Important:
mark_type=="Urgently"?styles.mrks_button_Urgently:mark_type=='Attention'? styles.mrks_button_Attention: styles.mrks_button_No
const btn_title= mark_type=="Important"?"Важно!":
mark_type=="Urgently"?"Срочно!":mark_type=='NO'?'Нет':'Внимание'

return <button className={className} onClick={()=>click}>{btn_title}</button>
}
// import { marksTask } from '../../types'
// import styles from './mrks_button.module.sass'

// interface mrks_button_props {
//   mark_type: marksTask
//   click: (mark_type: marksTask) => void
// }

export default function Marks_button({ click, mark_type, active }: mrks_button_props) {
  
  // 1. Создаем мапу для названий (так чище, чем тернарники)
  const titles: Record<marksTask, string> = {
    Important: "Важно!",
    Urgently: "Срочно!",
    Attention: "Внимание!",
    NO:"Нет"
  }

  // 2. Правильно склеиваем классы. 
  // Мы ВСЕГДА даем styles.mrks_button и ДОБАВЛЯЕМ модификатор
  const modifierClass = styles[`mrks_button_${mark_type}`];
  const fullClassName = `${styles.mrks_button} ${modifierClass} ${active==false?styles.base:styles.active}`;

  return (
    <button 
    type='button'
      className={fullClassName} 
      onClick={() => click(mark_type)} 
    >
      {titles[mark_type]}
    </button>
  )
}