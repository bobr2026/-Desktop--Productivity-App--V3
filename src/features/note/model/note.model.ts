import { invoke } from "@tauri-apps/api/core";
import { i_note, marksTask, statusTask } from "../../../shared/types";

export async function delete_note_from_db (npte_id:number){
    await invoke("delete_note", {noteId:npte_id})
}
export async function add_note(title:string, note_category_id:number|null, status:statusTask, marks:marksTask|null,
     globol_category_id:null|number, workspace_id:number) {
    await invoke("add_note", {
        title:title,
        noteCategoryId:note_category_id, 
        status:status,
        marks:marks,
        globolCategoryId:globol_category_id,
        workspaceId:workspace_id

    })
}
export async function get_noteByID(note_id:number) {
  const notes:i_note[] =  await invoke("get_noteByID",{noteId:note_id} )
  return notes[0]
}
export async function update_grub_notes___by_grub_id(note_category_id:number, note_id:number) {
    await invoke("update_grub_notes___by_grub_id", {categoryId:note_category_id, noteId:note_id})
}
export async function update_status_note___by_note_id(status:statusTask, note_id:number) {
    await invoke("update_status_note___by_note_id", {status:status,noteId:note_id})
}
export async function update_category_note___by_note_id(note_category_id:number, note_id:number) {
    await invoke("update_category_note___by_note_id",{noteCategoryId:note_category_id, noteId:note_id })
}
export async function update_workspace__note___by_workspace_id(workspace_id:number, note_id:number) {
    await invoke("update_workspace__note___by_workspace_id", {
        workspaceId:workspace_id,
        noteId:note_id
        })
}