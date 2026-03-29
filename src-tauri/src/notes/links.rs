use rusqlite::{params, Connection, Result};

use super::entrys::Links;
use crate::servises::get_db_path;

// Create
#[tauri::command]
pub fn create_link(
    source_type: String,
    source_id: i64,
    target_type: String,
    target_id: i64,
    link_type: String,
    created_at: String,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO Links (source_type, source_id, target_type, target_id, link_type, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        params![source_type, source_id, target_type, target_id, link_type, created_at],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

// Read (ищем все связи, исходящие из конкретного источника)
#[tauri::command]
pub fn get_links_by_source(source_type: String, source_id: i64) -> Result<Vec<Links>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT link_id, source_type, source_id, target_type, target_id, link_type, created_at 
         FROM Links WHERE source_type = ? AND source_id = ?",
        )
        .map_err(|e| e.to_string())?;

    let links_iter = stmt
        .query_map(params![source_type, source_id], |row| {
            Ok(Links {
                link_id: row.get(0)?,
                source_type: row.get(1)?,
                source_id: row.get(2)?,
                target_type: row.get(3)?,
                target_id: row.get(4)?,
                link_type: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for l in links_iter {
        links.push(l.map_err(|e| e.to_string())?);
    }
    Ok(links)
}
#[tauri::command]
pub fn update_link_sourse(
    link_id: i64,
    source_type: String,
    source_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE Links SET source_type = ?, source_id = ? WHERE link_id = ?",
            params![source_type, source_id, link_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
// Delete
#[tauri::command]
pub fn delete_link(link_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM Links WHERE link_id = ?", params![link_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

// 1. Поиск по target (кто ссылается на этот объект)
#[tauri::command]
pub fn get_links_by_target(target_type: String, target_id: i64) -> Result<Vec<Links>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT link_id, source_type, source_id, target_type, target_id, link_type, created_at 
         FROM Links WHERE target_type = ? AND target_id = ?",
        )
        .map_err(|e| e.to_string())?;

    let links_iter = stmt
        .query_map(params![target_type, target_id], |row| {
            Ok(Links {
                link_id: row.get(0)?,
                source_type: row.get(1)?,
                source_id: row.get(2)?,
                target_type: row.get(3)?,
                target_id: row.get(4)?,
                link_type: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for l in links_iter {
        links.push(l.map_err(|e| e.to_string())?);
    }
    Ok(links)
}

// 2. Поиск по типу связи (например, все "mention" или "reference")
#[tauri::command]
pub fn get_links_by_type(link_type: String) -> Result<Vec<Links>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT link_id, source_type, source_id, target_type, target_id, link_type, created_at 
         FROM Links WHERE link_type = ?",
        )
        .map_err(|e| e.to_string())?;

    let links_iter = stmt
        .query_map([link_type], |row| {
            Ok(Links {
                link_id: row.get(0)?,
                source_type: row.get(1)?,
                source_id: row.get(2)?,
                target_type: row.get(3)?,
                target_id: row.get(4)?,
                link_type: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for l in links_iter {
        links.push(l.map_err(|e| e.to_string())?);
    }
    Ok(links)
}

// 3. Получение конкретной связи по ID
#[tauri::command]
pub fn get_link_by_id(link_id: i64) -> Result<Links, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT link_id, source_type, source_id, target_type, target_id, link_type, created_at 
         FROM Links WHERE link_id = ?",
        params![link_id],
        |row| {
            Ok(Links {
                link_id: row.get(0)?,
                source_type: row.get(1)?,
                source_id: row.get(2)?,
                target_type: row.get(3)?,
                target_id: row.get(4)?,
                link_type: row.get(5)?,
                created_at: row.get(6)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

// 4. Обновление типа связи по link_id (например, сменили "черновик" на "утверждено")
#[tauri::command]
pub fn update_link_type(link_id: i64, new_type: String) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE Links SET link_type = ? WHERE link_id = ?",
            params![new_type, link_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

// 5. Обновление цели связи (если нужно перепривязать линк к другому объекту)
#[tauri::command]
pub fn update_link_target(
    link_id: i64,
    target_type: String,
    target_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE Links SET target_type = ?, target_id = ? WHERE link_id = ?",
            params![target_type, target_id, link_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
