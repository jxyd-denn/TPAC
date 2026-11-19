import { useEffect, useMemo, useRef, useState } from 'react'
import {
  addDays,
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfMonth,
  format,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import './GeneralTimeline.css'

const PILL_WIDTH = 190
const PILL_GAP = 10

function getIcon(type) {
  const value = String(type || '').toLowerCase()
  if (value.includes('exec')) return '⚑'
  if (value.includes('submission') || value.includes('document')) return '▤'
  if (value.includes('dry')) return '◉'
  if (value.includes('recce')) return '⌕'
  if (value.includes('meeting')) return '◎'
  return '•'
}

function parseIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    console.warn('Skipping invalid timeline date:', value)
    return null
  }

  const date = parseISO(value)
  if (!isValid(date)) {
    console.warn('Skipping invalid timeline date:', value)
    return null
  }
  return date
}

function GeneralTimeline({ items, scopes, onQuickAdd }) {
  const [pixelsPerDay, setPixelsPerDay] = useState(8)
  const [selectedItem, setSelectedItem] = useState(null)
  const [availability, setAvailability] = useState({})
  const scrollRef = useRef(null)

  const parsedItems = useMemo(() => items.map((item) => {
    const date = parseIsoDate(item.date_value)
    return date ? { ...item, parsedDate: date } : null
  }).filter(Boolean).sort((a, b) => a.parsedDate - b.parsedDate), [items])

  const range = useMemo(() => {
    if (!parsedItems.length) {
      const today = startOfDay(new Date())
      return { start: startOfMonth(today), end: endOfMonth(today) }
    }

    const first = parsedItems[0].parsedDate
    const last = parsedItems[parsedItems.length - 1].parsedDate
    return {
      start: startOfMonth(first),
      end: endOfMonth(last),
    }
  }, [parsedItems])

  const axisEnd = addDays(range.end, 28)
  const totalDays = Math.max(1, differenceInCalendarDays(axisEnd, range.start) + 1)
  const axisWidth = totalDays * pixelsPerDay
  const months = eachMonthOfInterval({ start: range.start, end: range.end })

  const packedItems = useMemo(() => {
    const laneEnds = []
    const lanes = []

    parsedItems.forEach((item) => {
      const left = 30 + differenceInCalendarDays(item.parsedDate, range.start) * pixelsPerDay
      let laneIndex = laneEnds.findIndex((laneEnd) => left >= laneEnd + PILL_GAP)
      if (laneIndex === -1) {
        laneIndex = laneEnds.length
        laneEnds.push(left + PILL_WIDTH)
      } else {
        laneEnds[laneIndex] = left + PILL_WIDTH
      }
      lanes.push({ item, laneIndex, left })
    })

    return { packed: lanes, laneCount: Math.max(1, laneEnds.length) }
  }, [parsedItems, range.start, pixelsPerDay])

  useEffect(() => {
    const today = startOfDay(new Date())
    const container = scrollRef.current
    if (!container || isBefore(today, range.start) || today > axisEnd) return

    const left = 30 + differenceInCalendarDays(today, range.start) * pixelsPerDay
    container.scrollTo({ left: Math.max(0, left - container.clientWidth / 2), behavior: 'smooth' })
  }, [axisEnd, range.start, pixelsPerDay])

  function scrollToday() {
    const container = scrollRef.current
    if (!container) return
    const today = startOfDay(new Date())
    const left = 30 + differenceInCalendarDays(today, range.start) * pixelsPerDay
    container.scrollTo({ left: Math.max(0, left - container.clientWidth / 2), behavior: 'smooth' })
  }

  const monthWidth = 30 + Math.ceil(axisWidth / months.length)
  const today = startOfDay(new Date())
  const todayOffset = 30 + differenceInCalendarDays(today, range.start) * pixelsPerDay

  function eventFor(item) {
    return scopes.find((scope) => scope.id === item.scope_id)
  }

  return (
    <section className="general-timeline">
      <div className="general-timeline-toolbar">
        <div className="zoom-controls" aria-label="Timeline zoom controls">
          <button type="button" onClick={() => setPixelsPerDay((value) => Math.max(2, value - 2))} disabled={pixelsPerDay === 2}>−</button>
          <span>{pixelsPerDay}px/day</span>
          <button type="button" onClick={() => setPixelsPerDay((value) => Math.min(20, value + 2))} disabled={pixelsPerDay === 20}>+</button>
        </div>
        <button type="button" className="today-button" onClick={scrollToday}>Today</button>
      </div>

      {parsedItems.length === 0 ? (
        <div className="timeline-empty">No dates match the current filters.</div>
      ) : (
        <div className="general-timeline-scroll" ref={scrollRef}>
          <div className="general-timeline-grid" style={{ width: `${axisWidth + 60}px`, height: `${94 + packedItems.laneCount * 48}px` }}>
            <div className="general-month-header">
              {months.map((month, index) => {
                const monthStart = differenceInCalendarDays(month, range.start) * pixelsPerDay + 30
                const monthEnd = differenceInCalendarDays(endOfMonth(month), range.start) * pixelsPerDay + 30
                return (
                  <div
                    key={month.toISOString()}
                    className={`general-month ${index % 2 ? 'alternate' : ''}`}
                    style={{ left: `${monthStart}px`, width: `${Math.max(40, monthEnd - monthStart)}px` }}
                  >
                    {format(month, 'MMM yyyy')}
                  </div>
                )
              })}
              {today >= range.start && today <= axisEnd && (
                <div className="general-today-line" style={{ left: `${todayOffset}px` }}><span>Today</span></div>
              )}
            </div>

            <div className="general-timeline-body">
              {months.map((month, index) => {
                const left = 30 + differenceInCalendarDays(month, range.start) * pixelsPerDay
                return <div key={`grid-${month.toISOString()}`} className={`general-gridline ${index % 2 ? 'alternate' : ''}`} style={{ left: `${left}px`, width: `${differenceInCalendarDays(endOfMonth(month), month) * pixelsPerDay}px` }} />
              })}

              {today >= range.start && today <= axisEnd && (
                <div className="general-today-line body" style={{ left: `${todayOffset}px` }} />
              )}

              {packedItems.packed.map(({ item, laneIndex, left }) => {
                const event = eventFor(item)
                const past = isBefore(item.parsedDate, today)
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`general-date-pill ${past ? 'past' : ''}`}
                    style={{
                      left: `${left}px`,
                      top: `${laneIndex * 48}px`,
                      width: `${PILL_WIDTH}px`,
                      '--pill-event': event?.color || item.color || '#26776d',
                    }}
                    title={`${item.title} — ${format(item.parsedDate, 'dd MMM yyyy')} — ${item.date_type}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <span className="pill-icon">{getIcon(item.date_type)}</span>
                    <span className="pill-copy">
                      <strong>{item.title}</strong>
                      <small>{format(item.parsedDate, 'dd MMM')}</small>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <aside className="general-detail-card" aria-label="Timeline date details">
          <button type="button" className="detail-close" onClick={() => setSelectedItem(null)}>×</button>
          <p className="detail-kicker">{selectedItem.date_type}</p>
          <h2>{selectedItem.title}</h2>
          <dl>
            <div><dt>Event</dt><dd>{eventFor(selectedItem)?.label || 'Department'}</dd></div>
            <div><dt>Date</dt><dd>{format(parseIsoDate(selectedItem.date_value) || selectedItem.parsedDate, 'dd MMMM yyyy')}</dd></div>
            {selectedItem.time_value && <div><dt>Time</dt><dd>{selectedItem.time_value}</dd></div>}
            {selectedItem.location && <div><dt>Location</dt><dd>{selectedItem.location}</dd></div>}
            {selectedItem.notes && <div><dt>Notes</dt><dd>{selectedItem.notes}</dd></div>}
            {selectedItem.mcs && <div><dt>MCs</dt><dd>{selectedItem.mcs}</dd></div>}
          </dl>
          <div className="availability-actions">
            {[['available', 'Available'], ['maybe', 'Maybe'], ['unavailable', 'Unavailable']].map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={availability[selectedItem.id] === key ? 'active' : ''}
                onClick={() => setAvailability((current) => ({ ...current, [selectedItem.id]: key }))}
              >
                {label}
              </button>
            ))}
          </div>
          {onQuickAdd && <button type="button" className="detail-add-button" onClick={() => onQuickAdd({ scopeType: 'event', scopeId: selectedItem.scope_id })}>+ Add date</button>}
        </aside>
      )}
    </section>
  )
}

export default GeneralTimeline
