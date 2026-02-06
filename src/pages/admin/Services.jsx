import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicesApi } from '../../services/api'
import styles from './Photos.module.css'

export default function Services() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadServices()
    }, [])

    async function loadServices() {
        try {
            const res = await servicesApi.getAll()
            setServices(res.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this service?')) return
        try {
            await servicesApi.delete(id)
            setServices(services.filter(s => s.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Services</h1>
                <Link to="/admin/services/create" className={styles.uploadBtn}>
                    Create Service
                </Link>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.grid}>
                {services.map(service => (
                    <div key={service.id} className={styles.photoCard} style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{service.name}</h3>
                                {service.isPopular && <span className={styles.badge}>Popular</span>}
                            </div>
                            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                                {service.shortDescription || 'No description'}
                            </p>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#d4af37' }}>
                                {service.priceFrom && 'From '}£{service.price}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link
                                    to={`/admin/services/${service.id}`}
                                    className={styles.uploadBtn}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none', background: '#333', color: 'white' }}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className={styles.deleteBtn}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && (
                <div className={styles.empty}>
                    <p>No services yet</p>
                </div>
            )}
        </div>
    )
}
