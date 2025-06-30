// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private enabled: boolean = false

  private constructor() {
    this.enabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true'
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(label: string): () => void {
    if (!this.enabled) return () => {}
    
    const startTime = performance.now()
    return () => this.endTimer(label, startTime)
  }

  private endTimer(label: string, startTime: number): void {
    const duration = performance.now() - startTime
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    
    this.metrics.get(label)!.push(duration)
    
    // Log if duration is significant (>100ms)
    if (duration > 100) {
      console.warn(`Performance: ${label} took ${duration.toFixed(2)}ms`)
    }
  }

  getMetrics(label?: string): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {}
    
    if (label) {
      const values = this.metrics.get(label)
      if (values && values.length > 0) {
        result[label] = this.calculateStats(values)
      }
    } else {
      this.metrics.forEach((values, key) => {
        if (values.length > 0) {
          result[key] = this.calculateStats(values)
        }
      })
    }
    
    return result
  }

  private calculateStats(values: number[]): { avg: number; min: number; max: number; count: number } {
    const sum = values.reduce((a, b) => a + b, 0)
    return {
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    }
  }

  clearMetrics(): void {
    this.metrics.clear()
  }

  logMetrics(): void {
    if (!this.enabled) return
    
    const metrics = this.getMetrics()
    console.group('Performance Metrics')
    Object.entries(metrics).forEach(([label, stats]) => {
      console.log(`${label}:`, {
        average: `${stats.avg.toFixed(2)}ms`,
        min: `${stats.min.toFixed(2)}ms`,
        max: `${stats.max.toFixed(2)}ms`,
        count: stats.count
      })
    })
    console.groupEnd()
  }
}

// Convenience functions
export const perf = PerformanceMonitor.getInstance()

export const withPerformanceTracking = <T extends any[], R>(
  fn: (...args: T) => R,
  label: string
) => {
  return (...args: T): R => {
    const endTimer = perf.startTimer(label)
    try {
      const result = fn(...args)
      if (result instanceof Promise) {
        return result.finally(endTimer) as R
      }
      endTimer()
      return result
    } catch (error) {
      endTimer()
      throw error
    }
  }
} 