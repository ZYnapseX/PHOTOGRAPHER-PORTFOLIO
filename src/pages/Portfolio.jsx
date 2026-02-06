import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MasonryGrid } from '../components/gallery/MasonryGrid'
import { PhotoCard } from '../components/gallery/PhotoCard'
import { CategoryFilter } from '../components/gallery/CategoryFilter'
import { publicApi } from '../services/api'
import { fadeInUp } from '../utils/animations'
import styles from './Portfolio.module.css'

export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [albums, setAlbums] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [albumsRes, categoriesRes] = await Promise.all([
                    publicApi.getAlbums(),
                    publicApi.getCategories()
                ])
                setAlbums(albumsRes.data)
                setCategories([
                    { id: 'all', name: 'All Work' },
                    ...categoriesRes.data.map(c => ({ id: c.slug, name: c.name }))
                ])
            } catch (error) {
                console.error('Failed to fetch portfolio data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredAlbums = useMemo(() => {
        if (activeCategory === 'all') return albums
        // Match category slug
        return albums.filter(album => album.category?.slug === activeCategory)
    }, [activeCategory, albums])

    if (loading) {
        return (
            <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className={styles.loading}>Loading portfolio...</div>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.h1
                        className={styles.title}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        Portfolio
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        A curated collection of my best work
                    </motion.p>
                </div>
            </section>

            <section className={styles.filters}>
                <div className="container">
                    <CategoryFilter
                        categories={categories}
                        active={activeCategory}
                        onChange={setActiveCategory}
                    />
                </div>
            </section>

            <section className={styles.gallery}>
                <div className="container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <MasonryGrid columns={3}>
                                {filteredAlbums.map(album => (
                                    <PhotoCard key={album.id} album={album} />
                                ))}
                            </MasonryGrid>

                            {filteredAlbums.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                                    No albums found in this category.
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    )
}
