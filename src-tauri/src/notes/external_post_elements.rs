use rusqlite::{params, Connection, Result};

use super::entrys::external_post_elements;
use crate::servises::get_db_path;

#[tauri::command]
pub fn create_external_element(
    post_id: i64,
    app_id: Option<i64>,
    folder_id: Option<i64>,
    row: Option<i64>,
    col: Option<i64>,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO external_post_elements (post_id, app_id, folder_id, row, col) VALUES (?, ?, ?, ?, ?)",
        params![post_id, app_id, folder_id, row, col],
    ).map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_external_elements_by_post(post_id: i64) -> Result<Vec<external_post_elements>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, post_id, app_id, folder_id, row, col FROM external_post_elements WHERE post_id = ?"
    ).map_err(|e| e.to_string())?;

    let elements_iter = stmt
        .query_map([post_id], |row| {
            Ok(external_post_elements {
                id: row.get(0)?,
                post_id: row.get(1)?,
                app_id: row.get(2)?,
                folder_id: row.get(3)?,
                row: row.get(4)?,
                col: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut elements = Vec::new();
    for el in elements_iter {
        elements.push(el.map_err(|e| e.to_string())?);
    }
    Ok(elements)
}
#[tauri::command]
pub fn update_external_element_position(
    id: i64,
    row: Option<i64>,
    col: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE external_post_elements SET row = ?, col = ? WHERE id = ?",
            params![row, col, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

// 2. Смена целевого объекта (замена приложения на папку или наоборот)
#[tauri::command]
pub fn update_external_element_target(
    id: i64,
    app_id: Option<i64>,
    folder_id: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // SQLITE автоматически проверит твой CHECK констрейнт здесь
    let changes = conn
        .execute(
            "UPDATE external_post_elements SET app_id = ?, folder_id = ? WHERE id = ?",
            params![app_id, folder_id, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
#[tauri::command]
pub fn delete_external_element(id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "DELETE FROM external_post_elements WHERE id = ?",
            params![id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
