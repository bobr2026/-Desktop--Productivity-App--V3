
import { Paragraph } from "../../../../shared/types";
import styles from '../../note_form.module.sass'
import { paragraphContentChanged, paragraphFocused, paragraphRemoved, postRemoved } from "../../store/noteFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../App/store/store";
import TextareaAutosize from "react-textarea-autosize";
import { deleteParagraph, updateContentParagraph } from "../../model/paragrah.model";
import { useEffect, useRef } from "react";
import { global_store_type } from "../../../../App/store/global_store.types";
import { set_context_munu_point } from "../../../../App/store/context_munu_slise";
import { setOpenedContextMenu } from "../../../tasks/store/task_list_ui_store";
import Context_menu from "../../../../shared/ui/context_munu/context_munu";
import { deletePostInNote } from "../../model/post.model";

interface ParagrahProps{
    paragraph_data:Paragraph
    noteId:number
}
export function Paragrah({paragraph_data, noteId}:ParagrahProps){
    const context_munu_items= [
            {
                label: "Удалить абзац",
                onClick: async() => {
                    dispatch(
                        paragraphRemoved(paragraph_data.paragraph_id))
                        
                       await deleteParagraph(paragraph_data.paragraph_id, paragraph_data.post_id)
                }
            },
            {
                label: "Удалить пост",
                onClick: async() => {
                    dispatch(
                        postRemoved(paragraph_data.post_id))
                        
                       await deletePostInNote(paragraph_data.post_id, noteId)
                }
            }
        ]
    const dispatch = useDispatch<AppDispatch>()
    const{contextMenuX, contextMenuY, openedContextMenuId} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
  
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(()=>{
     const id=  setInterval(()=>{
            async function fn() {
                await updateContentParagraph(paragraph_data.content, paragraph_data.paragraph_id)
            
            }
            fn()
        }, 500)
     clearInterval(id)
     
}, [paragraph_data.content])

  return     <div className={styles.paragrah}    onContextMenu={(e: React.MouseEvent) => {
              e.stopPropagation()
                          e.preventDefault()
          
                          dispatch(
                              setOpenedContextMenu(
                                  openedContextMenuId === paragraph_data.paragraph_id ? null : paragraph_data.paragraph_id 
                              )
                          )
                          dispatch(set_context_munu_point("reset"))
                          dispatch(set_context_munu_point({x:e.clientX, y:e.clientY}))
          
                         
                      }} >
                    <TextareaAutosize 
                      className={styles.textarea}
                      value={paragraph_data.content}
                      onFocus={() => dispatch(paragraphFocused(paragraph_data.paragraph_id))}
                      onChange={(e) =>{
                        // set_paragrah_content(e.target.value)
                        dispatch(
                          paragraphContentChanged({
                            paragraph_id: paragraph_data.paragraph_id,
                            content: e.target.value,
                          })
                        )
                      }
                    }
                      onBlur={async() => { 
                        console.log("onBlur")
                        await updateContentParagraph(paragraph_data.content, paragraph_data.paragraph_id)}}
                    />
                      <Context_menu open={openedContextMenuId==paragraph_data.paragraph_id} x={contextMenuX} y={contextMenuY} items={context_munu_items}/>
                  </div>
                
            

}