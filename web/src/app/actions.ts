'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createGroup(name: string) {
    const group = await prisma.group.create({
        data: {
            name,
        },
    })
    return group.id
}

export async function joinGroup(groupId: string, name: string) {
    // Check if group is open
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { participants: true }
    })

    if (!group) throw new Error('Group not found')
    if (group.status !== 'OPEN') throw new Error('Group is already drawn')

    const participant = await prisma.participant.create({
        data: {
            name,
            groupId,
        },
    })

    return participant.id
}

export async function drawNames(groupId: string) {
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { participants: true },
    })

    if (!group) throw new Error('Group not found')
    if (group.participants.length < 2) throw new Error('Need at least 2 participants')

    const participants = group.participants
    const shuffled = [...participants].sort(() => Math.random() - 0.5)

    // Simple rotation: 1->2, 2->3, ..., n->1
    const updates = []
    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i]
        const receiver = shuffled[(i + 1) % shuffled.length]

        updates.push(
            prisma.participant.update({
                where: { id: giver.id },
                data: { assignedToId: receiver.id },
            })
        )
    }

    await prisma.$transaction([
        ...updates,
        prisma.group.update({
            where: { id: groupId },
            data: { status: 'DRAWN' },
        }),
    ])
}

export async function getParticipant(id: string) {
    return prisma.participant.findUnique({
        where: { id },
        include: { assignedTo: true, group: true },
    })
}

export async function getGroup(id: string) {
    return prisma.group.findUnique({
        where: { id },
        include: { participants: true }
    })
}

export async function markAsRevealed(id: string) {
    return prisma.participant.update({
        where: { id },
        data: { isRevealed: true }
    })
}
