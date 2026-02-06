import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from '../../../hooks/useInView'
import { useCursor } from '../../../context/CursorContext'
import { publicApi } from '../../../services/api'
import { fadeInUp, staggerContainer } from '../../../utils/animations'
import styles from './Categories.module.css'

export default function Categories() {
    const { ref, isInView } = useInView({ threshold: 0.2 })
    const { setCursor, resetCursor } = useCursor()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await publicApi.getCategories()
                setCategories(res.data || [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        loadCategories()
    }, [])

    if (loading || categories.length === 0) return null

    return (
        <section ref={ref} className={styles.section}>
            <div className="container">
                <motion.div
                    className={styles.header}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <h2 className={styles.title}>Explore Categories</h2>
                    <p className={styles.subtitle}>
                        From intimate portraits to grand celebrations, discover the full range of my photography
                    </p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {categories.map(category => (
                        <motion.div key={category.id} variants={fadeInUp}>
                            <Link
                                to={`/portfolio?category=${category.slug}`}
                                className={styles.card}
                                onMouseEnter={() => setCursor('view', 'Explore')}
                                onMouseLeave={resetCursor}
                            >
                                <img
                                    src={category.coverImage?.startsWith('http') ? category.coverImage : `http://localhost:5000${category.coverImage || '/placeholder.jpg'}`}
                                    alt={category.name}
                                    className={styles.image}
                                    loading="lazy"
                                />
                                <div className={styles.overlay} />
                                <div className={styles.content}>
                                    <span className={styles.label}>Category</span>
                                    <h3 className={styles.name}>{category.name}</h3>
                                    <p className={styles.count}>{category._count?.albums || 0} Projects</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
