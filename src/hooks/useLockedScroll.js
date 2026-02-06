import { useEffect, useCallback } from 'react'

export function useLockedScroll(locked) {
    const lockScroll = useCallback(() => {
        const scrollY = window.scrollY
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'
    }, [])

    const unlockScroll = useCallback(() => {
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }, [])

    useEffect(() => {
        if (locked) {
            lockScroll()
        } else {
            unlockScroll()
        }

        return () => unlockScroll()
    }, [locked, lockScroll, unlockScroll])
}
