import { useParams } from "react-router-dom";
import { type_page_enum } from "../../App/store/global_store.types";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";
import { NoteForm } from "../../features/note/noteForm";

export function Edit_note_page(){
    const { noteId } = useParams<{ noteId: string }>();
    const currentPath = `/edit_note_page/${noteId}`;
 active_page_hendler(type_page_enum.edit_note, currentPath, `edit_note`)
 return <NoteForm  noteId={noteId}/>
}