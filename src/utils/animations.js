import { easeOut, easeInOut } from './easing'

export const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: easeOut }
    }
}

export const fadeInDown = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easeOut }
    }
}

export const fadeInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: easeOut }
    }
}

export const fadeInRight = {
    hidden: { opacity: 0, x: 80 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: easeOut }
    }
}

export const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: easeOut }
    }
}

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export const staggerFast = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
}

export const slideUp = {
    hidden: { y: '100%' },
    visible: {
        y: 0,
        transition: { duration: 0.8, ease: easeOut }
    },
    exit: {
        y: '-100%',
        transition: { duration: 0.6, ease: easeInOut }
    }
}

export const overlayReveal = {
    hidden: { scaleY: 1 },
    visible: {
        scaleY: 0,
        transition: { duration: 1, ease: easeInOut, originY: 0 }
    }
}

export const charReveal = {
    hidden: { y: '100%', opacity: 0 },
    visible: i => ({
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: easeOut,
            delay: i * 0.03
        }
    })
}

export const wordReveal = {
    hidden: { y: '100%', opacity: 0 },
    visible: i => ({
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeOut,
            delay: i * 0.08
        }
    })
}

export function createStagger(baseDelay = 0.1, maxItems = 5) {
    return {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: baseDelay,
                delayChildren: 0.1
            }
        }
    }
}
