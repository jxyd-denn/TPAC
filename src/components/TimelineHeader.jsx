import './TimelineHeader.css'

function TimelineHeader({ initials = 'TP', avatarUrl, onAddDate, onLogout, onProfile, onMenu }) {
  return (
    <header className="timeline-header">
      <div className="timeline-brand">
        <span className="brand-icon" aria-hidden="true">△</span>
        <span>TPAC Timeline</span>
      </div>
      <div className="header-actions">
        <button type="button" className="add-event-button" onClick={onAddDate}>+ Add date</button>
        <button type="button" className="header-avatar" onClick={onProfile || onLogout} aria-label="Open profile">
          {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
        </button>
        <button type="button" className="menu-button" onClick={onMenu} aria-label="Open menu">☰</button>
      </div>
    </header>
  )
}

export default TimelineHeader
