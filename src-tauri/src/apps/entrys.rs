use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct App {
    pub id: i64,
    pub title: String,
    pub path: String,
    pub icon_path: String,
    pub hotkey: Option<String>,
    pub app_category_id: Option<i64>,
    pub globol_category_id: Option<i64>,
    pub workspace_id: i64,
}
#[derive(Serialize)]
pub struct categories_apps {
    pub id: i64,
    pub name: String,
    pub color: Option<String>,
    pub parent_id: Option<i64>,
    pub workspace_id: i64,
}
#[derive(Serialize)]            // ← обязательно для Tauri
pub struct AppCategory {
    pub name: String,
    pub color: Option<String>,          // если цвет хранится как hex-строка
}