import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { invoke } from "@tauri-apps/api/core"
import { i_task } from "../../../shared/types"
import {  sub_task_list_store_type } from "../../../App/store/global_store.types"


export const get_all_Sub_sub_tasksBy_workspace_id= createAsyncThunk("sub_tasks_list/get_all_Sub_sub_tasksBy_workspace_id", async(grubId:number)=>{
    const sub_tasks:i_task[]= await invoke("get_all_sub_tasks_by_workspaceID", {workspaceId:grubId})
    console.log("get_all_taskBy_workspace_id "+sub_tasks)
    return sub_tasks
 
 })

 const initialState:sub_task_list_store_type={
sub_tasks:[]
 }
 const sub_tasks_list_slise= createSlice({
    name:"sub_tasks_list",
 initialState:initialState,
 reducers:{
    add_Sub_task( state ,action:PayloadAction<i_task>, ){
        state.sub_tasks.push(action.payload)
    },
    delete_Sub_task(state, action:PayloadAction<number>){
        state.sub_tasks = state.sub_tasks.filter(
            task => task.task_id !== action.payload
          )
    },
    update_Sub_task:(state, action:PayloadAction<i_task>)=>{
        state.sub_tasks.forEach(task=>{
            if(task.task_id==action.payload.task_id){
                task =action.payload
            }
            
        })
    },


 },
 extraReducers(builder) {

    //get_all_Sub_sub_tasksBy_workspace_id
    builder.addCase(get_all_Sub_sub_tasksBy_workspace_id.pending, state=>{

    }),
    builder.addCase(get_all_Sub_sub_tasksBy_workspace_id.fulfilled, (state, action:PayloadAction<i_task[]>)=>{
        state.sub_tasks=action.payload
       
    }),
    builder.addCase(get_all_Sub_sub_tasksBy_workspace_id.rejected, state=>{

    }) 
 }
})
export const { add_Sub_task, update_Sub_task, delete_Sub_task} = sub_tasks_list_slise.actions

export default sub_tasks_list_slise.reducer