import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import { RootLayot } from "../layouts/root_layout/RootLayot";
import { Home } from "../pages/Home_page/Home";
import App_list from "../features/app/app_list";
import { App_list_page } from "../pages/app_list_page/app_list_page";
import { Create_item_page } from "../pages/create_item_page/create_item_page";
import { Folder_list_page } from "../pages/folder_list_page/folder_list_page";
import { Create_app_page } from "../pages/create_app/create_app_page";
import Task_list_page from "../pages/task_list_page/task_list_page";
import Notes_list_page from "../pages/notes_list_page/notes_list_page";
import { Grub_and_category_list_page } from "../pages/grub_and_category_list_page/grub_and_category_list_page";
import Creare_category_page from "../pages/creare_category_page/creare_category_page";
import Create_folder_page from "../pages/create_folder_page/create_folder_page";
import Create_task_page from "../pages/create_task_page/create_task_page";
import Edit_task_page from "../pages/edit_task_page/edit_task_page";
import { Edit_app_page } from "../pages/edit_app_page/edit_app_page";
import { Edit_folder_page } from "../pages/edit_folder_page/edit_folder_page";
import Create_workspace_page from "../pages/Create_workspace_page/Create_workspace_page";
import Edit_workspace_page from "../pages/Edit_workspace_page/Edit_workspace_page";

const routes:RouteObject[] =[
    {path:"/",  element:<RootLayot/>, children:[
        { index:true, element:<Home/>},
        { path:"/folder_list", element:<Folder_list_page/>},
        { path:"/apps_list", element:<App_list_page/>},
        { path:"/notes_list", element:<Notes_list_page/>},
        { path:"/tasks_list", element:<Task_list_page/>},
        { path:"/grubs_and_category", element:<Grub_and_category_list_page/>},
        { path:"/create_item", element:<Create_item_page/>},
        { path:"/create_app", element:<Create_app_page/>},
        {path:"/creare_category_page", element:<Creare_category_page/>},
        {path:"/creare_folder_page", element:<Create_folder_page/>},
        {path:"/creare_task_page", element:<Create_task_page/>},
        {path:"/edit_task_page/:taskId", element:<Edit_task_page/>},
        {path:"/edit_app_page/:appId", element:<Edit_app_page/>},
        {path:"/edit_folder_page/:folderId", element:<Edit_folder_page/>},
        { path: "/create_workspace", element: <Create_workspace_page /> },
{ path: "/edit_workspace/:workspaceId", element: <Edit_workspace_page /> },
    ]

    }
] 
const router = createBrowserRouter(routes)
export default function App(){
    return <RouterProvider router={router}/>
}