import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { Button } from '../components/common/Button'
import { CTA } from '../components/sections/CTA'
import { services, additionalServices, formatPrice } from '../data/services'
import { fadeInUp, staggerContainer } from '../utils/animations'
import styles from './Services.module.css'

export default function Services() {
    const { ref: heroRef, isInView: heroInView } = useInView({ threshold: 0.2 })

    return (
        <div className={styles.page}>
            <section ref={heroRef} className={styles.hero}>
                <div className="container">
                    <motion.h1
                        className={styles.title}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={heroInView ? 'visible' : 'hidden'}
                    >
                        Services & Pricing
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={heroInView ? 'visible' : 'hidden'}
                        transition={{ delay: 0.1 }}
                    >
                        Tailored packages to capture your most important moments with artistry and care
                    </motion.p>
                </div>
            </section>

            {services.map(service => (
                <ServiceSection key={service.id} service={service} />
            ))}

            <section className={styles.additional}>
                <div className="container">
                    <h2 className={styles.additionalTitle}>Additional Services</h2>
                    <div className={styles.additionalGrid}>
                        {additionalServices.map(item => (
                            <div key={item.name} className={styles.additionalItem}>
                                <span>{item.name}</span>
                                <strong>{item.price}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    )
}

function ServiceSection({ service }) {
    const { ref, isInView } = useInView({ threshold: 0.1 })

    return (
        <section ref={ref} className={styles.serviceSection}>
            <div className="container">
                <motion.div
                    className={styles.serviceHeader}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <h2 className={styles.serviceName}>{service.name}</h2>
                    <p className={styles.serviceDesc}>{service.description}</p>
                </motion.div>

                <motion.div
                    className={styles.packages}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {service.packages.map(pkg => (
                        <motion.div
                            key={pkg.id}
                            className={`${styles.package} ${pkg.popular ? styles.popular : ''}`}
                            variants={fadeInUp}
                        >
                            {pkg.popular && <span className={styles.popularBadge}>Most Popular</span>}
                            <h3 className={styles.packageName}>{pkg.name}</h3>
                            <p className={styles.packageDuration}>{pkg.duration}</p>
                            <div className={styles.packagePrice}>{formatPrice(pkg.price)}</div>
                            <ul className={styles.packageFeatures}>
                                {pkg.features.map(feature => (
                                    <li key={feature} className={styles.feature}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button to="/booking" variant={pkg.popular ? 'primary' : 'outline'} className={styles.packageBtn}>
                                Book Now
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
