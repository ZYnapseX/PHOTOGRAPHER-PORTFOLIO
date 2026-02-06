import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLockedScroll } from '../../../hooks/useLockedScroll'
import { useSwipe } from '../../../hooks/useSwipe'
import { easeInOut, easeOut } from '../../../utils/easing'
import styles from './Lightbox.module.css'

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
}

const imageVariants = {
    enter: direction => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: easeOut }
    },
    exit: direction => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3, ease: easeInOut }
    })
}

export default function Lightbox({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrev
}) {
    useLockedScroll(isOpen)

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return
        if (e.key === 'Escape') onClose()
        if (e.key === 'ArrowRight') onNext()
        if (e.key === 'ArrowLeft') onPrev()
    }, [isOpen, onClose, onNext, onPrev])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const { handlers } = useSwipe({
        onSwipeLeft: onNext,
        onSwipeRight: onPrev,
        threshold: 50
    })

    if (!photos?.length) return null

    const currentPhoto = photos[currentIndex]
    const direction = 1

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.lightbox}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <button
                        className={styles.close}
                        onClick={e => { e.stopPropagation(); onClose() }}
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className={styles.imageContainer}
                        onClick={e => e.stopPropagation()}
                        {...handlers}
                    >
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.img
                                key={currentPhoto.id}
                                src={currentPhoto.src}
                                alt={currentPhoto.alt}
                                className={styles.image}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                draggable={false}
                            />
                        </AnimatePresence>
                    </div>

                    {currentIndex > 0 && (
                        <button
                            className={`${styles.nav} ${styles.prev}`}
                            onClick={e => { e.stopPropagation(); onPrev() }}
                            aria-label="Previous"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    )}

                    {currentIndex < photos.length - 1 && (
                        <button
                            className={`${styles.nav} ${styles.next}`}
                            onClick={e => { e.stopPropagation(); onNext() }}
                            aria-label="Next"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    )}

                    <div className={styles.counter}>
                        {currentIndex + 1} / {photos.length}
                    </div>

                    {currentPhoto.alt && (
                        <div className={styles.caption}>{currentPhoto.alt}</div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
