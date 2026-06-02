
use serde::Serialize;
#[derive(Serialize, Debug)]
pub struct categories_task {
    pub id: i64,
    pub name: String,
    pub color: Option<String>,
    pub parent_id: Option<i64>,
    pub workspace_id: i64,
}
#[derive(Serialize, Debug)]
pub struct task {
    pub task_id: i64,
    pub marks: Option<String>,
    pub status: String,
    pub parent_id: Option<i64>,
    pub title: String,
    pub task_category_id: Option<i64>,
    pub workspace_id: i64,
}

#[derive(Serialize, Debug)]
pub struct ElementLink {
    pub link_id: i64,
    pub perent_element_id: i64,
    pub sub_element_id: i64,
    pub swoh_type: String,
}
#[derive(Serialize, Debug)]
pub struct sub_elements {

    pub sub_element_id: i64,

}
