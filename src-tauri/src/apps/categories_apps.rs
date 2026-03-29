use super::entrys::{categories_apps, AppCategory};
use crate::servises::get_db_path;
use rusqlite::{params, Connection, Result};

#[tauri::command]
pub fn create_app_category(
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO categories_apps (name, color, parent_id, workspace_id) VALUES (?, ?, ?, ?)",
        params![name, color, parent_id, workspace_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

// Read (Получаем все категории для конкретного рабочего пространства)
#[tauri::command]
pub fn get_app_categories_by_workspace(workspace_id: i64) -> Result<Vec<categories_apps>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * FROM categories_apps WHERE workspace_id = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([workspace_id], |row| {
            Ok(categories_apps {
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
pub fn update_app_category(
    id: i64,
    name: String,
    color: Option<String>,
    parent_id: Option<i64>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE categories_apps SET name = ?, color = ?, parent_id = ? WHERE id = ?",
            params![name, color, parent_id, id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

// Delete
#[tauri::command]
pub fn delete_app_category(id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Благодаря ON DELETE CASCADE в базе, если у этой категории есть подкатегории
    // или привязанные приложения (если ты добавил каскад и туда), они удалятся сами.
    let changes = conn
        .execute("DELETE FROM categories_apps WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
#[tauri::command]
pub fn get_all_categories_apps() -> Result<Vec<categories_apps>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name, color,parent_id , workspace_id   FROM categories_apps")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(categories_apps {
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
pub fn get_app_Category_name_and_color_ById(categoryId: i32) -> Result<AppCategory, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let category: AppCategory = conn
    .query_row(
        "SELECT name, color FROM categories_apps WHERE id = ?",
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
pub fn get_app_categories_by_id(
    app_category_id: i64,
) -> Result<Vec<categories_apps>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT * ROM categories_apps WHERE id  = ?")
        .map_err(|e| e.to_string())?;

    let cat_iter = stmt
        .query_map([app_category_id], |row| {
            Ok(categories_apps {
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

