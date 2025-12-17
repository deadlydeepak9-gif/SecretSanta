'use client'

import { useState } from 'react'
import { createGroup } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function CreateGroupForm() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        try {
            const groupId = await createGroup(name)
            router.push(`/group/${groupId}`)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="groupName" className="sr-only">Group Name</label>
                <input
                    id="groupName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Group Name (e.g. Office Party)"
                    className="w-full rounded-lg border-0 bg-white/90 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                    required
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-green-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Group'}
            </motion.button>
        </form>
    )
}
