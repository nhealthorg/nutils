import type { InternalRequest, ConfirmModalOptions } from './useConfirmModal'

type ConfirmModalState = {
  open: boolean
  loading: boolean
  queue: InternalRequest<unknown>[]
  current: InternalRequest | null
  // reactive input/checkbox for validation
  confirmInput: string
  confirmChecked: boolean
  // snapshot of options currently rendered to avoid flicker on close
  renderOptions: ConfirmModalOptions<unknown> | null
}

// Shared reactive state across the app
export function useConfirmModalState(): Ref<ConfirmModalState> {
  return useState<ConfirmModalState>('confirmModal', () => ({
    open: false,
    loading: false,
    queue: [],
    current: null,
    confirmInput: '',
    confirmChecked: false,
    renderOptions: null,
  }))
}

export default useConfirmModalState
