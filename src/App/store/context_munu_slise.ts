import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { context_munu_ui_store_types, } from "./global_store.types"

interface context_munu_point_types{
    x:number
    y:number
}
const context_munu_ui_store:context_munu_ui_store_types={
openedContextMenuId:null,

contextMenuX:0,
contextMenuY:0
}

const context_munu_ui_slise= createSlice({
    name:"task_list_ui",
    initialState:context_munu_ui_store,
    reducers:{
        setOpenedContextMenu: (state, action: PayloadAction<number|null >) => {
            state.openedContextMenuId = action.payload
        },
        set_context_munu_point(state, action:PayloadAction<context_munu_point_types|"reset">){
 if(action.payload!="reset"){
    state.contextMenuX= action.payload.x
    state.contextMenuY=action.payload.y
 }else{
    state.contextMenuX=0
    state.contextMenuY=0
 }
        }
    }
})

export const {
    setOpenedContextMenu,set_context_munu_point
    } = context_munu_ui_slise.actions

export default context_munu_ui_slise.reducer