import './TimelineHeader.css'

function TimelineHeader({ initials = 'TP', onAddDate, onLogout }) {
  return (
    <header className="timeline-header">
      <div className="timeline-brand">
        <span className="brand-icon" aria-hidden="true">△</span>
        <span>TPAC Timeline</span>
      </div>
      <div className="header-actions">
        <button type="button" className="add-event-button" onClick={onAddDate}>+ Add date</button>
        <button type="button" className="header-avatar" onClick={onLogout} aria-label="Log out">{initials}</button>
      </div>
    </header>
  )
}

export default TimelineHeader
