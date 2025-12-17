'use client'

import CreateGroupForm from '@/components/CreateGroupForm'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Home() {
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      })

      gsap.from(descRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
      })

      gsap.from(formRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-600 to-red-800 p-4 text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 ref={titleRef} className="text-5xl font-extrabold tracking-tight drop-shadow-md">
          🎅 Secret Santa
        </h1>
        <p ref={descRef} className="text-lg text-red-100">
          The easiest way to host a Secret Santa party. Free, simple, and fun!
        </p>

        <div ref={formRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <CreateGroupForm />
        </div>
      </div>
    </main>
  )
}
