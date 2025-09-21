'use client'
import Hero from "./hero";
import NyligArbeid from "./nyligArbeid";
import Stats from "./stats";
import { useState, useEffect } from 'react'
import Toast from './booking/Toast'


export default function Home() {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedBefore')
    
    if (!hasVisited) {
      // First time visitor - show toast after a short delay
      const timer = setTimeout(() => {
        setShowToast(true)
        // Mark that user has visited
        localStorage.setItem('hasVisitedBefore', 'true')
      }, 200) 
      
      return () => clearTimeout(timer)
    }
  }, [])
  
  return (
    <div className="font-sans text-white bg-primary">
      <Hero />
      <Stats />
      <NyligArbeid />
      <Toast 
          message="Nettsiden er fremdeles under utvikling. Noe funksjonalitet kan mangle." 
          isVisible={showToast} 
          onHide={() => setShowToast(false)} 
          duration={4000}
      />
    </div>
  );
}
