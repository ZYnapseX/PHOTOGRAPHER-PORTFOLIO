import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCursor } from '../context/CursorContext'
import { MasonryGrid } from '../components/gallery/MasonryGrid'
import { PhotoCard } from '../components/gallery/PhotoCard'
import { Lightbox } from '../components/gallery/Lightbox'
import { publicApi } from '../services/api'
import { formatDate } from '../utils/helpers'
import { fadeInUp } from '../utils/animations'
import styles from './Album.module.css'

export default function Album() {
    const { slug } = useParams()
    const { setCursor, resetCursor } = useCursor()

    const [album, setAlbum] = useState(null)
    const [relatedAlbums, setRelatedAlbums] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

    useEffect(() => {
        async function loadAlbum() {
            setLoading(true)
            try {
                const res = await publicApi.getAlbum(slug)
                setAlbum(res.data)

                // Fetch related albums
                if (res.data?.category?.id) {
                    // TODO: Add related endpoint or just fetch albums by category
                    const related = await publicApi.getAlbums({ categoryId: res.data.category.id, limit: 3 })
                    setRelatedAlbums(related.data.filter(a => a.id !== res.data.id))
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadAlbum()
    }, [slug])

    if (loading) return (
        <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className={styles.loading}>Loading album...</div>
        </div>
    )

    if (error || !album) {
        return <Navigate to="/portfolio" replace />
    }

    const openLightbox = (index) => {
        setCurrentPhotoIndex(index)
        setLightboxOpen(true)
    }

    // Prepare photos for lightbox - format path correctly
    const lightboxPhotos = album.photos.map(p => ({
        ...p,
        src: p.pathLarge?.startsWith('http') ? p.pathLarge : `http://localhost:5000${p.pathLarge}`
    }))

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <img
                        src={album.coverImage?.startsWith('http') ? album.coverImage : `http://localhost:5000${album.coverImage}`}
                        alt={album.title}
                    />
                </div>
                <div className={`container ${styles.heroContent}`}>
                    <Link to="/portfolio" className={styles.back}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Portfolio
                    </Link>
                    <motion.h1
                        className={styles.title}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        {album.title}
                    </motion.h1>
                    <motion.div
                        className={styles.meta}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        <span>{album.location}</span>
                        <span>{formatDate(album.shootDate)}</span>
                        <span style={{ textTransform: 'capitalize' }}>{album.category?.name}</span>
                    </motion.div>
                </div>
            </section>

            <section className={styles.gallery}>
                <div className="container">
                    <motion.p
                        className={styles.description}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                    >
                        {album.description}
                    </motion.p>

                    <div className={styles.grid}>
                        {album.photos.map((photo, index) => (
                            <motion.button
                                key={photo.id}
                                className={styles.photo}
                                onClick={() => openLightbox(index)}
                                onMouseEnter={() => setCursor('view', 'View')}
                                onMouseLeave={resetCursor}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <img
                                    src={photo.pathThumbnail?.startsWith('http') ? photo.pathThumbnail : `http://localhost:5000${photo.pathThumbnail}`}
                                    alt={photo.altText || photo.title}
                                    loading="lazy"
                                />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {relatedAlbums.length > 0 && (
                <section className={styles.related}>
                    <div className="container">
                        <h2 className={styles.relatedTitle}>Related Work</h2>
                        <MasonryGrid columns={3}>
                            {relatedAlbums.map(a => (
                                <PhotoCard key={a.id} album={a} />
                            ))}
                        </MasonryGrid>
                    </div>
                </section>
            )}

            <Lightbox
                photos={lightboxPhotos}
                currentIndex={currentPhotoIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setCurrentPhotoIndex(i => Math.min(i + 1, lightboxPhotos.length - 1))}
                onPrev={() => setCurrentPhotoIndex(i => Math.max(i - 1, 0))}
            />
        </div>
    )
}
