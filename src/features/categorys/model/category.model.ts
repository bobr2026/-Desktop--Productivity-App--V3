import { invoke } from "@tauri-apps/api/core";
import { I_folder, I_ginerik_category, i_note, i_task, I_workspace_types, Iapp, WorkspaceCounters } from "../../../shared/types";
//TODO ВСЕХ ПОЛУЧЕНИЕ СУЩНОСТЕЙ ПО ID ГРУППЫ
// //TODO ->
export async function getAllAppsByCategoryId(grubId: number): Promise<Iapp[]> {
    try {
      // В invoke передаем имя Rust-функции и объект с аргументами.
      // Названия ключей в объекте должны строго совпадать с аргументами в Rust (grub_id)
      return await invoke<Iapp[]>('get_all_appsByGrub_id', { grubId });
    } catch (error) {
      console.error('Ошибка при вызове get_all_appsByGrub_id:', error);
      throw error;
    }
  }
  
  /**
   * Получить все заметки по ID категории
   */
  export async function getAllNotesByCategoryId(categoryId: number): Promise<i_note[]> {
    try {
      return await invoke<i_note[]>('get_all_notesByCategory_id', { categoryId });
    } catch (error) {
      console.error('Ошибка при вызове get_all_notesByCategory_id:', error);
      throw error;
    }
  }

  /**
   * Получить все задачи по ID категории задач
   */
  export async function getAllTasksByTaskCategoryId(taskCategoryId: number): Promise<i_task[]> {
    try {
      return await invoke<i_task[]>('get_all_tasks_by_task_category_id', { taskCategoryId });
    } catch (error) {
      console.error('Ошибка при вызове get_all_tasks_by_task_category_id:', error);
      throw error;
    }
  }

  export async function getAllFoldersByCategoryId(grubId: number): Promise<I_folder[]> {
    try {
      return await invoke<I_folder[]>('get_all_foldersByGrub_id', { grubId });
    } catch (error) {
      console.error('Ошибка при вызове get_all_foldersByGrub_id:', error);
      throw error;
    }
  }
//TODO ВСЕХ ПОЛУЧЕНИЕ СУЩНОСТЕЙ ПО ID ГРУППЫ
// //TODO <-
  export async function updateCategoryNoteByNoteId(
    noteCategoryId: number,
    noteId: number
  ): Promise<number> {
    try {
      // Внимание на количество подчеркиваний в имени команды, как в вашем Rust коде:
      // update_category_note___by_note_id
      return await invoke<number>('update_category_note___by_note_id', {
        noteCategoryId,
        noteId,
      });
    } catch (error) {
      console.error(`Ошибка при обновлении категории для заметки ${noteId}:`, error);
      throw error;
    }
  }
  
  /**
   * Обновить категорию (группу) приложения по его ID
   * @returns Количество измененных строк
   */
  export async function updateGrubAppByAppId(
    appCategoryId: number,
    appId: number
  ): Promise<number> {
    try {
      return await invoke<number>('update_grub_app__by_app_id', {
        appCategoryId,
        appId,
      });
    } catch (error) {
      console.error(`Ошибка при обновлении категории для приложения ${appId}:`, error);
      throw error;
    }
  }
  
  /**
   * Обновить категорию (группу) папки по её ID
   * @returns Количество измененных строк
   */
  export async function updateGrubFolderByFolderId(
    folderCategoryId: number,
    folderId: number
  ): Promise<number> {
    try {
      // Учитываем три подчеркивания из Rust: update_grub_folder___by_folder_id
      return await invoke<number>('update_grub_folder___by_folder_id', {
        folderCategoryId,
        folderId,
      });
    } catch (error) {
      console.error(`Ошибка при обновлении категории для папки ${folderId}:`, error);
      throw error;
    }
  }
  
// 
  /**
   * Обновить категорию задачи по её ID
   * @returns Количество измененных строк
   */
  export async function updateCategoryTaskByTaskId(
    taskCategoryId: number,
    taskId: number
  ): Promise<number> {
    try {
      // Учитываем три подчеркивания из Rust: update_category_task___by_task_id
      return await invoke<number>('update_category_task___by_task_id', {
        taskCategoryId,
        taskId,
      });
    } catch (error) {
      console.error(`Ошибка при обновлении категории для задачи ${taskId}:`, error);
      throw error;
    }
  }

  export async function getFolderCategoriesByWorkspace(workspaceId: number): Promise<I_ginerik_category[]> {
    try {
      return await invoke<I_ginerik_category[]>('get_folder_categories_by_workspace', { workspaceId });
    } catch (error) {
      console.error('Ошибка при вызове get_folder_categories_by_workspace:', error);
      throw error;
    }
  }
  
  /**
   * Получить категории приложений для конкретного воркспейса
   */
  export async function getAppCategoriesByWorkspace(workspaceId: number): Promise<I_ginerik_category[]> {
    try {
      return await invoke<I_ginerik_category[]>('get_app_categories_by_workspace', { workspaceId });
    } catch (error) {
      console.error('Ошибка при вызове get_app_categories_by_workspace:', error);
      throw error;
    }
  }
  
  /**
   * Получить категории заметок для конкретного воркспейса (включая общие категории, где workspace_id IS NULL)
   */
  export async function getNoteCategoriesByWorkspace(workspaceId: number): Promise<I_ginerik_category[]> {
    try {
      // Внимание: название функции в Rust отличается от остальных шаблонов (нет слова note_ в названии метода)
      return await invoke<I_ginerik_category[]>('get_categories_by_workspace', { workspaceId });
    } catch (error) {
      console.error('Ошибка при вызове get_categories_by_workspace:', error);
      throw error;
    }
  }
  
  /**
   * Получить категории задач для конкретного воркспейса
   */
  export async function getTaskCategoriesByWorkspace(workspaceId: number): Promise<I_ginerik_category[]> {
    try {
      return await invoke<I_ginerik_category[]>('get_task_categories_by_workspace', { workspaceId });
    } catch (error) {
      console.error('Ошибка при вызове get_task_categories_by_workspace:', error);
      throw error;
    }
  }


export async function deleteTaskCategory(categoriesTaskId: number): Promise<number> {
  try {
    // Аргумент categories_task_id из Rust передаем в camelCase как categoriesTaskId
    return await invoke<number>('delete_task_category', { categoriesTaskId });
  } catch (error) {
    console.error(`Ошибка при удалении категории задач с ID ${categoriesTaskId}:`, error);
    throw error;
  }
}

/**
 * Удалить категорию заметок
 * @returns void (поскольку бэкенд возвращает пустой tuple `()`)
 */
export async function deleteCategoryNoteById(categoryId: number): Promise<void> {
  try {
    // Внимание на точный нейминг функции в Rust: deleteCategory_note_ByID
    await invoke<void>('deleteCategory_note_ByID', { categoryId });
  } catch (error) {
    console.error(`Ошибка при удалении категории заметок с ID ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Удалить категорию папок
 * @returns Количество удаленных строк (usize)
 */
export async function deleteFolderCategory(id: number): Promise<number> {
  try {
    return await invoke<number>('delete_folder_category', { id });
  } catch (error) {
    console.error(`Ошибка при удалении категории папок с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Удалить категорию приложений
 * @returns Количество удаленных строк (usize)
 */
export async function deleteAppCategory(id: number): Promise<number> {
  try {
    return await invoke<number>('delete_app_category', { id });
  } catch (error) {
    console.error(`Ошибка при удалении категории приложений с ID ${id}:`, error);
    throw error;
  }
}



export async function get_all_workspaces() {
  try{
return await invoke<I_workspace_types[]>('get_all_workspaces')
  }catch(error){
    
  }

}
export async function  getCounters(workspaceId: number): Promise<WorkspaceCounters> {
  try {
    // Важно: в Rust аргумент "workspace_id", но Tauri ждет "workspaceId"
    return await invoke<WorkspaceCounters>('get_workspace_counters', { workspaceId });
  } catch (error) {
    console.error('Ошибка при получении счетчиков воркспейса:', error);
    throw error;
  }
}
export async function deleteWorkspace(id: number): Promise<number> {
  try {
    return await invoke<number>('delete_workspace', {workspaceId:id });
  } catch (error) {
    console.error(`Ошибка при удалении категории приложений с ID ${id}:`, error);
    throw error;
  }
}


export interface I_workspace_types1 {
  workspace_id?: number; // Опционально, так как при создании id еще нет
  name: string;
  color: string | null;
}

// Создание нового окружения
export async function create_workspace_fn(name: string, color: string | null): Promise<void> {
  try {
      await invoke('add_workspace', { name, color: color || null });
  } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
  }
}

// Обновление существующего окружения
export async function update_workspace_fn(workspace_id: number, name: string, color: string | null): Promise<void> {
  try {
      // Передаем workspace_id как i64 (в JS/TS это просто number, Tauri сам сматчит)
      await invoke('all_update_workspace', { workspaceId:workspace_id, name, color: color || null });
  } catch (error) {
      console.error('Failed to update workspace:', error);
      throw error;
  }
}
export async function get_workspace_by_id_fn(workspace_id: number): Promise<I_workspace_types> {
  try {
      return await invoke<I_workspace_types>('get_workspace_by_id', { workspaceId: workspace_id });
  } catch (error) {
      console.error(`Failed to fetch workspace with id ${workspace_id}:`, error);
      throw error;
  }
}