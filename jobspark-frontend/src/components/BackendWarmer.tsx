// app/components/BackendWarmer.tsx
'use client'
import { useEffect } from 'react'

export function BackendWarmer() {
    useEffect(() => {
        fetch('https://jobspark-chyg.onrender.com/health', { cache: 'no-store' }).catch(() => { })
    }, [])
    return null
}