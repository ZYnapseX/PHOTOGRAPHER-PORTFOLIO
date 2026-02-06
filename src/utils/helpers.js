export function getImageUrl(path) {
    return `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1200&q=80`
}

export function formatPrice(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0
    }).format(amount)
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date))
}

export function debounce(fn, delay) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

export function throttle(fn, limit) {
    let inThrottle
    return (...args) => {
        if (!inThrottle) {
            fn(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

export function splitText(text) {
    return text.split('').map((char, i) => ({
        char: char === ' ' ? '\u00A0' : char,
        index: i
    }))
}

export function splitWords(text) {
    return text.split(' ').map((word, i) => ({
        word,
        index: i
    }))
}

export function isMobile() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 768px)').matches
}

export function isTouch() {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function prefersReducedMotion() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
