import { useEffect, useId, useRef, useState } from 'react'
import { MODULE_OPTIONS, type ModuleId, moduleLabel } from '../../modules/types'
import {
  IconChevronDown,
  IconFeedback,
  IconHelp,
  IconUser,
} from './icons'

type HeaderBarProps = {
  selectedModuleId: ModuleId
  onModuleChange: (id: ModuleId) => void
}

export function HeaderBar({ selectedModuleId, onModuleChange }: HeaderBarProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const selectedLabel = moduleLabel(selectedModuleId)

  useEffect(() => {
    if (!open) return
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className="header-bar">
      <div className="header-bar__left">
        <div className="header-bar__logo" aria-label="KUBRA ConfigHQ">
          <span className="header-bar__logo-kubra">KUBRA</span>
          <span className="header-bar__logo-hq">ConfigHQ</span>
        </div>
        <div className="header-bar__module-wrap" ref={wrapRef}>
          <button
            type="button"
            className={`header-bar__module-pill ${open ? 'header-bar__module-pill--open' : ''}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span>{selectedLabel}</span>
            <IconChevronDown className="header-bar__module-chevron" size={14} />
          </button>
          {open && (
            <div
              id={menuId}
              className="header-bar__module-menu"
              role="listbox"
              aria-label="Module"
            >
              {MODULE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={selectedModuleId === opt.id}
                  className={`header-bar__module-option ${selectedModuleId === opt.id ? 'header-bar__module-option--selected' : ''}`}
                  onClick={() => {
                    onModuleChange(opt.id)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="header-bar__center">
        <div className="header-bar__company-pill">ABC Energy Utility Company</div>
      </div>

      <div className="header-bar__right">
        <button type="button" className="header-bar__feedback">
          <IconFeedback size={16} />
          <span>Feedback</span>
        </button>
        <button type="button" className="header-bar__icon-circle" aria-label="Help">
          <IconHelp size={18} />
        </button>
        <button type="button" className="header-bar__icon-circle" aria-label="Account">
          <IconUser size={18} />
        </button>
      </div>
    </header>
  )
}
