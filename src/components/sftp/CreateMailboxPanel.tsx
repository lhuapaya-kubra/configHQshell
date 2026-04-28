import { type FormEvent, useEffect, useId, useState } from 'react'
import { IconClose } from '../dashboard/icons'
import './create-mailbox-panel.css'

export type RealmChoice = 'Live' | 'Sandbox'

export type CreateMailboxFormValues = {
  mailboxName: string
  realm: RealmChoice
  folders: string[]
  userDisplayName: string
  userContact: string
  userUsername: string
  sshPublicKey: string
  permissionRead: boolean
  permissionWrite: boolean
  permissionDelete: boolean
}

const STANDARD_FOLDERS = [
  { id: 'remittance', label: 'Remittance', description: 'Typical inbound remittance files' },
  {
    id: 'batch_payment_posting',
    label: 'Batch payment posting',
    description: 'Batch settlement / posting drops',
  },
] as const

type CreateMailboxPanelProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: CreateMailboxFormValues) => void
}

const initialForm: CreateMailboxFormValues = {
  mailboxName: '',
  realm: 'Sandbox',
  folders: [],
  userDisplayName: '',
  userContact: '',
  userUsername: '',
  sshPublicKey: '',
  permissionRead: true,
  permissionWrite: true,
  permissionDelete: true,
}

function validate(values: CreateMailboxFormValues): Partial<Record<string, string>> {
  const e: Partial<Record<string, string>> = {}
  if (!values.mailboxName.trim()) {
    e.mailboxName = 'Mailbox name is required.'
  }
  if (values.folders.length === 0) {
    e.folders = 'Select at least one folder for this mailbox.'
  }
  if (!values.userDisplayName.trim()) {
    e.userDisplayName = 'User display name is required.'
  }
  if (!values.userContact.trim()) {
    e.userContact = 'Contact (email) is required for operational reach-out.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.userContact.trim())) {
    e.userContact = 'Enter a valid email address.'
  }
  if (!values.userUsername.trim()) {
    e.userUsername = 'SFTP username is required.'
  }
  if (!values.sshPublicKey.trim()) {
    e.sshPublicKey = 'SSH public key is required.'
  } else if (!/ssh-(rsa|ed25519|dss)|ecdsa-sha2/i.test(values.sshPublicKey.trim())) {
    e.sshPublicKey =
      'Paste a valid OpenSSH public key (e.g. ssh-rsa, ssh-ed25519, or ecdsa-sha2-nistp256).'
  }
  if (!values.permissionRead && !values.permissionWrite && !values.permissionDelete) {
    e.permissions = 'Select at least one permission (Read, Write, or Delete).'
  }
  return e
}

export function CreateMailboxPanel({ open, onClose, onSubmit }: CreateMailboxPanelProps) {
  const titleId = useId()
  const [values, setValues] = useState<CreateMailboxFormValues>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (!open) return
    setValues(initialForm)
    setErrors({})
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  function toggleFolder(id: string) {
    setValues((v) => ({
      ...v,
      folders: v.folders.includes(id) ? v.folders.filter((x) => x !== id) : [...v.folders, id],
    }))
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate(values)
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onSubmit(values)
    onClose()
    setValues(initialForm)
  }

  return (
    <div className="create-mailbox-overlay" role="presentation">
      <button type="button" className="create-mailbox-overlay__backdrop" aria-label="Close panel" onClick={onClose} />
      <div
        className="create-mailbox-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="create-mailbox-panel__header">
          <h2 id={titleId} className="create-mailbox-panel__title">
            Create SFTP mailbox
          </h2>
          <button
            type="button"
            className="create-mailbox-panel__close"
            onClick={onClose}
            aria-label="Close"
          >
            <IconClose size={22} />
          </button>
        </header>

        <p className="create-mailbox-panel__intro">
          Required fields follow the SFTP Mailbox Manager PRD/DRD: mailbox identity, realm (Live/Sandbox), standard
          folders, and an initial user with SSH key and mailbox-level permissions.
        </p>

        <form className="create-mailbox-panel__form" onSubmit={handleSubmit} noValidate>
          <fieldset className="create-mailbox-fieldset">
            <legend className="create-mailbox-fieldset__legend">Mailbox</legend>

            <label className="create-mailbox-label" htmlFor="mb-name">
              Mailbox name <span className="create-mailbox-required">*</span>
            </label>
            <input
              id="mb-name"
              className={`create-mailbox-input ${errors.mailboxName ? 'create-mailbox-input--error' : ''}`}
              value={values.mailboxName}
              onChange={(e) => setValues((v) => ({ ...v, mailboxName: e.target.value }))}
              placeholder="e.g. client-remittance-live"
              autoComplete="off"
              aria-invalid={!!errors.mailboxName}
              aria-describedby={errors.mailboxName ? 'err-mb-name' : undefined}
            />
            {errors.mailboxName && (
              <p id="err-mb-name" className="create-mailbox-error" role="alert">
                {errors.mailboxName}
              </p>
            )}

            <span className="create-mailbox-label" id="realm-label">
              Realm <span className="create-mailbox-required">*</span>
            </span>
            <div className="create-mailbox-segment" role="group" aria-labelledby="realm-label">
              {(['Sandbox', 'Live'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`create-mailbox-segment__btn ${values.realm === r ? 'create-mailbox-segment__btn--active' : ''}`}
                  onClick={() => setValues((v) => ({ ...v, realm: r }))}
                  aria-pressed={values.realm === r}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="create-mailbox-hint">Sandbox for testing; Live for production traffic (realm separation per DRD).</p>

            <span className="create-mailbox-label" id="folders-label">
              Standard folders <span className="create-mailbox-required">*</span>
            </span>
            <p className="create-mailbox-hint">PRD examples: remittance, batch_payment_posting. Users get access to all selected folders (no per-folder ACL in MVP).</p>
            <div className="create-mailbox-checklist" role="group" aria-labelledby="folders-label">
              {STANDARD_FOLDERS.map((f) => (
                <label key={f.id} className="create-mailbox-check">
                  <input
                    type="checkbox"
                    checked={values.folders.includes(f.id)}
                    onChange={() => toggleFolder(f.id)}
                  />
                  <span className="create-mailbox-check__text">
                    <span className="create-mailbox-check__title">{f.label}</span>
                    <span className="create-mailbox-check__sub">{f.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.folders && (
              <p className="create-mailbox-error" role="alert">
                {errors.folders}
              </p>
            )}
          </fieldset>

          <fieldset className="create-mailbox-fieldset">
            <legend className="create-mailbox-fieldset__legend">Initial SFTP user</legend>
            <p className="create-mailbox-hint">DRD F2: name, contact, and SSH public key. Password auth is out of scope.</p>

            <label className="create-mailbox-label" htmlFor="user-display">
              User display name <span className="create-mailbox-required">*</span>
            </label>
            <input
              id="user-display"
              className={`create-mailbox-input ${errors.userDisplayName ? 'create-mailbox-input--error' : ''}`}
              value={values.userDisplayName}
              onChange={(e) => setValues((v) => ({ ...v, userDisplayName: e.target.value }))}
              placeholder="e.g. Jane Operator"
              aria-invalid={!!errors.userDisplayName}
              aria-describedby={errors.userDisplayName ? 'err-display' : undefined}
            />
            {errors.userDisplayName && (
              <p id="err-display" className="create-mailbox-error" role="alert">
                {errors.userDisplayName}
              </p>
            )}

            <label className="create-mailbox-label" htmlFor="user-contact">
              Contact email <span className="create-mailbox-required">*</span>
            </label>
            <input
              id="user-contact"
              type="email"
              className={`create-mailbox-input ${errors.userContact ? 'create-mailbox-input--error' : ''}`}
              value={values.userContact}
              onChange={(e) => setValues((v) => ({ ...v, userContact: e.target.value }))}
              placeholder="ops@client.com"
              autoComplete="email"
              aria-invalid={!!errors.userContact}
              aria-describedby={errors.userContact ? 'err-contact' : undefined}
            />
            {errors.userContact && (
              <p id="err-contact" className="create-mailbox-error" role="alert">
                {errors.userContact}
              </p>
            )}

            <label className="create-mailbox-label" htmlFor="user-username">
              SFTP username <span className="create-mailbox-required">*</span>
            </label>
            <input
              id="user-username"
              className={`create-mailbox-input ${errors.userUsername ? 'create-mailbox-input--error' : ''}`}
              value={values.userUsername}
              onChange={(e) => setValues((v) => ({ ...v, userUsername: e.target.value }))}
              placeholder="Lowercase, no spaces (uniqueness rules TBD)"
              autoComplete="off"
              aria-invalid={!!errors.userUsername}
              aria-describedby={errors.userUsername ? 'err-user' : undefined}
            />
            {errors.userUsername && (
              <p id="err-user" className="create-mailbox-error" role="alert">
                {errors.userUsername}
              </p>
            )}

            <label className="create-mailbox-label" htmlFor="ssh-key">
              SSH public key <span className="create-mailbox-required">*</span>
            </label>
            <textarea
              id="ssh-key"
              className={`create-mailbox-textarea ${errors.sshPublicKey ? 'create-mailbox-input--error' : ''}`}
              value={values.sshPublicKey}
              onChange={(e) => setValues((v) => ({ ...v, sshPublicKey: e.target.value }))}
              placeholder="Begins with ssh-rsa, ssh-ed25519, ecdsa-sha2-nistp256, etc."
              rows={5}
              spellCheck={false}
              aria-invalid={!!errors.sshPublicKey}
              aria-describedby={errors.sshPublicKey ? 'err-ssh' : undefined}
            />
            {errors.sshPublicKey && (
              <p id="err-ssh" className="create-mailbox-error" role="alert">
                {errors.sshPublicKey}
              </p>
            )}

            <span className="create-mailbox-label" id="perm-label">
              Mailbox-level permissions <span className="create-mailbox-required">*</span>
            </span>
            <p className="create-mailbox-hint">Applies to all folders for this user (PRD/DRD MVP — not per-folder).</p>
            <div className="create-mailbox-perms" role="group" aria-labelledby="perm-label">
              <label className="create-mailbox-inline-check">
                <input
                  type="checkbox"
                  checked={values.permissionRead}
                  onChange={(e) => setValues((v) => ({ ...v, permissionRead: e.target.checked }))}
                />
                Read
              </label>
              <label className="create-mailbox-inline-check">
                <input
                  type="checkbox"
                  checked={values.permissionWrite}
                  onChange={(e) => setValues((v) => ({ ...v, permissionWrite: e.target.checked }))}
                />
                Write
              </label>
              <label className="create-mailbox-inline-check">
                <input
                  type="checkbox"
                  checked={values.permissionDelete}
                  onChange={(e) => setValues((v) => ({ ...v, permissionDelete: e.target.checked }))}
                />
                Delete
              </label>
            </div>
            {errors.permissions && (
              <p className="create-mailbox-error" role="alert">
                {errors.permissions}
              </p>
            )}
          </fieldset>

          <div className="create-mailbox-panel__actions">
            <button type="button" className="create-mailbox-btn create-mailbox-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-mailbox-btn create-mailbox-btn--primary">
              Create mailbox
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
