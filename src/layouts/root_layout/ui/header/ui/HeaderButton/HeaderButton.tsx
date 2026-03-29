 import styles from './HeaderButton.module.sass'

interface I_HeaderButton{
    title?:string,
    click:()=>void
    click2?:()=>void
}
 export  function HeaderButton({title,click }:I_HeaderButton){
    return <button className={styles.HeaderButton} onClick={()=>click()}>{title}</button>
}
export  function HeaderButton_test({title,click, click2}:I_HeaderButton){
    return <button className={`${styles.HeaderButton_test} ${styles.HeaderButton} `}> 
    <div className={styles.HeaderButton_test_text} onClick={()=>click()}>{title}</div>
     <div  className={styles.HeaderButton_test_closed} 
     onClick={()=>{click2!==undefined?click2():null}}>"X"</div> </button>
}