use super::entrys::categories_notes;
use crate::servises::get_db_path;
use rusqlite::{params, Connection, Result};
use std::{path::PathBuf, thread};

#[tauri::command]
pub fn add_Category_note(
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
    workspace_id: i64,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO categories_notes (name, color, parent_id, workspace_id) VALUES (?, ?,?,?)",
        params![name, color, parent_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn deleteCategory_note_ByID(category_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM categories_notes WHERE id = ?",
        params![category_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}
#[tauri::command]
pub fn get_note_categories_by_id(
    note_category_id: i64,
) -> Result<Vec<categories_notes>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM categories_notes WHERE id  = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([note_category_id], |row| {
            Ok(categories_notes {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                parent_id: row.get(3)?,
                workspace_id: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut categories = Vec::new();
    for c in cat_iter {
        categories.push(c.map_err(|e| e.to_string())?);
    }
    Ok(categories)
}



#[tauri::command]
pub fn get_all_categories_notes() -> Result<Vec<categories_notes>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT *  FROM categories_notes")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(categories_notes {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                parent_id: row.get(3)?,
                workspace_id: row.get(4)?,
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
pub fn get_note_Category_name_ById(categoryId: i32) -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let res = conn
        .query_row(
            "SELECT name FROM  categories_notes WHERE id =?",
            params![categoryId],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(res)
}
// Create

// Read (получаем все категории для конкретного workspace)
#[tauri::command]
pub fn get_categories_by_workspace(workspace_id: i64) -> Result<Vec<categories_notes>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT * FROM categories_notes WHERE workspace_id = ? OR workspace_id IS NULL")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([workspace_id], |row| {
            Ok(categories_notes {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                parent_id: row.get(3)?,
                workspace_id: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut categories = Vec::new();
    for c in cat_iter {
        categories.push(c.map_err(|e| e.to_string())?);
    }
    Ok(categories)
}

// Update 1: Основная информация (имя, цвет)
#[tauri::command]
pub fn update_category_info(id: i64, name: String, color: Option<String>,parent_id:Option<i64>) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE categories_notes SET name = ?, color = ?, parent_id=? WHERE id = ?",
            params![name, color,parent_id, id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

// Update 2: Иерархия (перемещение в другую папку или рабочую область)
#[tauri::command]
pub fn update_category_hierarchy(
    id: i64,
    parent_id: Option<i64>,
    workspace_id: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE categories_notes SET parent_id = ?, workspace_id = ? WHERE id = ?",
            params![parent_id, workspace_id, id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

// Delete
// #[tauri::command]
// pub fn delete_category(id: i64) -> Result<usize, String> {
//     let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//     let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
//     let changes = conn.execute("DELETE FROM categories_notes WHERE id = ?", params![id]).map_err(|e| e.to_string())?;
//     Ok(changes)
// }
