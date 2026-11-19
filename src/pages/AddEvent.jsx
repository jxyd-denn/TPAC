import { useState } from 'react'
import { createEvent } from '../apis/eventsApi'
import './AddEvent.css'

const eventColors = [
  { name: 'Forest', value: '#26776d' },
  { name: 'Blue', value: '#4f75a9' },
  { name: 'Amber', value: '#c89536' },
  { name: 'Coral', value: '#c86a5b' },
  { name: 'Purple', value: '#8066a8' },
]

function AddEvent({ onBack, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [color, setColor] = useState(eventColors[0].value)
  const [status, setStatus] = useState({ type: '', message: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Adding event...' })

    try {
      await createEvent({ title, description, eventDate, color })
      setStatus({ type: 'success', message: 'Event added to the timeline.' })
      onCreated?.()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="add-event-page">
      <header className="timeline-header">
        <button type="button" className="back-button" onClick={onBack}>← Timeline</button>
        <button type="button" className="header-avatar" aria-label="Account menu">TN</button>
      </header>

      <section className="event-form-wrap">
        <p className="page-kicker">New timeline item</p>
        <h1>Add an event</h1>
        <p className="page-subtitle">Create a color-coded milestone for the club.</p>

        <form className="event-form" onSubmit={handleSubmit}>
          <label htmlFor="event-title">Event name</label>
          <input id="event-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ATP Hike 3" required />

          <label htmlFor="event-description">Description</label>
          <textarea id="event-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add location, notes, or preparation details..." rows="4" />

          <label htmlFor="event-date">Event date</label>
          <input id="event-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />

          <fieldset>
            <legend>Timeline color</legend>
            <div className="color-options">
              {eventColors.map((option) => (
                <label key={option.value} className={color === option.value ? 'selected' : ''}>
                  <input type="radio" name="event-color" value={option.value} checked={color === option.value} onChange={() => setColor(option.value)} />
                  <span style={{ background: option.value }} />
                  {option.name}
                </label>
              ))}
            </div>
          </fieldset>

          {status.message && <p className={`event-status ${status.type}`}>{status.message}</p>}
          <button type="submit" className="save-event-button" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Add to timeline'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AddEvent
