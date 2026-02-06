import { useRef, useEffect, useState } from 'react'

export function useInView(options = {}) {
    const ref = useRef(null)
    const [isInView, setInView] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)

    const { threshold = 0.2, once = true, rootMargin = '0px' } = options

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = entry.isIntersecting
                setInView(visible)

                if (visible && once && !hasAnimated) {
                    setHasAnimated(true)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [threshold, rootMargin, once, hasAnimated])

    return { ref, isInView: once ? (hasAnimated || isInView) : isInView }
}
