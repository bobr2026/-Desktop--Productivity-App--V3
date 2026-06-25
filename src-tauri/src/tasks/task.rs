use rusqlite::{params, Connection, Result};

use super::entrys::task;
use crate::notes::entrys::{Note};
use crate::servises::get_db_path;
#[tauri::command]
pub fn create_task(
    title: String,
    status: String,
    marks: Option<String>,
    parent_id: Option<i64>,
    task_category_id: Option<i64>,
    workspace_id: i64,
) -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO task (title, status, marks, parent_id, task_category_id, workspace_id) VALUES (?, ?, ?, ?, ? , ?)",
        params![title, status, marks, parent_id, task_category_id ,workspace_id],
    ).map_err(|e| e.to_string())?;
    println!("create_task");
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_subtasks(parent_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT * FROM task WHERE parent_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([parent_id], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
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
    let mut stmt = conn.prepare("SELECT * FROM task WHERE marks = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([marks], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
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
    let mut stmt = conn.prepare("SELECT * FROM task WHERE task_category_id = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([task_category_id], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
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
pub fn get_task_by_id(task_id: i64) -> Result<Option<task>, String> {
    // 1. Подключаемся к базе данных
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Готовим SQL-запрос для поиска по task_id
    let mut stmt = conn
        .prepare("SELECT * FROM task WHERE task_id = ?")
        .map_err(|e| e.to_string())?;

    // 3. Выполняем запрос. query_row ищет ровно одну запись
    let task_result = stmt.query_row([task_id], |row| {
        Ok(task {
            task_id: row.get(0)?,
            marks: row.get(1)?,
            status: row.get(2)?,
            parent_id: row.get(3)?,
            title: row.get(4)?,
            task_category_id: row.get(5)?,
            workspace_id: row.get(6)?,
        })
    });

    // 4. Обрабатываем результат
    match task_result {
        Ok(t) => Ok(Some(t)), // Задача успешно найдена
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None), // Задачи с таким ID нет
        Err(e) => Err(e.to_string()), // Произошла какая-то другая ошибка БД
    }
}
#[tauri::command]
pub fn get_tasks_by_status(status: String) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT * FROM task WHERE status = ?").map_err(|e| e.to_string())?;
    let iter = stmt
        .query_map([status], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
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
pub fn update_category_task___by_task_id(
    task_category_id: i64,
    task_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE task SET task_category_id =?  WHERE task_id = ?",
            params![task_category_id, task_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}


#[tauri::command]
pub fn update_full_task(
    task_id: i64,
    title: String,
    marks: Option<String>,
    status: String,
    parent_id: Option<i64>,
    task_category_id: Option<i64>,
    workspace_id: Option<i64>,
) -> Result<usize, String> {
    // 1. Подключаемся к базе данных
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // 2. Выполняем запрос на обновление всех полей
    let rows_affected = conn.execute(
        "UPDATE task 
         SET title = ?, 
             marks = ?, 
             status = ?, 
             parent_id = ?, 
             task_category_id = ?, 
             workspace_id = ? 
         WHERE task_id = ?",
        params![
            title, 
            marks, 
            status, 
            parent_id, 
            task_category_id, 
            workspace_id, 
            task_id
        ],
    )
    .map_err(|e| e.to_string())?;

    // 3. Возвращаем количество измененных строк (обычно 1, если таска найдена)
    Ok(rows_affected)
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

// #[tauri::command]
// pub fn get_notes_for_task(task_id: i64) -> Result<Vec<Note>, String> {
//     let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//     let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
//     // Достаем все поля для Note
//     let query = "
//         SELECT 
//             n.note_id, n.title, n.note_category_id, n.status, 
//             n.marks, n.created_at, n.updated_at, n.globol_category_id, n.workspace_id
//         FROM notes n
//         INNER JOIN notes_task_links ntl ON n.note_id = ntl.note_id
//         WHERE ntl.task_id = ?
//     ";
    
//     let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;
    
//     let iter = stmt
//         .query_map([task_id], |row| {
//             Ok(Note {
//                 note_id: row.get(0)?,
//                 title: row.get(1)?,
//                 note_category_id: row.get(2)?, // rusqlite сам поймет, что это Option
//                 status: row.get(3)?,
//                 marks: row.get(4)?,
//                 created_at: row.get(5)?,
//                 updated_at: row.get(6)?,
//                 globol_category_id: row.get(7)?,
//                 workspace_id: row.get(8)?,
//             })
//         })
//         .map_err(|e| e.to_string())?;

//     let mut notes = Vec::new();
//     for n in iter {
//         notes.push(n.map_err(|e| e.to_string())?);
//     }
    
//     Ok(notes)
// }

// #[tauri::command]
// pub fn get_tasks_for_note(note_id: i64) -> Result<Vec<task>, String> {
//     let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//     let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
//     // Достаем все поля для task
//     let query = "
//         SELECT 
//             t.task_id, t.marks, t.status, t.parent_id, 
//             t.title, t.task_category_id, t.workspace_id 
//         FROM task t
//         INNER JOIN notes_task_links ntl ON t.task_id = ntl.task_id
//         WHERE ntl.note_id = ?
//     ";
    
//     let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;
    
//     let iter = stmt
//         .query_map([note_id], |row| {
//             Ok(task {
//                 task_id: row.get(0)?,
//                 marks: row.get(1)?,
//                 status: row.get(2)?,
//                 parent_id: row.get(3)?,
//                 title: row.get(4)?,
//                 task_category_id: row.get(5)?,
//                 workspace_id: row.get(6)?,
//             })
//         })
//         .map_err(|e| e.to_string())?;

//     let mut tasks = Vec::new();
//     for t in iter {
//         tasks.push(t.map_err(|e| e.to_string())?);
//     }
    
//     Ok(tasks)
// }

#[tauri::command]
pub fn get_notes_for_task(element_id: i64) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // SQL ОБНОВЛЕН: n.note_id теперь связан с sub_element_id, а фильтр идет по perent_element_id
    let query = "
        SELECT 
            n.note_id, n.title, n.note_category_id, n.status, 
            n.marks, n.created_at, n.updated_at, n.globol_category_id, n.workspace_id
        FROM notes n
        INNER JOIN notes_task_links ntl ON n.note_id = ntl.sub_element_id
        WHERE ntl.perent_element_id = ?
    ";
    
    let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;
    
    let iter = stmt
        .query_map([element_id], |row| {
            Ok(Note {
                note_id: row.get(0)?,
                title: row.get(1)?,
                note_category_id: row.get(2)?,
                status: row.get(3)?,
                marks: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
                globol_category_id: row.get(7)?,
                workspace_id: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for n in iter {
        notes.push(n.map_err(|e| e.to_string())?);
    }
    
    Ok(notes)
}

#[tauri::command]
pub fn get_tasks_for_note(element_id: i64) -> Result<Vec<task>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    
    // SQL ОБНОВЛЕН: t.task_id теперь связан с perent_element_id, а фильтр идет по sub_element_id
    let query = "
        SELECT 
            t.task_id, t.marks, t.status, t.parent_id, 
            t.title, t.task_category_id, t.workspace_id 
        FROM task t
        INNER JOIN notes_task_links ntl ON t.task_id = ntl.sub_element_id
        WHERE ntl.perent_element_id = ?
    ";
    
    let mut stmt = conn.prepare(query).map_err(|e| e.to_string())?;
    
    let iter = stmt
        .query_map([element_id], |row| {
            Ok(task {
                task_id: row.get(0)?,
                marks: row.get(1)?,
                status: row.get(2)?,
                parent_id: row.get(3)?,
                title: row.get(4)?,
                task_category_id: row.get(5)?,
                workspace_id: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tasks = Vec::new();
    for t in iter {
        tasks.push(t.map_err(|e| e.to_string())?);
    }
    
    Ok(tasks)
}