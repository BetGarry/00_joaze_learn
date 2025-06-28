import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { RotateCcw, Settings, Loader2 } from 'lucide-react'

interface ShapeDiverViewerProps {
  productName: string
  onParameterChange?: (paramId: string, value: string) => void
}

interface ShapeDiverParameter {
  id: string
  name: string
  type: string
  value: any
  min?: number
  max?: number
  choices?: string[]
}

export default function ShapeDiverViewer({ productName, onParameterChange }: ShapeDiverViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [parameters, setParameters] = useState<ShapeDiverParameter[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Get ShapeDiver ticket from environment
  const ticket = import.meta.env.VITE_SHAPEDIVER_TICKET

  useEffect(() => {
    if (!ticket) {
      setError('ShapeDiver ticket not found in environment variables')
      setIsLoading(false)
      return
    }

    initializeShapeDiver()
  }, [ticket])

  const initializeShapeDiver = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Create ShapeDiver session using the backend ticket
      const response = await fetch('https://sdeuc1.eu-central-1.shapediver.com/api/v2/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket: ticket,
          modelViewUrl: 'https://sdeuc1.eu-central-1.shapediver.com'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create ShapeDiver session: ${response.status}`)
      }

      const sessionData = await response.json()
      setSessionId(sessionData.sessionId)

      // Extract parameters from session
      if (sessionData.parameters) {
        const paramList: ShapeDiverParameter[] = Object.values(sessionData.parameters).map((param: any) => ({
          id: param.id,
          name: param.name,
          type: param.type,
          value: param.defval,
          min: param.min,
          max: param.max,
          choices: param.choices
        }))
        setParameters(paramList)
      }

      // Set up iframe with ShapeDiver viewer
      if (iframeRef.current) {
        const viewerUrl = `https://sdeuc1.eu-central-1.shapediver.com/app?ticket=${ticket}&autoplay=1&controls=1`
        iframeRef.current.src = viewerUrl
      }

      setIsLoading(false)
    } catch (err) {
      console.error('ShapeDiver initialization error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize ShapeDiver')
      setIsLoading(false)
    }
  }

  const updateParameter = async (parameterId: string, value: any) => {
    if (!sessionId) return

    try {
      const response = await fetch(`https://sdeuc1.eu-central-1.shapediver.com/api/v2/session/${sessionId}/customize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters: {
            [parameterId]: value
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update parameter: ${response.status}`)
      }

      // Update local parameter state
      setParameters(prev => prev.map(param => 
        param.id === parameterId ? { ...param, value } : param
      ))

      // Notify parent component
      if (onParameterChange) {
        onParameterChange(parameterId, value.toString())
      }

      // Send message to iframe to update the viewer
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'updateParameter',
          parameterId,
          value
        }, '*')
      }

    } catch (err) {
      console.error('Parameter update error:', err)
    }
  }

  const resetView = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'resetView'
      }, '*')
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError('Failed to load ShapeDiver viewer')
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-lg">
        <Card className="bg-slate-700 border-slate-600 p-6 text-center max-w-md">
          <div className="text-red-400 mb-4">
            <Settings className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">ShapeDiver Error</h3>
          </div>
          <p className="text-slate-300 text-sm mb-4">{error}</p>
          <Button 
            onClick={initializeShapeDiver}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            Retry Connection
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-slate-800 rounded-lg overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-4" />
            <p className="text-slate-300">Loading ShapeDiver Model...</p>
            <p className="text-slate-400 text-sm mt-2">Connecting to backend...</p>
          </div>
        </div>
      )}

      {/* ShapeDiver Iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="ShapeDiver 3D Viewer"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />

      {/* Controls Overlay */}
      {!isLoading && !error && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-600 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">ShapeDiver Connected</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  title="Reset View"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Parameter Count */}
            {parameters.length > 0 && (
              <div className="mt-2 text-xs text-slate-400">
                {parameters.length} parameters available
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Connection Info */}
      {!isLoading && !error && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-xs text-slate-300">
              Real-time 3D model powered by ShapeDiver
            </p>
            {sessionId && (
              <p className="text-xs text-slate-400 mt-1">
                Session: {sessionId.substring(0, 8)}...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}