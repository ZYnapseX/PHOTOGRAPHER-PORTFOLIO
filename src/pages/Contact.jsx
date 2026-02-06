import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useInView } from '../hooks/useInView'
import { Button } from '../components/common/Button'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../utils/animations'
import styles from './Contact.module.css'

export default function Contact() {
    const [sent, setSent] = useState(false)
    const { ref, isInView } = useInView({ threshold: 0.2 })
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log('Contact form:', data)
        setSent(true)
    }

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.h1
                        className={styles.title}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        Have a question or want to work together? I'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            <section ref={ref} className={styles.content}>
                <div className="container">
                    <motion.div
                        className={styles.grid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        <motion.div className={styles.info} variants={fadeInLeft}>
                            <div className={styles.infoSection}>
                                <h3>Contact Information</h3>
                                <div className={styles.infoItem}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <path d="M22 6l-10 7L2 6" />
                                    </svg>
                                    <span>hello@alexandravolkova.co.uk</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                    <span>+44 20 7946 0958</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>London, United Kingdom</span>
                                </div>
                            </div>

                            <div className={styles.infoSection}>
                                <h3>Follow Me</h3>
                                <div className={styles.social}>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="2" width="20" height="20" rx="5" />
                                            <circle cx="12" cy="12" r="4" />
                                            <circle cx="18" cy="6" r="1" />
                                        </svg>
                                    </a>
                                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M12 0a12 12 0 00-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.96s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.14 0 3.79-2.26 3.79-5.52 0-2.89-2.07-4.9-5.04-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.04.4 2.15.9 2.75.1.12.11.23.08.35l-.34 1.36c-.05.22-.18.27-.41.16-1.52-.71-2.47-2.93-2.47-4.72 0-3.83 2.79-7.36 8.04-7.36 4.22 0 7.5 3.01 7.5 7.03 0 4.19-2.64 7.56-6.31 7.56-1.23 0-2.39-.64-2.79-1.4l-.76 2.89c-.27 1.06-1.01 2.39-1.5 3.2A12 12 0 1012 0z" />
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className={styles.form} variants={fadeInRight}>
                            {sent ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                                    <h3>Thank you!</h3>
                                    <p>Your message has been sent. I'll get back to you soon.</p>
                                </div>
                            ) : (
                                <>
                                    <h3>Send a Message</h3>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className={styles.fieldGroup}>
                                            <div className={styles.fieldRow}>
                                                <div className={styles.field}>
                                                    <label>Name *</label>
                                                    <input {...register('name', { required: true })} />
                                                </div>
                                                <div className={styles.field}>
                                                    <label>Email *</label>
                                                    <input type="email" {...register('email', { required: true })} />
                                                </div>
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subject</label>
                                                <input {...register('subject')} />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Message *</label>
                                                <textarea rows={5} {...register('message', { required: true })} />
                                            </div>
                                        </div>
                                        <div className={styles.submit}>
                                            <Button type="submit" size="lg">Send Message</Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
