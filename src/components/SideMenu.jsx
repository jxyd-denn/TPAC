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
          <button type="button" onClick={() => onNavigate('task-manager')}>Task manager</button>
          <button type="button" onClick={() => onNavigate('settings')}>Settings</button>
          <button type="button" onClick={() => onNavigate('timetree')}>To TimeTree calendar</button>
        </nav>
      </aside>
    </>
  )
}

export default SideMenu
