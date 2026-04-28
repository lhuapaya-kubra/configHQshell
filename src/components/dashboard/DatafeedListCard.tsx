import { useMemo, useState } from 'react'
import type { DatafeedRow } from '../../data/datafeeds'
import { IconSearch, IconSliders } from './icons'

type DatafeedListCardProps = {
  rows: DatafeedRow[]
}

export function DatafeedListCard({ rows }: DatafeedListCardProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.key.toLowerCase().includes(q) ||
        r.datafeedType.toLowerCase().includes(q),
    )
  }, [rows, query])

  return (
    <div className="list-card">
      <div className="list-card__toolbar">
        <div className="list-card__search-wrap">
          <IconSearch className="list-card__search-icon" size={20} />
          <input
            type="search"
            className="list-card__search"
            placeholder="Search by name, Datafeed ID, or KRN ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search datafeeds"
          />
        </div>
        <button type="button" className="list-card__filter-btn" aria-label="Filter">
          <IconSliders size={20} />
        </button>
      </div>

      <div className="list-card__table-wrap">
        <table className="list-card__table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Datafeed type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.key}>
                <td>
                  <span className="list-card__name">{row.name}</span>
                  {row.legacy && <span className="list-card__badge">Legacy</span>}
                </td>
                <td>
                  <span className="list-card__type">*{row.datafeedType}*</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
