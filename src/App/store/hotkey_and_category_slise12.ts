import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { I_hotkey_and_category_slise_type } from "./global_store.types"
type element_type= "app"|"foldder"|"note"|"task"
interface base{
    element_id:number
    selected_category:null|number, 
    selected_hotkey:null|number
    element_type:element_type
}

const initialState:I_hotkey_and_category_slise_type={
    selected_category:null, 
    selected_hotkey:null
}
const hotkey_and_category_slise= createSlice({
  initialState,
  name:"hotkey_and_category_slise",
  reducers:{
    set_selected_hotkey(state, action:PayloadAction<string>){
        state.selected_hotkey= action.payload
    },
    remove_selected_hotkey(state){
        state.selected_hotkey= null
    },
    set_selected_category(state, action:PayloadAction<number>){
        state.selected_category= action.payload
    },
    remove_selected_category(state){
        state.selected_category= null
    }
  }
})

export const {remove_selected_category,
     remove_selected_hotkey, set_selected_category, set_selected_hotkey} 
= hotkey_and_category_slise.actions

export default hotkey_and_category_slise.reducer