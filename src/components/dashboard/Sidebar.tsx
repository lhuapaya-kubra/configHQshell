import type { ModuleId } from '../../modules/types'
import {
  IconArrowBack,
  IconChevronLeft,
  IconChevronRight,
  IconDatabase,
  IconFileTransform,
  IconSftpMailbox,
} from './icons'

type SidebarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
  activeModule: ModuleId
  onSelectModule: (id: ModuleId) => void
}

const MODULE_NAV: { id: ModuleId; label: string }[] = [
  { id: 'datafeed', label: 'Manage Datafeeds' },
  { id: 'sftp-mailbox', label: 'SFTP Mailboxes' },
  { id: 'file-transformation', label: 'File Transformation' },
]

function ModuleIcon({ id, size = 18 }: { id: ModuleId; size?: number }) {
  switch (id) {
    case 'datafeed':
      return <IconDatabase size={size} />
    case 'sftp-mailbox':
      return <IconSftpMailbox size={size} />
    case 'file-transformation':
      return <IconFileTransform size={size} />
    default:
      return <IconDatabase size={size} />
  }
}

export function Sidebar({ collapsed, onToggleCollapse, activeModule, onSelectModule }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <button
        type="button"
        className="sidebar__collapse-toggle"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
      </button>

      <nav className="sidebar__nav" aria-label="Main">
        <button
          type="button"
          className="sidebar__link"
          onClick={() => onSelectModule('datafeed')}
        >
          <IconArrowBack size={18} />
          {!collapsed && <span className="sidebar__label">Dashboard</span>}
        </button>
        {MODULE_NAV.map((item) => {
          const isActive = activeModule === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelectModule(item.id)}
            >
              <ModuleIcon id={item.id} size={18} />
              {!collapsed && <span className="sidebar__label">{item.label}</span>}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
