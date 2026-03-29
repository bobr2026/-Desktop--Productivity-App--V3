use rusqlite::{params, Connection, Result};

use crate::servises::get_db_path;
// use crate::servises::{get_linux_icon, get_windows_icon, get_mac_icon};
use super::entrys::App;
use dirs_next::home_dir;
use serde_json::Value;
use tauri_plugin_shell::ShellExt;
#[tauri::command]
pub fn add_app(
    title: String,//
    path: String,//
    icon_path: String,//
    hotkey: Option<String>,//
    app_category_id: Option<i64>,
    globol_category_id: Option<i64>,
    workspace_id: i64,//
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO apps (  title, path, icon_path,  hotkey, app_category_id, globol_category_id, workspace_id  ) VALUES 
            (?, ?, ?, ?, ?, ?, ? )",
        params![ title,path,icon_path,  hotkey, app_category_id, globol_category_id, workspace_id  ],
    )
    .map_err(|e| e.to_string())?;
    println!("app added");
    Ok(())
}
// #[tauri::command]
// pub async fn get_app_icon(app: tauri::AppHandle, app_path:String) -> Result<Value, String> {
//     // 1. Создаем команду
//     let os_platform = tauri_plugin_os::platform();
//     let sidecar_command = app
//         .shell()
//         .sidecar("get_app_icon")
//         .map_err(|e| e.to_string())?
//         .args([ "--system", os_platform,
//         "--app_path", &app_path,]);

//     // 2. Выполняем и ждем завершения (output() захватывает stdout и stderr)
//     let output = sidecar_command
//         .output()
//         .await
//         .map_err(|e| format!("Ошибка запуска: {}", e))?;

//     if output.status.success() {
//         // 3. Преобразуем байты из stdout в строку
//         let stdout_res = String::from_utf8(output.stdout)
//             .map_err(|_| "Не удалось прочитать вывод (UTF-8 error)".to_string())?;

//         // 4. Парсим JSON (или возвращаем строку как есть)
//         let json: Value = serde_json::from_str(&stdout_res)
//             .map_err(|_| format!("Python вернул невалидный JSON: {}", stdout_res))?;

//         Ok(json)
//     } else {
//         // Если Python завершился с ошибкой (exit code != 0)
//         let stderr = String::from_utf8_lossy(&output.stderr);
//         Err(format!("Python Error: {}", stderr))
//     }
// }

use file_icon_provider::get_file_icon;
use image::{DynamicImage, RgbaImage};
use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Runtime};

#[derive(Serialize)]
pub struct AppDetails {
    app_name: String,
    icon_path: String,
}

#[tauri::command]
pub async fn extract_icon_and_save<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
    path: String,
    size: u32,
) -> Result<AppDetails, String> {
    let source_path = PathBuf::from(&path);
    // Конвертируем размер в u16, так как библиотека требует именно этот тип
    let icon_size = size as u16;

    let app_name = source_path
        .file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or("UnknownApp")
        .to_string();

    let home_dir = home_dir().ok_or("Не удалось найти домашнюю директорию")?;
    let icons_dir = home_dir.join("Admin-app").join("icons");
    fs::create_dir_all(&icons_dir).map_err(|e| e.to_string())?;

    let icon_save_path = icons_dir.join(format!("{}.png", app_name));

    // --- ИЗВЛЕЧЕНИЕ ИКОНКИ ---

    let icon_data = if cfg!(target_os = "linux") {
        // На Linux run_on_main_thread не возвращает данные из замыкания напрямую.
        // Используем старый добрый канал (channel), чтобы пробросить данные обратно.
        let (tx, rx) = std::sync::mpsc::channel();
        let s_path = source_path.clone();

        app_handle
            .run_on_main_thread(move || {
                let res = get_file_icon(s_path, icon_size);
                let _ = tx.send(res); // Отправляем результат обратно
            })
            .map_err(|e| format!("Ошибка главного потока: {}", e))?;

        rx.recv()
            .map_err(|_| "Канал передачи данных был закрыт")?
            .map_err(|e| format!("Ошибка GTK: {}", e))?
    } else {
        // На Windows/Mac все просто
        get_file_icon(source_path, icon_size).map_err(|e| format!("Ошибка иконки: {}", e))?
    };

    // --- СОХРАНЕНИЕ ---

    let rgba_image = RgbaImage::from_raw(icon_data.width, icon_data.height, icon_data.pixels)
        .ok_or("Ошибка буфера пикселей (неверный размер)")?;

    image::DynamicImage::ImageRgba8(rgba_image)
        .save(&icon_save_path)
        .map_err(|e| format!("Ошибка записи файла: {}", e))?;

    Ok(AppDetails {
        app_name,
        icon_path: icon_save_path.to_string_lossy().to_string(),
    })
}
#[tauri::command]
pub fn get_all_apps() -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT * FROM apps")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}
// let mut notes = Vec::new();
//     for note in notes_iter {
//         notes.push(note.map_err(|e| e.to_string())?);
//     }
//     Ok(notes)
// }

//icon_id,path, hotkey , folder_grub_id,folder_id)
#[tauri::command]
pub fn update_app(
    title: String,
    path: String,
    icon_path: String,
    hotkey: String,
    app_category_id: Option<i64>,
    globol_category_id: Option<i64>,
    workspace_id: i64,
    app_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE apps SET title = ?, path = ?, icon_path=?,  hotkey = ? , app_category_id= ? , globol_category_id=?, workspace_id=? WHERE id = ?",
            params![title, path,icon_path,  hotkey, app_category_id,globol_category_id,workspace_id,  app_id ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn delete_app(app_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM apps WHERE id = ?", params![app_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn get_appsByID(app_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT *  FROM apps WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![app_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn get_all_appsByGrub_id(grub_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM apps WHERE app_category_id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![grub_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn get_all_appsBy_global_category_id(category_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM apps WHERE globol_category_id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![category_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn get_all_appsBy_workspace_id(workspace_id: i64) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT * FROM apps WHERE workspace_id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![workspace_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                icon_path: row.get(3)?,
                hotkey: row.get(4)?,
                app_category_id: row.get(5)?,
                globol_category_id: row.get(6)?,
                workspace_id: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn update_grub_app__by_app_id(app_category_id: i64, app_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE apps SET app_category_id=?  WHERE id = ?",
            params![app_category_id, app_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn update_workspace__app___by_workspace_id(
    workspace_id: i64,
    app_id: i64,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE apps SET workspace_id=?  WHERE id = ?",
            params![workspace_id, app_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn update_icon_by_app_id(icon_path: String, app_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute(
            "UPDATE apps SET icon_path=?  WHERE id = ?",
            params![icon_path, app_id],
        )
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

// pub fn get_icon_bytes(path: &str) -> Result<Vec<u8>, String> {
//     #[cfg(target_os = "windows")]
//     let bytes = get_windows_icon(path)?;

//     #[cfg(target_os = "macos")]
//     let bytes = get_mac_icon(path)?;

//     #[cfg(target_os = "linux")]
//     let bytes = get_linux_icon(path)?;

//     Ok(bytes)
// }
