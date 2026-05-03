import { marksTask, statusTask } from "./task"


export interface i_note{
    note_id:number
    title:string
    note_category_id:number|null
    status:statusTask
    marks:marksTask|null
    created_at:string
    updated_at:string
    globol_category_id:number|null
    workspace_id:number

}