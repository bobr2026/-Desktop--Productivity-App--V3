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
export  const STATUS_COLORS: Record<string, string> = {
    'not completed': 'red',
    'completed': 'green', // Исправил опечатку: 'gren' -> 'green'
    'in work': '#FF6200',
    "postponed": "#EAB308",  
}