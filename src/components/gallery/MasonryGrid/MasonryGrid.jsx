import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import styles from './MasonryGrid.module.css'

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export default function MasonryGrid({
    children,
    columns = 3,
    className = ''
}) {
    const { ref, isInView } = useInView({ threshold: 0.1 })

    const columnClass = columns === 2
        ? styles.two
        : columns === 4
            ? styles.four
            : ''

    return (
        <motion.div
            ref={ref}
            className={`${styles.grid} ${columnClass} ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
        >
            {children}
        </motion.div>
    )
}
