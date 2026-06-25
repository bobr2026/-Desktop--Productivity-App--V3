interface CategoryNodeProps {
    category: I_ginerik_category
    allCategories: I_ginerik_category[]
    category_type: SelectType
}
import strelka1 from '../icons/strelka.svg'
import strelka2 from '../icons/strelka2.svg'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../../../App/store/store"
import { I_ginerik_category } from "../../../types"
import get_cildren_category from "../../../utils/get_cildren_category.itils"
import styles from "../Under_category_list.module.sass"
import { removeAllSelectedCategory, removeSelectedCategory, removeSelectedHotkey, setSelectedCategory, setSelectedHotkey, } from '../../../../App/store/hotkey_and_category_slise'
import { global_store_type, SelectType } from '../../../../App/store/global_store.types'
export const CategoryNode = ({ category, allCategories, category_type }: CategoryNodeProps) => {
    let selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.app)
    const dispatch = useDispatch<AppDispatch>()
    switch (category_type) {
        case "app":
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.app)
            break;
        case "folder":
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.folder)
            break;
        case "global":
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.global)
            break;
        case "note":
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.note)
            break;
        case "task":
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.task)
            break;
        default:
            selected_category = useSelector((state: global_store_type) => state.hotkey_and_category.selectedCategories.task)
            break;
    }
    const [isOpen, setIsOpen] = useState(false)
    const [click, setClick] = useState<boolean>(false)

    const children = get_cildren_category(allCategories, category.id)

    return (
        <div className={styles.under_category_list_item}>
            <div className={styles.under_category_list_item__title}>
                {children.length > 0 && (
                    <img
                        className={styles.under_category_list_item__title_ing}
                        src={isOpen ? strelka2 : strelka1}
                        alt=""
                        onClick={() => setIsOpen(!isOpen)}
                    />
                )}

                <h3
                    className={selected_category !== category.id ? styles.under_category_list_item__title_h3 : styles.under_category_list_item__title_h3_active}
                    onClick={() => {
                        click == false ? dispatch(setSelectedCategory({id:category.id, type:category_type}))
                            : dispatch(removeSelectedCategory(category_type))
                        setClick(click == true ? false : true)
                    }

                    }
                >
                    {category.name}
                </h3>
            </div>

            {/* 👇 РЕКУРСИЯ */}
            <div
                className={`${styles.under_category_list_item__under_list} ${isOpen ? styles.open : ""
                    }`}
            >
                {/* {children.map((child) => (
                    <CategoryNode
                    category_type={category_type}
                        key={child.id}
                        category={child}
                        allCategories={allCategories}
                    />
                ))} */}
            </div>
        </div>
    )
}

