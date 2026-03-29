// CREATE TABLE  IF NOT EXISTS globol_categorys (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//        color TEXT NULL,
//     parent_id INTEGER NULL,
//     workspace_id INTEGER NOT NULL
//       FOREIGN KEY (workspace_id) REFERENCES workspace(workspace_id)  ON DELETE CASCADE
//     FOREIGN KEY (parent_id) REFERENCES categories_folders(id) ON DELETE CASCADE
// );

use serde::Serialize;


#[derive(Serialize, Debug)]
pub struct globol_categorys{
   pub id:i64,
   pub name:String,
   pub color:Option<String>,
   pub parent_id:Option<i64>,
   pub workspace_id:i64,



}

#[derive(Serialize, Debug)]
pub struct AppCategory {
    pub name: String,
    pub color: Option<String>,          // если цвет хранится как hex-строка
}