'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ToastProps {
  message: string
  isVisible: boolean
  onHide: () => void
  duration?: number
}

export default function Toast({ message, isVisible, onHide, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
            className="fixed bottom-10 left-10 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.15 }}
        >
          <div className="px-10 py-5 rounded-md shadow-stone-800 shadow-2xl font-medium text-md flex justify-center items-center gap-2 flex-row bg-black font-sans text-white border border-gray-700">
            <svg className="w-5 h-5 text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
            </svg>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}