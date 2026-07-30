use super::entrys::post;
use super::entrys::post_files;
use crate::servises::get_db_path;
use rusqlite::{params, Connection, Result};
use std::path::PathBuf;
#[tauri::command]
pub fn create_post_in_note(
    note_id: i64,
    title: String,
    position_in_the_note: i64,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO posts (note_id, title, position_in_the_note) VALUES (?, ?, ?)",
        params![note_id, title, position_in_the_note],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}
#[tauri::command]
pub fn get_all_posts_by_note_id(note_id: i64) ->Result<Vec<post>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT * FROM posts WHERE note_id= ?").map_err(|e| e.to_string())?;
    let files_iter = stmt
        .query_map([note_id], |row| {
            Ok(post {
                post_id: row.get(0)?,
                note_id: row.get(1)?,
                title: row.get(2)?,
                position_in_the_note: row.get(3)?
            })
        })
        .map_err(|e| e.to_string())?;

    let mut files = Vec::new();
    for f in files_iter {
        files.push(f.map_err(|e| e.to_string())?);
    }
    Ok(files)
}
#[tauri::command]
pub fn delite_post_in_note(post_id: i64, note_id: i64) -> Result<(usize), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "DELETE FROM posts
WHERE post_id = ?
  AND note_id = ?",
            params![post_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn all_update_post_in_note(
    title: String,
    position_in_the_note: i64,
    post_id: i64,
    note_id: i64,
) -> Result<(usize), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE posts
SET title = ?,
    position_in_the_note = ?
WHERE post_id = ?
  AND note_id = ?;",
            params![position_in_the_note, title, post_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn title_update_post_in_note(
    title: String,
    post_id: i64,
    note_id: i64,
) -> Result<(usize), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE posts
SET title = ?
WHERE post_id = ?
  AND note_id = ?;",
            params![title, post_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn position_update_post_in_note(
    position: i64,
    post_id: i64,
    note_id: i64,
) -> Result<(usize), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE posts
SET position_in_the_note = ?
WHERE post_id = ?
  AND note_id = ?;",
            params![position, post_id, note_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

//файлы и прилажения/папки

// Create
#[tauri::command]
pub fn create_post_file(
    post_id: i64,
    file_type: String,
    file_path: String,
    row: Option<i64>,
    col: Option<i64>,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO post_files (post_id, file_type, file_path, row, col) VALUES (?, ?, ?, ?, ?)",
        params![post_id, file_type, file_path, row, col],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

// Read (получаем все файлы конкретного поста)
#[tauri::command]
pub fn get_files_by_post_id(post_id: i64) -> Result<Vec<post_files>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT file_id, post_id, file_type, file_path, row, col FROM post_files WHERE post_id = ?").map_err(|e| e.to_string())?;
    let files_iter = stmt
        .query_map([post_id], |row| {
            Ok(post_files {
                file_id: row.get(0)?,
                post_id: row.get(1)?,
                file_type: row.get(2)?,
                file_path: row.get(3)?,
                row: row.get(4)?,
                col: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut files = Vec::new();
    for f in files_iter {
        files.push(f.map_err(|e| e.to_string())?);
    }
    Ok(files)
}

// Update (только позиция)
#[tauri::command]
pub fn update_post_file_position(
    file_id: i64,
    row: Option<i64>,
    col: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE post_files SET row = ?, col = ? WHERE file_id = ?",
            params![row, col, file_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

// Delete
#[tauri::command]
pub fn delete_post_file(file_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM post_files WHERE file_id = ?", params![file_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
