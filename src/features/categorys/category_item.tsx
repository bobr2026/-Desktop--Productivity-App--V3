import styles from './styles/Category_item.module.sass'
import strelka1 from './icons/strelka.svg'
import strelka2 from './icons/strelka2.svg'
import { JSX, useEffect, useState } from 'react'
import { Category_list_data_types, filtered_categorys, I_folder, i_note, i_task, Iapp } from '../../shared/types'
import { invoke } from '@tauri-apps/api/core'
import { useGet_Items_by_categoryId } from './hooks/useGet_Items_by_categoryId'
import Folder_list from '../folder/folder_list'
import { Folder_item } from '../folder/folder_item'
import { App_item } from '../app/app_item'
import Task_item from '../tasks/task_item'
import Note_task_item from '../tasks/note_task'
import { useDispatch, useSelector } from 'react-redux'
import { set_context_munu_point } from '../../App/store/context_munu_slise'
import { global_store_type } from '../../App/store/global_store.types'
import Context_menu from '../../shared/ui/context_munu/context_munu'
import { setOpenedStatusMenu, setOpenedContextMenu } from '../tasks/store/task_list_ui_store'
import { AppDispatch } from '../../App/store/store'
import { useDeleteCategory } from './hooks/useDelete_categorys'
import { set_rerender_category_list } from './store/categoryUiSlise'

interface Category_itemProps {
    id: number
    title: string

    color: string
    type: filtered_categorys

}
export function Category_item({ id, title, color, type }: Category_itemProps) {
    const [isDeletedLocally, setIsDeletedLocally] = useState(false);
    const deleteCategory=useDeleteCategory()
    const dispatch = useDispatch<AppDispatch>()

        const {openedContextMenuId, contextMenuX, contextMenuY} = useSelector(
            (state: global_store_type) => state.context_munu_ui
        )
        const {rerender_category_list} = useSelector(
            (state: global_store_type) => state.categoryUI
        )
        
    const [children_elements, set_children_elements] = useState<JSX.Element[]>([])
    const [open_cildrren_item, set_open_cildrren_item] = useState(false)
    const data = useGet_Items_by_categoryId(type, id)

    const context_munu_itens =[
         {
                    label: "Удалить",
                    onClick: async () => {
                        try {
                            // 1. Ждем, пока бэкенд реально удалит категорию
                            setIsDeletedLocally(true);
                            await deleteCategory(type, id);
                            
                            // 2. Закрываем подсписок, чтобы он не пытался рендерить старье
                            set_open_cildrren_item(false);
                            set_children_elements([]);
                    
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
                        // navigate(`/edit_task_page/${id}`)
                    }
                },
    ]

    console.log(data)
    useEffect(()=>{
        let children: JSX.Element[] = [];
        switch (type) {
            case 'folder':
          
                const folder_data = data as I_folder[]
                children = folder_data.map((app) => {
                    return <Folder_item id={app.id} key={app.id} icon_id={app.icon_id} path={app.path} hotkey={app.hotkey}
                        folder_category_id={app.folder_category_id} globol_category_id={app.globol_category_id}
                        title={app.title} swoh_color_grub='folder_category' />  
                })
            
    
                break;
            case 'app':
             
                const folder_data1 = data as Iapp[]
                children = folder_data1.map((app) => {
                    return <App_item id={app.id} icon_path={app.icon_path} app_path={app.path} hotkey={app.hotkey}
                    app_category_id={app.app_category_id} globol_category_id={app.globol_category_id}
                    title={app.title} swoh_color_grub='app_category' />
                })
               
    
                break;
            case 'note':
                const folder_data3 = data as i_note[]
                children = folder_data3.map((note) => {
                return   <Note_task_item
                                key={note.note_id} // Обязательный ключ для React
                                title={note.title}
                                category_id={note.note_category_id}
                                creaded={note.created_at}
                                update={note.updated_at}
                                element_id={note.note_id}
                                mark={note.marks != null ? note.marks : undefined}
                                status={note.status}
                                render_type='sub_list'
                                note_id={note.note_id}
                            />
                })
                break
            case 'task':
                const folder_data2 = data as i_task[]
                children = folder_data2.map((app) => {
                   return <Task_item key={app.task_id} id={app.task_id} title={app.title} status={app.status} mark_type={app.marks} workspase={app.workspace_id} />
                })
                break
            default:
                break;
        }
    

set_children_elements(children)

    }, [data, type])    


if(isDeletedLocally) return null
else  return <div className={styles.main_wraper}>

        <div className={styles.wraper}>
            <img src={open_cildrren_item == false ? strelka1 : strelka2} alt="" onClick={() => set_open_cildrren_item(!open_cildrren_item)} />
            <div className={styles.conteiner} onContextMenu={(e: React.MouseEvent) => {
                            e.preventDefault()
                            dispatch(setOpenedStatusMenu(null))
            
                            dispatch(
                                setOpenedContextMenu(
                                    openedContextMenuId === id ? null : id
                                )
                            )
            dispatch(set_context_munu_point("reset"))
                            dispatch(set_context_munu_point({
                                x: e.clientX,
                                y: e.clientY,
                            
                            }))
                        }} >
                <div className={styles.conteiner__color_div} style={{ background: color }}></div>
                <div className={styles.conteiner__data} >
                    <h1>{title}</h1>
                    <h2>КОЛИЧЕСТВО ЭЛЕМЕНТОВ: {data.length}</h2>
                </div>

            </div>

        </div>
        <div className={styles.coldren_elements_list} style={{ display: open_cildrren_item == true ? "flex" : "none" }}>
            {children_elements}
        </div>
          <Context_menu open={openedContextMenuId === id} x={contextMenuX} y={contextMenuY} items={context_munu_itens} />
    </div>
}