import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { invoke } from "@tauri-apps/api/core"
import { I_folder } from "../../../shared/types"
import { folder_list_ctore_type } from "../../../App/store/global_store.types"


export const get_all_foldersBy_workspace_id= createAsyncThunk("folders_list/get_all_foldersBy_workspace_id", async(grubId:number)=>{
    const folders:I_folder[]= await invoke("get_all_foldersBy_workspaceId", {workspaceId:grubId})
    console.log("get_all_folderBy_workspace_id "+folders)
    return folders
 
 })

 const initialState:folder_list_ctore_type={
folders:[]
 }
 const folders_list_slise= createSlice({
    name:"folders_list",
 initialState:initialState,
 reducers:{
    add_folder( state ,action:PayloadAction<I_folder>, ){
        state.folders.push(action.payload)
    },
    delete_folder(state, action:PayloadAction<number>){
        state.folders = state.folders.filter(
            folder => folder.id !== action.payload
          )
    },
    update_folder:(state, action:PayloadAction<I_folder>)=>{
        state.folders.forEach(folder=>{
            if(folder.id==action.payload.id){
                folder =action.payload
            }
            
        })
    },


 },
 extraReducers(builder) {

    //get_all_foldersBy_workspace_id
    builder.addCase(get_all_foldersBy_workspace_id.pending, state=>{

    }),
    builder.addCase(get_all_foldersBy_workspace_id.fulfilled, (state, action:PayloadAction<I_folder[]>)=>{
        state.folders=action.payload
       
    }),
    builder.addCase(get_all_foldersBy_workspace_id.rejected, state=>{

    }) 
 }
})
export const { add_folder, delete_folder, update_folder,} = folders_list_slise.actions

export default folders_list_slise.reducer