import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { active_page_type, I_header_store_types } from "../../../../../App/store/global_store.types";
const initialState:I_header_store_types={
    active_page:[]
}
const header_slise = createSlice({
    name:"header",
    initialState:initialState,
    reducers:{
add_active_page(state, action:PayloadAction<active_page_type>){
    state.active_page.push(action.payload)
},
delete_active_page(state, action:PayloadAction<number>){
    state.active_page = state.active_page.filter(
        app => app.active_page_id!== action.payload
      )
},
    }
})

export const { add_active_page, delete_active_page} = header_slise.actions

export default header_slise.reducer
