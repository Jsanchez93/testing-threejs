import React, { useEffect, useRef } from 'react'
import { initForest, cleanup } from './process'

export const Forest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      initForest(container)
    }

    return () => {
      if (container) {
        cleanup(container)
      }
    }
  }, [])

  return <div ref={containerRef} className="forest" />
}
