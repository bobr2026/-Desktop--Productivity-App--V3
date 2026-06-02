import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { task_list_ui_store_types } from "../../../App/store/global_store.types"


const task_list_ui_store:task_list_ui_store_types={
openedContextMenuId:null,
openedStatusMenuId:null,
contextMenuX:0,
contextMenuY:0
}

const task_list_ui_slise= createSlice({
    name:"task_list_ui",
    initialState:task_list_ui_store,
    reducers:{
        setOpenedContextMenu: (state, action: PayloadAction<number|null >) => {
            state.openedContextMenuId = action.payload
        },
        
        setOpenedStatusMenu: (state, action: PayloadAction<number|null >) => {
            state.openedStatusMenuId = action.payload
        }
    }
})

export const {
    setOpenedContextMenu,setOpenedStatusMenu
    } = task_list_ui_slise.actions

export default task_list_ui_slise.reducer