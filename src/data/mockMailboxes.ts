export type Realm = 'Live' | 'Sandbox'

export type MailboxRow = {
  key: string
  name: string
  realm: Realm
  userCount: number
  status: 'Active' | 'Provisioning' | 'Paused'
  storageDisplay: string
}

export const mockMailboxes: MailboxRow[] = [
  {
    key: 'mb-1',
    name: 'client-remittance-live',
    realm: 'Live',
    userCount: 4,
    status: 'Active',
    storageDisplay: '2.4 GB',
  },
  {
    key: 'mb-2',
    name: 'client-remittance-sandbox',
    realm: 'Sandbox',
    userCount: 2,
    status: 'Active',
    storageDisplay: '180 MB',
  },
  {
    key: 'mb-3',
    name: 'batch-posting-east',
    realm: 'Live',
    userCount: 6,
    status: 'Provisioning',
    storageDisplay: '—',
  },
  {
    key: 'mb-4',
    name: 'legacy-ingest-sandbox',
    realm: 'Sandbox',
    userCount: 1,
    status: 'Paused',
    storageDisplay: '920 MB',
  },
  {
    key: 'mb-5',
    name: 'hq-support-mailbox',
    realm: 'Live',
    userCount: 3,
    status: 'Active',
    storageDisplay: '512 MB',
  },
]
