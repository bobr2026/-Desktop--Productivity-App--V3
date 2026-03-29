import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { I_apps_store_type } from "../../../App/store/global_store.types";
import { Iapp } from "../../../shared/types";

const initialState:I_apps_store_type={
    apps:[],
    created_app_hotkey:null
    
}

export const get_apps_from_db= createAsyncThunk("apps_list/get_apps_from_db", async()=>{
    const folders:Iapp[]= await invoke("get_all_apps")
    return folders
 
 })
 export const get_all_appsByGlobal_dategory_id= createAsyncThunk("apps_list/get_all_appsByGlobal_dategory_id", async(grubId:number)=>{
    const folders:Iapp[]= await invoke("get_all_appsBy_global_category_id", {categoryId:grubId})
    return folders
 
 })
 export const get_all_appsBy_workspace_id= createAsyncThunk("apps_list/get_all_appsBy_workspace_id", async(grubId:number)=>{
    const folders:Iapp[]= await invoke("get_all_appsBy_workspace_id", {workspaceId:grubId})
    console.log("get_all_appsBy_workspace_id "+folders)
    return folders
 
 })

 export const get_all_appsByGrub_id= createAsyncThunk("apps_list/get_all_appsByGrub_id", async(grubId:number)=>{
    const folders:Iapp[]= await invoke("get_all_appsByGrub_id", {grubId:grubId})
    return folders
 
 })

 
const app_list_slise= createSlice({
    name:"apps_list",
 initialState:initialState,
 reducers:{
    add_app( state ,action:PayloadAction<Iapp>, ){
        state.apps.push(action.payload)
    },
    delete_app(state, action:PayloadAction<number>){
        state.apps = state.apps.filter(
            app => app.id !== action.payload
          )
    },
    update_app:(state, action:PayloadAction<Iapp>)=>{
        state.apps.forEach(folder=>{
            if(folder.id==action.payload.id){
                folder =action.payload
            }
            
        })
    },
    set_created_app_hotkey(state, action:PayloadAction<string>){
state.created_app_hotkey=action.payload
console.log(`app_slise_store: ${state.created_app_hotkey}`)
    },
    remove_creted_app_hotkey(state, ){
    state.created_app_hotkey=null
    }

 },
 extraReducers(builder) {

    //get_apps_from_db
    builder.addCase(get_apps_from_db.pending, state=>{

    }),
    builder.addCase(get_apps_from_db.fulfilled, (state, action:PayloadAction<Iapp[]>)=>{
        state.apps=action.payload
       
    }),
    builder.addCase(get_apps_from_db.rejected, state=>{

    }), 

//get_all_appsByGlobal_dategory_id
    builder.addCase(get_all_appsByGlobal_dategory_id.pending, state=>{

    }),
    builder.addCase(get_all_appsByGlobal_dategory_id.fulfilled, (state, action:PayloadAction<Iapp[]>)=>{
        state.apps=action.payload
    }),
    builder.addCase(get_all_appsByGlobal_dategory_id.rejected, state=>{

    }), 

    //get_all_appsBy_workspace_id
    builder.addCase(get_all_appsBy_workspace_id.pending, state=>{

    }),
    builder.addCase(get_all_appsBy_workspace_id.fulfilled, (state, action:PayloadAction<Iapp[]>)=>{
        state.apps=action.payload
    }),
    builder.addCase(get_all_appsBy_workspace_id.rejected, state=>{

    }),
//get_all_appsByGrub_id
    builder.addCase(get_all_appsByGrub_id.pending, state=>{

    }),
    builder.addCase(get_all_appsByGrub_id.fulfilled, (state, action:PayloadAction<Iapp[]>)=>{
        state.apps=action.payload

    }),
    builder.addCase(get_all_appsByGrub_id.rejected, state=>{

    })
    
 }
})

export const { add_app, delete_app, update_app, set_created_app_hotkey, remove_creted_app_hotkey} = app_list_slise.actions

export default app_list_slise.reducer
