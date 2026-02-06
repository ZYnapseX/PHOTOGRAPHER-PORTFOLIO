import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from '../components/common/Button'
import { publicApi } from '../services/api'
import { formatPrice } from '../utils/helpers'
import { fadeInUp } from '../utils/animations'
import styles from './Booking.module.css'

const steps = [
    { id: 1, label: 'Service' },
    { id: 2, label: 'Details' },
    { id: 3, label: 'Confirm' }
]

export default function Booking() {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedService, setSelectedService] = useState(null)
    const [services, setServices] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm()

    // Fetch services from API
    useEffect(() => {
        async function loadServices() {
            try {
                const res = await publicApi.getServices()
                setServices(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadServices()
    }, [])

    const onSubmit = async (data) => {
        setSubmitting(true)
        setError(null)
        try {
            await publicApi.createBooking({
                ...data,
                serviceId: selectedService.id,
                serviceName: selectedService.name, // Sending for context if needed, but ID is main
                shootDate: new Date(data.date).toISOString()
            })
            setSubmitted(true)
        } catch (err) {
            setError(err.message || 'Failed to submit booking')
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className={styles.page}>
                <motion.div
                    className={styles.success}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                >
                    <div className={styles.successIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <h2>Booking Request Sent!</h2>
                    <p>Thank you for your enquiry. I'll be in touch within 24 hours to confirm your session.</p>
                    <Button to="/" style={{ marginTop: '2rem' }}>Return Home</Button>
                </motion.div>
            </div>
        )
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
                        Book a Session
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        Let's create something beautiful together
                    </motion.p>
                </div>
            </section>

            <section className={styles.form}>
                <div className="container">
                    {loading ? <div>Loading services...</div> : (
                        <div className={styles.formInner}>
                            <div className={styles.steps}>
                                {steps.map(step => (
                                    <div
                                        key={step.id}
                                        className={`${styles.step} ${currentStep >= step.id ? styles.stepActive : ''}`}
                                    >
                                        <span className={styles.stepNumber}>{step.id}</span>
                                        <span className={styles.stepLabel}>{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            {error && <div className={styles.error} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <AnimatePresence mode="wait">
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Select a Service</h3>
                                            <div className={styles.packageGrid}>
                                                {services.map(service => (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        className={`${styles.packageOption} ${selectedService?.id === service.id ? styles.packageSelected : ''}`}
                                                        onClick={() => setSelectedService(service)}
                                                    >
                                                        <h4>{service.name}</h4>
                                                        <p>{service.shortDescription}</p>
                                                        <strong>{service.priceFrom ? 'From ' : ''}{formatPrice(service.price)}</strong>
                                                    </button>
                                                ))}
                                                {services.length === 0 && <p>No services available yet.</p>}
                                            </div>
                                            <div className={styles.actions}>
                                                <div />
                                                <Button
                                                    type="button"
                                                    onClick={() => selectedService && setCurrentStep(2)}
                                                    disabled={!selectedService}
                                                >
                                                    Continue
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className={styles.fieldGroup}>
                                                <div className={styles.fieldRow}>
                                                    <div className={styles.field}>
                                                        <label>First Name *</label>
                                                        <input {...register('clientName', { required: true })} placeholder="First & Last Name" />
                                                    </div>
                                                </div>
                                                <div className={styles.fieldRow}>
                                                    <div className={styles.field}>
                                                        <label>Email *</label>
                                                        <input type="email" {...register('clientEmail', { required: true })} />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>Phone</label>
                                                        <input type="tel" {...register('clientPhone')} />
                                                    </div>
                                                </div>
                                                <div className={styles.field}>
                                                    <label>Preferred Date *</label>
                                                    <input type="date" {...register('date', { required: true })} />
                                                </div>
                                                <div className={styles.field}>
                                                    <label>Location</label>
                                                    <input type="text" {...register('location')} placeholder="e.g. London" />
                                                </div>
                                                <div className={styles.field}>
                                                    <label>Tell me about your vision</label>
                                                    <textarea rows={4} {...register('message')} />
                                                </div>
                                            </div>
                                            <div className={styles.actions}>
                                                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                                                    Back
                                                </Button>
                                                <Button type="button" onClick={() => setCurrentStep(3)}>
                                                    Continue
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className={styles.summary}>
                                                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Booking Summary</h3>
                                                <div className={styles.summaryRow}>
                                                    <span>Service</span>
                                                    <span>{selectedService?.name}</span>
                                                </div>
                                                <div className={styles.summaryRow}>
                                                    <span>Duration</span>
                                                    <span>{selectedService?.duration}</span>
                                                </div>
                                                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                                    <span>Total</span>
                                                    <span>{selectedService?.priceFrom ? 'From ' : ''}{formatPrice(selectedService?.price || 0)}</span>
                                                </div>
                                            </div>
                                            <div className={styles.actions}>
                                                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                                                    Back
                                                </Button>
                                                <Button type="submit" disabled={submitting}>
                                                    {submitting ? 'Sending...' : 'Submit Request'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
