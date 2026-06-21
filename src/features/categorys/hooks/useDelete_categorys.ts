import { useCallback, useEffect } from "react";
import { Category_list_data_types } from "../../../shared/types";
import { deleteAppCategory, deleteTaskCategory, deleteCategoryNoteById, deleteFolderCategory, deleteWorkspace } from "../model/category.model";

export function useDeleteCategory() {
    const deleteCategory = useCallback(
      async (type: Category_list_data_types, id: number): Promise<void> => {
        try {
          switch (type) {
            case 'app':
              await deleteAppCategory(id);
              break;
  
            case 'task':
              await deleteTaskCategory(id);
              break;
  
            case 'note':
              await deleteCategoryNoteById(id);
              break;
  
            case 'folder':
              await deleteFolderCategory(id);
              break;
  
            case 'workspase': // если это опечатка — лучше исправить на 'workspace'
              await deleteWorkspace(id); // добавь функцию, если нужно
              console.warn('Workspace deletion not implemented yet');
              break;
  
            default:
              console.warn(`Неизвестный тип категории: ${type}`);
              return;
          }
  
          // Опционально: можно добавить toast-уведомление об успехе
          console.log(`✅ Категория ${type} с ID ${id} успешно удалена`);
        } catch (error) {
          console.error(`Ошибка при удалении категории ${type} (ID: ${id}):`, error);
          throw error; // пробрасываем дальше, если нужно обработать в компоненте
        }
      },
      []
    );
  
    return deleteCategory;
  }