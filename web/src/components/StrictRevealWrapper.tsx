'use client'

import { useState, useEffect, useRef } from 'react'
import { markAsRevealed } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import gsap from 'gsap'

export default function StrictRevealWrapper({ id, name }: { id: string, name: string }) {
    const [timeLeft, setTimeLeft] = useState(60)
    const router = useRouter()
    const cardRef = useRef(null)
    const timerRef = useRef(null)
    const nameRef = useRef(null)

    useEffect(() => {
        // Immediate reveal logic
        const reveal = async () => {
            try {
                await markAsRevealed(id)
                // Trigger confetti immediately
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            } catch (e) {
                console.error("Failed to mark as revealed", e)
            }
        }
        reveal()

        // GSAP Animations
        const ctx = gsap.context(() => {
            // Dramatic card entrance
            gsap.from(cardRef.current, {
                scale: 0.5,
                rotation: -10,
                opacity: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.5)',
            })

            // Name reveal with bounce
            gsap.from(nameRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                delay: 0.5,
                ease: 'back.out(2)',
            })

            // Timer pulse
            gsap.from(timerRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 1,
                ease: 'back.out(1.7)',
            })
        })

        // Timer logic
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push('/') // Redirect to home
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            ctx.revert()
            clearInterval(timer)
        }
    }, [id, router])

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center drop-shadow-md">
                Your Secret Santa Mission
            </h2>

            <motion.div
                ref={cardRef}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full border-4 border-yellow-500/50"
            >
                <p className="text-gray-500 font-medium mb-4 uppercase tracking-widest text-sm">You are gifting to</p>
                <h1 ref={nameRef} className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6 break-words">
                    {name}
                </h1>
                <div className="h-1 w-20 bg-gray-200 mx-auto rounded-full mb-6"></div>
                <p className="text-slate-400 text-xs">
                    Memorize this name now. You cannot see it again.
                </p>
            </motion.div>

            <div ref={timerRef} className="mt-8 text-center text-white">
                <p className="text-lg font-medium mb-2">This page will self-destruct in</p>
                <div className="text-5xl font-mono font-bold text-yellow-400 drop-shadow-lg">
                    {timeLeft}s
                </div>
            </div>

            <button
                onClick={() => router.push('/')}
                className="mt-8 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-2 rounded-lg transition"
            >
                Close Now
            </button>
        </div>
    )
}
