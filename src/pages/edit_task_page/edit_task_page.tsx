import { type_page_enum } from "../../App/store/global_store.types";
import TaskEdit from "../../features/tasks/TaskEdit";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export default function Edit_task_page(){
 active_page_hendler(type_page_enum.edit_task,  "/edit_task_page", "edit_task")
 return <TaskEdit/>
}