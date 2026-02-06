import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { fadeInUp, staggerContainer } from '../../../utils/animations'
import styles from './Footer.module.css'

export default function Footer() {
    const { ref, isInView } = useInView({ threshold: 0.2 })

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className={styles.footer}>
            <div className="container">
                <motion.div
                    ref={ref}
                    className={styles.inner}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <motion.div className={styles.brand} variants={fadeInUp}>
                        <div className={styles.logo}>Alexandra Volkova</div>
                        <p className={styles.tagline}>
                            Capturing life's beautiful moments through the lens.
                            Based in London, available worldwide.
                        </p>
                    </motion.div>

                    <motion.div className={styles.column} variants={fadeInUp}>
                        <h4>Navigate</h4>
                        <div className={styles.links}>
                            <Link to="/">Home</Link>
                            <Link to="/portfolio">Portfolio</Link>
                            <Link to="/about">About</Link>
                            <Link to="/services">Services</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </motion.div>

                    <motion.div className={styles.column} variants={fadeInUp}>
                        <h4>Services</h4>
                        <div className={styles.links}>
                            <Link to="/services">Wedding Photography</Link>
                            <Link to="/services">Portrait Sessions</Link>
                            <Link to="/services">Commercial</Link>
                            <Link to="/booking">Book a Session</Link>
                        </div>
                    </motion.div>

                    <motion.div className={styles.column} variants={fadeInUp}>
                        <h4>Contact</h4>
                        <div className={styles.contact}>
                            <p>hello@alexandravolkova.co.uk</p>
                            <p>+44 20 7946 0958</p>
                            <p>London, United Kingdom</p>
                        </div>
                        <div className={styles.social}>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">PI</a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LI</a>
                        </div>
                    </motion.div>
                </motion.div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Alexandra Volkova. All rights reserved.
                    </p>
                    <button className={styles.backToTop} onClick={scrollToTop}>
                        Back to top
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    )
}
