// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
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
    update_task_status,
};
use  tasks::categories_tasks::{
     create_task_category, update_task_category, get_task_categories_by_id, get_task_categories_by_workspace
};
use workspaces::workspace::{
    add_workspace, all_update_workspace, get_all_appsByWorkspace_id, get_all_foldersBy_workspaceId,
    get_all_notesByWorkspace_id, get_all_tasks_by_workspaceID, get_all_workspaces,
};

use rusqlite::{params, Connection, Result};

use crate::servises::{get_db_path, open_app, open_folder};

#[tauri::command]
fn  init_db() -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Включаем поддержку внешних ключей
    conn.execute("PRAGMA foreign_keys = ON;", []).map_err(|e| e.to_string())?;

    let queries = [
        // --- 1. Базовые таблицы (независимые) ---
        "CREATE TABLE IF NOT EXISTS workspace (
            workspace_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT NULL
        );",

        "CREATE TABLE IF NOT EXISTS Paragraph_styles (
            Paragraph_styles_id INTEGER PRIMARY KEY AUTOINCREMENT,
            font_size TEXT,
            color TEXT,
            background TEXT,
            font_weight TEXT,
            text_decoration TEXT,
            text_align TEXT, 
            extra_styles TEXT
        );",

        // --- 2. Таблицы категорий (зависят от workspace) ---
        "CREATE TABLE IF NOT EXISTS categories_folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            parent_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS globol_categorys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            parent_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS categories_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            parent_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES categories_notes(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS categories_apps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            parent_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES categories_apps(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS categories_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT,
            parent_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES categories_tasks(id) ON DELETE CASCADE
        );",

        // --- 3. Основной контент (Notes, Apps, Folders, Tasks) ---
        "CREATE TABLE IF NOT EXISTS notes (
            note_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            note_category_id INTEGER,
            status TEXT NOT NULL,
            marks TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            globol_category_id INTEGER, 
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (note_category_id) REFERENCES categories_notes(id) ON DELETE CASCADE,
            FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS apps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            icon_path TEXT NOT NULL,
            hotkey TEXT,
            app_category_id INTEGER,
            globol_category_id INTEGER, 
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (app_category_id) REFERENCES categories_apps(id) ON DELETE CASCADE,
            FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            icon_id INTEGER,
            path TEXT NOT NULL,
            title TEXT NOT NULL,
            hotkey TEXT,
            folder_category_id INTEGER,
            globol_category_id INTEGER, 
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (folder_category_id) REFERENCES categories_folders(id) ON DELETE CASCADE,
            FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS task (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT,
            marks TEXT,
            status TEXT NOT NULL,
            parent_id INTEGER,
            title TEXT NOT NULL,
            task_category_id INTEGER,
            workspace_id INTEGER NOT NULL,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
            FOREIGN KEY (task_category_id) REFERENCES categories_tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES task(task_id) ON DELETE CASCADE
        );",

        // --- 4. Структура внутри заметок (Posts, Paragraphs, Files) ---
        "CREATE TABLE IF NOT EXISTS posts (
            post_id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            position_in_the_note INTEGER, 
            FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS Paragraph (
            paragraph_id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            culomm INTEGER NOT NULL,
            row INTEGER NOT NULL,
            style_id INTEGER,
            UNIQUE(post_id, row, culomm),
            FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
            FOREIGN KEY(style_id) REFERENCES Paragraph_styles(Paragraph_styles_id) ON DELETE SET NULL
        );",

        "CREATE TABLE IF NOT EXISTS post_files (
            file_id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            row INTEGER,
            col INTEGER,
            FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
        );",

        // --- 5. Вспомогательные элементы и связи ---
        "CREATE TABLE IF NOT EXISTS external_post_elements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            app_id INTEGER,
            folder_id INTEGER,
            row INTEGER,
            col INTEGER,
            FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
            FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
            CHECK ((app_id IS NOT NULL AND folder_id IS NULL) OR (app_id IS NULL AND folder_id IS NOT NULL))
        );",

        "CREATE TABLE IF NOT EXISTS folder_icons (
            icon_id INTEGER PRIMARY KEY AUTOINCREMENT,
            folder_id INTEGER,
            icon_path TEXT NOT NULL,
            FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS dock_panels (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            color TEXT,
            name TEXT NOT NULL,
            posstion TEXT, 
            workspace_id INTEGER NOT NULL,
            swoh_element_grubs TEXT,
            hotkey TEXT,
            FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE
        );",

        "CREATE TABLE IF NOT EXISTS Links (
            link_id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_type TEXT NOT NULL,
            source_id INTEGER NOT NULL,
            target_type TEXT NOT NULL,
            target_id INTEGER NOT NULL,
            link_type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",

        // --- 6. Индексы и триггеры ---
        "CREATE INDEX IF NOT EXISTS idx_links_source ON Links(source_type, source_id);",
        "CREATE INDEX IF NOT EXISTS idx_links_target ON Links(target_type, target_id);",
        
        "CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
         AFTER UPDATE ON notes
         BEGIN
            UPDATE notes SET updated_at = DATETIME('now') WHERE note_id = NEW.note_id;
         END;"
    ];

    for query in queries {
        conn.execute(query, []).map_err(|e| format!("Error in query [{}]: {}", query, e))?;
    }

    println!("Database initialized successfully");
    Ok("Database initialized".to_string())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init()) // Плагин для shell/sidecar
        .plugin(tauri_plugin_os::init()) // ИНИЦИАЛИЗАЦИЯ ПЛАГИНА OS
        .setup(|app| {
            // Можно вызвать функцию напрямую
            match init_db() {
                Ok(msg) => println!("{}", msg),
                Err(err) => eprintln!("DB init error: {}", err),
            }
            Ok(())
        })
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
            

            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
