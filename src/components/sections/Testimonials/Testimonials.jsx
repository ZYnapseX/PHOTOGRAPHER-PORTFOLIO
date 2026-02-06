import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { testimonials } from '../../../data/testimonials'
import { fadeInUp } from '../../../utils/animations'
import styles from './Testimonials.module.css'

export default function Testimonials() {
    const containerRef = useRef(null)
    const { ref, isInView } = useInView({ threshold: 0.2 })

    const { scrollXProgress } = useScroll({
        container: containerRef
    })

    return (
        <section ref={ref} className={styles.section}>
            <div className="container">
                <motion.div
                    className={styles.header}
                    variants={fadeInUp}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <span className={styles.eyebrow}>Testimonials</span>
                    <h2 className={styles.title}>What Clients Say</h2>
                </motion.div>
            </div>

            <motion.div
                className={styles.slider}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    ref={containerRef}
                    className={styles.track}
                    drag="x"
                    dragConstraints={{ left: -600, right: 0 }}
                    style={{ cursor: 'grab', paddingLeft: 'calc((100vw - 1400px) / 2 + 32px)' }}
                >
                    {testimonials.map(testimonial => (
                        <motion.div
                            key={testimonial.id}
                            className={styles.card}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className={styles.quote}>"{testimonial.quote}"</p>
                            <div className={styles.author}>
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className={styles.avatar}
                                />
                                <div className={styles.info}>
                                    <div className={styles.name}>{testimonial.name}</div>
                                    <div className={styles.role}>{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    )
}
