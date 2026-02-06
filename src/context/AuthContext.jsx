import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, logout as apiLogout } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            authApi.getMe()
                .then(res => setUser(res.data))
                .catch(() => {
                    apiLogout()
                    setUser(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        setError(null)
        try {
            const data = await authApi.login(email, password)
            setUser(data.user)
            return true
        } catch (err) {
            setError(err.message || 'Login failed')
            return false
        }
    }

    const logout = async () => {
        try {
            await authApi.logout()
        } catch (e) { }
        apiLogout()
        setUser(null)
    }

    const updateProfile = async (data) => {
        const res = await authApi.updateProfile(data)
        setUser(res.data)
        return res.data
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
