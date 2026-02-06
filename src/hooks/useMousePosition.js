import { useState, useEffect, useRef } from 'react'
import { lerp } from '../utils/easing'

export function useMousePosition(smoothing = 0.15) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
    const targetRef = useRef({ x: 0, y: 0 })
    const currentRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    useEffect(() => {
        function handleMouseMove(e) {
            targetRef.current = { x: e.clientX, y: e.clientY }
            setPosition({ x: e.clientX, y: e.clientY })
        }

        function animate() {
            currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, smoothing)
            currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, smoothing)

            setSmoothPosition({
                x: currentRef.current.x,
                y: currentRef.current.y
            })

            rafRef.current = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove)
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [smoothing])

    return { position, smoothPosition }
}
