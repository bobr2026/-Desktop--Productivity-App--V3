import { useParams } from "react-router-dom";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";
import EditFolder from "../../features/folder/edit_folder";

export function Edit_folder_page(){
    const { folderId } = useParams<{ folderId: string }>();
    const currentPath = `/edit_folder_page/${folderId}`;
     active_page_hendler(type_page_enum.edit_folder,  currentPath, "edit_folder")
     return <EditFolder folderId={folderId}/>
}