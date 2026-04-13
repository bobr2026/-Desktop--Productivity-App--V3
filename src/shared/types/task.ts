export type marksTask = "Important"|"Urgently"|"Attention" //Важно /Срочно/Внимание
export type statusTask = "not completed"|"completed"|"in work"|"postponed"

export type i_ceate_task_data={
    title:string,
       status:statusTask,
       marks:null|marksTask,
       parentId:null|number
       taskCategoryId:null|number
       workspaceId:number
   
   }
//    pub struct task {
//     pub task_id: i64,
//     pub marks: Option<String>,
//     pub status: String,
//     pub parent_id: Option<i64>,
//     pub title: String,
//     pub task_category_id: Option<i64>,
//     pub workspace_id: i64,
// }
export interface i_task{
    task_id:number
    marks:marksTask|null
    status:statusTask
    parent_id:number|null
    title:string
    task_category_id:number|null
    workspace_id:number




}