export enum select_types_category_enum{
"categories_folders"="categories_folders",
"categories_apps"="categories_apps", 
"categories_tasks"="categories_tasks",
"globol_categorys"="globol_categorys",
"categories_notes"="categories_notes"

}
 export type types_categorys_table_db = "categories_folder"|"categories_app"|"categories_task"
 |"globol_category"|"categories"
export type types_create_category_table_db="create_global_category"|"add_Category_note"|"create_app_category"
|"create_folder_category"|"create_task_category"

export type types_update_category_table_db='update_category_info'|'update_task_category'|"update_folder_category"
|"update_global_category"|"update_app_category"