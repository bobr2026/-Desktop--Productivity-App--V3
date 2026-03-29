use serde::Serialize;


#[derive(Serialize, Debug)]
pub struct workspace {
    pub workspace_id: i64,
    pub name: String,
    pub color: Option<String>,
}
