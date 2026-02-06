export const easeOut = [0.33, 1, 0.68, 1]
export const easeInOut = [0.76, 0, 0.24, 1]
export const easeOutExpo = [0.16, 1, 0.3, 1]
export const easeOutBack = [0.34, 1.56, 0.64, 1]
export const easeOutQuart = [0.25, 1, 0.5, 1]

export const springDefault = { stiffness: 300, damping: 30 }
export const springSmooth = { stiffness: 100, damping: 20 }
export const springBouncy = { stiffness: 400, damping: 25 }

export function lerp(start, end, factor) {
  return start + (end - start) * factor
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
