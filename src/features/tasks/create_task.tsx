import styls from '../../shared/styles/forms.module.sass'
import Under_category_list from '../../shared/ui/under_category_list/Under_category_list'
export default function Create_task(){
    return <div className={styles.main_conteiner}>

    <form className={styles.category_form} onSubmit={handleSubmit}>
        
    <div className={styles.category_form__item}>
    {form_data.icon_path!=null?<img className={styles_create_app.form__item_app_icon} src={convertFileSrc( form_data.icon_path)} alt="" />:<p> Укажите приложение </p>}  
              <p>{form_data.app_name!=null?form_data.app_name:null}</p>
              <p>{path}</p> 
        <button onClick={async()=>{
           setPath( await get_app_path())
          }}>укажите приложение</button>
            </div>
          
     
        {/* <div className={styles.category_form__item}>

            <label className={styles.category_form__item_lebel} htmlFor="category_name">укажите название категории: </label>
            <input name="category_name" id="category_name" type="text" placeholder="Названия катигории "/>

        </div>
        */}
        <div className={styles_create_app.from_item_munu_and_recorder}>
        <ShortcutRecorder />
            <select name="type_category" id="" onChange={handleChange} value={form_data.type_category}>
                <option value="app">Приложения</option>
                <option value="global">Общие</option>
            </select>

        </div>


        <Under_category_list type_category={form_data.type_category} />
        <button type="submit">Создать Приложение</button>

    </form>
</div >
}