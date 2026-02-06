import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { bookingsApi } from '../../services/api'
import styles from './Bookings.module.css'

export default function Bookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('All')

    const filters = ['All', 'NEW', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    useEffect(() => {
        loadBookings()
    }, [])

    async function loadBookings() {
        try {
            const res = await bookingsApi.getAll()
            setBookings(res.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus(id, status) {
        try {
            await bookingsApi.update(id, { status })
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
        } catch (err) {
            setError(err.message)
        }
    }

    const filtered = activeFilter === 'All'
        ? bookings
        : bookings.filter(b => b.status === activeFilter)

    if (loading) return <div className={styles.loading}>Loading bookings...</div>

    return (
        <div>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.filters}>
                {filters.map(filter => (
                    <button
                        key={filter}
                        className={`${styles.filter} ${activeFilter === filter ? styles.filterActive : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(booking => (
                            <motion.tr
                                key={booking.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <td>
                                    <div className={styles.clientName}>{booking.clientName}</div>
                                    <div className={styles.clientEmail}>{booking.clientEmail}</div>
                                </td>
                                <td>{booking.service?.name}</td>
                                <td>{new Date(booking.shootDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                                        className={styles.statusSelect}
                                    >
                                        {filters.slice(1).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </motion.tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
