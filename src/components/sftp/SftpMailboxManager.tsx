import { useMemo, useState } from 'react'
import type { MailboxRow } from '../../data/mockMailboxes'
import { mockMailboxes } from '../../data/mockMailboxes'
import { CreateMailboxPanel, type CreateMailboxFormValues } from './CreateMailboxPanel'
import { IconPlus, IconSearch } from '../dashboard/icons'
import './sftp.css'

export function SftpMailboxManager() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<MailboxRow[]>(() => [...mockMailboxes])
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.realm.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q),
    )
  }, [query, rows])

  function handleCreateSubmit(values: CreateMailboxFormValues) {
    setRows((prev) => [
      ...prev,
      {
        key: `mb-${crypto.randomUUID?.() ?? String(Date.now())}`,
        name: values.mailboxName.trim(),
        realm: values.realm,
        userCount: 1,
        status: 'Provisioning',
        storageDisplay: '—',
      },
    ])
  }

  return (
    <div className="sftp-page">
      <div className="sftp-page__header">
        <h1 className="sftp-page__title">SFTP Mailbox Manager</h1>
        <button
          type="button"
          className="sftp-page__create-btn"
          aria-label="Create mailbox"
          aria-expanded={createOpen}
          onClick={() => setCreateOpen(true)}
        >
          <IconPlus size={22} />
          <span>Create mailbox</span>
        </button>
      </div>

      <CreateMailboxPanel
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <section className="sftp-card" aria-labelledby="sftp-mailboxes-heading">
        <h2 id="sftp-mailboxes-heading" className="visually-hidden">
          Mailboxes
        </h2>
        <div className="sftp-card__toolbar">
          <div className="sftp-card__search-wrap">
            <IconSearch className="sftp-card__search-icon" size={20} />
            <input
              type="search"
              className="sftp-card__search"
              placeholder="Search mailboxes by name or realm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search mailboxes"
            />
          </div>
        </div>

        <div className="sftp-card__table-wrap">
          <table className="sftp-card__table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Realm</th>
                <th scope="col">Users</th>
                <th scope="col">Status</th>
                <th scope="col">Storage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.key}>
                  <td>
                    <button type="button" className="sftp-card__name-btn">
                      {row.name}
                    </button>
                  </td>
                  <td>
                    <span
                      className={`sftp-card__realm sftp-card__realm--${row.realm === 'Live' ? 'live' : 'sandbox'}`}
                    >
                      {row.realm}
                    </span>
                  </td>
                  <td>{row.userCount}</td>
                  <td>
                    <span className={`sftp-card__status sftp-card__status--${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="sftp-card__storage">{row.storageDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="sftp-card__empty" role="status">
              No mailboxes match your search.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
