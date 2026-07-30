import AutoGrowTextarea from '../../shared/ui/AutoGrowTextarea/AutoGrowTextarea'
import Base_button from '../../shared/ui/base_buttom/base_button'
import Marks_button from '../../shared/ui/mrks_button/mrks_button'
import styles from './note_form.module.sass'
import Toolbar from './ui/Toolbar/toolbar'
import { TitleIputBlock } from './widgets/TitleIputBlock/TitleIputBlock'
interface note_form_propos{
    noteId:string|undefined
}
export function NoteForm({noteId}:note_form_propos){
    return <div className={styles.note_form__main_block}>
        <div className={styles.note_form__header}>
         <TitleIputBlock button_title='Новый пост' button_click={()=>console.log("77")}/>
            <div className={styles.note_form__header_marksAndStatusBlock}>
  <div className={styles.note_form__header_marksBtn}>
<Marks_button mark_type='Attention' click={()=>console.log("click") } active={false}/>
<Marks_button mark_type='Important' click={()=>null} active={false}/>
<Marks_button mark_type='Urgently' click={()=>null}  active={false}/>
<Marks_button mark_type='NO' click={()=>null}  active={false}/>
    {/* <button   onMouseEnter={() => console.log("div hover")}>678686</button> */}
{/* <Marks_button mark_type='NO' click={()=>null}/> */}
  </div>
  {/* "not completed"|"completed"|"in work"|"postponed" */}
<select name="" id="">
    <option value="not completed">НЕ ВЫПОНЕНО</option>
    <option value="completed">ВЫПОНЕНО</option>
    <option value="postponed">ОТЛОЖЕННО</option>
    <option value="in work">В РАБОТЕ</option>
</select>
            </div>
            <Base_button>сохранить</Base_button>
        </div>
        <div className={styles.note_form__content}>
      
            <div className={styles.note_post}>
            <TitleIputBlock button_title='Новый абзац' button_click={()=>console.log("77")}/>
            <div className={styles.paragrah}>
                <p>{'6785756756567567 \n67567567567'}</p>
            </div>
            <div className={styles.paragrah}>
                {/* <p>'68768768768768768768768768768768768768 \n 87567575'</p> */}
                 <textarea
        className={styles.textarea}
        defaultValue="68768768768768768768768768768768768768
87567575"
        spellCheck={false}
        onChange={(e) => {
            // если нужно сохранять значение
            console.log(e.target.value);
        }} 
 /> 
            </div>
            <div className={styles.paragrah}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam corrupti a doloribus dolores recusandae odit cumque aspernatur dolor quis modi doloremque, impedit quisquam esse sed, tenetur officia quia assumenda vitae rem reprehenderit! Sequi facilis atque eligendi aspernatur officia, animi perspiciatis nisi, obcaecati sapiente culpa iusto voluptates hic neque suscipit harum saepe in, sed officiis ullam ab fugit optio odit dolore dolorem? Minima magnam odio labore quidem doloremque. Quisquam, fugit cupiditate praesentium blanditiis natus enim amet repellat neque obcaecati expedita officia temporibus laborum accusantium exercitationem iste similique perferendis. Corporis aliquid, perferendis, placeat in omnis dolor minus corrupti eveniet repudiandae quod expedita quae rem debitis beatae dolores quisquam vel. Aspernatur numquam iure, soluta amet molestiae voluptas obcaecati nemo dolorum hic iste corporis, beatae odio id alias maxime eum, necessitatibus perferendis. In dicta est consectetur, animi asperiores id quas odio laudantium ut aspernatur reprehenderit delectus vitae voluptas maiores tempora corrupti inventore eum dolore similique quos fugit laborum ipsum obcaecati? Dolore maxime tempora tempore accusamus explicabo sit, veniam totam eveniet ipsa ad labore adipisci necessitatibus, cumque fugiat, debitis repudiandae ducimus illum modi! Tempore blanditiis dolor reiciendis, perferendis nam totam. Dolorem tempora non minima pariatur in consequatur, distinctio ipsum dolor reprehenderit labore officiis ullam autem!</p>
            </div>
            </div>

        </div>
        <Toolbar/>
    </div>
}