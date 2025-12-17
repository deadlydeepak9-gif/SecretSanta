import { getGroup } from '@/app/actions'
import { notFound } from 'next/navigation'
import LobbyView from '@/components/LobbyView'
import RevealView from '@/components/RevealView'

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params
    const group = await getGroup(groupId)

    if (!group) {
        notFound()
    }

    return (
        <main className="min-h-screen text-slate-900 pb-20 relative z-10">
            <header className="bg-red-600 text-white p-6 md:p-8 shadow-xl text-center mb-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">{group.name}</h1>
                    <p className="font-bold text-red-50 text-lg uppercase tracking-widest drop-shadow-sm">Secret Santa Group</p>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {group.status === 'OPEN' ? (
                    <LobbyView group={group} />
                ) : (
                    <RevealView group={group} />
                )}
            </div>
        </main>
    )
}
