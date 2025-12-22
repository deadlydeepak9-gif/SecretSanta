'use client'

import { useState, useEffect, useRef } from 'react'
import { drawNames, removeParticipant } from '@/app/actions'
import JoinGroupForm from './JoinGroupForm'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Copy, Sparkles, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

export default function LobbyView({ group }: { group: any }) {
    const [copied, setCopied] = useState(false)
    const [drawing, setDrawing] = useState(false)
    const [myId, setMyId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const drawButtonRef = useRef(null)
    const participantsRef = useRef(null)

    useEffect(() => {
        // Load current participant ID from localStorage
        const storedId = localStorage.getItem(`participant_${group.id}`)
        if (storedId) {
            setMyId(storedId)
        }

        const ctx = gsap.context(() => {
            // Pulse animation for draw button
            if (group.participants.length >= 2 && drawButtonRef.current) {
                gsap.to(drawButtonRef.current, {
                    scale: 1.05,
                    duration: 0.8,
                    ease: 'power1.inOut',
                    repeat: -1,
                    yoyo: true,
                })
            }

            // Stagger participant cards - only if they exist
            const cards = document.querySelectorAll('.participant-card')
            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.7)',
                    clearProps: 'all', // Clear inline styles after animation
                })
            }
        })

        return () => ctx.revert()
    }, [group.participants.length, group.id])

    const copyLink = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const copyMyLink = (participantId: string) => {
        const link = `${window.location.origin}/group/${group.id}/reveal/${participantId}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDelete = async (participantId: string, name: string) => {
        if (!confirm(`Remove ${name} from the group?`)) return

        setDeleting(participantId)
        try {
            await removeParticipant(group.id, participantId)

            // Clear localStorage if deleting own participant
            if (participantId === myId) {
                localStorage.removeItem(`participant_${group.id}`)
            }

            window.location.reload()
        } catch (e: any) {
            alert(e.message || 'Failed to remove participant')
            setDeleting(null)
        }
    }

    const handleDraw = async () => {
        setDrawing(true)
        try {
            await drawNames(group.id)
            window.location.reload()
        } catch (e) {
            alert("Failed to draw names. Ensure there are at least 2 participants.")
            setDrawing(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Share Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-red-600" />
                    Invite Friends
                </h2>
                <div className="flex gap-2">
                    <code className="flex-1 bg-slate-100 p-3 rounded-lg text-sm font-mono truncate select-all">
                        {typeof window !== 'undefined' ? window.location.href : `.../group/${group.id}`}
                    </code>
                    <button
                        onClick={copyLink}
                        className={cn("bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition active:scale-95", copied && "bg-green-600")}
                    >
                        {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                {/* Budget Display */}
                {group.budget && (
                    <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                            🎁 <span>Suggested Budget: {group.budget}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Participants List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
                    <Users className="w-5 h-5 mr-2 text-slate-500" />
                    Participants
                    <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm">
                        {group.participants.length}
                    </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                        {group.participants.map((p: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={p.id}
                                className="participant-card bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-slate-100"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold mr-3">
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {myId === p.id && (
                                        <button
                                            onClick={() => copyMyLink(p.id)}
                                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                                            title="Copy your unique reveal link"
                                        >
                                            <Copy className="w-3 h-3" />
                                            My Link
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(p.id, p.name)}
                                        disabled={deleting === p.id}
                                        className="text-xs bg-red-50 text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                        title="Remove participant"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Join Form */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h3 className="font-bold text-red-800 mb-2">Join this Group</h3>
                <JoinGroupForm groupId={group.id} />
            </div>

            {/* Admin Actions */}
            <div className="text-center pt-8">
                {group.expectedParticipants && (
                    <div className="mb-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <p className="text-sm font-medium text-blue-800">
                            Participants: {group.participants.length} / {group.expectedParticipants}
                        </p>
                        {group.participants.length < group.expectedParticipants && (
                            <p className="text-xs text-blue-600 mt-1">
                                Waiting for {group.expectedParticipants - group.participants.length} more to join
                            </p>
                        )}
                    </div>
                )}
                <button
                    ref={drawButtonRef}
                    onClick={handleDraw}
                    disabled={group.participants.length !== group.expectedParticipants || drawing}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center mx-auto"
                >
                    {drawing ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    Start Secret Santa Draw!
                </button>
                <p className="text-slate-500 text-sm mt-3">
                    Need at least 2 participants. Once drawn, no new members can join.
                </p>
            </div>
        </div>
    )
}
