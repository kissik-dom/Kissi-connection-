import { useNavigate } from 'react-router-dom'
import { Video, Shield, Bot, Users, Monitor, Calendar, ArrowRight, Lock } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-kingdom-dark">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center relative">
          <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-gold-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Kingdom <span className="text-gold-400">Connection</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-2">
            Sovereign Video Conferencing for The Royal Kissi Kingdom
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Encrypted • AI-Enhanced • For Heads of State & Authorized Guests
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => navigate('/new')} className="btn-gold flex items-center gap-2 justify-center text-lg px-8 py-3">
              <Video className="w-5 h-5" /> Start Meeting
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-outline flex items-center gap-2 justify-center text-lg px-8 py-3">
              <Monitor className="w-5 h-5" /> Dashboard
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Shield, title: 'End-to-End Encrypted', desc: 'CRYSTALS-Kyber post-quantum encryption for all video, audio, and chat. Your conversations stay sovereign.' },
              { icon: Bot, title: 'AI Avatar Mode', desc: 'Phase 2: DeepFaceLive face swap, MuseTalk lip sync, and gaze correction. Indistinguishable from you.' },
              { icon: Lock, title: 'Authorized Access Only', desc: 'Invite-based access for heads of state, banking partners, and authorized guests. No public meetings.' },
            ].map(f => (
              <div key={f.title} className="card group hover:border-gold-500/30 transition-colors">
                <f.icon className="w-8 h-8 text-gold-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '📹', title: '1-on-1 & Group Calls', desc: 'Up to 50 participants with HD video and audio' },
            { icon: '🖥️', title: 'Screen Sharing', desc: 'Share your screen, specific windows, or tabs' },
            { icon: '💬', title: 'In-Call Chat', desc: 'Real-time text chat with file sharing during calls' },
            { icon: '🎙️', title: 'Call Recording', desc: 'Record meetings for archival and review' },
            { icon: '🎨', title: 'Virtual Backgrounds', desc: 'Kingdom-themed backgrounds and custom uploads' },
            { icon: '📅', title: 'Calendar Integration', desc: 'Schedule and manage meetings with reminders' },
            { icon: '🤖', title: 'AI Avatar (Phase 2)', desc: 'Face swap + lip sync + gaze correction via GPU' },
            { icon: '👁️', title: 'Gaze Correction', desc: 'AI makes it look like you\'re maintaining eye contact' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4 p-4 rounded-lg bg-royal-800/20 border border-gold-500/5">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-gold-500/10 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} The Royal Kissi Kingdom. All rights reserved. Powered by LiveKit/Jitsi.
      </footer>
    </div>
  )
}
