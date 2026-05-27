import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Users, Lock, Bot, Copy, Check, Calendar } from 'lucide-react'

export default function NewMeeting() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    type: 'instant',
    participants: '',
    avatar: false,
    recording: true,
    background: 'throne-room',
    encrypted: true,
  })
  const [meetingId, setMeetingId] = useState(null)
  const [copied, setCopied] = useState(false)

  function createMeeting() {
    const id = `KC-${Date.now().toString(36).toUpperCase()}`
    setMeetingId(id)
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://connection.kissikingdom.com/room/${meetingId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (meetingId) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Meeting Created</h2>
        <div className="card text-left space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Meeting ID</span><span className="text-gold-400 font-mono">{meetingId}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Title</span><span className="text-white">{form.title || 'Untitled Meeting'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Encrypted</span><span className="text-emerald-400">✓ Yes</span></div>
          <div className="flex justify-between"><span className="text-gray-500">AI Avatar</span><span className={form.avatar ? 'text-purple-400' : 'text-gray-500'}>{form.avatar ? '✓ Enabled' : 'Disabled'}</span></div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={copyLink} className="btn-outline flex items-center gap-2 text-sm">
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
          <button onClick={() => navigate(`/room/${meetingId}`)} className="btn-gold flex items-center gap-2 text-sm">
            <Video className="w-4 h-4" /> Join Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Meeting</h1>
        <p className="text-gray-500 text-sm mt-1">Create an instant or scheduled meeting</p>
      </div>

      <div className="card space-y-6">
        {/* Meeting type */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setForm(f => ({...f, type: 'instant'}))} className={`p-4 rounded-lg text-center ${form.type === 'instant' ? 'bg-gold-500/20 border border-gold-500/40' : 'bg-royal-800/40 border border-transparent'}`}>
            <Video className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <span className="text-sm text-white font-medium">Instant Meeting</span>
            <p className="text-xs text-gray-500 mt-0.5">Start right now</p>
          </button>
          <button onClick={() => setForm(f => ({...f, type: 'scheduled'}))} className={`p-4 rounded-lg text-center ${form.type === 'scheduled' ? 'bg-gold-500/20 border border-gold-500/40' : 'bg-royal-800/40 border border-transparent'}`}>
            <Calendar className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <span className="text-sm text-white font-medium">Schedule</span>
            <p className="text-xs text-gray-500 mt-0.5">Set date & time</p>
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Meeting Title</label>
          <input className="input-field" placeholder="e.g., Royal Council Session" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Invite Participants (emails, comma separated)</label>
          <input className="input-field" placeholder="ambassador@country.gov, broker@company.com" value={form.participants} onChange={e => setForm(f => ({...f, participants: e.target.value}))} />
        </div>

        {/* Virtual background */}
        <div>
          <label className="text-sm text-gray-300 block mb-2">Virtual Background</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'throne-room', label: '👑 Throne Room' },
              { id: 'garden', label: '🌿 Palace Garden' },
              { id: 'office', label: '🏛️ Royal Office' },
              { id: 'none', label: '❌ None' },
            ].map(bg => (
              <button key={bg.id} onClick={() => setForm(f => ({...f, background: bg.id}))} className={`p-3 rounded-lg text-center text-xs ${form.background === bg.id ? 'bg-gold-500/20 border border-gold-500/40' : 'bg-royal-800/40 border border-transparent'}`}>
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 pt-4 border-t border-gold-500/10">
          <ToggleOption icon={Lock} label="End-to-End Encryption" desc="CRYSTALS-Kyber post-quantum encryption" value={form.encrypted} onChange={v => setForm(f => ({...f, encrypted: v}))} />
          <ToggleOption icon={Video} label="Auto-Record" desc="Record the meeting for playback" value={form.recording} onChange={v => setForm(f => ({...f, recording: v}))} />
          <ToggleOption icon={Bot} label="AI Avatar Mode" desc="Use DeepFaceLive face swap with lip sync (requires GPU)" value={form.avatar} onChange={v => setForm(f => ({...f, avatar: v}))} />
        </div>

        <button onClick={createMeeting} className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-3">
          <Video className="w-5 h-5" /> {form.type === 'instant' ? 'Create & Join' : 'Schedule Meeting'}
        </button>
      </div>
    </div>
  )
}

function ToggleOption({ icon: Icon, label, desc, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-gold-400 mt-0.5" />
        <div>
          <p className="text-sm text-white">{label}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-gold-500' : 'bg-royal-600'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}
