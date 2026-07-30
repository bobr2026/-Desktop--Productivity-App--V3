import { Link } from 'react-router-dom'
import style from './create_item_page.module.sass'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { global_store_type, type_page_enum } from '../../App/store/global_store.types';
import { AppDispatch } from '../../App/store/store';
import { add_active_page } from '../../layouts/root_layout/ui/header/store/Header.store';
export function Create_item_page(){
    const dispatch= useDispatch<AppDispatch>()
    const active_pages = useSelector((state:global_store_type)=> state.header.active_page)


        
    return <div className={style.main_conteiner}>
    <Link className={style.main_conteiner__link} to={"/create_app"}> New app </Link>
    <Link className={style.main_conteiner__link} to={"/creare_folder_page"}> New folder </Link>
    <Link className={style.main_conteiner__link} to={""}> New dok </Link>
    <Link className={style.main_conteiner__link} to={"/create_note_page"}> New note </Link>
    <Link className={style.main_conteiner__link} to={"/creare_task_page"}> New task </Link>
    <Link className={style.main_conteiner__link} to={"/creare_category_page"}> New category </Link>
    <Link className={style.main_conteiner__link} to={"/create_workspace"}> New workspase</Link>

    </div>
}