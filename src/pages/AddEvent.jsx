import { useState, useEffect } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import { createTimelineDates } from '../apis/timelineDatesApi'
import { EVENT_OPTIONS, DEPARTMENT_OPTIONS, EVENT_TYPES, DEPARTMENT_TYPES } from '../constants/timelineOptions'
import TimelineHeader from '../components/TimelineHeader'
import { supabase } from '../lib/supabase'
import './AddEvent.css'

function addWeeks(dateString, weeks) {
  return format(addDays(parseISO(dateString), weeks * 7), 'yyyy-MM-dd')
}

function AddEvent({ onBack, onCreated, initialScope, onProfile, onMenu }) {
  const [scopeType, setScopeType] = useState(initialScope?.scopeType || 'event')
  const [scopeId, setScopeId] = useState(initialScope?.scopeId || '')
  const [profiles, setProfiles] = useState([])
  const [dateType, setDateType] = useState('')
  const [title, setTitle] = useState('')
  const [titleEdited, setTitleEdited] = useState(false)
  const [dateValue, setDateValue] = useState('')
  const [endDateValue, setEndDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')
  const [endTimeValue, setEndTimeValue] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [repeatMeeting, setRepeatMeeting] = useState(false)
  const [repeatWeeks, setRepeatWeeks] = useState(4)
  const [organizerIds, setOrganizerIds] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    supabase?.from('profiles').select('id, first_name, last_name').order('first_name').then(({ data }) => setProfiles(data || []))
  }, [])

  const scopes = scopeType === 'event' ? EVENT_OPTIONS : DEPARTMENT_OPTIONS
  const scopeName = scopes.find((scope) => scope.id === scopeId)?.title
    || scopes.find((scope) => scope.id === scopeId)?.name
    || ''
  const types = scopeType === 'event' ? EVENT_TYPES : DEPARTMENT_TYPES

  useEffect(() => {
    if (titleEdited) return
    const suggested = dateType && scopeName
      ? `${dateType} – ${scopeName}`
      : dateType || scopeName
    setTitle(suggested)
  }, [dateType, scopeName, titleEdited])

  function changeScopeType(nextScopeType) {
    setScopeType(nextScopeType)
    setScopeId('')
    setDateType('')
    setTitleEdited(false)
  }

  function validate() {
    const nextErrors = {}
    if (!scopeId) nextErrors.scope = 'Choose an event or department.'
    if (!dateType) nextErrors.dateType = 'Choose a date type.'
    if (!title.trim()) nextErrors.title = 'Enter a title.'
    if (!dateValue) nextErrors.date = 'Choose a date.'
    if (dateValue && endDateValue && parseISO(endDateValue) < parseISO(dateValue)) {
      nextErrors.endDate = 'End date cannot be before the start date.'
    }
    if (dateType === 'Meeting' && repeatMeeting && (!Number.isInteger(Number(repeatWeeks)) || Number(repeatWeeks) < 1)) {
      nextErrors.repeat = 'Enter at least 1 week.'
    }
    if (!organizerIds.length) nextErrors.organizers = 'Assign at least one organizer or IC.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventEvent?.()
    event.preventDefault()
    if (!validate()) return

    const scope = scopes.find((item) => item.id === scopeId)
    const rowCount = dateType === 'Meeting' && repeatMeeting ? Number(repeatWeeks) : 1
    const rows = Array.from({ length: rowCount }, (_, index) => ({
      scope_type: scopeType,
      scope_id: scopeId,
      title,
      date_type: dateType,
      date_value: addWeeks(dateValue, index),
      end_date: endDateValue ? addWeeks(endDateValue, index) : null,
      time_value: timeValue || null,
      end_time: endTimeValue || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
      organizer_ids: organizerIds,
      color: scope?.color || scope?.color,
    }))

    setStatus({ type: 'loading', message: 'Adding date...' })
    try {
      await createTimelineDates(rows)
      setStatus({ type: 'success', message: 'Date added to the timeline.' })
      onCreated?.()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="add-event-page">
      <TimelineHeader initials="TN" onAddDate={undefined} onProfile={onProfile} onMenu={onMenu} onLogout={onBack} />
      <section className="event-form-wrap">
        <button type="button" className="back-button" onClick={onBack}>← Back to timeline</button>
        <p className="page-kicker">Add a date</p>
        <h1 className="page-title">Plan the next milestone</h1>

        <form className="event-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="scope-toggle">
            <legend>Category</legend>
            <div>
              <button type="button" className={scopeType === 'event' ? 'active' : ''} onClick={() => changeScopeType('event')}>For an event</button>
              <button type="button" className={scopeType === 'department' ? 'active' : ''} onClick={() => changeScopeType('department')}>For a department</button>
            </div>
          </fieldset>

          <label htmlFor="scope-select">{scopeType === 'event' ? 'Event' : 'Department'}</label>
          <select id="scope-select" value={scopeId} onChange={(event) => setScopeId(event.target.value)}>
            <option value="">Select {scopeType}</option>
            {scopes.map((scope) => <option key={scope.id} value={scope.id}>{scope.title || scope.name}</option>)}
          </select>
          {errors.scope && <p className="field-error">{errors.scope}</p>}

          <label htmlFor="date-type">Type</label>
          <select id="date-type" value={dateType} onChange={(event) => setDateType(event.target.value)}>
            <option value="">Select type</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.dateType && <p className="field-error">{errors.dateType}</p>}

          <label htmlFor="date-title">Title</label>
          <input id="date-title" value={title} onChange={(event) => { setTitle(event.target.value); setTitleEdited(true) }} placeholder="Dry run – ATP Hike 3" />
          {errors.title && <p className="field-error">{errors.title}</p>}

          <div className="form-grid">
            <div>
              <label htmlFor="date-value">Date</label>
              <input id="date-value" type="date" value={dateValue} onChange={(event) => setDateValue(event.target.value)} />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time-value">Time <span>(optional)</span></label>
              <input id="time-value" type="time" value={timeValue} onChange={(event) => setTimeValue(event.target.value)} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label htmlFor="end-date-value">End date</label>
              <input id="end-date-value" type="date" value={endDateValue} onChange={(event) => setEndDateValue(event.target.value)} />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="end-time-value">End time <span>(optional)</span></label>
              <input id="end-time-value" type="time" value={endTimeValue} onChange={(event) => setEndTimeValue(event.target.value)} />
            </div>
          </div>

          <fieldset className="organizer-fieldset">
            <legend>Organizers / ICs</legend>
            <div className="organizer-options">
              {profiles.map((profile) => {
                const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed member'
                const checked = organizerIds.includes(profile.id)

                return (
                  <label key={profile.id} className={checked ? 'selected' : ''}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        setOrganizerIds((current) => event.target.checked
                          ? [...current, profile.id]
                          : current.filter((id) => id !== profile.id))
                      }}
                    />
                    <span className="organizer-avatar" aria-hidden="true">
                      {`${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()}
                    </span>
                    <span>{name}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <label htmlFor="date-location">Location <span>(optional)</span></label>
          <input id="date-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Add a location" />

          <label htmlFor="date-notes">Notes <span>(optional)</span></label>
          <textarea id="date-notes" rows="4" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add preparation details" />

          {dateType === 'Meeting' && (
            <div className="repeat-box">
              <label><input type="checkbox" checked={repeatMeeting} onChange={(event) => setRepeatMeeting(event.target.checked)} /> Repeat weekly</label>
              {repeatMeeting && (
                <div>
                  <label htmlFor="repeat-weeks">Number of weeks</label>
                  <input id="repeat-weeks" type="number" min="1" max="52" value={repeatWeeks} onChange={(event) => setRepeatWeeks(event.target.value)} />
                  {errors.repeat && <p className="field-error">{errors.repeat}</p>}
                </div>
              )}
            </div>
          )}

          {status.message && <p className={`event-status ${status.type}`}>{status.message}</p>}
          <button type="submit" className="save-event-button" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Add date'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AddEvent
