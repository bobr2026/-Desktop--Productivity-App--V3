import { createAsyncThunk , createSlice, type PayloadAction, } from "@reduxjs/toolkit"
import { I_categorys_store, i_globol_categorys, } from "./global_store.types"
import { invoke } from "@tauri-apps/api/core"
import { I_workspace_types } from "../../shared/types"

const initialState:I_categorys_store={
    worspases:[],
    global_categorys:[],
    active_worspase:null
}

export const get_all_global_category_by_workspace= createAsyncThunk("global_categorys_slise/get_all_global_category_by_workspace", async(workspaceId:number)=>{
    const folders:i_globol_categorys[]= await invoke("get_global_category_by_workspace" , {workspaceId:workspaceId})
    return folders
 
 })
 export const get_all_workspaces= createAsyncThunk("global_categorys_slise/get_all_workspaces", async()=>{
    const folders:I_workspace_types[]= await invoke("get_all_workspaces")
    return folders
 
 })
const global_categorys_slise= createSlice({
    name:"global_categorys",
    initialState:initialState, 
    reducers:{
 set_active_workspase(state, action:PayloadAction<I_workspace_types>){
state.active_worspase=action.payload
console.log(`global_category_slise: fn set_active_workspase: ${state.active_worspase.name} `)
if(state.active_worspase!=null){
    localStorage.removeItem("active_workspase");
}
localStorage.setItem("active_workspase", JSON.stringify(action.payload));
 },

  add_workspase( state ,action:PayloadAction<I_workspace_types>, ){
         state.worspases.push(action.payload)
     },
 delete_workspase(state, action:PayloadAction<number>){
         state.worspases = state.worspases.filter(
             app => app.workspace_id!== action.payload
           )
     },
     update_workspase:(state, action:PayloadAction<I_workspace_types>)=>{
         state.worspases.forEach(folder=>{
             if(folder.workspace_id==action.payload.workspace_id){
                 folder =action.payload
             }
             
         })
     },

     add_global_category( state ,action:PayloadAction<i_globol_categorys>, ){
        state.global_categorys.push(action.payload)
    },
delete_global_category(state, action:PayloadAction<number>){
        state.global_categorys = state.global_categorys.filter(
            app => app.id !== action.payload
          )
    },
    update_global_category:(state, action:PayloadAction<i_globol_categorys>)=>{
        state.global_categorys.forEach(folder=>{
            if(folder.id==action.payload.id){
                folder =action.payload
            }
            
        })
    }
    },
    extraReducers(builder) {
         builder.addCase(get_all_workspaces.pending, state=>{
        
            }),
            builder.addCase(get_all_workspaces.fulfilled, (state, action:PayloadAction<I_workspace_types[]>)=>{
                state.worspases=action.payload
            
            }),
            builder.addCase(get_all_workspaces.rejected, state=>{
        
            }),

            builder.addCase(get_all_global_category_by_workspace.pending, state=>{
        
            }),
            builder.addCase(get_all_global_category_by_workspace.fulfilled, (state, action:PayloadAction<i_globol_categorys[]>)=>{
                state.worspases= action.payload
            }),
            builder.addCase(get_all_global_category_by_workspace.rejected, state=>{
        
            })
    }
})

export const {add_global_category, add_workspase, update_global_category, update_workspase,
delete_global_category, delete_workspase, set_active_workspase

} = global_categorys_slise.actions

export default global_categorys_slise.reducer
