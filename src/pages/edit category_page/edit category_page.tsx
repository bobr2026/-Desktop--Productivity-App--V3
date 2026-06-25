import { useParams } from "react-router-dom";
import EditCategory from "../../features/categorys/editCategory";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export function Edit_category_page(){
    const {type_category, categoryId }=useParams()
      active_page_hendler(type_page_enum.edit_category, `/edit_category_page/${type_category}/${categoryId}`, "Edit category")
    return <EditCategory category_id={categoryId } type_category={type_category}/>
}