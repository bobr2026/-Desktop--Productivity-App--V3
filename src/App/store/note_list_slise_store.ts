import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { invoke } from "@tauri-apps/api/core"
import { i_note } from "../../shared/types"
import {  note_list_store_type } from "./global_store.types"


// export const get_all_notesBy_workspace_id= createAsyncThunk("notes_list/get_all_notesBy_workspace_id", async(grubId:number)=>{
//     const notes:i_note[]= await invoke("get_all_notesByWorkspace_id", {workspaceId:grubId})
//     console.log("get_all_noteBy_workspace_id "+notes)
//     console.log("notes louding")
//     console.log(notes)
//     return notes
 
//  })
 export const get_all_notesBy_workspace_id = createAsyncThunk(
    "notes_list/get_all_notesBy_workspace_id", 
    async (grubId: number, { rejectWithValue }) => {
      try {
        // Tauri автоматически конвертирует camelCase (workspaceId) в snake_case (workspace_id)
        const notes: i_note[] = await invoke("get_all_notesByWorkspace_id", { workspaceId: grubId });
        
        console.log("Заметки загружены:", notes);
        return notes;
      } catch (error) {
        // Если Rust вернет Err(e.to_string()), оно упадет сюда
        console.error("Ошибка Tauri/Rust:", error);
        return rejectWithValue(error);
      }
    }
  );

 const initialState:note_list_store_type={
notes:[]
 }
 const notes_list_slise= createSlice({
    name:"notes_list",
 initialState:initialState,
 reducers:{
    add_note( state ,action:PayloadAction<i_note>, ){
        state.notes.push(action.payload)
    },
    delete_note(state, action:PayloadAction<number>){
        state.notes = state.notes.filter(
            note => note.note_id !== action.payload
          )
    },
    update_note:(state, action:PayloadAction<i_note>)=>{
        state.notes.forEach(note=>{
            if(note.note_id==action.payload.note_id){
                note =action.payload
            }
            
        })
    },


 },
 extraReducers(builder) {

    //get_all_notesBy_workspace_id
    builder.addCase(get_all_notesBy_workspace_id.pending, state=>{

    }),
    builder.addCase(get_all_notesBy_workspace_id.fulfilled, (state, action:PayloadAction<i_note[]>)=>{
        state.notes=action.payload
       
    }),
    builder.addCase(get_all_notesBy_workspace_id.rejected, state=>{

    }) 
 }
})
export const { add_note, delete_note, update_note,} = notes_list_slise.actions

export default notes_list_slise.reducer