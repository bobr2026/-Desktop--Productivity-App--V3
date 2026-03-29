use rusqlite::{params, Connection, Result};

use super::entrys::Note;
use crate::servises::get_db_path;

#[tauri::command]
pub fn add_note(
    title: String,
    note_category_id: i64,
    status: String,
    marks: Option<String>,
    globol_category_id: Option<i64>,
    workspace_id: i64,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO notes (title, category_id, status, marks, globol_category_id,workspace_id ) VALUES (?, ?, ?, ?,  ?, ?)",
        params![title, note_category_id, status, marks, globol_category_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn get_all_notes() -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT * FROM notes")
        .map_err(|e| e.to_string())?;
    let notes_iter = stmt
        .query_map([], |row| {
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
    for note in notes_iter {
        notes.push(note.map_err(|e| e.to_string())?);
    }
    Ok(notes)
}

#[tauri::command]
pub fn delete_note(note_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM notes WHERE note_id = ?", params![note_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn get_noteByID(note_id: i64) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT  * FROM notes WHERE note_id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![note_id], |row| {
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
pub fn get_all_notesByCategory_id(category_id: i64) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare(" SELECT  * FROM notes WHERE note_category_id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![category_id], |row| {
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
pub fn update_grub_notes___by_grub_id(category_id: i64, note_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE notes SET note_category_id =?  WHERE note_id = ?",
            params![category_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn update_status_note___by_note_id(status: String, note_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE notes SET status  =?  WHERE note_id = ?",
            params![status, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn update_marks_note___by_note_id(marks: String, note_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE notes SET marks  =?  WHERE note_id = ?",
            params![marks, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn update_category_note___by_note_id(
    note_category_id: i64,
    note_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE notes SET note_category_id  =?  WHERE note_id = ?",
            params![note_category_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn update_workspace__note___by_workspace_id(
    workspace_id: i64,
    note_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE  SET workspace_id=?  WHERE note_id = ?",
            params![workspace_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
