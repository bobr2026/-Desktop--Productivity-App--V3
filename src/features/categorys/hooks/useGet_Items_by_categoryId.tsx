import { useEffect, useState } from "react";
import { getAllAppsByCategoryId, getAllFoldersByCategoryId, getAllNotesByCategoryId, getAllTasksByTaskCategoryId } from "../model/category.model";
import { filtered_categorys, I_folder, i_note, i_task, Iapp } from "../../../shared/types";

export function useGet_Items_by_categoryId(item_type: filtered_categorys, id: number) {
    const [data, set_data]=useState<i_note[]|i_task[]|Iapp[]|I_folder[]>([])
 
        useEffect(() => {
            async function get_dataq() {
                switch (item_type) {
                    case 'app':
                        const data = await getAllAppsByCategoryId(id);
                        set_data(data);
                        break;
        
                    case 'note':
                        const data1 = await getAllNotesByCategoryId(id);
                        set_data(data1);
                        break;
        
                    case 'folder':
                        const data2 = await getAllFoldersByCategoryId(id);
                        set_data(data2);
                        break;
        
                    case 'task':
                        const data3 = await getAllTasksByTaskCategoryId(id);
                        set_data(data3);
                        break;
                }
            }
        
            get_dataq();
        }, [item_type, id]); // <- зависимости здесь
        return data
}        
