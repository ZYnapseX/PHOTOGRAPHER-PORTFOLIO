import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { servicesApi, categoriesApi } from '../../services/api'
import styles from './Photos.module.css'

export default function ServiceForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = !!id

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        categoryId: '',
        price: '',
        priceFrom: false,
        duration: '',
        features: '[]',
        includes: '[]',
        isPopular: false,
        isActive: true,
        sortOrder: 0
    })

    // UI state for array inputs
    const [featuresList, setFeaturesList] = useState([])
    const [includesList, setIncludesList] = useState([])
    const [newFeature, setNewFeature] = useState('')
    const [newInclude, setNewInclude] = useState('')

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadCategories()
        if (isEdit) {
            loadService()
        }
    }, [id])

    async function loadCategories() {
        try {
            const res = await categoriesApi.getAll()
            setCategories(res.data)
            if (!isEdit && res.data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: res.data[0].id }))
            }
        } catch (e) { }
    }

    async function loadService() {
        try {
            const res = await servicesApi.getAll() // Ideally getOne but getAll is cached/fast enough for now or use getOne if available
            // Wait, servicesApi.getAll returns all. I should use getOne if it exists. 
            // Checking api.js: servicesApi has getAll, create, update, delete. specific getOne is missing in my memory of api.js content.
            // Let's check api.js content or just find from getAll.
            // Actually, for edit, I need the specific service. 
            // In api.js I wrote earlier:
            // export const servicesApi = {
            //    getAll: () => request('/admin/services'),
            //    create: (data) => request('/admin/services', { method: 'POST', body: data }),
            //    update: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: data }),
            //    delete: (id) => request(`/admin/services/${id}`, { method: 'DELETE' })
            // }
            // It seems I missed getOne for services. I'll rely on getAll and find by id for now as list is small.
            // Or I can add getOne.

            const allServices = res.data
            const service = allServices.find(s => s.id === id)

            if (service) {
                setFormData({
                    name: service.name,
                    slug: service.slug,
                    shortDescription: service.shortDescription || '',
                    description: service.description || '',
                    categoryId: service.categoryId,
                    price: service.price,
                    priceFrom: service.priceFrom,
                    duration: service.duration || '',
                    features: service.features, // JSON string
                    includes: service.includes, // JSON string
                    isPopular: service.isPopular,
                    isActive: service.isActive,
                    sortOrder: service.sortOrder
                })

                try {
                    setFeaturesList(JSON.parse(service.features || '[]'))
                } catch { setFeaturesList([]) }

                try {
                    setIncludesList(JSON.parse(service.includes || '[]'))
                } catch { setIncludesList([]) }
            }
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

        const submitData = {
            ...formData,
            features: JSON.stringify(featuresList),
            includes: JSON.stringify(includesList),
            price: parseFloat(formData.price)
        }

        try {
            if (isEdit) {
                await servicesApi.update(id, submitData)
            } else {
                await servicesApi.create(submitData)
            }
            navigate('/admin/services')
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

    const addItem = (list, setList, item, setItem) => {
        if (!item.trim()) return
        setList([...list, item.trim()])
        setItem('')
    }

    const removeItem = (list, setList, index) => {
        setList(list.filter((_, i) => i !== index))
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{isEdit ? 'Edit Service' : 'Create Service'}</h1>
                <button
                    type="button"
                    onClick={() => navigate('/admin/services')}
                    className={styles.uploadBtn}
                    style={{ background: '#333', color: 'white' }}
                >
                    Cancel
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '800px' }}>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                </div>

                <div className={styles.formGroup}>
                    <label>Short Description</label>
                    <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Full Description</label>
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
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Duration</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g. 2 hours"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Features (Bulleted list)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            value={newFeature}
                            onChange={e => setNewFeature(e.target.value)}
                            className={styles.input}
                            placeholder="Add feature"
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(featuresList, setFeaturesList, newFeature, setNewFeature))}
                        />
                        <button
                            type="button"
                            onClick={() => addItem(featuresList, setFeaturesList, newFeature, setNewFeature)}
                            className={styles.uploadBtn}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Add
                        </button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {featuresList.map((item, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#222', marginBottom: '0.25rem', borderRadius: '4px' }}>
                                <span>{item}</span>
                                <button type="button" onClick={() => removeItem(featuresList, setFeaturesList, index)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>×</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.formGroup}>
                    <label>Includes (What's included)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            value={newInclude}
                            onChange={e => setNewInclude(e.target.value)}
                            className={styles.input}
                            placeholder="Add included item"
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(includesList, setIncludesList, newInclude, setNewInclude))}
                        />
                        <button
                            type="button"
                            onClick={() => addItem(includesList, setIncludesList, newInclude, setNewInclude)}
                            className={styles.uploadBtn}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Add
                        </button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {includesList.map((item, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#222', marginBottom: '0.25rem', borderRadius: '4px' }}>
                                <span>{item}</span>
                                <button type="button" onClick={() => removeItem(includesList, setIncludesList, index)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>×</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="priceFrom"
                            checked={formData.priceFrom}
                            onChange={handleChange}
                        />
                        "Price From" Label
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="isPopular"
                            checked={formData.isPopular}
                            onChange={handleChange}
                        />
                        Popular
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        Active
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label>Sort Order</label>
                    <input
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={saving} className={styles.uploadBtn}>
                        {saving ? 'Saving...' : (isEdit ? 'Update Service' : 'Create Service')}
                    </button>
                </div>
            </form>
        </div>
    )
}
