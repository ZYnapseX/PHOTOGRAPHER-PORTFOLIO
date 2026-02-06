import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { albumsApi } from '../../services/api'
import { useCursor } from '../../context/CursorContext'
import styles from './Photos.module.css'

export default function Albums() {
    const { setCursor, resetCursor } = useCursor()
    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [filters, setFilters] = useState({ page: 1, limit: 20 })

    useEffect(() => {
        loadAlbums()
    }, [filters])

    async function loadAlbums() {
        try {
            const res = await albumsApi.getAll(filters)
            setAlbums(res.data)
            setPagination(res.pagination)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this album? Photos inside will not be deleted.')) return
        try {
            await albumsApi.delete(id)
            setAlbums(albums.filter(a => a.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Albums</h1>
                <Link to="/admin/albums/create" className={styles.uploadBtn}>
                    Create Album
                </Link>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading albums...</div>
            ) : (
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {albums.map(album => (
                            <motion.div
                                key={album.id}
                                className={styles.photoCard}
                                variants={itemVariants}
                                layout
                                onMouseEnter={() => setCursor('view', 'View')}
                                onMouseLeave={resetCursor}
                            >
                                <div className={styles.photoImage}>
                                    {album.coverImage ? (
                                        <img
                                            src={album.coverImage.startsWith('http') ? album.coverImage : `http://localhost:5000${album.coverImage}`}
                                            alt={album.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#666' }}>
                                            No Cover
                                        </div>
                                    )}
                                    <div className={styles.photoOverlay}>
                                        <span className={styles.badge}>
                                            {album.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                        <button
                                            className={styles.deleteIcon}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleDelete(album.id)
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.photoInfo}>
                                    <span className={styles.photoTitle}>{album.title}</span>
                                    <span className={styles.photoMeta}>
                                        {album.photos?.length || 0} photos • {album.category?.name || 'Uncategorized'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && albums.length === 0 && (
                <div className={styles.empty}>
                    <p>No albums yet</p>
                </div>
            )}
        </div>
    )
}
