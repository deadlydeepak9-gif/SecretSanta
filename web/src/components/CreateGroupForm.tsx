'use client'

import { useState } from 'react'
import { createGroup } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Users, DollarSign } from 'lucide-react'

export default function CreateGroupForm() {
    const [name, setName] = useState('')
    const [expectedParticipants, setExpectedParticipants] = useState(3)
    const [budget, setBudget] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || expectedParticipants < 2) return
        setLoading(true)
        try {
            const groupId = await createGroup(name, expectedParticipants, budget.trim() || undefined)
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
            <div>
                <label htmlFor="expectedCount" className="block text-sm font-medium text-red-100 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    How many people will join?
                </label>
                <input
                    id="expectedCount"
                    type="number"
                    value={expectedParticipants}
                    onChange={(e) => setExpectedParticipants(parseInt(e.target.value) || 2)}
                    min="2"
                    max="50"
                    className="w-full rounded-lg border-0 bg-white/90 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                    required
                />
                <p className="text-xs text-red-100 mt-1.5">
                    Names will only be drawn when this exact number joins
                </p>
            </div>
            <div>
                <label htmlFor="budget" className="block text-sm font-medium text-red-100 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget (Optional)
                </label>
                <input
                    id="budget"
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. $20-30 or ₹500"
                    className="w-full rounded-lg border-0 bg-white/90 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <p className="text-xs text-red-100 mt-1.5">
                    Suggested spending amount for gifts
                </p>
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
