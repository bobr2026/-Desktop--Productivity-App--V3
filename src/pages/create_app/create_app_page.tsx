import { save, open} from "@tauri-apps/plugin-dialog";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";
import Create_app from "../../features/app/create_app";

export function Create_app_page(){
    active_page_hendler(type_page_enum.create_app, "/create_app", "create_app")
   
    return(
        <Create_app/>
    )
}