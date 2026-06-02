import styles from './context_munu.module.sass'
interface ContextMenuItem {
    label: string
    onClick: () => void
}

interface ContextMenuProps {
    open: boolean
    x: number
    y: number
    items: ContextMenuItem[]
}

export default function Context_menu({
    open,
    items,
    x,y
}: ContextMenuProps) {

    if (!open) return null

    return (
        <div className={styles.context_munu_conteiner}   style={{
            left: x,
            top: y
        }}>
            {items.map(item => (
                <h2
                    key={item.label}
                    onClick={item.onClick}
                    className={styles.context_munu_item_h2}
                >
                    {item.label}
                </h2>
            ))}
        </div>
    )
}