import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { I_hotkey_and_category_slise_type } from "./global_store.types"

type SelectType = "app" | "folder" | "note" | "task" | "global"

type CategoriesState = Record<SelectType, number | null>

interface State {
  selectedCategories: CategoriesState
  selectedHotkey: string | null
}

const initialState: State = {
  selectedCategories: {
    app: null,
    folder: null,
    note: null,
    task: null,
    global: null,
  },
  selectedHotkey: null,
}

interface SelectCategoryPayload {
  type: SelectType
  id: number
}

const slice = createSlice({
  name: "hotkey_and_category",
  initialState,
  reducers: {
    read_selected_category(state){
state.selectedCategories
    }, 
    setSelectedHotkey(state, action: PayloadAction<string>) {
      state.selectedHotkey = action.payload
    },

    removeSelectedHotkey(state) {
      state.selectedHotkey = null
    },

    setSelectedCategory(state, action: PayloadAction<SelectCategoryPayload>) {
      const { type, id } = action.payload
      state.selectedCategories[type] = id
    },

    removeSelectedCategory(state, action: PayloadAction<SelectType>) {
      state.selectedCategories[action.payload] = null
    },

    removeAllSelectedCategory(state) {
      Object.keys(state.selectedCategories).forEach((key) => {
        state.selectedCategories[key as SelectType] = null
      })
    },
  },
})

export const {
  setSelectedHotkey,
  removeSelectedHotkey,
  setSelectedCategory,
  removeSelectedCategory,
  removeAllSelectedCategory,
  read_selected_category
} = slice.actions

export default slice.reducer

// type select_type = "app" | "folder" | "note" | "task" | "global"
// interface base {
//     selected_global_category: null | number,
//     selected_app_category: null | number,
//     selected_folder_category: null | number,
//     selected_task_category: null | number,
//     selected_note_category: null | number,
//     selected_hotkey: null | string
// }

// const initialState1: base = {
//     selected_global_category: null,
//     selected_app_category: null,
//     selected_folder_category: null,
//     selected_task_category: null,
//     selected_note_category: null,
//     selected_hotkey: null

// }
// interface select_category {
//     select_type: select_type
//     selected_category_id: number
// }
// const hotkey_and_category_slise1 = createSlice({
//     initialState:initialState1,
//     name: "hotkey_and_category_slise",
//     reducers: {
//         set_selected_hotkey(state, action: PayloadAction<string>) {
//             state.selected_hotkey = action.payload
//         },
//         remove_selected_hotkey(state) {
//             state.selected_hotkey = null
//         },
//         set_selected_category(state, action: PayloadAction<select_category>) {
//             switch (action.payload.select_type) {
//                 case "app":
//                     state.selected_app_category = action.payload.selected_category_id
//                     break;
//                 case "folder":
//                     state.selected_folder_category = action.payload.selected_category_id
//                     break;
//                 case "note":
//                     state.selected_note_category = action.payload.selected_category_id
//                     break;
//                 case "global":
//                     state.selected_global_category = action.payload.selected_category_id
//                     break;
//                 case "task":
//                     state.selected_task_category = action.payload.selected_category_id
//                     break;
//             }
//         },
//         remove_selected_category(state, action:PayloadAction<select_type>) {
//             switch (action.payload) {
//                 case "app":
//                     state.selected_app_category = null
//                     break;
//                 case "folder":
//                     state.selected_folder_category = null
//                     break;
//                 case "note":
//                     state.selected_note_category = null
//                     break;
//                 case "global":
//                     state.selected_global_category = null
//                     break;
//                 case "task":
//                     state.selected_task_category = null
//                     break;
//             }
//         },
//         remove_all_selected_category(state){
//             state.selected_app_category = null
//             state.selected_folder_category=null
//             state.selected_global_category=null
//             state.selected_note_category=null
//             state.selected_task_category=null
//         }
//     }
// })

// export const { remove_selected_category,
//     remove_selected_hotkey, set_selected_category, set_selected_hotkey, remove_all_selected_category }
//     = hotkey_and_category_slise1.actions

// export default hotkey_and_category_slise1.reducer




