import { useState, useEffect } from 'react'
import { settingsApi } from '../../services/api'
import styles from './Settings.module.css'

export default function Settings() {
    const [settings, setSettings] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        loadSettings()
    }, [])

    async function loadSettings() {
        try {
            const res = await settingsApi.getAll()
            setSettings(res.data || [])
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
        setMessage(null)

        const formData = new FormData(e.target)
        const updates = []

        for (const [key, value] of formData.entries()) {
            updates.push({ key, value })
        }

        try {
            await Promise.all(updates.map(u => settingsApi.update(u)))
            setMessage('Settings saved successfully')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className={styles.loading}>Loading settings...</div>

    return (
        <div className={styles.container}>
            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.success}>{message}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <h2>General Information</h2>
                    {settings.filter(s => s.group === 'general').map(setting => (
                        <div key={setting.key} className={styles.formGroup}>
                            <label htmlFor={setting.key}>{setting.key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                                type={setting.type || 'text'}
                                id={setting.key}
                                name={setting.key}
                                defaultValue={setting.value}
                                className={styles.input}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={saving} className={styles.saveBtn}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
