export const MODULE_OPTIONS = [
  { id: 'datafeed', label: 'Datafeed' },
  { id: 'file-transformation', label: 'File Transformation' },
  { id: 'sftp-mailbox', label: 'SFTP Mailbox Manager' },
] as const

export type ModuleId = (typeof MODULE_OPTIONS)[number]['id']

export function moduleLabel(id: ModuleId): string {
  return MODULE_OPTIONS.find((o) => o.id === id)?.label ?? 'Datafeed'
}
