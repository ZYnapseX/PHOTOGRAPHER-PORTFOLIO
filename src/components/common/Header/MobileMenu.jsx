import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLockedScroll } from '../../../hooks/useLockedScroll'
import { easeInOut, easeOut } from '../../../utils/easing'
import styles from './MobileMenu.module.css'

const menuVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: { duration: 0.6, ease: easeInOut }
    },
    exit: {
        x: '100%',
        transition: { duration: 0.5, ease: easeInOut }
    }
}

const linkVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easeOut,
            delay: 0.2 + i * 0.08
        }
    }),
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
    }
}

export default function MobileMenu({ isOpen, onClose, links }) {
    useLockedScroll(isOpen)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.menu}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <nav className={styles.nav}>
                        {links.map(({ path, label }, index) => (
                            <motion.div
                                key={path}
                                custom={index}
                                variants={linkVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Link
                                    to={path}
                                    className={styles.link}
                                    onClick={onClose}
                                >
                                    {label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    <motion.div
                        className={styles.footer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link to="/booking" className={styles.cta} onClick={onClose}>
                            Book a Session
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
