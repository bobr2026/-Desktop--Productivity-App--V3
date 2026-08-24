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
export interface Post {
    post_id: number;
    note_id: number;
    title: string;
    position_in_the_note: number;
}

export interface Paragraph {
    paragraph_id: number;
    post_id: number;
    content: string;
    culomm: number;
    row: number;
    style_id: number | null;
}

export interface ParagraphStyle {
    Paragraph_styles_id: number;
    font_size: string | null;
    color: string | null;
    background: string | null;
    font_weight: string | null;
    text_decoration: string | null;
    text_align: string | null;
    extra_styles: string | null;
}