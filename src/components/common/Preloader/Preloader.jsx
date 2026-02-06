import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { easeInOut, easeOut } from '../../../utils/easing'
import styles from './Preloader.module.css'

const logoVariants = {
    hidden: { y: 60 },
    visible: { 
        y: 0, 
        transition: { 
            duration: 1, 
            ease: easeOut 
        } 
    },
    exit: { 
        y: -40, 
        transition: { duration: 0.5, ease: easeInOut } 
    }
}

const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            duration: 0.8, 
            ease: easeOut,
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    },
    exit: { 
        opacity: 0,
        transition: { duration: 0.4 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: easeOut }
    }
}

export default function Preloader({ onComplete }) {
    const [progress, setProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        let current = 0
        const increment = () => {
            const remaining = 100 - current
            const step = Math.random() * remaining * 0.15 + 2
            current = Math.min(current + step, 100)
            setProgress(Math.round(current))

            if (current < 100) {
                setTimeout(increment, Math.random() * 80 + 40)
            } else {
                setTimeout(() => {
                    setIsVisible(false)
                    setTimeout(() => onComplete?.(), 1000)
                }, 500)
            }
        }

        setTimeout(increment, 400)
    }, [onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.preloader}
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        transition: { duration: 0.8, ease: easeInOut }
                    }}
                >
                    {/* Decorative lines */}
                    <div className={styles.decorLine} />
                    <div className={styles.decorLine} />
                    <div className={styles.decorLine} />

                    {/* Floating particles */}
                    <div className={styles.particles}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.particle} />
                        ))}
                    </div>

                    <motion.div
                        className={styles.content}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className={styles.logo}>
                            <motion.span 
                                className={styles.logoText}
                                variants={logoVariants}
                            >
                                Alexandra Volkova
                            </motion.span>
                        </div>

                        <motion.div 
                            className={styles.progressWrap}
                            variants={itemVariants}
                        >
                            <motion.div
                                className={styles.progressBar}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: progress / 100 }}
                                transition={{ duration: 0.2, ease: easeOut }}
                            />
                            <motion.div 
                                className={styles.progressGlow}
                                style={{ left: `${progress}%` }}
                            />
                        </motion.div>

                        <motion.div 
                            className={styles.counter}
                            variants={itemVariants}
                        >
                            {progress}%
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
