import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { invoke } from "@tauri-apps/api/core"
import { i_task } from "../../../shared/types"
import {  task_list_store_type } from "../../../App/store/global_store.types"


export const get_all_tasksBy_workspace_id= createAsyncThunk("tasks_list/get_all_tasksBy_workspace_id", async(grubId:number)=>{
    const tasks:i_task[]= await invoke("get_all_tasks_by_workspaceID", {workspaceId:grubId})
    console.log("get_all_taskBy_workspace_id "+tasks)
    return tasks
 
 })

 const initialState:task_list_store_type={
tasks:[]
 }
 const tasks_list_slise= createSlice({
    name:"tasks_list",
 initialState:initialState,
 reducers:{
    add_task( state ,action:PayloadAction<i_task>, ){
        state.tasks.push(action.payload)
    },
    delete_task(state, action:PayloadAction<number>){
        state.tasks = state.tasks.filter(
            task => task.task_id !== action.payload
          )
    },
    update_task:(state, action:PayloadAction<i_task>)=>{
        state.tasks.forEach(task=>{
            if(task.task_id==action.payload.task_id){
                task =action.payload
            }
            
        })
    },


 },
 extraReducers(builder) {

    //get_all_tasksBy_workspace_id
    builder.addCase(get_all_tasksBy_workspace_id.pending, state=>{

    }),
    builder.addCase(get_all_tasksBy_workspace_id.fulfilled, (state, action:PayloadAction<i_task[]>)=>{
        state.tasks=action.payload
       
    }),
    builder.addCase(get_all_tasksBy_workspace_id.rejected, state=>{

    }) 
 }
})
export const { add_task, delete_task, update_task,} = tasks_list_slise.actions

export default tasks_list_slise.reducer