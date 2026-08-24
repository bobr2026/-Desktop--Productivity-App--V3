import { ChangeEvent } from 'react'
import BaseButton from '../../../../shared/ui/base_buttom/base_button'
import NoteInput from '../../ui/noteInput/noteInput'
import styles from './TitleIputBlock.module.sass'
interface TitleIputBlockProps{
button_title:string
button_click:()=>void   
onChengeHendler?:(e:ChangeEvent<HTMLInputElement>)=>void
input_value?:number|string
input_placeholder?:string

}
export function TitleIputBlock({button_click, button_title, onChengeHendler, input_value, input_placeholder}:TitleIputBlockProps){
return <div className={styles.TitleIputBlock}>
    <NoteInput placeholder={input_placeholder} value={input_value} onChange={onChengeHendler}/>
    <BaseButton onClick={button_click}>{button_title}</BaseButton>
</div>
}