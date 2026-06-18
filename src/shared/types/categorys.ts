export interface I_ginerik_category{
id:number,
name:string,
color:string|null
parent_id:number|null,
workspace_id:number


}
export type Category_list_data_types ="app"|"note"|"folder"|"task"|"workspase"
export type filtered_categorys="app"|"note"|"folder"|"task"