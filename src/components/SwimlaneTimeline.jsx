import { useMemo, useState } from 'react'
import './SwimlaneTimeline.css'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function startOfDay(value) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000)
}

function getIcon(type) {
  const normalized = String(type || '').toLowerCase()
  if (normalized.includes('exec')) return '⚑'
  if (normalized.includes('submission') || normalized.includes('document')) return '▤'
  if (normalized.includes('dry')) return '◉'
  if (normalized.includes('recce')) return '⌕'
  if (normalized.includes('meeting')) return '◎'
  return '•'
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function SwimlaneTimeline({ lanes, rangeMode, onRangeModeChange, onQuickAdd }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const today = startOfDay(new Date())

  const range = useMemo(() => {
    const datedItems = lanes.flatMap((lane) => lane.items)
    const dates = datedItems.map((item) => startOfDay(`${item.date_value}T00:00:00`)).filter((date) => !Number.isNaN(date.getTime()))

    if (!dates.length) {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = addMonths(start, 6)
      return { start, end }
    }

    const earliest = new Date(Math.min(...dates.map((date) => date.getTime())))
    const latest = new Date(Math.max(...dates.map((date) => date.getTime())))

    if (rangeMode === 'Month') {
      return {
        start: new Date(earliest.getFullYear(), earliest.getMonth(), 1),
        end: new Date(earliest.getFullYear(), earliest.getMonth() + 1, 1),
      }
    }

    if (rangeMode === 'Semester') {
      const semesterMonth = earliest.getMonth() < 6 ? 0 : 6
      return {
        start: new Date(earliest.getFullYear(), semesterMonth, 1),
        end: new Date(earliest.getFullYear(), semesterMonth + 6, 1),
      }
    }

    return {
      start: new Date(earliest.getFullYear(), 0, 1),
      end: new Date(latest.getFullYear() + 1, 0, 1),
    }
  }, [lanes, rangeMode, today])

  const totalDays = Math.max(1, daysBetween(range.start, range.end))
  const axisWidth = rangeMode === 'Month' ? 900 : rangeMode === 'Semester' ? 1200 : 1500
  const months = []

  for (let month = new Date(range.start); month < range.end; month = addMonths(month, 1)) {
    months.push(new Date(month))
  }

  function positionFor(dateValue) {
    const date = startOfDay(`${dateValue}T00:00:00`)
    return Math.max(0, Math.min(100, (daysBetween(range.start, date) / totalDays) * 100))
  }

  function clusterItems(items) {
    const sorted = [...items].sort((a, b) => startOfDay(`${a.date_value}T00:00:00`) - startOfDay(`${b.date_value}T00:00:00`))
    const clusters = []

    sorted.forEach((item) => {
      const date = startOfDay(`${item.date_value}T00:00:00`)
      const current = clusters[clusters.length - 1]
      if (current && daysBetween(current.date, date) <= 3) {
        current.items.push(item)
      } else {
        clusters.push({ date, items: [item] })
      }
    })

    return clusters
  }

  const todayPosition = positionFor(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)

  return (
    <section className="swimlane-section">
      <div className="swimlane-toolbar">
        <div>
          <p className="axis-label">Timeline range</p>
          <strong>{range.start.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })} – {addMonths(range.end, -1).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })}</strong>
        </div>
        <div className="range-toggle" aria-label="Timeline range">
          {['Month', 'Semester', 'Year'].map((mode) => (
            <button key={mode} type="button" className={rangeMode === mode ? 'active' : ''} onClick={() => onRangeModeChange(mode)}>{mode}</button>
          ))}
        </div>
      </div>

      <div className="swimlane-scroll">
        <div className="swimlane-grid" style={{ '--axis-width': `${axisWidth}px` }}>
          <div className="axis-header">
            <div className="lane-label-spacer">Event</div>
            <div className="month-axis">
              {months.map((month, index) => (
                <div
                  key={month.toISOString()}
                  className={`month-span ${index % 2 ? 'alternate' : ''}`}
                  style={{ flex: month.getMonth() === 11 ? 1 : 1 }}
                >
                  {MONTH_NAMES[month.getMonth()]}
                </div>
              ))}
              {todayPosition >= 0 && todayPosition <= 100 && (
                <div className="today-line" style={{ left: `${todayPosition}%` }}>
                  <span>Today</span>
                </div>
              )}
            </div>
          </div>

          {lanes.map((lane) => {
            const clusters = clusterItems(lane.items)
            const sortedItems = lane.items.sort((a, b) => startOfDay(`${a.date_value}T00:00:00`) - startOfDay(`${b.date_value}T00:00:00`))
            const first = sortedItems[0]
            const last = sortedItems[sortedItems.length - 1]
            const spanLeft = first ? positionFor(first.date_value) : 0
            const spanRight = last ? positionFor(last.date_value) : 0

            return (
              <div className="swimlane-row" key={lane.id}>
                <div className="lane-label">
                  <span className="lane-color" style={{ background: lane.color }} />
                  <strong>{lane.title}</strong>
                </div>

                <div className="lane-track">
                  {lane.items.length > 1 && (
                    <div
                      className="lane-span"
                      style={{ left: `${spanLeft}%`, width: `${Math.max(0, spanRight - spanLeft)}%`, background: lane.color }}
                    />
                  )}

                  {clusters.map((cluster) => {
                    const left = positionFor(`${cluster.date.getFullYear()}-${String(cluster.date.getMonth() + 1).padStart(2, '0')}-${String(cluster.date.getDate()).padStart(2, '0')}`)
                    const isPast = cluster.date < today

                    if (cluster.items.length > 1) {
                      return (
                        <button
                          type="button"
                          key={cluster.date.toISOString()}
                          className={`cluster-dot ${isPast ? 'past' : ''}`}
                          style={{ left: `${left}%`, background: lane.color }}
                          title={`${cluster.items.length} dates`}
                          onClick={() => setSelectedDate({ lane, items: cluster.items })}
                        >
                          +{cluster.items.length}
                        </button>
                      )
                    }

                    const item = cluster.items[0]
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`date-dot ${isPast ? 'past' : ''}`}
                        style={{ left: `${left}%`, '--dot-color': lane.color }}
                        title={`${item.title} · ${item.date_type}`}
                        onClick={() => setSelectedDate({ lane, items: [item] })}
                      >
                        <span>{getIcon(item.date_type)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <aside className="timeline-detail-card" aria-label="Timeline date details">
          <button type="button" className="detail-close" onClick={() => setSelectedDate(null)}>×</button>
          <p className="detail-lane" style={{ color: selectedDate.lane.color }}>{selectedDate.lane.title}</p>
          {selectedDate.items.map((item) => (
            <div className="detail-item" key={item.id}>
              <strong>{item.title}</strong>
              <span>{new Date(`${item.date_value}T00:00:00`).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })} · {item.date_type}</span>
              {item.location && <p>{item.location}</p>}
              {item.notes && <p>{item.notes}</p>}
              {onQuickAdd && <button type="button" onClick={() => onQuickAdd({ scopeType: 'event', scopeId: selectedDate.lane.id })}>+ Add date</button>}
            </div>
          ))}
        </aside>
      )}
    </section>
  )
}

export default SwimlaneTimeline
