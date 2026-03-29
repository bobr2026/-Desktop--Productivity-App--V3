import { useNavigate } from "react-router-dom";
import App_list from "../../features/app/app_list";
import { useDispatch, useSelector } from "react-redux";
import { global_store_type, type_page_enum } from "../../App/store/global_store.types";
import { AppDispatch } from "../../App/store/store";
import { useEffect } from "react";
import { add_active_page } from "../../layouts/root_layout/ui/header/store/Header.store";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export function App_list_page(){
   active_page_hendler(type_page_enum.app_list, "apps_list", "Apps_list")

    return <>
    <App_list/>
    </>
}