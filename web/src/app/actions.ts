'use server'

import { db } from '@/lib/firebase-admin'

export async function createGroup(name: string, expectedParticipants: number) {
    const groupRef = db.collection('groups').doc()
    await groupRef.set({
        name,
        expectedParticipants,
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date(),
    })
    return groupRef.id
}

export async function joinGroup(groupId: string, name: string) {
    // Check if group is open
    const groupDoc = await db.collection('groups').doc(groupId).get()

    if (!groupDoc.exists) throw new Error('Group not found')

    const groupData = groupDoc.data()
    if (groupData?.status !== 'OPEN') throw new Error('Group is already drawn')

    const participantRef = db.collection('groups').doc(groupId).collection('participants').doc()
    await participantRef.set({
        name,
        assignedToId: null,
        isRevealed: false,
        createdAt: new Date(),
    })

    return participantRef.id
}

export async function drawNames(groupId: string) {
    const groupRef = db.collection('groups').doc(groupId)
    const participantsSnapshot = await groupRef.collection('participants').get()

    if (participantsSnapshot.empty || participantsSnapshot.docs.length < 2) {
        throw new Error('Need at least 2 participants')
    }

    const participants = participantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    // Shuffle participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5)

    // Create assignments in batch
    const batch = db.batch()

    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i]
        const receiver = shuffled[(i + 1) % shuffled.length]

        const participantRef = groupRef.collection('participants').doc(giver.id)
        batch.update(participantRef, {
            assignedToId: receiver.id
        })
    }

    // Update group status
    batch.update(groupRef, {
        status: 'DRAWN',
        updatedAt: new Date()
    })

    await batch.commit()
}

export async function getParticipant(id: string) {
    // Search across all groups
    const groupsSnapshot = await db.collection('groups').get()

    for (const groupDoc of groupsSnapshot.docs) {
        const participantDoc = await groupDoc.ref.collection('participants').doc(id).get()

        if (participantDoc.exists) {
            const participantData = participantDoc.data()
            let assignedTo = null

            if (participantData?.assignedToId) {
                const assignedToDoc = await groupDoc.ref.collection('participants').doc(participantData.assignedToId).get()
                if (assignedToDoc.exists) {
                    const assignedData = assignedToDoc.data()
                    assignedTo = {
                        id: assignedToDoc.id,
                        name: assignedData?.name || '',
                        assignedToId: assignedData?.assignedToId || null,
                        isRevealed: assignedData?.isRevealed || false,
                        createdAt: assignedData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                    }
                }
            }

            const groupData = groupDoc.data()

            return {
                id: participantDoc.id,
                groupId: groupDoc.id,
                name: participantData?.name || '',
                assignedToId: participantData?.assignedToId || null,
                isRevealed: participantData?.isRevealed || false,
                createdAt: participantData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                assignedTo,
                group: {
                    id: groupDoc.id,
                    name: groupData?.name || '',
                    status: groupData?.status || 'OPEN',
                    createdAt: groupData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    updatedAt: groupData?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
                }
            }
        }
    }

    return null
}

export async function getGroup(id: string) {
    const groupDoc = await db.collection('groups').doc(id).get()

    if (!groupDoc.exists) return null

    const groupData = groupDoc.data()
    const participantsSnapshot = await groupDoc.ref.collection('participants').get()

    const participants = participantsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            name: data?.name || '',
            assignedToId: data?.assignedToId || null,
            isRevealed: data?.isRevealed || false,
            createdAt: data?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }
    })

    return {
        id: groupDoc.id,
        name: groupData?.name || '',
        status: groupData?.status || 'OPEN',
        expectedParticipants: groupData?.expectedParticipants || 0,
        createdAt: groupData?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: groupData?.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        participants
    }
}

export async function markAsRevealed(id: string) {
    // Find participant across all groups
    const groupsSnapshot = await db.collection('groups').get()

    for (const groupDoc of groupsSnapshot.docs) {
        const participantRef = groupDoc.ref.collection('participants').doc(id)
        const participantDoc = await participantRef.get()

        if (participantDoc.exists) {
            await participantRef.update({
                isRevealed: true
            })
            const data = participantDoc.data()
            return {
                id: participantDoc.id,
                name: data?.name || '',
                assignedToId: data?.assignedToId || null,
                isRevealed: true,
                createdAt: data?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            }
        }
    }

    throw new Error('Participant not found')
}
