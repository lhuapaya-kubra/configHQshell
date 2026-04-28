export type DatafeedRow = {
  key: string
  name: string
  legacy: boolean
  datafeedType: string
}

export const mockDatafeeds: DatafeedRow[] = [
  { key: '1', name: '0-andrew-test1', legacy: true, datafeedType: 'Custom Feed' },
  { key: '2', name: '0-andrew-test1', legacy: true, datafeedType: 'Outage Feed' },
  { key: '3', name: '0-andrew-test1', legacy: true, datafeedType: 'Additional Map Layer Feed' },
  { key: '4', name: '0-nate-test1', legacy: true, datafeedType: 'Custom Feed' },
  { key: '5', name: '0-nate-test1', legacy: true, datafeedType: 'Outage Feed' },
  { key: '6', name: '0-nate-test1', legacy: true, datafeedType: 'Additional Map Layer Feed' },
  { key: '7', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
  { key: '8', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
  { key: '9', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
  { key: '10', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
  { key: '11', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
  { key: '12', name: '0-nate-test1', legacy: true, datafeedType: 'Account Services' },
]
