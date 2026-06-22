import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";
import { I_workspace_types } from "../../shared/types";
import WorkspaceForm from "../../features/categorys/WorkspaceForm";
import { get_workspace_by_id_fn } from "../../features/categorys/model/category.model";


export default function Edit_workspace_page() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();
    const [currentWorkspace, setCurrentWorkspace] = useState<I_workspace_types | null>(null);

    // Регистрируем активную страницу изменения
    active_page_hendler(
        type_page_enum.edit_workspace, 
        `/edit_workspace/${workspaceId}`, 
        "edit_workspace"
    );


    useEffect(() => {
        async function fetchWorkspaceData() {
            if (workspaceId) {
                try {
                    const id = parseInt(workspaceId);
                    if (isNaN(id)) {
                        console.log("Некорректный ID окружения");
                        return;
                    }
                    
                    // Запрашиваем реальные данные из БД вместо заглушки
                    const data = await get_workspace_by_id_fn(id);
                    setCurrentWorkspace(data);
                } catch (error) {
                    console.error("Failed to load workspace data", error);
                    console.log("Окружение не найдено или произошла ошибка при загрузке");
                }
            }
        }
        fetchWorkspaceData();
    }, [workspaceId]);
    // const handleSuccess = () => {
    //     navigate("/tasks_list"); // Возвращаемся обратно после редактирования
    // };

    if (!currentWorkspace) {
        return <div>Загрузка данных окружения...</div>;
    }

    return (
        <WorkspaceForm 
            initialData={currentWorkspace} 
            // onSuccess={handleSuccess} 
        />
    );
}