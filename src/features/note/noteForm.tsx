import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '../../App/store/store'
import { i_active_btn, I_ginerik_category, i_note, marksTask, Paragraph, ParagraphStyle, Post, statusTask } from '../../shared/types'
import AutoGrowTextarea from '../../shared/ui/AutoGrowTextarea/AutoGrowTextarea'
import Base_button from '../../shared/ui/base_buttom/base_button'
import Marks_button from '../../shared/ui/mrks_button/mrks_button'
import styles from './note_form.module.sass'
import { noteOpened, paragraphAdded, paragraphContentChanged, paragraphFocused, postAdded, postSelected, postsSelectors, selectParagraphsGroupedByPost, selectParagraphsOfActivePost, update_Post_Title } from './store/noteFormSlice'
import Toolbar from './ui/Toolbar/toolbar'
import { TitleIputBlock } from './widgets/TitleIputBlock/TitleIputBlock'
import { invoke } from '@tauri-apps/api/core'
import { createPostInNote, getAllPostsByNoteId, updatePostInNote, updatePostTitle } from './model/post.model'
import { getAllParagraphByPostId, updateContentParagraph } from './model/paragrah.model'
import { ChangeEvent, useEffect, useState } from 'react'
import { getParagraphStyleById } from './model/paragrahStyles.model'
import { kill } from 'node:process'
import { add_note, get_noteByID, get_notes_count } from './model/note.model'
import { Await } from 'react-router-dom'
import { Paragrah } from './widgets/paragrah/paragrah'
import useGet_active_worspase_from_localStore from '../../shared/hooks/useGet_active_worspase_from_localStore'
import { getNoteCategoriesByWorkspace } from '../categorys/model/category.model'
interface note_form_propos {
    noteId: string | undefined
}

// title: String,
// note_category_id: Option<i64>,
// status: String,
// marks: Option<String>,
// globol_category_id: Option<i64>,
// workspace_id: i64,

export async function get_all_post_and_Paragraph(note_id: number) {
    const posts: Post[] = await getAllPostsByNoteId(note_id);

    const out_paragraphs: Paragraph[] = [];
    const out_paragraphStyles: ParagraphStyle[] = [];

    // Promise.all + await — функция реально ждёт, пока все посты
    // и все параграфы внутри них будут обработаны, прежде чем return
    await Promise.all(
        posts.map(async (post) => {
            const paragraphs: Paragraph[] = await getAllParagraphByPostId(post.post_id);
            out_paragraphs.push(...paragraphs);

            // итерируемся по paragraphs (параграфы ЭТОГО поста),
            // а не по out_paragraphs (накопленные за все посты) —
            // иначе стили пересчитываются повторно на каждом следующем посте
            await Promise.all(
                paragraphs.map(async (paragraph) => {
                    if (paragraph.style_id != null) {
                        const style: ParagraphStyle = await getParagraphStyleById(paragraph.style_id);
                        out_paragraphStyles.push(style);
                    }
                })
            );
        })
    );

    return { posts, out_paragraphs, out_paragraphStyles };
}

export async function get_all_post_and_Paragraph1(note_id: number) {
    const posts: Post[] = await getAllPostsByNoteId(note_id)
    let out_paragraphs: Paragraph[] = []
    let out_paragraphStyles: ParagraphStyle[] = []
    posts.map(async (post) => {
        const paragraphs: Paragraph[] = await getAllParagraphByPostId(post.post_id)
        console.log(paragraphs)
        out_paragraphs.push(...paragraphs)
        console.log(out_paragraphs)
        out_paragraphs.map(async (paragrah) => {
            if (paragrah.style_id != null) {
                const style: ParagraphStyle = await getParagraphStyleById(paragrah.style_id)
                out_paragraphStyles.push(style)

            }

        })

    })
    return { posts, out_paragraphs, out_paragraphStyles }
}
interface note_data{
    title:string
    note_category_id:number|'null'
    status:statusTask
    marks:null|marksTask
    globol_category_id:null|number
    workspace_id:number

}
export function NoteForm({ noteId }: note_form_propos) {
       const [active_btn, set_active_btn]= useState<i_active_btn>({
            btn_id:0,
            active:false
        })
const [noteData, setMoteData]= useState<note_data>({
    title:"",
    note_category_id:'null',
    marks:"NO",
    status:"not completed",
    globol_category_id:null,
    workspace_id: useGet_active_worspase_from_localStore().workspace_id
})
const [cotegory_notes_arr, set_cotegory_notes_arr]= useState<I_ginerik_category[]>([])
//   const hendelChenge=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
//         const { value , name, type} = e.target 
     
//         setMoteData((prev)=>({
//             ...prev,
//              [name]:value

//         }))
//     }
const hendelChenge = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
  
    setMoteData((prev) => {
      let newValue: string | number | null = value;
  
      // Специальная обработка для note_category_id
      if (name === 'note_category_id') {
        newValue = value === 'null' || value === '' ? null : Number(value);
      }
  
      // Если есть другие поля number | null — добавь аналогично
      // if (name === 'globol_category_id') {
      //   newValue = value === 'null' || value === '' ? null : Number(value);
      // }
  
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };
    const [new_note_id, set_new_note_id] = useState(0)
    useEffect(() => {
        if (noteId == undefined) {
            async function get() {
                const count_note = await get_notes_count()
                set_new_note_id(count_note + 1)
                dispatch(noteOpened({ noteId: new_note_id, posts: [], paragraphs: [], paragraphStyles: [] }))
                await add_note(`New note ${new_note_id}`, null, 'not completed', 'NO', null , noteData.workspace_id)
                
            }
            get()
        } else {
            async function get_data(noteId: string) {

                const { posts, out_paragraphs, out_paragraphStyles } = await get_all_post_and_Paragraph(parseInt(noteId))
                dispatch(noteOpened({ noteId: parseInt(noteId), posts: posts, paragraphs: out_paragraphs, paragraphStyles: out_paragraphStyles }))
                console.log({ posts, out_paragraphs, out_paragraphStyles })
                set_new_note_id(parseInt(noteId))
               const note_data:i_note = await get_noteByID(parseInt(noteId))
               setMoteData((prev)=>({
                ...prev,
                title:note_data.title
               }))
                const note_categorys_arr:I_ginerik_category[]= await getNoteCategoriesByWorkspace(noteData.workspace_id)
                set_cotegory_notes_arr(note_categorys_arr)
            }
            get_data(noteId)

        }
    }, [noteId])
    const dispatch = useDispatch<AppDispatch>()
    const posts = useAppSelector(postsSelectors.selectAll);
    console.log("+=======================")
    console.log(posts)
    const activePostId = useAppSelector((state) => state.noteForm.activePostId);
    const paragraphsOfActivePost = useAppSelector(selectParagraphsOfActivePost);
    const paragraphsByPost = useAppSelector(selectParagraphsGroupedByPost);
    console.log(paragraphsOfActivePost)
    const addParagraph = (postId: number, row: number) => async (dispatch: AppDispatch) => {
        const newParagraph = await invoke<Paragraph>('add_Paragraph', {
            postId,
            row: Math.floor(Math.random() * 10),
            culomm: Math.floor(Math.random() * 10),
            content: '',
            style_id: null
        });
        dispatch(paragraphAdded(newParagraph));
    };
    console.log(cotegory_notes_arr)
    const handleAddParagraph = (postId: number) => {
        // const nextRow = paragraphsOfActivePost.length; // упрощённо, для MVP ок
        // dispatch(addParagraph(postId, nextRow));
        const nextRow = (paragraphsByPost[postId] ?? []).length;
        dispatch(addParagraph(postId, nextRow));
    };
    const select_marks=(mark_type:marksTask)=>{
        setMoteData((prev)=>({
            ...prev,
            marks:mark_type
        }))
    }
    const set_active_btn_fn=(id:number)=>{
        set_active_btn({active:active_btn.active==false?true:false, btn_id:id})
    }

    return <div className={styles.note_form__main_block}>
        <div className={styles.note_form__header}>
            <TitleIputBlock button_title='Новый пост' button_click={async () => {
                const post: Post = await createPostInNote(new_note_id, "test", 0)
                dispatch(postAdded(post))
            }}  input_value={noteData.title}                   onChengeHendler={async(e)=>{
                setMoteData((prev)=>({
                    ...prev,
                    title:e.target.value
                   }))
             }}/>
            <div className={styles.note_form__header_marksAndStatusBlock}>
                <div className={styles.note_form__header_marksBtn}>
                 
                        <Marks_button mark_type='Attention' click={()=>{select_marks('Attention'),set_active_btn_fn(1) }} 
                         active={active_btn.btn_id==1?true:false}/>
                        <Marks_button mark_type='Important' click={()=>{select_marks('Important'), set_active_btn_fn(2)}} active={active_btn.btn_id==2?true:false}/>
                        <Marks_button mark_type='Urgently' click={()=>{select_marks('Urgently'), set_active_btn_fn(3)}}  active={active_btn.btn_id==3?true:false} />
                    <Marks_button mark_type='NO' click={() => {select_marks("NO"), set_active_btn_fn(4)}} active={active_btn.btn_id==1?true:false} />
                    {/* <button   onMouseEnter={() => console.log("div hover")}>678686</button> */}
                    {/* <Marks_button mark_type='NO' click={()=>null}/> */}
                </div>
                {/* "not completed"|"completed"|"in work"|"postponed" */}
                <select name="status" id="" onChange={hendelChenge} value={noteData.status} >
                    <option value="not completed">НЕ ВЫПОНЕНО</option>
                    <option value="completed">ВЫПОНЕНО</option>
                    <option value="postponed">ОТЛОЖЕННО</option>
                    <option value="in work">В РАБОТЕ</option>
                </select>
                <select name="note_category_id" onChange={hendelChenge} value={noteData.note_category_id??'null'} id="">
                    <option value='null'>НЕ Выбран</option>
                 {cotegory_notes_arr.map((category)=>{
                    return <option value={category.id}>{category.name}</option>
                 })}
                </select>
            </div>
         
            
         
                <Base_button >сохранить</Base_button>
        </div>

        {noteId === undefined && posts.length == 0 ? (
            <h1>начнем работу</h1>
        ) : (
            <div className={styles.note_form__content}>
                {posts.map((post: Post) => (
                    <div
                        key={post.post_id}
                        className={styles.note_post}
                        onClick={() => dispatch(postSelected(post.post_id))}
                    >
                        <TitleIputBlock
                            input_value={post.title}
                            onChengeHendler={async(e)=>{
dispatch(update_Post_Title({post_id:post.post_id, title:e.target.value}))
await updatePostTitle(e.target.value, post.post_id, new_note_id)
                            }}
                            button_title="Новый абзац"
                            button_click={() => handleAddParagraph(post.post_id)}
                        />

                        {(paragraphsByPost[post.post_id] ?? []).map((paragraph) => (

                            <Paragrah paragraph_data={paragraph} noteId={new_note_id} />

                        ))}

                    </div>
                ))}

                <Toolbar />
            </div>
        )
    }
    </div>
}