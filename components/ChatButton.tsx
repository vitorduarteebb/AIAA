"use client"

import { useState } from 'react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import AIChatWidget from './AIChat'

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Abrir chat com IA"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>
      
      <AIChatWidget open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
} 