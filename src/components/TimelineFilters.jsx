import './TimelineFilters.css'

function TimelineFilters({ scopes, departments = [], types, activeScopes, activeDepartments = [], activeTypes, onToggleScope, onToggleDepartment, onToggleType, onlyMine, onOnlyMineChange, searchQuery, onSearchChange, onClearAll }) {
  return (
    <div className="timeline-filters">
      <div className="search-filter">
        <div className="search-filter-heading">
          <label htmlFor="timeline-search">Search timeline</label>
          <button type="button" className="clear-filters-button" onClick={onClearAll}>Clear all filters</button>
        </div>
        <input
          id="timeline-search"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search events, titles, locations, or notes"
        />
      </div>

      <div className="compact-filter-row">
        <div className="filter-group event-filter-group">
          <p>Events</p>
          <div className="chip-row event-chip-row">
            {scopes.map((scope) => (
              <button key={scope.id} type="button" className={`filter-chip ${activeScopes.includes(scope.id) ? 'active' : ''}`} onClick={() => onToggleScope(scope.id)}>
                <span style={{ background: scope.color }} />{scope.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group department-filter-group">
          <p>Departments</p>
          <div className="chip-row department-chip-row">
            {departments.map((department) => (
              <button key={department.id} type="button" className={`filter-chip ${activeDepartments.includes(department.id) ? 'active' : ''}`} onClick={() => onToggleDepartment(department.id)}>
                <span style={{ background: department.color }} />{department.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group type-filter-group">
          <label htmlFor="type-filter">Type</label>
          <select
            id="type-filter"
            value={activeTypes[0] || ''}
            onChange={(event) => {
              const selected = event.target.value
              if (!selected) {
                activeTypes.forEach((type) => onToggleType(type))
              } else {
                activeTypes.forEach((type) => onToggleType(type))
                onToggleType(selected)
              }
            }}
          >
            <option value="">All types</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
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
