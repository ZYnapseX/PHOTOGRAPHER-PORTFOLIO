import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { Button } from '../../common/Button'
import { fadeInUp, fadeInLeft, fadeInRight } from '../../../utils/animations'
import styles from './AboutPreview.module.css'

export default function AboutPreview() {
    const { ref, isInView } = useInView({ threshold: 0.2 })

    return (
        <section ref={ref} className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        className={styles.imageWrap}
                        variants={fadeInLeft}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                            alt="Alexandra Volkova"
                            className={styles.image}
                        />
                        <motion.div
                            className={styles.floatingCard}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <div className={styles.cardNumber}>12+</div>
                            <div className={styles.cardLabel}>Years Experience</div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={styles.content}
                        variants={fadeInRight}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        <span className={styles.eyebrow}>About Me</span>
                        <h2 className={styles.title}>
                            Telling Your Story Through Light and Emotion
                        </h2>
                        <p className={styles.text}>
                            I'm Alexandra, a London-based photographer with a passion for capturing
                            authentic moments and genuine emotions. My approach is relaxed and
                            documentary in style, allowing your true personality to shine through.
                        </p>
                        <p className={styles.text}>
                            Whether it's the quiet moments before you walk down the aisle,
                            or the genuine laughter shared between loved ones, I believe
                            in preserving the real, unscripted beauty of your special day.
                        </p>
                        <p className={styles.signature}>— Alexandra</p>
                        <Button to="/about">Learn More</Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
