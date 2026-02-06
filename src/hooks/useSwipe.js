import { useRef, useState } from 'react'

export function useSwipe(options = {}) {
    const {
        threshold = 50,
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown
    } = options

    const [swiping, setSwiping] = useState(false)
    const [delta, setDelta] = useState({ x: 0, y: 0 })
    const startRef = useRef({ x: 0, y: 0 })

    function handleTouchStart(e) {
        const touch = e.touches[0]
        startRef.current = { x: touch.clientX, y: touch.clientY }
        setSwiping(true)
        setDelta({ x: 0, y: 0 })
    }

    function handleTouchMove(e) {
        if (!swiping) return
        const touch = e.touches[0]
        const dx = touch.clientX - startRef.current.x
        const dy = touch.clientY - startRef.current.y
        setDelta({ x: dx, y: dy })
    }

    function handleTouchEnd() {
        if (!swiping) return

        const { x, y } = delta
        const absX = Math.abs(x)
        const absY = Math.abs(y)

        if (absX > absY && absX > threshold) {
            if (x > 0) onSwipeRight?.()
            else onSwipeLeft?.()
        } else if (absY > absX && absY > threshold) {
            if (y > 0) onSwipeDown?.()
            else onSwipeUp?.()
        }

        setSwiping(false)
        setDelta({ x: 0, y: 0 })
    }

    const handlers = {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
    }

    return { handlers, delta, swiping }
}
