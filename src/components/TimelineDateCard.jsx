import './TimelineDateCard.css'

function formatTime(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const date = new Date(2000, 0, 1, Number(hours), Number(minutes))
  return date.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' })
}

function TimelineDateCard({ item, scopeLabel, position, onQuickAdd }) {
  const date = new Date(`${item.date_value}T00:00:00`)

  return (
    <article
      className="year-date-marker"
      style={{ '--marker-position': `${position}%`, '--event-color': item.color || '#26776d' }}
    >
      <button
        type="button"
        className="year-marker-dot"
        aria-label={`${item.title}, ${date.toLocaleDateString()}`}
        onClick={onQuickAdd}
      />
      <div className="year-marker-label">
        <span>{date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</span>
        <strong>{item.title}</strong>
        <small>{item.date_type}{scopeLabel ? ` · ${scopeLabel}` : ''}</small>
        {(item.time_value || item.location) && (
          <p>
            {item.time_value ? formatTime(item.time_value) : ''}
            {item.time_value && item.location ? ' · ' : ''}
            {item.location || ''}
          </p>
        )}
      </div>
    </article>
  )
}

export default TimelineDateCard
