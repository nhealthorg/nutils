import { useConfirmModalState } from './useConfirmModalState'

// Types for the confirm modal configuration and results
export type ConfirmModalResult<T = unknown> = {
  confirmed: boolean
  value?: T
}

export type ConfirmModalOptions<T = unknown> = {
  // Content
  title?: string
  text?: string
  description?: string
  items?: string[] // bullet list items
  warning?: string // warning message
  icon?: string // lucide icon name

  // Buttons
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'neutral' | 'error' | 'success' | 'warning'
  cancelColor?: 'neutral' | 'primary' | 'error' | 'success' | 'warning'
  confirmVariant?: 'solid' | 'subtle' | 'ghost' | 'outline' | 'soft' | 'link'
  cancelVariant?: 'solid' | 'subtle' | 'ghost' | 'outline' | 'soft' | 'link'

  // Icon styling
  iconColor?: 'primary' | 'error' | 'warning' | 'success' | 'info'

  // Behavior
  dangerous?: boolean // style hint for destructive actions
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  autofocus?: 'confirm' | 'cancel' | 'none'
  closeOnConfirm?: boolean
  closeOnCancel?: boolean

  // Validation gates for confirm
  requireInputEquals?: string // if set, require user to type this exact string
  inputPlaceholder?: string
  inputLabel?: string
  inputHint?: string
  requireCheckbox?: boolean
  checkboxLabel?: string

  // Arbitrary data passed back to callbacks
  payload?: T

  // Callbacks (optional, promise return from open() is also supported)
  onConfirm?: (ctx: { payload?: T }) => void | Promise<void>
  onCancel?: (ctx: { payload?: T }) => void | Promise<void>
}

export type InternalRequest<T = unknown> = {
  id: number
  options: ConfirmModalOptions<T>
  resolve: (v: ConfirmModalResult<T>) => void
  reject: (e?: unknown) => void
}

let autoId = 0

function enqueue<T = unknown>(req: Omit<InternalRequest<T>, 'id'>) {
  const state = useConfirmModalState()
  const id = ++autoId
  const full: InternalRequest<T> = { id, ...req }
  state.value.queue.push(full as unknown as InternalRequest<unknown>)
  // If nothing is being shown, show immediately
  if (!state.value.current) {
    showNext()
  }
}

function showNext() {
  const state = useConfirmModalState()
  const next = state.value.queue[0] || null
  state.value.current = next
  state.value.confirmInput = ''
  state.value.confirmChecked = false
  state.value.loading = false
  state.value.open = !!next
  // Preserve the options that should be rendered during transitions
  state.value.renderOptions = next?.options ?? state.value.renderOptions
}

function finishCurrent(result: ConfirmModalResult) {
  const state = useConfirmModalState()
  const cur = state.value.current
  if (!cur) return
  // Resolve promise with outcome
  try {
    cur.resolve(result)
  }
  catch {
    // ignore
  }
  // Dequeue current
  state.value.queue.shift()
  state.value.current = null
  state.value.open = false
  state.value.loading = false
  // Show next if exists
  if (state.value.queue.length > 0) {
    // slight microtask to allow modal close animation
    queueMicrotask(showNext)
  }
}

export function useConfirmModal<T = unknown>(
  defaults?: ConfirmModalOptions<T>,
) {
  const mergedDefaults: ConfirmModalOptions<T> = {
    title: 'Confirm',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmColor: 'primary',
    cancelColor: 'neutral',
    confirmVariant: 'solid',
    cancelVariant: 'subtle',
    autofocus: 'confirm',
    closeOnConfirm: true,
    closeOnCancel: true,
    ...(defaults || {}),
  }

  // Returns a function to open the modal with overrides; resolves with result
  return function confirm(overrides: ConfirmModalOptions<T> = {}) {
    const options: ConfirmModalOptions<T> = {
      ...mergedDefaults,
      ...(overrides || {}),
    }
    return new Promise<ConfirmModalResult<T>>((resolve, reject) => {
      enqueue<T>({ options, resolve, reject })
    })
  }
}

// Actions used by the host component
export function useConfirmModalActions() {
  const state = useConfirmModalState()

  async function onConfirm() {
    const cur = state.value.current
    if (!cur) return

    // Validate gates
    const { requireInputEquals, requireCheckbox } = cur.options
    if (requireInputEquals && state.value.confirmInput !== requireInputEquals) {
      return
    }
    if (requireCheckbox && !state.value.confirmChecked) {
      return
    }

    state.value.loading = true
    try {
      const res = await cur.options.onConfirm?.({
        payload: cur.options.payload,
      })
      const result: ConfirmModalResult = { confirmed: true, value: res }
      if (cur.options.closeOnConfirm !== false) {
        finishCurrent(result)
      }
      else {
        // keep open but stop loading
        state.value.loading = false
      }
    }
    catch {
      // keep open and stop loading on error
      state.value.loading = false
      // optionally could surface error; for now, do nothing
    }
  }

  async function onCancel() {
    const cur = state.value.current
    if (!cur) return
    try {
      await cur.options.onCancel?.({ payload: cur.options.payload })
    }
    finally {
      if (cur.options.closeOnCancel !== false) {
        finishCurrent({ confirmed: false })
      }
    }
  }

  function onClosedExternally() {
    // If modal is closed without explicit action, treat as cancel
    const cur = state.value.current
    if (!cur) return
    finishCurrent({ confirmed: false })
  }

  return { onConfirm, onCancel, onClosedExternally }
}

export default useConfirmModal
