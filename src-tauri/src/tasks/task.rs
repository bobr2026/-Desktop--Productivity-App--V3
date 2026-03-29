use rusqlite::{params, Connection, Result};

use super::entrys::task;
use crate::servises::get_db_path;
#[tauri::command]
pub fn create_task(
    title: String,
    status: String,
    marks: Option<String>,
    parent_id: Option<i64>,
    task_category_id: Option<i64>,
    globol_category_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO task (title, status, marks, parent_id, task_category_id, globol_category_id, workspace_id) VALUES (?, ?, ?, ?, ? , ?, ?)",
        params![title, status, marks, parent_id, task_category_id, globol_category_id,workspace_id],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_subtasks(parent_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT task_id, marks, status, parent_id, title, task_category_id,globol_category_id, workspace_id  FROM task WHERE parent_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([parent_id], |row| {
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
#[tauri::command]
pub fn get_tasks_by_markType(marks: String) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT task_id, marks, status, parent_id, title, task_category_id, globol_category_id, workspace_id FROM task WHERE marks = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([marks], |row| {
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

#[tauri::command]
pub fn get_all_tasks_by_task_category_id(task_category_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT task_id, marks, status, parent_id, title, task_category_id, globol_category_id, workspace_id FROM task WHERE task_category_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([task_category_id], |row| {
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

#[tauri::command]
pub fn get_tasks_by_status(status: String) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT task_id, marks, status, parent_id, title, task_category_id, globol_category_id, workspace_id FROM task WHERE status = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([status], |row| {
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

#[tauri::command]
pub fn update_task_status(task_id: i64, status: String) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE task SET status = ? WHERE task_id = ?",
        params![status, task_id],
    )
    .map_err(|e| e.to_string())
}
#[tauri::command]
pub fn update_task_marks(task_id: i64, marks: Option<String>) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE task SET marks = ? WHERE task_id = ?",
        params![marks, task_id],
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_task_content(
    task_id: i64,
    title: String,
    marks: Option<String>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE task SET title = ? WHERE task_id = ?",
        params![title, marks, task_id],
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_task(task_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    // Примечание: если в SQL не указан ON DELETE CASCADE для parent_id,
    // подзадачи могут остаться "сиротами".
    conn.execute("DELETE FROM task WHERE task_id = ?", params![task_id])
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_workspace__task___by_workspace_id(
    workspace_id: i64,
    task_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE task SET workspace_id=?  WHERE task_id = ?",
            params![workspace_id, task_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
