import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SplitText } from '../../common/AnimatedText'
import { Button } from '../../common/Button'
import { easeOut } from '../../../utils/easing'
import styles from './Hero.module.css'

export default function Hero() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={ref} className={styles.hero}>
            <motion.div className={styles.background} style={{ y }}>
                <img
                    src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=80"
                    alt="Wedding photography"
                    className={styles.bgImage}
                />
                <div className={styles.overlay} />
            </motion.div>

            <motion.div className={`container ${styles.content}`} style={{ opacity }}>
                <motion.p
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
                >
                    Wedding & Portrait Photography
                </motion.p>

                <h1 className={styles.title}>
                    <SplitText delay={0.5}>Capturing Life's</SplitText>
                    <br />
                    <SplitText delay={0.7}>Beautiful Moments</SplitText>
                </h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: easeOut }}
                >
                    Creating timeless photographs that tell your unique story.
                    Based in London, available for destination weddings worldwide.
                </motion.p>

                <motion.div
                    className={styles.ctas}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4, ease: easeOut }}
                >
                    <Button to="/portfolio" size="lg">View Portfolio</Button>
                    <Button to="/booking" variant="outline" size="lg">Book a Session</Button>
                </motion.div>
            </motion.div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2 }}
            >
                <span className={styles.scrollText}>Scroll</span>
                <motion.div
                    className={styles.scrollLine}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>
        </section>
    )
}
