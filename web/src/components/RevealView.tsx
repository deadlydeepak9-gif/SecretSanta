'use client'

import { Gift } from 'lucide-react'

export default function RevealView({ group }: { group: any }) {
    return (
        <div className="space-y-8 text-center max-w-2xl mx-auto">
            <div className="bg-green-100 p-6 rounded-2xl border-2 border-green-200 inline-block">
                <Gift className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-green-800">Draw Completed!</h2>
                <p className="text-green-700">Everyone can now reveal their matches.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-8 text-left">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">🎯 How to Reveal Your Match</h3>

                <div className="space-y-4 text-blue-800">
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                        <div>
                            <p className="font-semibold">Find Your Name in the Lobby</p>
                            <p className="text-sm text-blue-700">Look for your name in the participants list above</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                        <div>
                            <p className="font-semibold">Click "My Link" Button</p>
                            <p className="text-sm text-blue-700">The button next to your name copies your unique reveal link</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                        <div>
                            <p className="font-semibold">Visit Your Link</p>
                            <p className="text-sm text-blue-700">Paste and visit your unique link to see who you're gifting to!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium">
                        🔒 <strong>Privacy Note:</strong> Each participant has their own unique link. You can only see YOUR match - no one else's!
                    </p>
                </div>
            </div>

            <p className="text-xs text-slate-400">
                Remember: You can only reveal your match once, so make sure you're ready!
            </p>
        </div>
    )
}
