import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCursor } from '../../context/CursorContext'
import styles from './AdminLayout.module.css'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
    { path: '/admin/photos', label: 'Photos', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/albums', label: 'Albums', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { path: '/admin/bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/categories', label: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { path: '/admin/services', label: 'Services', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
]

const pageTitles = {
    '/admin': 'Dashboard',
    '/admin/photos': 'Photo Management',
    '/admin/albums': 'Album Management',
    '/admin/bookings': 'Bookings',
    '/admin/categories': 'Categories',
    '/admin/services': 'Services',
    '/admin/settings': 'Settings'
}

const sidebarVariants = {
    hidden: { x: -260, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: 0.2 }
    }
}

export default function AdminLayout() {
    const { user, loading, logout } = useAuth()
    const { setCursor, resetCursor } = useCursor()
    const location = useLocation()

    if (loading) {
        return <div className={styles.loading}>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />
    }

    const pageTitle = pageTitles[location.pathname] || 'Admin'

    return (
        <div className={styles.layout}>
            <motion.aside
                className={styles.sidebar}
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className={styles.logo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Admin Panel
                </motion.div>

                <nav className={styles.nav}>
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                                onMouseEnter={() => setCursor('link')}
                                onMouseLeave={resetCursor}
                            >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.label}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                <motion.div
                    className={styles.logout}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button
                        onClick={logout}
                        className={styles.logoutBtn}
                        onMouseEnter={() => setCursor('link')}
                        onMouseLeave={resetCursor}
                    >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </motion.div>
            </motion.aside>

            <main className={styles.main}>
                <motion.header
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className={styles.pageTitle}>{pageTitle}</h1>
                    <div className={styles.userInfo}>
                        <span>{user.name}</span>
                        <motion.div
                            className={styles.avatar}
                            whileHover={{ scale: 1.05 }}
                            onMouseEnter={() => setCursor('link')}
                            onMouseLeave={resetCursor}
                        >
                            {user.name.charAt(0)}
                        </motion.div>
                    </div>
                </motion.header>

                <motion.div
                    className={styles.content}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    key={location.pathname}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    )
}
