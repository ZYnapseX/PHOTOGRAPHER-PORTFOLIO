import { useState, useRef, useEffect } from 'react'
import styles from './LazyImage.module.css'

export default function LazyImage({
    src,
    alt,
    className = '',
    aspectRatio,
    ...props
}) {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(false)
    const imgRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '50px' }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const wrapperStyle = aspectRatio
        ? { aspectRatio }
        : {}

    return (
        <div
            ref={imgRef}
            className={`${styles.wrapper} ${className}`}
            style={wrapperStyle}
        >
            <div className={styles.placeholder} />
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    className={`${styles.image} ${loaded ? styles.loaded : styles.loading}`}
                    onLoad={() => setLoaded(true)}
                    {...props}
                />
            )}
        </div>
    )
}
