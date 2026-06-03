import { useParams } from "react-router-dom";
import { type_page_enum } from "../../App/store/global_store.types";
import TaskEdit from "../../features/tasks/TaskEdit";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export default function Edit_task_page(){
    const { taskId } = useParams<{ taskId: string }>();

    // 2. Формируем динамический путь и заголовок конкретно для этой задачи
    const currentPath = `/edit_task_page/${taskId}`;
   
 active_page_hendler(type_page_enum.edit_task,  currentPath, "edit_task")
 return <TaskEdit taskId={taskId} />
}