"use client"
import Experience from '@/pkg/experience/Experience'
import React, { useEffect, useRef } from 'react'

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    new Experience(canvasRef.current)
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className="webgl"></canvas>
    </div>
  )
}

export default Page
