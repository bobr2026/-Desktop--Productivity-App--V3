use crate::servises::get_db_path;
use super::entrys::{globol_categorys, AppCategory};
use rusqlite::{params, Connection, Result};
#[tauri::command]
pub fn create_global_category(
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO globol_categorys (name, color, parent_id, workspace_id) VALUES (?, ?, ?, ?)",
        params![name, color, parent_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}
#[tauri::command]
pub fn get_global_category_by_workspace(
    workspace_id: i64,
) -> Result<Vec<globol_categorys>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM globol_categorys WHERE workspace_id = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([workspace_id], |row| {
            Ok(globol_categorys {
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
pub fn update_global_category(
    id: i64,
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE globol_categorys SET name = ?, color = ?, parent_id = ? WHERE id = ?",
            params![name, color, parent_id, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

#[tauri::command]
pub fn delete_global_category(id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Благодаря ON DELETE CASCADE в базе, если у этой категории есть подкатегории
    // или привязанные приложения (если ты добавил каскад и туда), они удалятся сами.
    let changes = conn
        .execute("DELETE FROM globol_categorys WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
#[tauri::command]
pub fn get_all_global_categories() -> Result<Vec<globol_categorys>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT *  FROM globol_categorys")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(globol_categorys {
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
pub fn get_global_Category_name_and_color_ById(categoryId: i64) -> Result<AppCategory, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let category: AppCategory = conn
    .query_row(
        "SELECT name, color FROM globol_categorys WHERE id = ?",
        params![categoryId],
        |row| {
            Ok(AppCategory {
                name: row.get(0)?,
                color: row.get(1)?,
            })
        },
    )
    .map_err(|e| e.to_string())?;

Ok(category)
  
}

#[tauri::command]
pub fn get_globol_categories_by_id(
    globol_category_id: i64,
) -> Result<Vec<globol_categorys>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM globol_categorys WHERE id  = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([globol_category_id], |row| {
            Ok(globol_categorys {
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

