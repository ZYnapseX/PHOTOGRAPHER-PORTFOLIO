import { useMousePosition } from '../../../hooks/useMousePosition'
import { useCursor } from '../../../context/CursorContext'
import { useIsDesktop } from '../../../hooks/useMediaQuery'
import styles from './Cursor.module.css'

export default function CustomCursor() {
    const isDesktop = useIsDesktop()
    const { position, smoothPosition } = useMousePosition(0.15)
    const { cursorType, cursorText } = useCursor()

    if (!isDesktop) return null

    return (
        <div
            className={styles.cursor}
            data-type={cursorType}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
            <div className={styles.dot} />
            <div
                className={styles.ring}
                style={{
                    transform: `translate(calc(-50% + ${smoothPosition.x - position.x}px), calc(-50% + ${smoothPosition.y - position.y}px))`
                }}
            >
                {cursorText && <span className={styles.text}>{cursorText}</span>}
            </div>
        </div>
    )
}
