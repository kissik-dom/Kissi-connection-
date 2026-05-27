import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Clock, Users, Play, Calendar, Bot } from 'lucide-react'

const RECENT_MEETINGS = [
  { id: 'KC-001', title: 'Royal Council Session', participants: 4, duration: '1h 23m', date: '2026-05-27', recorded: true },
  { id: 'KC-002', title: 'Banking Partnership Review', participants: 2, duration: '45m', date: '2026-05-26', recorded: true },
  { id: 'KC-003', title: 'Property Acquisition Call', participants: 3, duration: '32m', date: '2026-05-25', recorded: false },
  { id: 'KC-004', title: 'Technology Infrastructure Planning', participants: 2, duration: '1h 05m', date: '2026-05-24', recorded: true },
]

const SCHEDULED = [
  { id: 'SC-001', title: 'Diplomatic Meeting — Embassy of Ghana', time: '2026-05-28 10:00', participants: 3, avatar: true },
  { id: 'SC-002', title: 'Legal Counsel Review', time: '2026-05-29 14:00', participants: 2, avatar: false },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Your Kingdom Connection overview</p>
        </div>
        <button onClick={() => navigate('/new')} className="btn-gold flex items-center gap-2 text-sm">
          <Video className="w-4 h-4" /> New Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Total Meetings</span>
            <Video className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">47</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Total Hours</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">38.5</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Participants</span>
            <Users className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase">Recordings</span>
            <Play className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">23</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Upcoming */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold-400" /> Upcoming Meetings
          </h3>
          <div className="space-y-3">
            {SCHEDULED.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg bg-royal-800/30 hover:bg-royal-800/50 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{meeting.title}</h4>
                    {meeting.avatar && <Bot className="w-3 h-3 text-purple-400" title="AI Avatar enabled" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(meeting.time).toLocaleString()} • {meeting.participants} participants</p>
                </div>
                <button className="btn-gold text-xs py-1.5 px-3">Join</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" /> Recent Meetings
          </h3>
          <div className="space-y-3">
            {RECENT_MEETINGS.map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg bg-royal-800/30">
                <div>
                  <h4 className="text-sm font-medium text-white">{meeting.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{meeting.date} • {meeting.duration} • {meeting.participants} participants</p>
                </div>
                <div className="flex gap-2">
                  {meeting.recorded && (
                    <button className="btn-outline text-[10px] py-1 px-2">
                      <Play className="w-3 h-3 inline mr-0.5" /> Watch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
