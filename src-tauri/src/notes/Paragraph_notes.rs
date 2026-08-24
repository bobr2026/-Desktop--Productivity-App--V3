use super::entrys::Paragraph;
use crate::servises::get_db_path;
use rusqlite::{params, Connection, Result};
use std::path::PathBuf;

#[tauri::command]
pub fn add_Paragraph(
    post_id: i64,
    content: String,
    culomm: i64,
    row: i64,
    style_id: Option<i64>,
) -> Result<Paragraph, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO Paragraph (post_id,content, culomm, row, style_id) VALUES (?, ?, ?, ?, ?)",
        params![post_id, content, culomm, row, style_id],
    )
    .map_err(|e| e.to_string())?;
    println!("paragraph added");
    let id = conn.last_insert_rowid();
    Ok(Paragraph { paragraph_id: id, post_id, content, culomm, row, style_id })
}

#[tauri::command]
pub fn get_all_paragraph_by_post_id(post_id: i64) -> Result<Vec<Paragraph>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT * FROM Paragraph WHERE post_id = ?")
        .map_err(|e| e.to_string())?;
    let notes_iter = stmt
        .query_map([post_id], |row| {
            Ok(Paragraph {
                paragraph_id: row.get(0)?,
                post_id: row.get(1)?,
                content: row.get(2)?,
                culomm: row.get(3)?,
                row: row.get(4)?,
                style_id: row.get(5)?,
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
pub fn delete_paragraph_by_post_id(paragraph_id: i64, post_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "DELETE FROM Paragraph
WHERE paragraph_id = ?
  AND post_id = ?",
            params![paragraph_id, post_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn update_position_paragraph(
    culomm: Option<i64>,
    row: Option<i64>,
    paragraph_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE Paragraph SET culomm  =? row =? WHERE paragraph_id = ?",
            params![culomm, row, paragraph_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn update_content_paragraph(content: Option<String>, paragraph_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE Paragraph SET content  =?  WHERE paragraph_id = ?",
            params![content, paragraph_id],
        )
        .map_err(|e| e.to_string())?;
    println!("update_content_paragraph called");
    Ok(changes)
}

#[tauri::command]
pub fn set_styleId_paragraph(style_id: Option<i64>, paragraph_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE Paragraph SET style_id = ? WHERE paragraph_id = ?",
            params![style_id, paragraph_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn set_post_id_paragraph(post_id: i64, paragraph_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE Paragraph SET post_id=? WHERE paragraph_id = ?",
            params![post_id, paragraph_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
