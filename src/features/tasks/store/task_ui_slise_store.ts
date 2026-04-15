import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ui_task_list_ctore_type } from "../../../App/store/global_store.types"


const initialState:ui_task_list_ctore_type={
    show_context_munu:false,
    select_element_id:-1,
    parent_element_id:-1
     
}
const ui_task_list_slise= createSlice({
    initialState:initialState,
    name:"ui_task_list_slise",
    reducers:{
 remove_show_context_munu(state){
 state.show_context_munu=false
 },
 set_show_context_munu(state){
state.show_context_munu=true
 },
 set_perent_element_id(state, action:PayloadAction<number>){
 state.parent_element_id=action.payload
 },
 set_select_element_id(state, action:PayloadAction<number>){
    state.select_element_id=action.payload
    },
    remove_select_element_id(state){
        state.select_element_id= -1
        },
        remove_perent_element_id(state){
            state.parent_element_id= -1
            },
    }
})
export const {remove_show_context_munu, set_show_context_munu} = ui_task_list_slise.actions

export default ui_task_list_slise.reducer