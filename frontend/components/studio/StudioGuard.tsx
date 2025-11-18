'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StudioGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('tofula_studio_auth')
      
      if (auth !== '1') {
        router.replace('/studio/login')
        return
      }
      
      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuth()
  }, [router])

  // Show nothing while checking to avoid flicker
  if (isChecking || !isAuthorized) {
    return null
  }

  return <>{children}</>
}
