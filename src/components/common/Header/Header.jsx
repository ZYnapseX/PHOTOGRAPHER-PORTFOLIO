import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCursor } from '../../../context/CursorContext'
import { Button } from '../Button'
import MobileMenu from './MobileMenu'
import styles from './Header.module.css'

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' }
]

export default function Header() {
    const [isHidden, setHidden] = useState(false)
    const [isScrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [lastScroll, setLastScroll] = useState(0)
    const { setCursor, resetCursor } = useCursor()
    const location = useLocation()

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    useEffect(() => {
        function handleScroll() {
            const currentScroll = window.scrollY

            setScrolled(currentScroll > 50)

            if (currentScroll > 100) {
                setHidden(currentScroll > lastScroll)
            } else {
                setHidden(false)
            }

            setLastScroll(currentScroll)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScroll])

    const headerClasses = [
        styles.header,
        isHidden && styles.headerHidden,
        isScrolled && styles.headerScrolled
    ].filter(Boolean).join(' ')

    return (
        <>
            <header className={headerClasses}>
                <div className={styles.inner}>
                    <Link
                        to="/"
                        className={styles.logo}
                        onMouseEnter={() => setCursor('link')}
                        onMouseLeave={resetCursor}
                    >
                        Alexandra Volkova
                    </Link>

                    <nav className={styles.nav}>
                        {navLinks.map(({ path, label }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                }
                                onMouseEnter={() => setCursor('link')}
                                onMouseLeave={resetCursor}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className={styles.cta}>
                        <Button to="/booking" size="sm">Book Now</Button>
                    </div>

                    <button
                        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.burgerLine} />
                        <span className={styles.burgerLine} />
                        <span className={styles.burgerLine} />
                    </button>
                </div>
            </header>

            <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
        </>
    )
}
