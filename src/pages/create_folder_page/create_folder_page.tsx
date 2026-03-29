import { type_page_enum } from "../../App/store/global_store.types";
import Create_folder from "../../features/folder/create_folder";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export default function Create_folder_page(){
 active_page_hendler(type_page_enum.create_folder, "/creare_folder_page" ,"create_folder")
 return <Create_folder/>

}