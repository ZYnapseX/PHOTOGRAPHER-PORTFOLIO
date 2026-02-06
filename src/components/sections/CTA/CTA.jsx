import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { Button } from '../../common/Button'
import { fadeInUp, staggerContainer } from '../../../utils/animations'
import styles from './CTA.module.css'

export default function CTA() {
    const { ref, isInView } = useInView({ threshold: 0.3 })

    return (
        <section ref={ref} className={styles.section}>
            <div className="container">
                <motion.div
                    className={styles.inner}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <motion.div className={styles.content} variants={fadeInUp}>
                        <h2 className={styles.title}>Ready to Tell Your Story?</h2>
                        <p className={styles.subtitle}>
                            Let's create something beautiful together. Get in touch to discuss
                            your vision and check my availability.
                        </p>
                    </motion.div>

                    <motion.div className={styles.ctas} variants={fadeInUp}>
                        <Button to="/booking" size="lg">Book a Session</Button>
                        <Button to="/contact" variant="outline" size="lg">Get in Touch</Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
