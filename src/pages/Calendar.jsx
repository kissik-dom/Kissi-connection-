import { Calendar as CalendarIcon, Plus, Clock, Users, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EVENTS = [
  { id: 1, title: 'Diplomatic Meeting — Embassy of Ghana', date: '2026-05-28', time: '10:00 AM', duration: '1 hour', participants: 3, status: 'confirmed' },
  { id: 2, title: 'Legal Counsel Review', date: '2026-05-29', time: '2:00 PM', duration: '45 min', participants: 2, status: 'confirmed' },
  { id: 3, title: 'Property Investment Board', date: '2026-05-30', time: '11:00 AM', duration: '1.5 hours', participants: 5, status: 'pending' },
  { id: 4, title: 'Weekly Royal Council', date: '2026-06-02', time: '9:00 AM', duration: '2 hours', participants: 4, status: 'recurring' },
]

export default function Calendar() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meeting Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">Scheduled meetings and events</p>
        </div>
        <button onClick={() => navigate('/new')} className="btn-gold flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Schedule Meeting</button>
      </div>

      {/* Simple week view */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Week of May 26, 2026</h3>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs rounded bg-gold-500/20 text-gold-400">Week</button>
            <button className="px-3 py-1 text-xs rounded text-gray-500 hover:text-white">Month</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-2 text-gray-500 font-medium">{day}</div>
          ))}
          {[26, 27, 28, 29, 30, 31, 1].map((d, i) => {
            const hasEvent = EVENTS.some(e => parseInt(e.date.split('-')[2]) === d)
            const isToday = d === 27
            return (
              <div key={d} className={`py-3 rounded-lg ${isToday ? 'bg-gold-500/20 text-gold-400' : hasEvent ? 'bg-royal-700/50 text-white' : 'text-gray-500'}`}>
                {d}
                {hasEvent && <div className="w-1 h-1 rounded-full bg-gold-400 mx-auto mt-1" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming events list */}
      <div className="space-y-3">
        {EVENTS.map(event => (
          <div key={event.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className="text-2xl font-bold text-white">{event.date.split('-')[2]}</p>
              </div>
              <div className="w-px h-10 bg-gold-500/20" />
              <div>
                <h3 className="font-semibold text-white text-sm">{event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time} ({event.duration})</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.participants}</span>
                  <span className={`badge text-[10px] ${event.status === 'confirmed' ? 'badge-green' : event.status === 'recurring' ? 'badge-gold' : 'badge-gold'}`}>{event.status}</span>
                </div>
              </div>
            </div>
            <button className="btn-outline text-xs flex items-center gap-1"><Video className="w-3 h-3" /> Join</button>
          </div>
        ))}
      </div>
    </div>
  )
}
