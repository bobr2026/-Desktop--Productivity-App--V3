use crate::servises::get_db_path;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
#[derive(Serialize, Debug)]
pub struct Note {
    pub note_id: i64,
    pub title: String,
    pub note_category_id: Option<i64>,
    pub status: String,
    pub marks: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub globol_category_id: Option<i64>,
    pub workspace_id: i64,
}
#[derive(Serialize, Debug)]
pub struct post {
    pub post_id: i64,
    pub note_id: i64,
    pub title: String,
    pub position_in_the_note: i64,
}
#[derive(Serialize, Debug)]
pub struct Paragraph {
    pub paragraph_id: i64,
    pub post_id: i64,
    pub content: String,
    pub culomm: i64,
    pub row: i64,
    pub style_id: Option<i64>,
}
#[derive(Serialize, Debug)]
pub struct Paragraph_styles {
    pub Paragraph_styles_id: i64,
    pub font_size: Option<String>,
    pub color: Option<String>,
    pub background: Option<String>,
    pub font_weight: Option<String>,
    pub text_decoration: Option<String>,
    pub text_align: Option<String>,
    pub extra_styles: Option<String>,
}

#[derive(Serialize, Debug)]
pub struct post_files {
    pub file_id: i64,
    pub post_id: i64,
    pub file_type: String,
    pub file_path: String,
    pub row: Option<i64>,
    pub col: Option<i64>,
}
#[derive(Serialize, Debug)]
pub struct Links {
    pub link_id: i64,
    pub source_type: String,
    pub source_id: i64,
    pub target_type: String,
    pub target_id: i64,
    pub link_type: String,
    pub created_at: String,
}
#[derive(Serialize, Debug)]
pub struct categories_notes {
    pub id: i64,
    pub name: String,
    pub color: Option<String>,
    pub parent_id: Option<i64>,
     pub workspace_id: i64,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct external_post_elements {
    pub id: i64,
    pub post_id: i64,
    pub app_id: Option<i64>,
    pub folder_id: Option<i64>,
    pub row: Option<i64>,
    pub col: Option<i64>,
}
#[derive(Serialize, Deserialize)]
#[serde(tag = "type", content = "id")]
pub enum ExternalTarget {
    App(i64),
    Folder(i64),
}
