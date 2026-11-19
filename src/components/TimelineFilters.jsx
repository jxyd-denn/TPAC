import './TimelineFilters.css'

function TimelineFilters({ scopes, types, activeScopes, activeTypes, onToggleScope, onToggleType, onlyMine, onOnlyMineChange }) {
  return (
    <div className="timeline-filters">
      <div className="filter-group">
        <p>Events</p>
        <div className="chip-row">
          {scopes.map((scope) => (
            <button key={scope.id} type="button" className={`filter-chip ${activeScopes.includes(scope.id) ? 'active' : ''}`} onClick={() => onToggleScope(scope.id)}>
              <span style={{ background: scope.color }} />{scope.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <p>Type</p>
        <div className="chip-row">
          {types.map((type) => (
            <button key={type} type="button" className={`filter-chip ${activeTypes.includes(type) ? 'active' : ''}`} onClick={() => onToggleType(type)}>{type}</button>
          ))}
        </div>
      </div>

      <label className="mine-toggle">
        <input type="checkbox" checked={onlyMine} onChange={(event) => onOnlyMineChange(event.target.checked)} />
        <span>Only my events/departments</span>
      </label>
    </div>
  )
}

export default TimelineFilters
