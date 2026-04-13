import { type_page_enum } from "../../App/store/global_store.types"
import Task_list from "../../features/tasks/tasks_list"
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils"

export default function Task_list_page(){
       active_page_hendler(type_page_enum.task_list,  "/tasks_list", "tasks_list")
    return <Task_list/>
}