import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { easeInOut, easeOut } from '../../../utils/easing'
import styles from './PageTransition.module.css'

const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easeOut,
            delay: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: easeOut }
    }
}

export default function PageTransition({ children }) {
    return (
        <motion.div
            className={styles.content}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    )
}

