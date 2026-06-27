import { type_page_enum } from "../../App/store/global_store.types"
import { Note_list } from "../../features/note/note_list"
import { active_page_hendler } from "../../shared/utils/active_page_hendler.utils"

export default function Notes_list_page(){
      active_page_hendler(type_page_enum.notes_list,  "/notes_list", "notes_list")
    return <Note_list/>
}