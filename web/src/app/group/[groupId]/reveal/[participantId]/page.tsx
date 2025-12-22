import { getParticipant } from '@/app/actions'
import { notFound, redirect } from 'next/navigation'
import StrictRevealWrapper from '@/components/StrictRevealWrapper'
import { ShieldAlert } from 'lucide-react'

export default async function RevealPage({ params }: { params: Promise<{ groupId: string, participantId: string }> }) {
    const { participantId, groupId } = await params
    const participant = await getParticipant(participantId)

    if (!participant || participant.groupId !== groupId) {
        notFound()
    }

    if (participant.isRevealed) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                    <p className="text-slate-600 mb-6">
                        This Secret Santa card has already been revealed. For security and fairness, it cannot be viewed again.
                    </p>
                    <a
                        href={`/group/${groupId}`}
                        className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition"
                    >
                        Back to Group
                    </a>
                </div>
            </div>
        )
    }

    if (!participant.assignedTo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Error: No match assigned yet.</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
            <StrictRevealWrapper
                participant={participant}
                id={participant.id}
            />
        </main>
    )
}
