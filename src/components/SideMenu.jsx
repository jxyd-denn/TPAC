import './SideMenu.css'

function SideMenu({ open, onClose, onNavigate }) {
  return (
    <>
      {open && <button className="menu-backdrop" type="button" aria-label="Close menu" onClick={onClose} />}
      <aside className={`side-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="side-menu-header">
          <h2>Menu</h2>
          <button type="button" className="side-menu-close" onClick={onClose} aria-label="Close menu">×</button>
        </div>
        <nav className="side-menu-links">
          <button type="button" onClick={() => onNavigate('timeline')}><span className="menu-option-icon" aria-hidden="true">▥</span>Timeline</button>
          <button type="button" onClick={() => onNavigate('task-manager')}><span className="menu-option-icon" aria-hidden="true">☑</span>Task manager</button>
          <button type="button" onClick={() => onNavigate('settings')}><span className="menu-option-icon" aria-hidden="true">⚙</span>Settings</button>
          <button type="button" onClick={() => onNavigate('timetree')}><span className="menu-option-icon" aria-hidden="true">▣</span>To TimeTree calendar</button>
        </nav>
      </aside>
    </>
  )
}

export default SideMenu
