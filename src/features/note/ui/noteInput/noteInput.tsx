import { ComponentProps, HTMLAttributes } from "react";
import styles from './noteInput.module.sass'
interface NoteInputProps extends ComponentProps<'input'>{}
export default function NoteInput({  ...props}:NoteInputProps){
    return <input type="text" className={styles.NoteInput} {...props} />
}