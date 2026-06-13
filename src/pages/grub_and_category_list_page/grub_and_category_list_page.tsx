import { type_page_enum } from "../../App/store/global_store.types"
import { Category_list } from "../../features/categorys/category_list"
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils"

export function Grub_and_category_list_page(){
    active_page_hendler(type_page_enum.grubs_list , "/grubs_and_category", "grubs_list")
    return(<Category_list/>)
}