import styles from './styles/Category_item.module.sass'
import strelka1 from './icons/strelka.svg'
import strelka2 from './icons/strelka2.svg'
import { JSX, useEffect, useState } from 'react'
import { Category_list_data_types } from '../../shared/types'
import { invoke } from '@tauri-apps/api/core'
interface Category_itemProps {
    id: number
    title: string
   
    color: string
    type:Category_list_data_types

}
export function Category_item({ id, title, color, type }: Category_itemProps) {
    const [children_elements , set_children_elements]= useState<JSX.Element[]>([])
    const [open_cildrren_item, set_open_cildrren_item] = useState(false)



    return <div className={styles.main_wraper}>

        <div className={styles.wraper}>
            <img src={open_cildrren_item == false ? strelka1 : strelka2} alt="" onClick={() => set_open_cildrren_item(!open_cildrren_item)} />
            <div className={styles.conteiner}>
                <div className={styles.conteiner__color_div} style={{ background: color }}></div>
                <div className={styles.conteiner__data} >
                    <h1>{title}</h1>
                    <h2>КОЛИЧЕСТВО ЭЛЕМЕНТОВ: {2}</h2>
                </div>

            </div>

        </div>
 <div className={styles.coldren_elements_list} style={{display:open_cildrren_item==true?"flex":"none"}}>
{children}
 </div>
    </div>
}