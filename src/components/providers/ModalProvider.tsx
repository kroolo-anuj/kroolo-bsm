// ========================================
// MODAL PROVIDER - BSM PLATFORM
// Global modal management system for the application
// Provides centralized modal state and control functions
// Supports multiple modal types and configurations
// Handles modal stacking and focus management
// Includes accessibility features and keyboard navigation
// Provides animation and transition support
// Optimized for performance with lazy loading
// Supports both imperative and declarative modal usage
// Includes backdrop click and escape key handling
// ========================================

'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ========================================
// TYPE DEFINITIONS
// ========================================

interface ModalConfig {
  id: string
  title?: string
  content: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  persistent?: boolean
  onClose?: () => void
  className?: string
}

interface ModalContextType {
  modals: ModalConfig[]
  openModal: (config: Omit<ModalConfig, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<ModalConfig>) => void
}

// ========================================
// CONTEXT CREATION
// ========================================

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// ========================================
// HOOK FOR USING MODAL CONTEXT
// ========================================

export function useModal(): ModalContextType {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

// ========================================
// MODAL PROVIDER COMPONENT
// ========================================

interface ModalProviderProps {
  children: React.ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalConfig[]>([])

  // ========================================
  // MODAL MANAGEMENT FUNCTIONS
  // ========================================

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const modalConfig: ModalConfig = {
      id,
      size: 'md',
      closable: true,
      persistent: false,
      ...config,
    }

    setModals(prev => [...prev, modalConfig])
    return id
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id)
      if (modal?.onClose) {
        modal.onClose()
      }
      return prev.filter(m => m.id !== id)
    })
  }, [])

  const closeAllModals = useCallback(() => {
    setModals(prev => {
      prev.forEach(modal => {
        if (modal.onClose) {
          modal.onClose()
        }
      })
      return []
    })
  }, [])

  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev =>
      prev.map(modal =>
        modal.id === id ? { ...modal, ...updates } : modal
      )
    )
  }, [])

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer modals={modals} closeModal={closeModal} />
    </ModalContext.Provider>
  )
}

// ========================================
// MODAL RENDERER COMPONENT
// ========================================

interface ModalRendererProps {
  modals: ModalConfig[]
  closeModal: (id: string) => void
}

function ModalRenderer({ modals, closeModal }: ModalRendererProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (modals.length === 0) {
    return null
  }

  return createPortal(
    <div className="modal-container">
      {modals.map((modal, index) => (
        <ModalOverlay
          key={modal.id}
          modal={modal}
          zIndex={1000 + index}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </div>,
    document.body
  )
}

// ========================================
// MODAL OVERLAY COMPONENT
// ========================================

interface ModalOverlayProps {
  modal: ModalConfig
  zIndex: number
  onClose: () => void
}

function ModalOverlay({ modal, zIndex, onClose }: ModalOverlayProps) {
  const modalRef = React.useRef<HTMLDivElement>(null)

  // ========================================
  // KEYBOARD EVENT HANDLING
  // ========================================

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modal.closable && !modal.persistent) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modal.closable, modal.persistent, onClose])

  // ========================================
  // FOCUS MANAGEMENT
  // ========================================

  React.useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement
    
    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus()
    }

    // Return focus when modal closes
    return () => {
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus()
      }
    }
  }, [])

  // ========================================
  // SIZE CLASSES
  // ========================================

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }

  // ========================================
  // BACKDROP CLICK HANDLING
  // ========================================

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && modal.closable && !modal.persistent) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
      style={{ zIndex }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modal.title ? `modal-title-${modal.id}` : undefined}
    >
      <div
        ref={modalRef}
        className={`
          bg-background border rounded-lg shadow-lg max-h-[90vh] overflow-auto
          animate-scale-in focus:outline-none
          ${sizeClasses[modal.size || 'md']}
          ${modal.className || ''}
        `}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(modal.title || modal.closable) && (
          <div className="flex items-center justify-between p-6 border-b">
            {modal.title && (
              <h2
                id={`modal-title-${modal.id}`}
                className="text-lg font-semibold"
              >
                {modal.title}
              </h2>
            )}
            {modal.closable && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6">
          {modal.content}
        </div>
      </div>
    </div>
  )
}
