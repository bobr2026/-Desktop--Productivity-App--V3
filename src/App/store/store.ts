import {configureStore} from '@reduxjs/toolkit'
import app_list_slise from '../../features/app/store/app_slise_store'
import folder_list_slise from '../../features/folder/store/folder_slise_store.ts'
import  header_slise  from '../../layouts/root_layout/ui/header/store/Header.store.ts'
import globol_category_slise from './global_category_slise.ts'
import hotkey_and_category_slise from './hotkey_and_category_slise.ts'
import task_list_slise from '../../features/tasks/store/task_list_store.ts'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

const store = configureStore({
    reducer:{
        apps_list:app_list_slise,
        header:header_slise,
        global_category:globol_category_slise,
        hotkey_and_category:hotkey_and_category_slise,
        folder_list: folder_list_slise,
        task_list:task_list_slise
    }
})
export default store
console.log(store.getState())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector