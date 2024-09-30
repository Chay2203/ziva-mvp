'use client'
 
import dynamic from 'next/dynamic'
 
const App = dynamic(() => import('../../src/App.jsx'), { ssr: false })
 
export function ClientOnly() {
  return <App />
}