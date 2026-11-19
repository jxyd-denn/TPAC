import { useEffect, useState } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import { updateTimelineDate } from '../apis/timelineDatesApi'
import { EVENT_OPTIONS, EVENT_TYPES, DEPARTMENT_TYPES } from '../constants/timelineOptions'
import TimelineHeader from '../components/TimelineHeader'
import { supabase } from '../lib/supabase'
import './EditEvent.css'

function addWeeks(dateString, weeks) {
  return format(addDays(parseISO(dateString), weeks * 7), 'yyyy-MM-dd')
}

function EditEvent({ editItem, onBack, onUpdated, onBackToAdd }) {
  const [scopeType, setScopeType] = useState(editItem?.scope_type || 'event')
  const [scopeId, setScopeId] = useState(editItem?.scope_id || '')
  const [departments, setDepartments] = useState([])
  const [profiles, setProfiles] = useState([])
  const [dateType, setDateType] = useState(editItem?.date_type || '')
  const [title, setTitle] = useState(editItem?.title || '')
  const [titleEdited, setTitleEdited] = useState(true)
  const [dateValue, setDateValue] = useState(editItem?.date_value || '')
  const [endDateValue, setEndDateValue] = useState(editItem?.end_date || '')
  const [timeValue, setTimeValue] = useState(editItem?.time_value || '')
  const [endTimeValue, setEndTimeValue] = useState(editItem?.end_time || '')
  const [location, setLocation] = useState(editItem?.location || '')
  const [notes, setNotes] = useState(editItem?.notes || '')
  const [organizerIds, setOrganizerIds] = useState(editItem?.organizer_ids || [])
  const [repeatMeeting, setRepeatMeeting] = useState(false)
  const [repeatWeeks, setRepeatWeeks] = useState(4)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    supabase?.from('departments').select('id, name, color').then(({ data }) => setDepartments(data || []))
    supabase?.from('profiles').select('id, first_name, last_name').order('first_name').then(({ data }) => setProfiles(data || []))
  }, [])

  const scopes = scopeType === 'event' ? EVENT_OPTIONS : departments
  const scopeName = scopes.find((scope) => scope.id === scopeId)?.title
    || scopes.find((scope) => scope.id === scopeId)?.name
    || ''
  const types = scopeType === 'event' ? EVENT_TYPES : DEPARTMENT_TYPES

  useEffect(() => {
    if (titleEdited) return
    setTitle(dateType && scopeName ? `${dateType} – ${scopeName}` : dateType || scopeName)
  }, [dateType, scopeName, titleEdited])

  function validate() {
    const nextErrors = {}
    if (!scopeId) nextErrors.scope = 'Choose an event or department.'
    if (!dateType) nextErrors.dateType = 'Choose a date type.'
    if (!title.trim()) nextErrors.title = 'Enter a title.'
    if (!dateValue) nextErrors.date = 'Choose a date.'
    if (dateValue && endDateValue && parseISO(endDateValue) < parseISO(dateValue)) {
      nextErrors.endDate = 'End date cannot be before the start date.'
    }
    if (repeatMeeting && (!Number.isInteger(Number(repeatWeeks)) || Number(repeatWeeks) < 1)) {
      nextErrors.repeat = 'Enter at least 1 week.'
    }
    if (!organizerIds.length) nextErrors.organizers = 'Assign at least one organizer or IC.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const scope = scopes.find((item) => item.id === scopeId)
    const rowCount = repeatMeeting ? Number(repeatWeeks) : 1
    const updates = {
      scope_type: scopeType,
      scope_id: scopeId,
      title,
      date_type: dateType,
      date_value: addWeeks(dateValue, 0),
      end_date: endDateValue ? addWeeks(endDateValue, 0) : null,
      time_value: timeValue || null,
      end_time: endTimeValue || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
      organizer_ids: organizerIds,
      color: scope?.color || scope?.color,
    }

    setStatus({ type: 'loading', message: 'Saving changes...' })
    try {
      await updateTimelineDate(editItem.id, updates)
      setStatus({ type: 'success', message: 'Event updated.' })
      onUpdated?.()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="edit-event-page">
      <TimelineHeader initials="TN" onAddDate={onBackToAdd} onLogout={onBack} />
      <section className="edit-event-form-wrap">
        <button type="button" className="edit-back-button" onClick={onBack}>← Back to timeline</button>
        <p className="edit-page-kicker">Edit event</p>
        <h1>Update milestone details</h1>

        <form className="edit-event-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="edit-scope-toggle">
            <legend>Category</legend>
            <div>
              <button type="button" className={scopeType === 'event' ? 'active' : ''} onClick={() => setScopeType('event')}>For an event</button>
              <button type="button" className={scopeType === 'department' ? 'active' : ''} onClick={() => setScopeType('department')}>For a department</button>
            </div>
          </fieldset>

          <label htmlFor="edit-scope-select">{scopeType === 'event' ? 'Event' : 'Department'}</label>
          <select id="edit-scope-select" value={scopeId} onChange={(event) => setScopeId(event.target.value)}>
            <option value="">Select {scopeType}</option>
            {scopes.map((scope) => <option key={scope.id} value={scope.id}>{scope.title || scope.name}</option>)}
          </select>
          {errors.scope && <p className="edit-field-error">{errors.scope}</p>}

          <label htmlFor="edit-date-type">Type</label>
          <select id="edit-date-type" value={dateType} onChange={(event) => setDateType(event.target.value)}>
            <option value="">Select type</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {errors.dateType && <p className="edit-field-error">{errors.dateType}</p>}

          <label htmlFor="edit-date-title">Title</label>
          <input id="edit-date-title" value={title} onChange={(event) => { setTitle(event.target.value); setTitleEdited(true) }} />
          {errors.title && <p className="edit-field-error">{errors.title}</p>}

          <div className="edit-form-grid">
            <div>
              <label htmlFor="edit-date-value">Date</label>
              <input id="edit-date-value" type="date" value={dateValue} onChange={(event) => setDateValue(event.target.value)} />
              {errors.date && <p className="edit-field-error">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="edit-time-value">Time <span>(optional)</span></label>
              <input id="edit-time-value" type="time" value={timeValue} onChange={(event) => setTimeValue(event.target.value)} />
            </div>
          </div>

          <div className="edit-form-grid">
            <div>
              <label htmlFor="edit-end-date-value">End date <span>(optional)</span></label>
              <input id="edit-end-date-value" type="date" value={endDateValue} onChange={(event) => setEndDateValue(event.target.value)} />
              {errors.endDate && <p className="edit-field-error">{errors.endDate}</p>}
            </div>
            <div>
              <label htmlFor="edit-end-time-value">End time <span>(optional)</span></label>
              <input id="edit-end-time-value" type="time" value={endTimeValue} onChange={(event) => setEndTimeValue(event.target.value)} />
            </div>
          </div>

          <fieldset className="edit-organizer-fieldset">
            <legend>Organizers / ICs</legend>
            <div className="edit-organizer-options">
              {profiles.map((profile) => {
                const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed member'
                const checked = organizerIds.includes(profile.id)
                return (
                  <label key={profile.id} className={checked ? 'selected' : ''}>
                    <input type="checkbox" checked={checked} onChange={(event) => setOrganizerIds((current) => event.target.checked ? [...current, profile.id] : current.filter((id) => id !== profile.id))} />
                    <span className="edit-organizer-avatar">{`${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()}</span>
                    <span>{name}</span>
                  </label>
                )
              })}
            </div>
            {errors.organizers && <p className="edit-field-error">{errors.organizers}</p>}
          </fieldset>

          <label htmlFor="edit-location">Location <span>(optional)</span></label>
          <input id="edit-location" value={location} onChange={(event) => setLocation(event.target.value)} />

          <label htmlFor="edit-notes">Notes <span>(optional)</span></label>
          <textarea id="edit-notes" rows="4" value={notes} onChange={(event) => setNotes(event.target.value)} />

          {status.message && <p className={`edit-status ${status.type}`}>{status.message}</p>}
          <button type="submit" className="edit-save-button" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default EditEvent
