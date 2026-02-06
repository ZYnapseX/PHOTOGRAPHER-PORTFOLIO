import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { easeInOut } from '../../../utils/easing'
import styles from './AnimatedText.module.css'

export default function RevealText({
    children,
    delay = 0,
    className = ''
}) {
    const { ref, isInView } = useInView({ threshold: 0.3 })

    const textVariants = {
        hidden: { y: '100%' },
        visible: {
            y: 0,
            transition: { duration: 0.8, ease: easeInOut, delay }
        }
    }

    const maskVariants = {
        hidden: { scaleX: 1 },
        visible: {
            scaleX: 0,
            transition: { duration: 1, ease: easeInOut, delay: delay + 0.3 }
        }
    }

    return (
        <span ref={ref} className={`${styles.reveal} ${className}`}>
            <motion.span
                className={styles.revealText}
                variants={textVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                {children}
            </motion.span>
            <motion.span
                className={styles.revealMask}
                variants={maskVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            />
        </span>
    )
}
