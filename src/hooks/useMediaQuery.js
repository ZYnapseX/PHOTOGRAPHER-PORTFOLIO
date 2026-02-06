import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)

        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        function listener(e) {
            setMatches(e.matches)
        }

        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query, matches])

    return matches
}

export function useIsMobile() {
    return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet() {
    return useMediaQuery('(max-width: 1024px)')
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1025px)')
}

export function usePrefersReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)')
}
