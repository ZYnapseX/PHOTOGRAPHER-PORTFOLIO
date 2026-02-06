import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { CTA } from '../components/sections/CTA'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../utils/animations'
import styles from './About.module.css'

const stats = [
    { number: 12, suffix: '+', label: 'Years Experience' },
    { number: 500, suffix: '+', label: 'Weddings Captured' },
    { number: 1200, suffix: '+', label: 'Happy Clients' },
    { number: 50, suffix: '+', label: 'Awards Won' }
]

const equipment = [
    { title: 'Sony A7R V', description: 'Primary body for ultimate detail' },
    { title: 'Sony 24-70mm f/2.8 GM II', description: 'Versatile zoom for all situations' },
    { title: 'Sony 85mm f/1.4 GM', description: 'Perfect for portraits' },
    { title: 'Sony 35mm f/1.4 GM', description: 'Wide environmental shots' },
    { title: 'Profoto B10X', description: 'Portable lighting solution' },
    { title: 'DJI Mavic 3 Pro', description: 'Aerial photography' }
]

function AnimatedNumber({ target, suffix = '' }) {
    const [count, setCount] = useState(0)
    const { ref, isInView } = useInView({ threshold: 0.5 })

    useEffect(() => {
        if (!isInView) return

        let start = 0
        const duration = 2000
        const increment = target / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [isInView, target])

    return <span ref={ref}>{count}{suffix}</span>
}

export default function About() {
    const { ref: heroRef, isInView: heroInView } = useInView({ threshold: 0.2 })
    const { ref: storyRef, isInView: storyInView } = useInView({ threshold: 0.2 })

    return (
        <div className={styles.page}>
            <section ref={heroRef} className={styles.hero}>
                <div className="container">
                    <motion.div
                        className={styles.heroGrid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={heroInView ? 'visible' : 'hidden'}
                    >
                        <motion.div className={styles.imageWrap} variants={fadeInLeft}>
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                                alt="Alexandra Volkova"
                                className={styles.image}
                            />
                        </motion.div>

                        <motion.div className={styles.content} variants={fadeInRight}>
                            <span className={styles.eyebrow}>About Me</span>
                            <h1 className={styles.title}>Hello, I'm Alexandra</h1>
                            <p className={styles.intro}>
                                A London-based wedding and portrait photographer with over 12 years
                                of experience capturing life's most precious moments. My style is
                                timeless, elegant, and deeply personal — focusing on genuine emotions
                                and authentic connections.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <div className={styles.statNumber}>
                                    <AnimatedNumber target={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={storyRef} className={styles.story}>
                <div className="container">
                    <motion.div
                        className={styles.storyContent}
                        variants={fadeInUp}
                        initial="hidden"
                        animate={storyInView ? 'visible' : 'hidden'}
                    >
                        <h2 className={styles.storyTitle}>My Journey</h2>
                        <p className={styles.storyText}>
                            Photography found me at sixteen when I borrowed my father's old film
                            camera during a family holiday in Greece. There was something magical
                            about freezing those fleeting moments — the way the evening light
                            touched the Aegean Sea, my grandmother's gentle smile.
                        </p>
                        <p className={styles.storyText}>
                            After studying Fine Art Photography at Central Saint Martins, I
                            apprenticed with some of London's most renowned wedding photographers.
                            Those years taught me that technical excellence means nothing without
                            emotional depth.
                        </p>
                        <p className={styles.storyText}>
                            Today, I approach each session as a collaboration. I want to understand
                            your story, your quirks, the way you laugh together. Because photographs
                            shouldn't just look beautiful — they should feel like coming home.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className={styles.equipment}>
                <div className="container">
                    <h2 className={styles.equipmentTitle}>My Equipment</h2>
                    <div className={styles.equipmentGrid}>
                        {equipment.map((item, index) => (
                            <motion.div
                                key={item.title}
                                className={styles.equipmentCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    )
}
