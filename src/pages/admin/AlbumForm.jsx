import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { albumsApi, categoriesApi } from '../../services/api'
import styles from './Photos.module.css'

export default function AlbumForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        location: '',
        shootDate: '',
        isPublished: false,
        isFeatured: false
    })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadCategories()
        if (isEdit) {
            loadAlbum()
        }
    }, [id])

    async function loadCategories() {
        try {
            const res = await categoriesApi.getAll()
            setCategories(res.data)
            if (!isEdit && res.data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: res.data[0].id }))
            }
        } catch (e) {}
    }

    async function loadAlbum() {
        try {
            const res = await albumsApi.getOne(id)
            const album = res.data
            setFormData({
                title: album.title,
                description: album.description || '',
                categoryId: album.categoryId,
                location: album.location || '',
                shootDate: album.shootDate ? album.shootDate.split('T')[0] : '',
                isPublished: album.isPublished,
                isFeatured: album.isFeatured
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            if (isEdit) {
                await albumsApi.update(id, formData)
            } else {
                await albumsApi.create(formData)
            }
            navigate('/admin/albums')
        } catch (err) {
            setError(err.message)
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{isEdit ? 'Edit Album' : 'Create Album'}</h1>
                <button 
                    type="button" 
                    onClick={() => navigate('/admin/albums')}
                    className={styles.uploadBtn}
                    style={{ background: '#333', color: 'white' }}
                >
                    Cancel
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '800px' }}>
                <div className={styles.formGroup}>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Category</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={styles.input}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Shoot Date</label>
                        <input
                            type="date"
                            name="shootDate"
                            value={formData.shootDate}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                        />
                        Published
                    </label>
                    
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        Featured
                    </label>
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={saving} className={styles.uploadBtn}>
                        {saving ? 'Saving...' : (isEdit ? 'Update Album' : 'Create Album')}
                    </button>
                </div>
            </form>
        </div>
    )
}
