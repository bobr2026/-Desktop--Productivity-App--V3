import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { categoryUi_types } from "../../../App/store/global_store.types"


const initialState:categoryUi_types={
    rerender_category_list:false
}
const categoryUiSlise=createSlice({
    name:"categoryUI",
    initialState,
    reducers:{

        set_rerender_category_list(state, action:PayloadAction<boolean>){
        state.rerender_category_list=action.payload
        }
    }
})
export const {set_rerender_category_list} =categoryUiSlise.actions
export default categoryUiSlise.reducer