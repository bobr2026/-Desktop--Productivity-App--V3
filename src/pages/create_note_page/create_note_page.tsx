import { type_page_enum } from "../../App/store/global_store.types";
import { NoteForm } from "../../features/note/noteForm";
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils";

export function Create_note_page(){
    active_page_hendler(type_page_enum.create_note, 'create_note_page', "create_note"    )
    return <NoteForm noteId={undefined}/>
}