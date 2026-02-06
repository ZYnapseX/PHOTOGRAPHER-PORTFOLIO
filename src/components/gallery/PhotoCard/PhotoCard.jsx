import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCursor } from '../../../context/CursorContext'
import { easeOut } from '../../../utils/easing'
import styles from './PhotoCard.module.css'

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easeOut }
    }
}

export default function PhotoCard({
    album,
    onClick,
    ...props
}) {
    const { setCursor, resetCursor } = useCursor()

    const content = (
        <>
            <div className={styles.imageWrap}>
                <img
                    src={album.coverImage?.startsWith('http') ? album.coverImage : `http://localhost:5000${album.coverImage}`}
                    alt={album.title}
                    className={styles.image}
                    loading="lazy"
                />
                <div className={styles.overlay} />
                <div className={styles.viewIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-9 9M3 21l9-9" />
                    </svg>
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{album.title}</h3>
                <p className={styles.category}>{album.category?.name || album.category}</p>
            </div>
        </>
    )

    if (onClick) {
        return (
            <motion.button
                className={styles.card}
                variants={cardVariants}
                onMouseEnter={() => setCursor('view', 'View')}
                onMouseLeave={resetCursor}
                onClick={onClick}
                {...props}
            >
                {content}
            </motion.button>
        )
    }

    return (
        <motion.div variants={cardVariants}>
            <Link
                to={`/portfolio/${album.slug}`}
                className={styles.card}
                onMouseEnter={() => setCursor('view', 'View')}
                onMouseLeave={resetCursor}
            >
                {content}
            </Link>
        </motion.div>
    )
}
