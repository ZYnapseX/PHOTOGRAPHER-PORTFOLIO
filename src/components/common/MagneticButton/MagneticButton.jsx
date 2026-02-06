import { motion } from 'framer-motion'
import { useMagneticEffect } from '../../../hooks/useMagneticEffect'
import { useCursor } from '../../../context/CursorContext'

export default function MagneticButton({
    children,
    strength = 0.3,
    className = '',
    onClick
}) {
    const { ref, offset } = useMagneticEffect(strength)
    const { setCursor, resetCursor } = useCursor()

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseEnter={() => setCursor('link')}
            onMouseLeave={resetCursor}
            animate={{ x: offset.x, y: offset.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
            {children}
        </motion.button>
    )
}
