'use client'

import { useState } from 'react'
import { joinGroup } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function JoinGroupForm({ groupId }: { groupId: string }) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        try {
            await joinGroup(groupId, name)
            setName('')
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Failed to join')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="flex-1 rounded-lg border-red-200 px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none border bg-white"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition active:scale-95 flex items-center justify-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Join'}
            </button>
        </form>
    )
}
