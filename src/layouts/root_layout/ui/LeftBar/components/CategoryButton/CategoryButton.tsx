import styles from './CategoryButton.module.sass'

interface ICategoryButton{
    title:string,
    icon:string, 
    icon2?:string
    click: () => void
}
export default function CategoryButton({title, icon, icon2, click }:ICategoryButton){
return <button className={styles.CategoryButton} onClick={()=>click()}>
    <img src={icon} alt="" /> {title}  
    {icon2!==null?<img src={icon2} alt=''/>:null}</button>
}
