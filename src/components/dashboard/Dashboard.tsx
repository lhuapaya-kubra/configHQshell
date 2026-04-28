import { useState } from 'react'
import type { ModuleId } from '../../modules/types'
import { mockDatafeeds } from '../../data/datafeeds'
import { SftpMailboxManager } from '../sftp/SftpMailboxManager'
import { DatafeedListCard } from './DatafeedListCard'
import { EmptySelectionCard } from './EmptySelectionCard'
import { HeaderBar } from './HeaderBar'
import { IconPlus } from './icons'
import { ModulePlaceholder } from './ModulePlaceholder'
import { Sidebar } from './Sidebar'
import './dashboard.css'

export function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeModule, setActiveModule] = useState<ModuleId>('datafeed')

  return (
    <div className="dashboard">
      <HeaderBar selectedModuleId={activeModule} onModuleChange={setActiveModule} />
      <div className="dashboard__body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          activeModule={activeModule}
          onSelectModule={setActiveModule}
        />
        <main className="dashboard__main">
          {activeModule === 'datafeed' && (
            <>
              <div className="dashboard__page-header">
                <h1 className="dashboard__title">Manage Datafeeds</h1>
                <button type="button" className="dashboard__add-btn" aria-label="Add datafeed">
                  <IconPlus size={22} />
                </button>
              </div>
              <div className="dashboard__grid">
                <DatafeedListCard rows={mockDatafeeds} />
                <EmptySelectionCard />
              </div>
            </>
          )}

          {activeModule === 'sftp-mailbox' && <SftpMailboxManager />}

          {activeModule === 'file-transformation' && (
            <ModulePlaceholder
              title="File Transformation"
              description="Configuration and monitoring for file transformation pipelines will appear here. This module is not part of the MVP scope for SFTP Mailbox Manager."
            />
          )}
        </main>
      </div>
    </div>
  )
}
