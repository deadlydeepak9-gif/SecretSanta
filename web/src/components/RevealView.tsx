'use client'

import { useState } from 'react'
import { Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RevealView({ group }: { group: any }) {
    const [selectedId, setSelectedId] = useState<string>('')
    const [match, setMatch] = useState<any>(null)
    const [revealed, setRevealed] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleReveal = () => {
        if (!selectedId) return
        setLoading(true)
        // Redirect to the strict reveal page
        router.push(`/group/${group.id}/reveal/${selectedId}`)
    }

    return (
        <div className="space-y-8 text-center">
            <div className="bg-green-100 p-6 rounded-2xl border-2 border-green-200 inline-block">
                <Gift className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-green-800">Draw Completed!</h2>
                <p className="text-green-700">Find your name to reveal your match.</p>
            </div>

            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <label className="block text-left font-medium text-slate-700 mb-2">Who are you?</label>
                <select
                    className="w-full p-3 rounded-xl border border-slate-300 text-lg bg-white mb-4 disabled:opacity-50"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    disabled={loading}
                >
                    <option value="">Select your name...</option>
                    {group.participants.filter((p: any) => !p.isRevealed).map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <button
                    onClick={handleReveal}
                    disabled={!selectedId || loading}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-red-700 transition flex items-center justify-center"
                >
                    {loading ? 'Redirecting...' : 'Reveal My Match'}
                </button>
            </div>

            <p className="text-sm text-slate-400">
                Note: You can only reveal your match once. Make sure you are ready!
            </p>
        </div>
    )
}
