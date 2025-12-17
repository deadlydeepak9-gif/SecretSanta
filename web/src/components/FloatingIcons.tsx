'use client'

import { motion } from 'framer-motion'
import { Snowflake, Gift, Trees, CloudSnow } from 'lucide-react'
import { useEffect, useState } from 'react'

const icons = [Snowflake, Gift, Trees, CloudSnow]

export default function FloatingIcons() {
    const [elements, setElements] = useState<any[]>([])

    useEffect(() => {
        // Generate random icons on client side
        const items = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            Icon: icons[Math.floor(Math.random() * icons.length)],
            left: Math.random() * 100,
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 20,
            size: 20 + Math.random() * 30, // 20px to 50px
            initialY: 105 + Math.random() * 20
        }))
        setElements(items)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="pointer-events-none" // Explicitly disable pointer events on children
                    initial={{ y: `${el.initialY}vh`, x: '-50%', opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 0.6, 0.6, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        left: `${el.left}%`,
                        color: 'rgba(220, 38, 38, 0.1)' // faint red
                    }}
                >
                    <el.Icon size={el.size} />
                </motion.div>
            ))}
        </div>
    )
}
