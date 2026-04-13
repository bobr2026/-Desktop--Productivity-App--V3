// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;
use tauri::{Manager, State}; // Manager нужен для .state()

mod servises; // подключаем services.rs
mod notes {
    // подключаем папку notes
    pub mod Paragraph_notes;
    pub mod Paragraph_styles_notes;
    pub mod categories_notes;
    pub mod entrys; // подключаем entrys.rs как подмодуль
    pub mod external_post_elements;
    pub mod links;
    pub mod note;
    pub mod posts_notes;
}
mod folders {
    pub mod categories_folders;
    pub mod entrys;
    pub mod folder;
}
mod apps {
    pub mod app;
    pub mod categories_apps;
    pub mod entrys;
}
mod tasks {
    pub mod categories_tasks;
    pub mod entrys;
    pub mod task;
}

mod workspaces {
    pub mod entrys;
    pub mod workspace;
}
mod dock_panels {
    pub mod dock_panel;
    pub mod entrys;
}
mod  globol_categorys{
    pub  mod  globol_categorys;
    pub mod entrys;
}
use  globol_categorys::globol_categorys::{
    create_global_category, update_global_category, get_all_global_categories, get_global_category_by_workspace,
    get_global_Category_name_and_color_ById,  delete_global_category,  get_globol_categories_by_id,
};
use apps::app::{
    add_app, extract_icon_and_save, get_all_apps, get_all_appsByGrub_id, get_appsByID, update_app,
    update_grub_app__by_app_id, update_icon_by_app_id, update_workspace__app___by_workspace_id,
    get_all_appsBy_workspace_id
};
use apps::categories_apps::{
    create_app_category, delete_app_category, get_all_categories_apps, get_app_categories_by_workspace, get_app_categories_by_id,
    update_app_category,  get_app_Category_name_and_color_ById
};
use folders::categories_folders::{
    create_folder_category, delete_folder_category, get_all_categories_folders,
    update_folder_category,get_folder_categories_by_id, get_folder_categories_by_workspace,get_folder_Category_name_and_color_ById,
};
use folders::folder::{
 add_folder,   get_all_folders, get_all_foldersByGrub_id, get_foldersByID, update__icon__by_folder_id,
    update__workspace__by_folder_id, update_folder, update_global_category___by_folder_id,
    update_grub_folder___by_folder_id,
};
use notes::categories_notes::{
    add_Category_note, deleteCategory_note_ByID, get_all_categories_notes,
    get_categories_by_workspace, get_note_Category_name_ById,get_note_categories_by_id
};
use notes::external_post_elements::{
    create_external_element, delete_external_element, get_external_elements_by_post,
    update_external_element_position, update_external_element_target,
};
use notes::links::{
    create_link, delete_link, get_link_by_id, get_links_by_source, get_links_by_target,
    get_links_by_type, update_link_sourse, update_link_target, update_link_type,
};
use notes::note::{
    add_note, delete_note, get_all_notes, get_all_notesByCategory_id, get_noteByID,
    update_category_note___by_note_id, update_grub_notes___by_grub_id,
    update_marks_note___by_note_id, update_status_note___by_note_id,
    update_workspace__note___by_workspace_id,
};
use notes::posts_notes::{
    all_update_post_in_note, create_post_file, create_post_in_note, delete_post_file,
    delite_post_in_note, get_files_by_post_id, title_update_post_in_note,
    update_post_file_position,
};
use notes::Paragraph_notes::{
    add_Paragraph, delete_paragraph_by_post_id, get_all_paragraph_by_post_id,
    update_content_paragraph, update_position_paragraph,
};
use notes::Paragraph_styles_notes::{
    add_Paragraph_styles, delete_paragraph_style, get_paragraph_style_by_id, update_style_colors,
    update_style_extra, update_style_font, update_style_formatting,
};
use tasks::task::{
    create_task, delete_task, get_all_tasks_by_task_category_id, get_subtasks,
    get_tasks_by_markType, get_tasks_by_status, update_task_content, update_task_marks,
    update_task_status,get_notes_for_task, get_tasks_for_note
};
use  tasks::categories_tasks::{
     create_task_category, update_task_category, get_task_categories_by_id, get_task_categories_by_workspace
};
use workspaces::workspace::{
    add_workspace, all_update_workspace, get_all_appsByWorkspace_id, get_all_foldersBy_workspaceId,
    get_all_notesByWorkspace_id, get_all_tasks_by_workspaceID, get_all_workspaces,
};

use rusqlite::{params, Connection, Result};
use std::sync::{Arc};
use crate::servises::{get_db_path, open_app, open_folder};
mod init_db;
use init_db::{init_db_logic, DbState};


#[tauri::command]
async fn start_init_db(state: State<'_, DbState>) -> Result<String, String> {
    // .inner() возвращает &DbState, который живет всё время работы приложения
    
 // получаем ссылку на DbState
    
    // Клонируем Arc из нашего состояния
    let state_arc = state.0.clone(); 

    tokio::task::spawn_blocking(move || {
        // Теперь поток владеет своей копией Arc, 
        // и ограничение 'static больше не вызывает ошибок!
        init_db_logic(state_arc)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init()) // Плагин для shell/sidecar
        .plugin(tauri_plugin_os::init()) // ИНИЦИАЛИЗАЦИЯ ПЛАГИНА OS
        .manage(DbState(Arc::new(Mutex::new(None)))) // Обернули в Arc::new
        .setup(|app| {
            let db_handle = app.state::<DbState>();
    
            // Передаем клон Arc в функцию
            match init_db_logic(db_handle.0.clone()) {
                Ok(_) => println!("Успешный запуск при старте"),
                Err(e) => eprintln!("Ошибка: {}", e),
            }
            Ok(())
        })
        // ...
        .invoke_handler(tauri::generate_handler![
            add_app,
            extract_icon_and_save,
            get_all_apps,
            add_workspace,
            open_app,
            get_all_workspaces,
            add_Category_note,
          create_app_category,
          create_folder_category,
          create_task_category,


            create_global_category,
            delete_global_category,
            update_global_category, 
            get_all_global_categories,
            get_task_categories_by_id, 
            get_folder_categories_by_id,
            get_globol_categories_by_id,
            get_app_categories_by_id,
            get_note_categories_by_id, 
            get_global_category_by_workspace,
            get_categories_by_workspace,
            get_app_categories_by_workspace,
            get_task_categories_by_workspace,
            get_folder_categories_by_workspace,
            get_all_appsBy_workspace_id,
            get_global_Category_name_and_color_ById,
            get_app_Category_name_and_color_ById,
            add_folder,
            get_all_folders,
            update_folder,
            get_foldersByID,
            get_all_foldersBy_workspaceId,
            get_all_notesByWorkspace_id,
            get_folder_Category_name_and_color_ById,
            open_folder,
            create_task, delete_task, get_all_tasks_by_task_category_id, get_subtasks,
            get_tasks_by_markType, get_tasks_by_status, update_task_content, update_task_marks,
            update_task_status,
            get_all_tasks_by_workspaceID, 
            get_notes_for_task,
             get_tasks_for_note,
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
