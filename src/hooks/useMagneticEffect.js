import { useRef, useEffect, useState } from 'react'
import { lerp } from '../utils/easing'

export function useMagneticEffect(strength = 0.3) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let animationId
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    function animate() {
      currentX = lerp(currentX, targetX, 0.15)
      currentY = lerp(currentY, targetY, 0.15)
      setOffset({ x: currentX, y: currentY })
      animationId = requestAnimationFrame(animate)
    }

    function handleMouseMove(e) {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      
      targetX = distX * strength
      targetY = distY * strength
    }

    function handleMouseLeave() {
      targetX = 0
      targetY = 0
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    animationId = requestAnimationFrame(animate)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [strength])

  return { ref, offset }
}
