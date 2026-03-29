use rusqlite::{params, Connection, Result};

use super::entrys::dock_panels;
use crate::{
    apps::entrys::App, folders::entrys::Folder, notes::entrys::Note, servises::get_db_path,
    tasks::entrys::task,
};

#[tauri::command]
pub fn add_dock_panel(
    color: Option<String>,
    name: String,
    posstion: Option<String>,
    workspace_id: i64,
    swoh_element_grubs: Option<String>,
    hotkey:Option<String>
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO dock_panels (color, name, posstion, workspace_id, swoh_element_grubs,hotkey ) VALUES (?, ?, ?, ?, ?, ?)",
        params![color, name, posstion, workspace_id, swoh_element_grubs, hotkey],
    )
    .map_err(|e| e.to_string())?;
    println!("dock_panel");
    Ok(())
}
#[tauri::command]
pub fn delete_dock_panel(id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM dock_panels WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn get_dock_panel_ByID(id: i64) -> Result<Vec<dock_panels>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM dock_panels WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![id], |row| {
            // Используются параметры при выполнении запроса
            Ok(dock_panels {
                id: row.get(0)?,
                color: row.get(1)?,
                name: row.get(2)?,
                posstion: row.get(3)?,
                workspace_id: row.get(4)?,
                swoh_element_grubs: row.get(5)?,
                hotkey:row.get(6)?,
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
pub fn get_all_dock_panels() -> Result<Vec<dock_panels>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT * FROM dock_panels",
        )
        .map_err(|e| e.to_string())?;
    let notes_iter = stmt
        .query_map([], |row| {
            Ok(dock_panels {
                id: row.get(0)?,
                color: row.get(1)?,
                name: row.get(2)?,
                posstion: row.get(3)?,
                workspace_id: row.get(4)?,
                swoh_element_grubs: row.get(5)?,
                hotkey:row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note in notes_iter {
        notes.push(note.map_err(|e| e.to_string())?);
    }
    Ok(notes)
}

#[tauri::command]
pub fn update_dock_panel(
    color: Option<String>,
    name: String,
    posstion: Option<String>,
    workspace_id: i64,
    swoh_element_grubs: Option<String>,
    hotkey:Option<String>, 
    id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE dock_panels SET color = ?, name = ?, posstion = ?, workspace_id= ?,swoh_element_grubs=?,globol_category_id=? , workspace_id=?,  hotkey=?  WHERE id = ?",
            params![color, name, posstion,workspace_id, swoh_element_grubs, hotkey,  id ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}





#[tauri::command]
pub fn get_all_foldersByGlobal_Grub_id(grub_id: i64) -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, icon_id,path, title,  hotkey, folder_category_id, globol_category_id, workspace_id FROM folders WHERE  globol_category_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![grub_id], |row| {
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

#[tauri::command]
pub fn get_all_appsByGlobal_Grub_id(grub_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title,path,icon_path,  hotkey, app_category_id, globol_category_id, workspace_id FROM apps WHERE globol_category_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![grub_id], |row| {
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
pub fn get_all_notesByGlobol_category_id(globol_category_id: i64) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare(" SELECT  note_id, title, note_category_id,status,marks, created_at, updated_at, globol_category_id,workspace_id  FROM notes WHERE globol_category_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![globol_category_id], |row| {
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
pub fn get_all_tasks_by_global_category_id(globol_category_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT task_id, marks, status, parent_id, title, task_category_id, globol_category_id, workspace_id FROM task WHERE globol_category_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([globol_category_id], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tasks = Vec::new();
    for t in iter {
        tasks.push(t.map_err(|e| e.to_string())?);
    }
    Ok(tasks)
}
