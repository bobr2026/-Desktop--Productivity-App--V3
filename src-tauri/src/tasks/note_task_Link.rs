use rusqlite::{params, Connection};

use crate::servises::get_db_path;
use super::entrys::ElementLink;
// --- CREATE (Добавление связи) ---
#[tauri::command]
pub fn add_element_link(
    perent_id: i64,
    sub_id: i64,
    swoh_type: String,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Database path not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO notes_task_links (perent_element_id, sub_element_id, swoh_type) 
         VALUES (?, ?, ?)",
        params![perent_id, sub_id, swoh_type],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// --- READ: Получение всех под-элементов для родителя ---
#[tauri::command]
pub fn get_sub_elements(perent_id: i64) -> Result<Vec<ElementLink>, String> {
    let db_path = get_db_path().ok_or("Database path not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT link_id, perent_element_id, sub_element_id, swoh_type FROM notes_task_links WHERE perent_element_id = ?")
        .map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![perent_id], |row| {
        Ok(ElementLink {
            link_id: row.get(0)?,
            perent_element_id: row.get(1)?,
            sub_element_id: row.get(2)?,
            swoh_type: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for row in rows {
        links.push(row.map_err(|e| e.to_string())?);
    }

    Ok(links)
}

// --- UPDATE: Изменение типа связи или перепривязка ---
#[tauri::command]
pub fn update_element_link(
    link_id: i64,
    new_type: String,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Database path not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE notes_task_links SET swoh_type = ? WHERE link_id = ?",
        params![new_type, link_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// --- DELETE: Удаление связи ---
#[tauri::command]
pub fn delete_element_link(link_id: i64) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Database path not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "DELETE FROM notes_task_links WHERE link_id = ?",
        params![link_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_perent_elements(sub_id: i64) -> Result<Vec<ElementLink>, String> {
    let db_path = get_db_path().ok_or("Database path not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Выбираем связи, где текущий ID является sub_element_id
    let mut stmt = conn
        .prepare("SELECT link_id, perent_element_id, sub_element_id, swoh_type FROM notes_task_links WHERE sub_element_id = ?")
        .map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![sub_id], |row| {
        Ok(ElementLink {
            link_id: row.get(0)?,
            perent_element_id: row.get(1)?,
            sub_element_id: row.get(2)?,
            swoh_type: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut links = Vec::new();
    for row in rows {
        links.push(row.map_err(|e| e.to_string())?);
    }

    Ok(links)
}

#[tauri::command]
pub fn unlink_elements(perent_id: i64, sub_id: i64) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found")?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Удаляем запись, где совпадают и родитель, и под-элемент
    conn.execute(
        "DELETE FROM notes_task_links WHERE perent_element_id = ? AND sub_element_id = ?",
        params![perent_id, sub_id],
    )
    .map_err(|e| e.to_string())?;

    println!("Элемент {} успешно отвязан от родителя {}", sub_id, perent_id);
    Ok(())
}