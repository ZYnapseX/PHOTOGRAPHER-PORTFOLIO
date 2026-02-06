import { motion } from 'framer-motion'
import { splitText } from '../../../utils/helpers'
import { easeOut } from '../../../utils/easing'
import styles from './AnimatedText.module.css'

export default function SplitText({
    children,
    delay = 0,
    stagger = 0.03,
    className = ''
}) {
    const chars = splitText(children)

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay
            }
        }
    }

    const charVariants = {
        hidden: { y: '100%', opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: easeOut }
        }
    }

    return (
        <motion.span
            className={`${styles.splitText} ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {chars.map(({ char, index }) => (
                <span key={index} className={styles.char}>
                    <motion.span
                        className={styles.charInner}
                        variants={charVariants}
                    >
                        {char}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    )
}
