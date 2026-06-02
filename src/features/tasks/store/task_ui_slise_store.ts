import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { task_ui_madal_type, ui_task_list_ctore_type } from "../../../App/store/global_store.types"


const initialState:ui_task_list_ctore_type={
    madal_type:"create_link_task_to_task",
    show_elelemts_madal:false,
    select_element_id:-1,
    parent_element_id:-1,
    rerender_sub_elements:false,
    rerender_task_list:0
     
}
const ui_task_list_slise= createSlice({
    initialState:initialState,
    name:"ui_task_list_slise",
    reducers:{
 remove_show_elelemts_madal(state){
 state.show_elelemts_madal=false
 },
 set_show_elelemts_madal(state){
state.show_elelemts_madal=true
 },
 set_madal_type(state, action:PayloadAction<task_ui_madal_type>){
state.madal_type= action.payload
 }, 
 remove_madal_type(state){
state.madal_type="create_link_task_to_task"
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
        remove_all_task_ui_state(state){
             state.madal_type="create_link_task_to_task"
            state.parent_element_id= -1
            state.select_element_id= -1
            state.show_elelemts_madal=false
            state.rerender_sub_elements=false
        },
        set_rerender_sub_elements(state){
           
            
            state.rerender_sub_elements=true
        },
        remove_rerender_sub_elements(state){
            state.rerender_sub_elements=false
        },
        set_rerender_task_list(state){
            const random_nambor = Math.random()*100
            console.log(random_nambor)
             
             state.rerender_task_list=random_nambor
         },
    }
})
export const {remove_show_elelemts_madal, set_show_elelemts_madal, 
     set_perent_element_id, set_select_element_id, remove_perent_element_id,
      remove_select_element_id,remove_madal_type, set_madal_type,
     remove_all_task_ui_state,
     set_rerender_sub_elements,
     remove_rerender_sub_elements,
     set_rerender_task_list
    } = ui_task_list_slise.actions

export default ui_task_list_slise.reducer