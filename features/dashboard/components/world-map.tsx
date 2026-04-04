'use client'

import { useEffect, useRef } from 'react'

interface MapMarker {
  country: string
  value: number
  lat: number
  lng: number
  color: string
}

const markers: MapMarker[] = [
  { country: 'Brasil',    value: 87142, lat: -14.235, lng: -51.925, color: '#4F46E5' },
  { country: 'Argentina', value: 45089, lat: -38.416, lng: -63.617, color: '#10B981' },
  { country: 'Chile',     value: 32504, lat: -35.675, lng: -71.543, color: '#F59E0B' },
  { country: 'Colombia',  value: 28321, lat:   4.571, lng: -74.297, color: '#EF4444' },
  { country: 'Peru',      value: 18904, lat:  -9.19,  lng: -75.015, color: '#8B5CF6' },
]

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = '#E5E7EB'
    const dotSpacing = 8
    const dotRadius = 1

    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        const normalizedX = x / width
        const normalizedY = y / height

        const isSouthAmerica  = normalizedX > 0.2  && normalizedX < 0.45 && normalizedY > 0.3  && normalizedY < 0.95
        const isNorthAmerica  = normalizedX > 0.1  && normalizedX < 0.4  && normalizedY > 0.1  && normalizedY < 0.4
        const isEuropeAfrica  = normalizedX > 0.45 && normalizedX < 0.65 && normalizedY > 0.1  && normalizedY < 0.85
        const isAsia          = normalizedX > 0.55 && normalizedX < 0.95 && normalizedY > 0.1  && normalizedY < 0.6
        const isAustralia     = normalizedX > 0.75 && normalizedX < 0.95 && normalizedY > 0.6  && normalizedY < 0.85

        if (isSouthAmerica || isNorthAmerica || isEuropeAfrica || isAsia || isAustralia) {
          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const latLngToXY = (lat: number, lng: number) => ({
      x: ((lng + 180) / 360) * width,
      y: ((90 - lat) / 180) * height,
    })

    markers.forEach((marker) => {
      const { x, y } = latLngToXY(marker.lat, marker.lng)

      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fillStyle = marker.color + '20'
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = marker.color
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()

      const labelX = x + 15
      const labelY = y - 5
      const text = marker.value.toLocaleString()
      ctx.font = '10px Inter, sans-serif'
      const textWidth = ctx.measureText(text).width

      ctx.fillStyle = marker.color
      ctx.beginPath()
      ctx.roundRect(labelX - 4, labelY - 10, textWidth + 8, 16, 4)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(text, labelX, labelY + 2)
    })
  }, [])

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ minHeight: '200px' }}
      />
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
        {markers.slice(0, 3).map((marker) => (
          <div key={marker.country} className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: marker.color }} />
            <span className="text-xs text-muted-foreground">{marker.country}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
