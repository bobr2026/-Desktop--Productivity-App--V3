import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { active_page_type, global_store_type, type_page_enum } from "../../App/store/global_store.types";
import { add_active_page } from "../../layouts/root_layout/ui/header/store/Header.store";
import { AppDispatch } from "../../App/store/store";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export function Folder_list_page(){
 
    
    active_page_hendler(type_page_enum.folder_list, "/folder_list", "folder_list")
   return(
    <><p>Folder_list_page</p></>
   )
}

