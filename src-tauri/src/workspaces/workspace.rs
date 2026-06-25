use super::entrys::workspace;
use crate::{
    apps::entrys::App, folders::entrys::Folder, notes::entrys::Note, servises::get_db_path,
    tasks::entrys::task,
};
use rusqlite::{params, Connection, Result};

#[tauri::command]
pub fn add_workspace(name: String, color: Option<String>) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO workspace (name, color  ) VALUES 
            (?, ? )",
        params![name, color],
    )
    .map_err(|e| e.to_string())?;
    println!("app added");
    Ok(())
}

#[tauri::command]
pub fn all_update_workspace(
    name: String,
    color: Option<String>,
    workspace_id: i64,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE workspace SET name = ?, color= ? WHERE workspace_id = ?",
        params![name, color, workspace_id],
    )
    .map_err(|e| e.to_string())?;
    println!("app added");
    Ok(())
}
#[tauri::command]
pub fn get_all_workspaces() -> Result<Vec<workspace>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT  *  FROM workspace")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(workspace {
                workspace_id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}
#[tauri::command]
pub fn delete_workspace(workspace_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "DELETE FROM workspace WHERE workspace_id = ?",
        params![workspace_id],
    )
    .map_err(|e| e.to_string())
}
#[tauri::command]
pub fn get_workspace_by_id(workspace_id: i64) -> Result<workspace, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT workspace_id, name, color FROM workspace WHERE workspace_id = ?")
        .map_err(|e| e.to_string())?;
        
    let mut workspace_iter = stmt
        .query_map(params![workspace_id], |row| {
            Ok(workspace {
                workspace_id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?;

    // Извлекаем первую найденную запись
    if let Some(result) = workspace_iter.next() {
        let workspace_data = result.map_err(|e| e.to_string())?;
        Ok(workspace_data)
    } else {
        Err("Workspace not found".to_string())
    }
}
#[tauri::command]
pub fn get_all_tasks_by_workspaceID(workspace_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT *  FROM task WHERE workspace_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([workspace_id], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tasks = Vec::new();
    for t in iter {
        tasks.push(t.map_err(|e| e.to_string())?);
    }
    Ok(tasks)
}

#[tauri::command]
pub fn get_all_appsByWorkspace_id(workspace_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title,path,icon_path,  hotkey, app_category_id, globol_category_id, workspace_id FROM apps WHERE workspace_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![workspace_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn get_all_notesByWorkspace_id(workspace_id: i64) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    // ДОБАВИТЬ ЭТИ ДВЕ СТРОКИ:
    println!("--- DEBUG RUST ---");
    println!("1. Открываем базу данных по пути: {:?}", db_path);
    println!("2. Ищем заметки для workspace_id: {}", workspace_id);
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare(" SELECT * FROM notes WHERE workspace_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![workspace_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Note {
                note_id: row.get(0)?,
                title: row.get(1)?,
                note_category_id: row.get(2)?,
                status: row.get(3)?,
                marks: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
                globol_category_id: row.get(7)?,
                workspace_id: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }

    }
    Ok(notes)
}

#[tauri::command]
pub fn get_all_foldersBy_workspaceId(workspace_id: i64) -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, icon_id,path, title,  hotkey, folder_category_id, globol_category_id,  workspace_id FROM folders WHERE workspace_id= ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![workspace_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Folder {
                id: row.get(0)?,
                icon_id: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                hotkey: row.get(4)?,
                folder_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[derive(serde::Serialize)]
pub struct WorkspaceCounters {
    pub apps: i64,
    pub tasks: i64,
    pub notes: i64,
    pub folders: i64,
}

#[tauri::command]
pub fn get_workspace_counters(workspace_id: i64) -> Result<WorkspaceCounters, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let apps: i64 = conn
        .query_row("SELECT COUNT(*) FROM apps WHERE workspace_id = ?", [workspace_id], |r| r.get(0))
        .unwrap_or(0);

    let tasks: i64 = conn
        .query_row("SELECT COUNT(*) FROM task WHERE workspace_id = ?", [workspace_id], |r| r.get(0))
        .unwrap_or(0);

    let notes: i64 = conn
        .query_row("SELECT COUNT(*) FROM notes WHERE workspace_id = ?", [workspace_id], |r| r.get(0))
        .unwrap_or(0);

    let folders: i64 = conn
        .query_row("SELECT COUNT(*) FROM folders WHERE workspace_id = ?", [workspace_id], |r| r.get(0))
        .unwrap_or(0);

    Ok(WorkspaceCounters { apps, tasks, notes, folders })
}