use rusqlite::{params, Connection, Result};

use super::entrys::Paragraph_styles;
use crate::servises::get_db_path;

#[tauri::command]
pub fn add_Paragraph_styles(
    font_size: Option<String>,
    color: Option<String>,
    background: Option<String>,
    font_weight: Option<String>,
    text_decoration: Option<String>,
    text_align: Option<String>,
    extra_styles: Option<String>,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO Paragraph (font_size, color, background, font_weight,
         text_decoration, text_align, extra_styles) VALUES (?, ?, ?, ?, ?, ?, ?)",
        params![
            font_size,
            color,
            background,
            font_weight,
            text_decoration,
            text_align,
            extra_styles
        ],
    )
    .map_err(|e| e.to_string())?;
    println!("paragraph added");
    Ok(())
}
#[tauri::command]
pub fn get_paragraph_style_by_id(style_id: i64) -> Result<Paragraph_styles, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT Paragraph_styles_id, font_size, color, background, font_weight, text_decoration, text_align, extra_styles 
                  FROM Paragraph_styles WHERE Paragraph_styles_id = ?")
        .map_err(|e| e.to_string())?;

    let style = stmt
        .query_row(params![style_id], |row| {
            Ok(Paragraph_styles {
                Paragraph_styles_id: row.get(0)?,
                font_size: row.get(1)?,
                color: row.get(2)?,
                background: row.get(3)?,
                font_weight: row.get(4)?,
                text_decoration: row.get(5)?,
                text_align: row.get(6)?,
                extra_styles: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(style)
}

// Обновление типографики (размер и толщина шрифта)
#[tauri::command]
pub fn update_style_font(
    style_id: i64,
    font_size: Option<String>,
    font_weight: Option<String>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn.execute(
        "UPDATE Paragraph_styles SET font_size = ?, font_weight = ? WHERE Paragraph_styles_id = ?",
        params![font_size, font_weight, style_id],
    ).map_err(|e| e.to_string())?;

    Ok(changes)
}

// Обновление цветовой схемы (текст и фон)
#[tauri::command]
pub fn update_style_colors(
    style_id: i64,
    color: Option<String>,
    background: Option<String>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE Paragraph_styles SET color = ?, background = ? WHERE Paragraph_styles_id = ?",
            params![color, background, style_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

// Обновление форматирования (выравнивание и декорации)
#[tauri::command]
pub fn update_style_formatting(
    style_id: i64,
    text_decoration: Option<String>,
    text_align: Option<String>,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn.execute(
        "UPDATE Paragraph_styles SET text_decoration = ?, text_align = ? WHERE Paragraph_styles_id = ?",
        params![text_decoration, text_align, style_id],
    ).map_err(|e| e.to_string())?;

    Ok(changes)
}

// Обновление дополнительных (кастомных) стилей
#[tauri::command]
pub fn update_style_extra(style_id: i64, extra_styles: Option<String>) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "UPDATE Paragraph_styles SET extra_styles = ? WHERE Paragraph_styles_id = ?",
            params![extra_styles, style_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}
#[tauri::command]
pub fn delete_paragraph_style(style_id: i64) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    let changes = conn
        .execute(
            "DELETE FROM Paragraph_styles WHERE Paragraph_styles_id = ?",
            params![style_id],
        )
        .map_err(|e| e.to_string())?;

    Ok(changes)
}

#[tauri::command]
pub fn get_count_paragraph_style() -> Result<i64, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM Paragraph_styles",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(count)
}