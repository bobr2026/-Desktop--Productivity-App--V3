import { useEffect, useState } from 'react'
import { I_workspace_types, WorkspaceCounters } from '../../shared/types'
import styles from './styles/workspase_item.module.sass'
import {  getCounters } from './model/category.model'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../App/store/store'
import { useDeleteCategory } from './hooks/useDelete_categorys'
import { global_store_type } from '../../App/store/global_store.types'
import { set_rerender_category_list } from './store/categoryUiSlise'
import { set_context_munu_point } from '../../App/store/context_munu_slise'
import Context_menu from '../../shared/ui/context_munu/context_munu'
import { setOpenedStatusMenu, setOpenedContextMenu } from '../tasks/store/task_list_ui_store'
import { get_all_workspaces } from '../../App/store/global_category_slise'
import { useNavigate } from 'react-router-dom'
interface Workspase_item_props{
    workspase_id:number
    color:string|null
    name:string

}
export function Workspase_item({workspase_id, color, name, }:Workspase_item_props){
    const [isDeletedLocally, setIsDeletedLocally] = useState(false);
    const navigate = useNavigate()
    const deleteCategory=useDeleteCategory()
    const dispatch = useDispatch<AppDispatch>()
    const {openedContextMenuId, contextMenuX, contextMenuY} = useSelector(
        (state: global_store_type) => state.context_munu_ui
    )
    const {rerender_category_list} = useSelector(
        (state: global_store_type) => state.categoryUI
    )
    
    const [workspaceCounters, setWorkspaceCounters]=useState<WorkspaceCounters>({
        apps:0,
        tasks:0,
        notes:0,
        folders:0
    })
        const context_munu_itens = workspaceCounters.apps!=0 ||
         workspaceCounters.folders!=0||workspaceCounters.notes!=0||workspaceCounters.tasks!=0?[
            //  {
            //             label: "Удалить",
            //             onClick: async () => {
            //                 try {
            //                     // 1. Ждем, пока бэкенд реально удалит категорию
            //                     setIsDeletedLocally(true);
            //                     await deleteCategory('workspase', workspase_id);
                                
            //                     // 2. Закрываем подсписок, чтобы он не пытался рендерить старье
            //                     // set_open_cildrren_item(false);
            //                     // set_children_elements([]);
                        
            //                     // 3. Триггерим ререндер списка (чтобы заново запросить категории с бэкенда)
            //                     dispatch(set_rerender_category_list(!rerender_category_list));
            //                 } catch (error) {
            //                     console.error("Ошибка при удалении:", error);
            //                 }
            //             }
            //         },
                    {
                        label: "Изменить",
                        onClick: () => {
                            navigate(`/edit_workspace/${workspase_id}`)
                        }
                    },
        ]:[
            {
                label: "Удалить",
                onClick: async () => {
                    try {
                        // 1. Ждем, пока бэкенд реально удалит категорию
                        setIsDeletedLocally(true);
                             
                        await deleteCategory('workspase', workspase_id);
                        dispatch(get_all_workspaces())
                        
                        // 2. Закрываем подсписок, чтобы он не пытался рендерить старье
                        // set_open_cildrren_item(false);
                        // set_children_elements([]);
                
                        // 3. Триггерим ререндер списка (чтобы заново запросить категории с бэкенда)
                        dispatch(set_rerender_category_list(!rerender_category_list));
                    } catch (error) {
                        console.error("Ошибка при удалении:", error);
                    }
                }
            },
            {
                label: "Изменить",
                onClick: () => {
                    navigate(`/edit_workspace/${workspase_id}`)
                    dispatch(get_all_workspaces())
                }
            },
        ]
    
    useEffect(()=>{
        async function load() {
            const counters:WorkspaceCounters = await getCounters(workspase_id);
            setWorkspaceCounters(counters)
           
          }
          load()
    }, [workspase_id])
    if(isDeletedLocally) return null
   else return <div className={styles.workspase_item} onContextMenu={(e: React.MouseEvent) => {
                               e.preventDefault()
                               dispatch(setOpenedStatusMenu(null))
               
                               dispatch(
                                   setOpenedContextMenu(
                                       openedContextMenuId === workspase_id ? null : workspase_id
                                   )
                               )
               dispatch(set_context_munu_point("reset"))
                               dispatch(set_context_munu_point({
                                   x: e.clientX,
                                   y: e.clientY,
                               
                               }))
                           }} >
        <p>{name}</p>
        <div className={styles.workspase_item_content}>

        <div className={styles.workspase_elemts_len}>
            <p>Папок:{workspaceCounters.folders}</p>
            <p>Приложений:{workspaceCounters.apps}</p>
            <p>Задач:{workspaceCounters.tasks}</p>
            <p>Заметок:{workspaceCounters.notes}</p>
        </div>
        <div className={styles.workspase_item_color_div} style={{background:color!=null?color:""}}></div>
        </div>
 <Context_menu open={openedContextMenuId === workspase_id} x={contextMenuX} y={contextMenuY} items={context_munu_itens} />
    </div>
}