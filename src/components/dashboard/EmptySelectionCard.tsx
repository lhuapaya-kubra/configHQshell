export function EmptySelectionCard() {
  return (
    <div className="empty-card">
      <div className="empty-card__art" aria-hidden>
        <div className="empty-card__blob" />
        <svg className="empty-card__db" viewBox="0 0 200 200" role="img">
          <title>Database illustration</title>
          <ellipse cx="100" cy="52" rx="58" ry="20" fill="#9ca3af" />
          <ellipse cx="100" cy="48" rx="58" ry="20" fill="#d1d5db" />
          <path d="M42 48v28c0 11 26 20 58 20s58-9 58-20V48" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <path d="M42 76v28c0 11 26 20 58 20s58-9 58-20V76" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" />
          <path d="M42 104v28c0 11 26 20 58 20s58-9 58-20v-28" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="156" cy="88" r="4" fill="#22c55e" />
          <circle cx="156" cy="98" r="4" fill="#eab308" />
          <circle cx="156" cy="108" r="4" fill="#ef4444" />
        </svg>
        <span className="empty-card__star empty-card__star--1">✦</span>
        <span className="empty-card__star empty-card__star--2">✦</span>
        <span className="empty-card__star empty-card__star--3">✦</span>
      </div>
      <p className="empty-card__message">Select a Datafeed to view or edit</p>
    </div>
  )
}
