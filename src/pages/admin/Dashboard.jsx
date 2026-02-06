import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../../context/CursorContext'
import { dashboardApi, bookingsApi } from '../../services/api'
import styles from './Dashboard.module.css'

export default function Dashboard() {
    const { setCursor, resetCursor } = useCursor()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadStats()
    }, [])

    async function loadStats() {
        try {
            const res = await dashboardApi.getStats()
            setStats(res.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    }

    if (loading) {
        return <div className={styles.loading}>Loading...</div>
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 variants={itemVariants} className={styles.title}>Dashboard</motion.h1>

            <motion.div variants={itemVariants} className={styles.statsGrid}>
                <div
                    className={styles.statCard}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                >
                    <span className={styles.statNumber}>{stats?.totalPhotos || 0}</span>
                    <span className={styles.statLabel}>Total Photos</span>
                </div>
                <div
                    className={styles.statCard}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                >
                    <span className={styles.statNumber}>{stats?.totalAlbums || 0}</span>
                    <span className={styles.statLabel}>Albums</span>
                </div>
                <div
                    className={styles.statCard}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                >
                    <span className={styles.statNumber}>{stats?.totalBookings || 0}</span>
                    <span className={styles.statLabel}>Total Bookings</span>
                </div>
                <div
                    className={`${styles.statCard} ${stats?.newBookings > 0 ? styles.highlight : ''}`}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                >
                    <span className={styles.statNumber}>{stats?.newBookings || 0}</span>
                    <span className={styles.statLabel}>New Bookings</span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className={styles.section}>
                <h2>Recent Bookings</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Client</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentBookings?.map((booking, i) => (
                                <motion.tr
                                    key={booking.id}
                                    variants={itemVariants}
                                    onMouseEnter={() => setCursor('hover')}
                                    onMouseLeave={resetCursor}
                                >
                                    <td>{booking.bookingNumber}</td>
                                    <td>{booking.clientName}</td>
                                    <td>{booking.service}</td>
                                    <td>{new Date(booking.shootDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                            {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No bookings yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    )
}
