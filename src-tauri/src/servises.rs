use dirs_next::home_dir;
use std::path::PathBuf;

use std::fs;
use std::path::Path;
use tauri::{AppHandle, Manager};

pub fn get_db_path() -> Option<PathBuf> {
    // Получаем домашний каталог
    let home = home_dir()?;

    // Создаем путь к папке "Admin-app"
    let mut dir_path = home.clone();
    dir_path.push("Admin-app");

    // Создаем папку, если ее нет
    // Обработка ошибок: если не удалось создать, возвращаем None или обработать иначе
    if let Err(e) = fs::create_dir_all(&dir_path) {
        eprintln!("Ошибка при создании папки: {}", e);
        return None;
    }

    // Добавляем название файла базы данных
    dir_path.push("my_db_noteBook.db");

    Some(dir_path)
}

use std::process::Command;

#[tauri::command]
pub fn open_app(app_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    use std::process::Command;

    Command::new("cmd")
        .args(&["/C", "start", "", &app_path])
        .spawn()
        .map_err(|e| e.to_string())?;
    {
        // Command::new("start")
        //     .arg(&app_path)
        //     .spawn()
        //     .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        Command::new(app_path).spawn().map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new(app_path).spawn().map_err(|e| e.to_string())?;
    }
    Ok(())
}
#[tauri::command]
pub fn open_folder(folder_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
