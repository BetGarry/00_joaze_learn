import { useState, useEffect } from 'react'
import { Box, RotateCcw, ZoomIn, ZoomOut, Move3D, Palette, Diamond } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ProductViewerProps {
  productName: string
  onParameterChange?: (paramId: string, value: string) => void
}

export default function ProductViewer({ productName, onParameterChange }: ProductViewerProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return
    
    const interval = setInterval(() => {
      setRotation(prev => ({ 
        x: prev.x, 
        y: (prev.y + 0.5) % 360 
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [autoRotate])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }))

    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setAutoRotate(true)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(prev => !prev)
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-lg overflow-hidden">
      {/* 3D Viewer Area */}
      <div 
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Lighting Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/20"></div>
        
        {/* Main 3D Object */}
        <div 
          className="relative transition-transform duration-100 ease-out"
          style={{ 
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Ring Base */}
          <div className="relative w-32 h-32">
            {/* Ring Band */}
            <div className="absolute inset-4 rounded-full border-8 border-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner"></div>
            </div>
            
            {/* Center Stone */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 rounded-full shadow-lg animate-pulse">
                <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full"></div>
              </div>
            </div>
            
            {/* Side Stones */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 bg-gradient-to-br from-blue-100 to-blue-300 rounded-full shadow-md"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-full"></div>
              </div>
            ))}
            
            {/* Reflection/Highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-300/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-600 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-medium">{productName}</span>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAutoRotate}
                className={`bg-slate-700 border-slate-600 text-white hover:bg-slate-600 ${autoRotate ? 'ring-2 ring-amber-400' : ''}`}
                title="Toggle Auto Rotate"
              >
                <Move3D className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                title="Reset View"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Zoom Indicator */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Zoom:</span>
            <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-xs text-slate-300">
            Drag to rotate • Scroll to zoom • Click controls below
          </p>
        </div>
      </div>
    </div>
  )
}