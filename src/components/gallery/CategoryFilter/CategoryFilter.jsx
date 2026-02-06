import { motion } from 'framer-motion'
import styles from './CategoryFilter.module.css'

export default function CategoryFilter({
    categories,
    active,
    onChange,
    className = ''
}) {
    return (
        <div className={`${styles.filters} ${className}`}>
            {categories.map(cat => (
                <motion.button
                    key={cat.id}
                    className={`${styles.filter} ${active === cat.id ? styles.active : ''}`}
                    onClick={() => onChange(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {cat.name}
                </motion.button>
            ))}
        </div>
    )
}
