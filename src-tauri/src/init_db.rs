use std::sync::Mutex;

use rusqlite::{params, Connection, Result};
use crate::servises::get_db_path;
use tauri::{Manager, State}; // Manager нужен для .state()
use std::sync::{Arc};
pub struct DbState(pub Arc<Mutex<Option<Connection>>>);
// pub fn _init_db_logic(state_arc: Arc<Mutex<Option<Connection>>>) -> Result<String, String> {
//     let mut drawer = state_arc.0.lock().unwrap();
    
//     let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//     let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

//     // Включаем поддержку внешних ключей
//     conn.execute("PRAGMA foreign_keys = ON;", []).map_err(|e| e.to_string())?;

//     let queries = [
//         // --- 1. Базовые таблицы (независимые) ---
//         "CREATE TABLE IF NOT EXISTS workspace (
//             workspace_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT NULL
//         );",

//         "CREATE TABLE IF NOT EXISTS Paragraph_styles (
//             Paragraph_styles_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             font_size TEXT,
//             color TEXT,
//             background TEXT,
//             font_weight TEXT,
//             text_decoration TEXT,
//             text_align TEXT, 
//             extra_styles TEXT
//         );",

//         // --- 2. Таблицы категорий (зависят от workspace) ---
//         "CREATE TABLE IF NOT EXISTS categories_folders (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT,
//             parent_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS globol_categorys (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT,
//             parent_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS categories_notes (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT,
//             parent_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES categories_notes(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS categories_apps (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT,
//             parent_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES categories_apps(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS categories_tasks (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT NOT NULL,
//             color TEXT,
//             parent_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES categories_tasks(id) ON DELETE CASCADE
//         );",

//         // --- 3. Основной контент (Notes, Apps, Folders, Tasks) ---
//         "CREATE TABLE IF NOT EXISTS notes (
//             note_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             note_category_id INTEGER,
//             status TEXT NOT NULL,
//             marks TEXT,
//             created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
//             updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
//             globol_category_id INTEGER, 
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (note_category_id) REFERENCES categories_notes(id) ON DELETE CASCADE,
//             FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS apps (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             path TEXT NOT NULL,
//             icon_path TEXT NOT NULL,
//             hotkey TEXT,
//             app_category_id INTEGER,
//             globol_category_id INTEGER, 
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (app_category_id) REFERENCES categories_apps(id) ON DELETE CASCADE,
//             FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS folders (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             icon_id INTEGER,
//             path TEXT NOT NULL,
//             title TEXT NOT NULL,
//             hotkey TEXT,
//             folder_category_id INTEGER,
//             globol_category_id INTEGER, 
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (folder_category_id) REFERENCES categories_folders(id) ON DELETE CASCADE,
//             FOREIGN KEY (globol_category_id) REFERENCES globol_categorys(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS task (
//             task_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             marks TEXT,
//             status TEXT NOT NULL,
//             parent_id INTEGER,
//             title TEXT NOT NULL,
//             task_category_id INTEGER,
//             workspace_id INTEGER NOT NULL,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE,
//             FOREIGN KEY (task_category_id) REFERENCES categories_tasks(id) ON DELETE CASCADE,
//             FOREIGN KEY (parent_id) REFERENCES task(task_id) ON DELETE CASCADE
//         );",

//         // --- 4. Структура внутри заметок (Posts, Paragraphs, Files) ---
//         "CREATE TABLE IF NOT EXISTS posts (
//             post_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             note_id INTEGER NOT NULL,
//             title TEXT NOT NULL,
//             position_in_the_note INTEGER, 
//             FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS Paragraph (
//             paragraph_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             post_id INTEGER NOT NULL,
//             content TEXT NOT NULL,
//             culomm INTEGER NOT NULL,
//             row INTEGER NOT NULL,
//             style_id INTEGER,
//             UNIQUE(post_id, row, culomm),
//             FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
//             FOREIGN KEY(style_id) REFERENCES Paragraph_styles(Paragraph_styles_id) ON DELETE SET NULL
//         );",

//         "CREATE TABLE IF NOT EXISTS post_files (
//             file_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             post_id INTEGER NOT NULL,
//             file_type TEXT NOT NULL,
//             file_path TEXT NOT NULL,
//             row INTEGER,
//             col INTEGER,
//             FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
//         );",

//         // --- 5. Вспомогательные элементы и связи ---
//         "CREATE TABLE IF NOT EXISTS external_post_elements (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             post_id INTEGER NOT NULL,
//             app_id INTEGER,
//             folder_id INTEGER,
//             row INTEGER,
//             col INTEGER,
//             FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
//             FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
//             FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
//             CHECK ((app_id IS NOT NULL AND folder_id IS NULL) OR (app_id IS NULL AND folder_id IS NOT NULL))
//         );",

//         "CREATE TABLE IF NOT EXISTS folder_icons (
//             icon_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             folder_id INTEGER,
//             icon_path TEXT NOT NULL,
//             FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS dock_panels (
//             id INTEGER PRIMARY KEY AUTOINCREMENT, 
//             color TEXT,
//             name TEXT NOT NULL,
//             posstion TEXT, 
//             workspace_id INTEGER NOT NULL,
//             swoh_element_grubs TEXT,
//             hotkey TEXT,
//             FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id) ON DELETE CASCADE
//         );",

//         "CREATE TABLE IF NOT EXISTS Links (
//             link_id INTEGER PRIMARY KEY AUTOINCREMENT,
//             source_type TEXT NOT NULL,
//             source_id INTEGER NOT NULL,
//             target_type TEXT NOT NULL,
//             target_id INTEGER NOT NULL,
//             link_type TEXT NOT NULL,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         );",

//         // --- 6. Индексы и триггеры ---
//         "CREATE INDEX IF NOT EXISTS idx_links_source ON Links(source_type, source_id);",
//         "CREATE INDEX IF NOT EXISTS idx_links_target ON Links(target_type, target_id);",
        
//         "CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
//          AFTER UPDATE ON notes
//          BEGIN
//             UPDATE notes SET updated_at = DATETIME('now') WHERE note_id = NEW.note_id;
//          END;"
//     ];

//     for query in queries {
//         conn.execute(query, []).map_err(|e| format!("Error in query [{}]: {}", query, e))?;
//     }


//     *drawer = Some(conn);
//     Ok("БД готова".into())
  
// }


// Используем явный Result, чтобы не путать с rusqlite::Result
pub fn init_db_logic(state_arc: Arc<Mutex<Option<Connection>>>) -> std::result::Result<String, String> {
    // 1. Убираем .0, так как state_arc — это уже Arc
    let mut drawer = state_arc.lock().map_err(|_| "Не удалось заблокировать мьютекс".to_string())?;
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    
    // 2. Открываем соединение
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 3. Включаем foreign keys
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

    for query in &queries {
        conn.execute(query, []).map_err(|e| format!("Error in query [{}]: {}", query, e))?;
    }

    // 4. Сохраняем соединение в состояние
    *drawer = Some(conn);
    
    Ok("БД готова".into())
}
