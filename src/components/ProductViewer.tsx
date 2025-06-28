import { useState } from 'react'
import { Box, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from './ui/button'

interface ProductViewerProps {
  productName: string
  onParameterChange?: (paramId: string, value: string) => void
}

export default function ProductViewer({ productName, onParameterChange }: ProductViewerProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleRotate = () => {
    setRotation(prev => ({ x: prev.x + 15, y: prev.y + 15 }))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5))
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="viewer-placeholder aspect-square relative">
      <div className="placeholder-content">
        <div 
          className="placeholder-icon transition-transform duration-300"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})` 
          }}
        >
          <Box className="w-full h-full" />
        </div>
        <div className="placeholder-text">{productName}</div>
        <div className="placeholder-subtext">3D Model Viewer</div>
        
        {/* Viewer Controls */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}