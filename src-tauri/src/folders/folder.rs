use super::entrys::Folder;
use crate::servises::get_db_path;
use rusqlite::{params, Connection, Result};
use std::path::PathBuf;
#[tauri::command]
pub fn add_folder(
    icon_id: i64,
    title: String,
    path: String,
    hotkey: Option<String>,
    folder_category_id: Option<i64>,
    globol_category_id: Option<i64>,
    workspace_id: i64,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO folders ( icon_id,path, title,  hotkey, folder_category_id, globol_category_id, workspace_id) VALUES 
            (?, ?, ?, ?, ?, ?, ?)",
        params![icon_id,path, title, hotkey, folder_category_id, globol_category_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn get_all_folders() -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT * FROM folders")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
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

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}
// let mut notes = Vec::new();
//     for note in notes_iter {
//         notes.push(note.map_err(|e| e.to_string())?);
//     }
//     Ok(notes)
// }

//icon_id,path, hotkey , folder_grub_id,folder_id)
#[tauri::command]
pub fn update_folder(
    icon_id: i64,
    path: String,
    hotkey: String,
    title: String,
    folder_category_id: Option<i64>,
    globol_category_id: Option<i64>,
    workspace_id: i64,
    folder_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE folders SET icon_id = ?, path = ?, hotkey = ?, title= ?,folder_category_id=?,globol_category_id=? , workspace_id=?   WHERE id = ?",
            params![icon_id,path,hotkey, title, folder_category_id, globol_category_id, workspace_id,  folder_id  ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn delete_folder(folder_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM folders WHERE id = ?", params![folder_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn get_foldersByID(folder_id: i64) -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM folders WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![folder_id], |row| {
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
pub fn get_all_foldersByGrub_id(grub_id: i64) -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM folders WHERE  folder_category_id = ?") // Добавлено FROM notes
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
pub fn update_grub_folder___by_folder_id(
    folder_category_id: i64,
    folder_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE folders SET folder_category_id=?  WHERE id = ?",
            params![folder_category_id, folder_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
pub fn update_global_category___by_folder_id(
    globol_category_id: i64,
    folder_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE folders SET globol_category_id=?  WHERE id = ?",
            params![globol_category_id, folder_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
pub fn update__workspace__by_folder_id(workspace_id: i64, folder_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE folders SET workspace_id=?  WHERE id = ?",
            params![workspace_id, folder_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
pub fn update__icon__by_folder_id(icon_id: i64, folder_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE folders SET icon_id=?  WHERE id = ?",
            params![icon_id, folder_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
