import { Video, Play, Download, Trash2, Search, Clock } from 'lucide-react'

const RECORDINGS = [
  { id: 'REC-001', title: 'Royal Council Session', date: '2026-05-27', duration: '1h 23m', size: '458 MB', participants: 4 },
  { id: 'REC-002', title: 'Banking Partnership Review', date: '2026-05-26', duration: '45m', size: '212 MB', participants: 2 },
  { id: 'REC-003', title: 'Technology Infrastructure Planning', date: '2026-05-24', duration: '1h 05m', size: '324 MB', participants: 2 },
  { id: 'REC-004', title: 'Embassy of Côte d\'Ivoire', date: '2026-05-22', duration: '52m', size: '244 MB', participants: 3 },
  { id: 'REC-005', title: 'Legal Strategy Session', date: '2026-05-20', duration: '38m', size: '178 MB', participants: 2 },
]

export default function Recordings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Recordings</h1>
          <p className="text-gray-500 text-sm mt-1">{RECORDINGS.length} recorded meetings</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input className="input-field pl-10" placeholder="Search recordings..." />
      </div>

      <div className="space-y-3">
        {RECORDINGS.map(rec => (
          <div key={rec.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{rec.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>{rec.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.duration}</span>
                  <span>{rec.size}</span>
                  <span>{rec.participants} participants</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1"><Play className="w-3 h-3" /> Play</button>
              <button className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
              <button className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
