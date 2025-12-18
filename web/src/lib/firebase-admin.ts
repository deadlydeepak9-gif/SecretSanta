import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Validate required environment variables
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase credentials:', {
        hasProjectId: !!projectId,
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey
    })
    throw new Error('Firebase credentials not configured. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your environment variables.')
}

// Initialize Firebase Admin
const apps = getApps()
if (!apps.length) {
    try {
        initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        })
        console.log('Firebase Admin initialized successfully')
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error)
        throw error
    }
}

export const db = getFirestore()
