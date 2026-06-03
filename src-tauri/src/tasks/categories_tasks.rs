use rusqlite::{params, Connection, Result};

use super::entrys::categories_task;
use crate::servises::get_db_path;

#[tauri::command]
pub fn create_task_category(
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO categories_tasks (name, color, parent_id, workspace_id) VALUES (?, ?, ?, ?)",
        params![name, color, parent_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_task_categories_by_workspace(workspace_id: i64) -> Result<Vec<categories_task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT * FROM categories_tasks WHERE workspace_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([workspace_id], |row| {
            Ok(categories_task {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                parent_id: row.get(3)?,
                workspace_id: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut list = Vec::new();
    for item in iter {
        list.push(item.map_err(|e| e.to_string())?);
    }
    Ok(list)
}

#[tauri::command]
pub fn update_task_category(id: i64, name: String, color: Option<String>) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE categories_tasks SET name = ?, color = ? WHERE id = ?",
        params![name, color, id],
    )
    .map_err(|e| e.to_string())
}
#[tauri::command]
pub fn delete_task_category(categories_task_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "DELETE FROM categories_tasks WHERE id = ?",
            params![categories_task_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}


#[tauri::command]
pub fn get_task_categories_by_id(
    task_category_id: i64,
) -> Result<Option<categories_task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM categories_tasks WHERE id  = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_row([task_category_id], |row| {
            Ok(categories_task {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                parent_id: row.get(3)?,
                workspace_id: row.get(4)?,
            })
        });

  // 4. Обрабатываем результат
  match cat_iter {
    Ok(t) => Ok(Some(t)), // Задача успешно найдена
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None), // Задачи с таким ID нет
    Err(e) => Err(e.to_string()), // Произошла какая-то другая ошибка БД
}
}

