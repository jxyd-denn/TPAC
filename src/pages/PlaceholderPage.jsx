import TimelineHeader from '../components/TimelineHeader'
import './PlaceholderPage.css'

function PlaceholderPage({ title, description, onBack, onMenu, onProfile }) {
  return (
    <main className="placeholder-page">
      <TimelineHeader onAddDate={onBack} onMenu={onMenu} onProfile={onProfile} />
      <section className="placeholder-content">
        <button type="button" onClick={onBack}>← Back to timeline</button>
        <p className="placeholder-kicker">TPAC Timeline</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}

export default PlaceholderPage
