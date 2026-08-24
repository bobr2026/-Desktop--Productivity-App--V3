interface note_form_slice_store{
    note_id:number
    active_post:{
        title:string
        position_in_the_note:number
        post_id:number
    }
    last_post:number
    active_paragraph:{
        paragraph_id:number
        post_id:number
        content:string
        culomm:number
        row:number
        style_id:number|null
    
    }
    last_paragrah:number
    active_paragrah_styles:{
        Paragraph_styles_id:number
        font_size:string|null
        color:string|null
        background:string|null
        font_weight:string|null
        text_decoration:string|null
        text_align:string|null
        extra_styles:string|null

    }
}

interface note_form_slice_store2{
    active_paragrah_id:number
    active_paragrah_styles_id:number
    active_post_id:number
    note_id:number
    posts:Post[]
    paragraph:Paragraph[]
    paragraphStyles:ParagraphStyle[]
}
