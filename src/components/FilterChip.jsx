import './FilterChip.css'

function FilterChip({ label, color, active, onClick }) {
  return (
    <button type="button" className={`filter-chip ${active ? 'active' : ''}`} onClick={onClick}>
      {color && <span className="filter-chip-dot" style={{ background: color }} />}
      {label}
    </button>
  )
}

export default FilterChip
