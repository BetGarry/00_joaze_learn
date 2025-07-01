// Product Configuration Types
export interface ProductParameter {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  detailedInfo: string
  currentValue: string | number
  options?: ProductOption[]
  min?: number
  max?: number
  weightPerStone?: number
  weightModifier?: number
}

export interface ProductOption {
  value: string
  label: string
  weightModifier: number
  description: string
}

export interface ProductConfigurator {
  name: string
  baseWeight: number
  image: string
  parameters: ProductParameter[]
}

// Learning Steps Types
export interface LearningStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  videoUrl?: string
  content: string
}

// WebGI Types
export interface WebgiViewerProps {
  paramsRef: React.RefObject<HTMLDivElement>
  setSessionManager?: (sessionManager: any) => void
}

// Session Manager Types
export interface SessionManager {
  parameters?: Record<string, any>
  weight?: number | null
  customizeSession: (paramId: string, value: any) => void
  setWeight: (weight: number) => void
  weightUpdateHandler?: (weight: number) => void
  init: () => Promise<void>
}

// Configuration Types
export interface AppConfig {
  title: string
  version: string
  enableDebugUI: boolean
  enablePerformanceMonitoring: boolean
} 