import { useParams } from "react-router-dom";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";
import { AppEdit } from "../../features/app/appEdit";

export function Edit_app_page(){
      const { appId } = useParams<{ appId: string }>();
      const currentPath = `/edit_app_page/${appId}`;
      active_page_hendler(type_page_enum.edit_app,  currentPath, "edit_app")
   return(
 <AppEdit appId={appId}/>
   ) 
}