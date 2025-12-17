'use client'

import { useRef, useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScratchCardProps {
    text: string
    onReveal?: () => void
    width?: number
    height?: number
    containerClassName?: string
}

export default function ScratchCard({ text, onReveal, width = 300, height = 150, containerClassName }: ScratchCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    const performReveal = () => {
        if (isRevealed) return

        setIsRevealed(true)
        if (onReveal) onReveal()

        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        })

        // We rely on CSS opacity transition to hide checks, 
        // but we can also clear rect after transition if needed.
    }

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Setup canvas with a more festive "foil" look
        // Create a gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, '#C0C0C0') // Silver
        gradient.addColorStop(0.25, '#E8E8E8') // Lighter Silver
        gradient.addColorStop(0.5, '#A9A9A9') // Darker Silver
        gradient.addColorStop(0.75, '#E8E8E8')
        gradient.addColorStop(1, '#C0C0C0')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Add some noise/texture
        for (let i = 0; i < 400; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#888888';
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Text instruction
        ctx.fillStyle = '#1a1a1a' // Almost Black
        ctx.font = 'bold 24px Arial' // Bolder
        ctx.textAlign = 'center'
        // Simplified text for tap interaction
        ctx.fillText('🎁 Tap to Reveal! 🎁', width / 2, height / 2)

        ctx.globalCompositeOperation = 'destination-out'
    }, [width, height])

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden rounded-xl shadow-lg select-none w-full max-w-md mx-auto z-[100] cursor-pointer active:scale-95 transition-transform duration-200", containerClassName)}
            style={{ aspectRatio: `${width}/${height}` }}
            onClick={performReveal}
        >
            {/* Underlying Content */}
            <div className="absolute inset-0 flex items-center justify-center bg-white text-3xl font-extrabold text-black z-0 text-center p-4">
                {text}
            </div>

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={cn("absolute inset-0 z-[101] w-full h-full transition-opacity duration-700", isRevealed ? "opacity-0 pointer-events-none" : "opacity-100")}
            />
        </div>
    )
}
