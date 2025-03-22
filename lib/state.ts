import type { AnalyticsEvents, TrackingState } from '@/types'

type StateKind = {
  trackingState: TrackingState
  analyticsId: string
  visitorUid: string
  analyticsEvents: AnalyticsEvents
  debug: boolean
  mock: boolean
  data?: Record<string, string | number>
}

type ReactiveState = {
  value: StateKind
  setState: (updatedState: Partial<StateKind>) => void
}

// Initial state values
const initialState: StateKind = {
  trackingState: 'preinit',
  analyticsId: '',
  visitorUid: '',
  analyticsEvents: [],
  debug: false,
  mock: false,
}

// Create a deep clone of state to prevent direct mutation
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  ) as T
}

// Create a proxy to detect changes to state
function createStateProxy(state: StateKind): StateKind {
  const handler: ProxyHandler<StateKind> = {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value === 'object' && value !== null) {
        // Return a proxy for nested objects to track changes at all levels
        return new Proxy(
          value as object,
          handler as ProxyHandler<object>
        ) as unknown
      }
      return value
    },
    set() {
      // Prevent direct mutation of state
      console.warn('Direct state mutation detected! Use setState instead.')
      return false
    },
  }

  return new Proxy(state, handler)
}

// Internal state holder with an immutable getter
const internalState = {
  current: { ...initialState },
  get value() {
    return createStateProxy(deepClone(this.current))
  },
}

function setState(updatedState: Partial<StateKind>) {
  internalState.current = { ...internalState.current, ...updatedState }
}

// The public state object maintains the same API as before for compatibility
const state: ReactiveState = {
  get value() {
    return internalState.value
  },
  setState,
}

export default state
