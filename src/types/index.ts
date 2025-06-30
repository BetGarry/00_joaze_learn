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
  pricePerStone?: number
  priceModifier?: number
}

export interface ProductOption {
  value: string
  label: string
  priceModifier: number
  description: string
}

export interface ProductConfigurator {
  name: string
  basePrice: number
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
  customizeSession: (paramId: string, value: any) => void
  init: () => Promise<void>
}

// Configuration Types
export interface AppConfig {
  title: string
  version: string
  enableDebugUI: boolean
  enablePerformanceMonitoring: boolean
} 