use crate::servises::get_db_path;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};




#[derive(Serialize, Debug)]
pub struct categories_folders {
    pub id: i64,
    pub name: String,
    pub color: Option<String>,
    pub parent_id: Option<i64>,
     pub workspace_id: i64,
}
#[derive(Serialize, Debug)]
pub struct folder_icons {
    pub icon_id: i64,
    pub folder_id: Option<i64>,
    pub icon_path: String,
}
#[derive(Serialize, Debug)]
pub struct Folder {
    pub id: i64,
    pub icon_id: i64,
    pub path: String,
    pub title: String,
    pub hotkey: Option<String>,
    pub folder_category_id: Option<i64>,
    pub globol_category_id: Option<i64>,
     pub workspace_id: i64,
}
