import { type_page_enum } from "../../App/store/global_store.types";
import Create_task from "../../features/tasks/create_task";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export default function Create_task_page(){
         active_page_hendler(type_page_enum.create_task,  "/creare_task_page", "create_task")
    return <Create_task/>
}