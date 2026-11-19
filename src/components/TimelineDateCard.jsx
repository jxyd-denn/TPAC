import './TimelineDateCard.css'

function formatTime(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const date = new Date(2000, 0, 1, Number(hours), Number(minutes))
  return date.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' })
}

function TimelineDateCard({ item, scopeLabel, onQuickAdd }) {
  const date = new Date(`${item.date_value}T00:00:00`)

  return (
    <article className="horizontal-date-card" style={{ '--event-color': item.color || '#26776d' }}>
      <div className="date-marker">
        <span>{date.toLocaleDateString('en-SG', { month: 'short' }).toUpperCase()}</span>
        <strong>{date.getDate()}</strong>
        <small>{date.getFullYear()}</small>
      </div>
      <div className="date-card-content">
        <div className="date-card-topline">
          <span className="date-type">{item.date_type}</span>
          <span className="scope-label">{scopeLabel}</span>
        </div>
        <h3>{item.title}</h3>
        {(item.time_value || item.location) && (
          <p className="date-meta">
            {item.time_value && <span>{formatTime(item.time_value)}</span>}
            {item.location && <span>{item.location}</span>}
          </p>
        )}
        {item.notes && <p className="date-notes">{item.notes}</p>}
        {onQuickAdd && <button type="button" className="quick-add" onClick={onQuickAdd}>+ Add date</button>}
      </div>
    </article>
  )
}

export default TimelineDateCard
