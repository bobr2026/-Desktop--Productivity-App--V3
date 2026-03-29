use super::entrys::categories_folders;
use crate::servises::{get_db_path, AppCategory};
use rusqlite::{params, Connection, Result};

#[tauri::command]
pub fn create_folder_category(
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO categories_folders (name, color, parent_id, workspace_id) VALUES (?, ?, ?, ?)",
        params![name, color, parent_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

// Read (Получаем все категории для конкретного рабочего пространства)
#[tauri::command]
pub fn get_folder_categories_by_workspace(
    workspace_id: i64,
) -> Result<Vec<categories_folders>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM categories_folders WHERE workspace_id = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([workspace_id], |row| {
            Ok(categories_folders {
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
pub fn get_folder_categories_by_id(
    folder_category_id: i64,
) -> Result<Vec<categories_folders>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * ROM categories_folders WHERE id  = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([folder_category_id], |row| {
            Ok(categories_folders {
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


// Update (Обновление инфы или перемещение в другую папку)
#[tauri::command]
pub fn update_folder_category(
    id: i64,
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE categories_folders SET name = ?, color = ?, parent_id = ? WHERE id = ?",
            params![name, color, parent_id, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

// Delete
#[tauri::command]
pub fn delete_folder_category(id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Благодаря ON DELETE CASCADE в базе, если у этой категории есть подкатегории
    // или привязанные приложения (если ты добавил каскад и туда), они удалятся сами.
    let changes = conn
        .execute("DELETE FROM categories_folders WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
#[tauri::command]
pub fn get_all_categories_folders() -> Result<Vec<categories_folders>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT *  FROM categories_folders")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(categories_folders {
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
pub fn get_folder_Category_name_ById(categoryId: i64) -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let res = conn
        .query_row(
            "SELECT name FROM  categories_folders WHERE id =?",
            params![categoryId],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(res)
}
#[tauri::command]
pub fn get_folder_Category_name_and_color_ById(categoryId: i32) -> Result<AppCategory, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let category: AppCategory = conn
    .query_row(
        "SELECT name, color FROM categories_folders WHERE id = ?",
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