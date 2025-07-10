"use client"

import { useState } from 'react'
import AIChatWidget from '@/components/AIChat'

export default function ChatButton() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-lg hover:scale-105 transition-all text-base font-semibold mb-24 sm:mb-6"
          style={{ zIndex: 100 }}
        >
          <span className="mr-2">✈️</span> Pergunte à IA
        </button>
      )}
      {chatOpen && (
        <AIChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  )
} 