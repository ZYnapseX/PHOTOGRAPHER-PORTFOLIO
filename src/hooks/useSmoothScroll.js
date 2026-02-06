import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export function useSmoothScroll(enabled = true) {
    const lenisRef = useRef(null)

    useEffect(() => {
        if (!enabled) return

        const lenis = new Lenis({
            duration: 1.2,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true
        })

        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
            lenisRef.current = null
        }
    }, [enabled])

    return lenisRef
}
