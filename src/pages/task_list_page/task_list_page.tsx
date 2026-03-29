import { type_page_enum } from "../../App/store/global_store.types"
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils"

export default function Task_list_page(){
       active_page_hendler(type_page_enum.task_list,  "/tasks_list", "tasks_list")
    return <p>Task_list_page</p>
}