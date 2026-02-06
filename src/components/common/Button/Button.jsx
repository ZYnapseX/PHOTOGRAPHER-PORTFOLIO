import { Link } from 'react-router-dom'
import { useCursor } from '../../../context/CursorContext'
import styles from './Button.module.css'

export default function Button({
    children,
    to,
    href,
    variant = 'primary',
    size = 'md',
    icon,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const { setCursor, resetCursor } = useCursor()

    const classes = [
        styles.btn,
        styles[`btn${size.charAt(0).toUpperCase() + size.slice(1)}`],
        styles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        className
    ].filter(Boolean).join(' ')

    const content = (
        <>
            <span className={styles.fill} />
            <span className={styles.text}>{children}</span>
            {icon && <span className={styles.icon}>{icon}</span>}
        </>
    )

    const handlers = {
        onMouseEnter: () => setCursor('link'),
        onMouseLeave: resetCursor
    }

    if (to) {
        return (
            <Link to={to} className={classes} {...handlers} {...props}>
                {content}
            </Link>
        )
    }

    if (href) {
        return (
            <a href={href} className={classes} {...handlers} {...props}>
                {content}
            </a>
        )
    }

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            {...handlers}
            {...props}
        >
            {content}
        </button>
    )
}
