import BaseButton from '../../../../shared/ui/base_buttom/base_button'
import NoteInput from '../../ui/noteInput/noteInput'
import styles from './TitleIputBlock.module.sass'
interface TitleIputBlockProps{
button_title:string
button_click:()=>void   
}
export function TitleIputBlock({button_click, button_title}:TitleIputBlockProps){
return <div className={styles.TitleIputBlock}>
    <NoteInput/>
    <BaseButton onClick={button_click}>{button_title}</BaseButton>
</div>
}