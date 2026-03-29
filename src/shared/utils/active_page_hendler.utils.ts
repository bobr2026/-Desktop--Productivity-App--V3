import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { global_store_type, type_page_enum } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { add_active_page } from "../../layouts/root_layout/ui/header/store/Header.store";

export function active_page_hendler(type:type_page_enum, element:string, title:string){
    const dispatch= useDispatch<AppDispatch>()
    const active_pages = useSelector((state:global_store_type)=> state.header.active_page)
    useEffect(() => {
        // Проверяем, есть ли уже страница с типом app_list
        const hasAppList = active_pages.some(
          page => page.active_page_type === type
        );
      
        if (!hasAppList) {
          console.log("add app_list");
          dispatch(add_active_page({
                  active_page_id: (1+active_pages.length),
                  active_page_title: title,
                  active_page_type: type,
                  element: element
              }))
    
        } else {
        
        }
      }, [active_pages]); // добавляем зависимость, чтобы реагировать на изменения массива
    
} 