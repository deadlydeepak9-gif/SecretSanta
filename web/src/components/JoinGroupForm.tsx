'use client'

import { useState } from 'react'
import { joinGroup } from '@/app/actions'
import { Loader2, CheckCircle, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function JoinGroupForm({ groupId }: { groupId: string }) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [participantId, setParticipantId] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)
        try {
            const id = await joinGroup(groupId, name)

            // Store in localStorage
            localStorage.setItem(`participant_${groupId}`, id)

            setParticipantId(id)
            setSuccess(true)
            setName('')

            // Reload after showing success
            setTimeout(() => {
                router.refresh()
            }, 3000)
        } catch (e) {
            console.error(e)
            alert('Failed to join')
        } finally {
            setLoading(false)
        }
    }

    const copyLink = () => {
        const link = `${window.location.origin}/group/${groupId}/reveal/${participantId}`
        navigator.clipboard.writeText(link)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
    }

    if (success && participantId) {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="font-bold">Joined successfully!</h3>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-green-700 font-medium">Your unique reveal link:</p>
                    <div className="flex gap-2">
                        <code className="flex-1 bg-white p-2 rounded text-xs break-all border border-green-200">
                            /group/{groupId}/reveal/{participantId}
                        </code>
                        <button
                            onClick={copyLink}
                            className="bg-green-600 text-white px-3 rounded hover:bg-green-700 transition flex items-center justify-center"
                        >
                            {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-green-600">
                        💡 Save this link to reveal your match after names are drawn!
                    </p>
                </div>
            </div>
        )
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
