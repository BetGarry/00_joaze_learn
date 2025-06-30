import { useEffect, useRef, useState } from 'react'
import initWebgi from './webgiInit'


export interface WebgiViewerProps {
  paramsRef: React.RefObject<HTMLDivElement>
  setSessionManager?: (sessionManager: any) => void
}

export default function WebgiViewer({ paramsRef, setSessionManager }: WebgiViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (canvasRef.current && paramsRef.current) {
      setIsLoading(true)
      setError(null)
      
      initWebgi(canvasRef.current, paramsRef.current, setSessionManager)
        .then(() => {
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Failed to initialize WebGI:', err)
          setError(err instanceof Error ? err.message : 'Failed to load 3D viewer')
          setIsLoading(false)
        })
    }
  }, [paramsRef, setSessionManager])

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading 3D viewer...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm z-10">
          <div className="text-center p-6 bg-red-900/50 rounded-lg border border-red-700">
            <p className="text-red-300 mb-2">Failed to load 3D viewer</p>
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} id="webgi-canvas" className="w-full h-full" />
    </div>
  )
}

