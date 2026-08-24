import { ColorBar } from '../colorBar/colorBar'
import { TextIcon } from '../icons/TextIcon'
import { TextSetingsBar } from '../textSetingsBar/textSetingsBar'
import styles from './toolbar.module.sass'
export default function Toolbar(){
    return<div className={styles.Toolbar}>
  
     <TextSetingsBar/>
      <ColorBar/>
    </div>
}