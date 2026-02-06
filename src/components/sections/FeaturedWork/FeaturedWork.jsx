import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { useCursor } from '../../../context/CursorContext'
import { MasonryGrid } from '../../gallery/MasonryGrid'
import { PhotoCard } from '../../gallery/PhotoCard'
import { publicApi } from '../../../services/api'
import { fadeInUp } from '../../../utils/animations'
import styles from './FeaturedWork.module.css'

export default function FeaturedWork() {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const { setCursor, resetCursor } = useCursor()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {

        const res = await publicApi.getAlbums({ isFeatured: true, limit: 6 })
        setFeatured(res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  if (loading || featured.length === 0) return null

  return (
    <section ref={ref} className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className={styles.title}>Featured Work</h2>
          <Link
            to="/portfolio"
            className={styles.viewAll}
            onMouseEnter={() => setCursor('link')}
            onMouseLeave={resetCursor}
          >
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <MasonryGrid columns={3}>
          {featured.map(album => (
            <PhotoCard key={album.id} album={album} />
          ))}
        </MasonryGrid>
      </div>
    </section>
  )
}
