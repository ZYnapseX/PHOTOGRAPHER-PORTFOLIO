import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCursor } from '../../context/CursorContext'
import { photosApi, albumsApi, categoriesApi } from '../../services/api'
import styles from './Photos.module.css'

export default function Photos() {
    const { setCursor, resetCursor } = useCursor()
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [selectedPhotos, setSelectedPhotos] = useState([])
    const [categories, setCategories] = useState([])
    const [albums, setAlbums] = useState([])
    const [filters, setFilters] = useState({ page: 1, limit: 20 })
    const [pagination, setPagination] = useState(null)
    const fileInputRef = useRef(null)

    useEffect(() => {
        loadPhotos()
        loadCategories()
        loadAlbums()
    }, [filters])

    async function loadPhotos() {
        try {
            const res = await photosApi.getAll(filters)
            setPhotos(res.data)
            setPagination(res.pagination)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function loadCategories() {
        try {
            const res = await categoriesApi.getAll()
            setCategories(res.data)
        } catch (e) { }
    }

    async function loadAlbums() {
        try {
            const res = await albumsApi.getAll()
            setAlbums(res.data)
        } catch (e) { }
    }

    async function handleUpload(e) {
        const files = Array.from(e.target.files)
        if (!files.length) return

        setUploading(true)
        try {
            await photosApi.upload(files)
            loadPhotos()
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this photo?')) return
        try {
            await photosApi.delete(id)
            setPhotos(photos.filter(p => p.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleBulkDelete() {
        if (!selectedPhotos.length) return
        if (!confirm(`Delete ${selectedPhotos.length} photos?`)) return

        try {
            await photosApi.bulkDelete(selectedPhotos)
            setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)))
            setSelectedPhotos([])
        } catch (err) {
            setError(err.message)
        }
    }

    function toggleSelect(id) {
        setSelectedPhotos(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    }

    const itemVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Photos</h1>
                <div className={styles.actions}>
                    {selectedPhotos.length > 0 && (
                        <button
                            className={styles.deleteBtn}
                        onMouseEnter={() => setCursor('hover')}
                        onMouseLeave={resetCursor}
                        >
                            Delete ({selectedPhotos.length})
                        </button>
                    )}
                    <button
                        className={styles.uploadBtn}
                        onMouseEnter={() => setCursor('hover')}
                        onMouseLeave={resetCursor}
                    >
                        {uploading ? 'Uploading...' : 'Upload Photos'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading photos...</div>
            ) : (
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {photos.map(photo => (
                            <motion.div
                                key={photo.id}
                                className={`${styles.photoCard} ${selectedPhotos.includes(photo.id) ? styles.selected : ''}`}
                                variants={itemVariants}
                                onMouseEnter={() => setCursor('view', 'View')}
                                onMouseLeave={resetCursor}
                            >
                                <div className={styles.photoImage}>
                                    <img
                                        src={photo.pathThumbnail?.startsWith('http') ? photo.pathThumbnail : `http://localhost:5000${photo.pathThumbnail}`}
                                        alt={photo.title || 'Photo'}
                                        loading="lazy"
                                    />
                                    <div className={styles.photoOverlay}>
                                        <label className={styles.checkbox}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPhotos.includes(photo.id)}
                                                onChange={() => toggleSelect(photo.id)}
                                            />
                                        </label>
                                        <button
                                            className={styles.deleteIcon}
                                            onClick={() => handleDelete(photo.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.photoInfo}>
                                    <span className={styles.photoTitle}>{photo.title || photo.filename}</span>
                                    <span className={styles.photoMeta}>{photo.album?.title || 'No album'}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        disabled={!pagination.hasPrev}
                        onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button
                        disabled={!pagination.hasNext}
                        onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    >
                        Next
                    </button>
                </div>
            )}

            {!loading && photos.length === 0 && (
                <div className={styles.empty}>
                    <p>No photos yet</p>
                    <button onClick={() => fileInputRef.current?.click()}>
                        Upload your first photos
                    </button>
                </div>
            )}
        </div>
    )
}
