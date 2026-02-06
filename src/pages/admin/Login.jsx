import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCursor } from '../../context/CursorContext'
import { Button } from '../../components/common/Button'
import styles from './Login.module.css'

const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export default function Login() {
    const { user, login } = useAuth()
    const { setCursor, resetCursor } = useCursor()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (user) {
        return <Navigate to="/admin" replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(email, password)

        if (!result.success) {
            setError(result.error)
        }
        setLoading(false)
    }

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.card}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className={styles.logo}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Admin Login
                </motion.h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <motion.div
                            className={styles.error}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.div
                        className={styles.field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setCursor('text')}
                            onBlur={resetCursor}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className={styles.field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setCursor('text')}
                            onBlur={resetCursor}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className={styles.submit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </motion.div>
                </form>

                <motion.p
                    className={styles.hint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Demo: <code>admin@alexandra.com</code> / <code>admin123</code>
                </motion.p>
            </motion.div>
        </div>
    )
}
