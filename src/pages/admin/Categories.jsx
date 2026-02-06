import { useState, useEffect } from 'react'
import { categoriesApi } from '../../services/api'
import styles from './Photos.module.css'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editingId, setEditingId] = useState(null)

    // Form state
    const [formData, setFormData] = useState({ name: '', description: '', sortOrder: 0 })
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        try {
            const res = await categoriesApi.getAll()
            setCategories(res.data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            if (editingId) {
                const res = await categoriesApi.update(editingId, formData)
                setCategories(categories.map(c => c.id === editingId ? res.data : c))
                setEditingId(null)
            } else {
                const res = await categoriesApi.create(formData)
                setCategories([...categories, res.data])
                setIsCreating(false)
            }
            setFormData({ name: '', description: '', sortOrder: 0 })
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this category?')) return
        try {
            await categoriesApi.delete(id)
            setCategories(categories.filter(c => c.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    function startEdit(category) {
        setEditingId(category.id)
        setFormData({
            name: category.name,
            description: category.description || '',
            sortOrder: category.sortOrder
        })
        setIsCreating(true)
    }

    const displayedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Categories</h1>
                {!isCreating && (
                    <button
                        onClick={() => { setIsCreating(true); setEditingId(null); setFormData({ name: '', description: '', sortOrder: 0 }) }}
                        className={styles.uploadBtn}
                    >
                        New Category
                    </button>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isCreating && (
                <div className={styles.formCard} style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Category' : 'New Category'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                className={styles.input}
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className={styles.input}
                                rows={3}
                            />
                            <input
                                type="number"
                                placeholder="Sort Order"
                                value={formData.sortOrder}
                                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className={styles.uploadBtn}>Save</button>
                            <button
                                type="button"
                                onClick={() => { setIsCreating(false); setEditingId(null); }}
                                className={styles.deleteBtn}
                                style={{ background: '#444' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.grid}>
                {displayedCategories.map(category => (
                    <div key={category.id} className={styles.photoCard} style={{ padding: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{category.name}</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
                                {category.description || 'No description'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>Order: {category.sortOrder}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => startEdit(category)}
                                    style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
