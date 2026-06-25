import { type_page_enum } from "../../App/store/global_store.types";
import WorkspaceForm from "../../features/categorys/WorkspaceForm";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export default function Create_workspace_page() {


    // Регистрируем активную страницу в глобальном стейте / утилитах
    active_page_hendler(
        type_page_enum.edit_workspace, 
        "/create_workspace", 
        "create_workspace"
    );

    // Коллбек после успешного добавления
    // const handleSuccess = () => {
    //     navigate("/tasks_list"); // Или любой другой дефолтный роут
    // };

    return <WorkspaceForm  />;
}