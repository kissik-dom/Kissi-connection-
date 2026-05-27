import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, VideoOff, Mic, MicOff, Monitor, MessageSquare, Phone, Users, Bot, Settings, Maximize, Hand } from 'lucide-react'

export default function MeetingRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [videoOn, setVideoOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [screenShare, setScreenShare] = useState(false)
  const [avatarMode, setAvatarMode] = useState(false)

  return (
    <div className="fixed inset-0 bg-kingdom-dark flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-royal-900/80 border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-white font-medium">Meeting: {id}</span>
          <span className="text-xs text-gray-500">• 00:12:34</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-green text-[10px]">Encrypted</span>
          {avatarMode && <span className="badge-gold text-[10px]">AI Avatar Active</span>}
          <span className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> 2</span>
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 flex relative">
        {/* Main video */}
        <div className="flex-1 flex items-center justify-center bg-kingdom-dark p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl bg-royal-800/50 border border-gold-500/10 overflow-hidden flex items-center justify-center">
            {videoOn ? (
              <div className="absolute inset-0 bg-gradient-to-b from-royal-800/20 to-royal-900/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-4xl">👑</span>
                  </div>
                  <p className="text-white font-medium">Your Camera Feed</p>
                  <p className="text-xs text-gray-500 mt-1">{avatarMode ? 'AI Avatar Active — DeepFaceLive processing' : 'Camera active'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Camera Off</p>
              </div>
            )}

            {/* Self view (PIP) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-lg bg-royal-800 border border-gold-500/20 flex items-center justify-center">
              <div className="text-center">
                <span className="text-lg">🙂</span>
                <p className="text-[10px] text-gray-500">You</p>
              </div>
            </div>

            {avatarMode && (
              <div className="absolute top-4 left-4 p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <div className="flex items-center gap-2 text-xs text-purple-400">
                  <Bot className="w-3 h-3" />
                  <span>Avatar: Face swap + Lip sync + Gaze ✓</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-80 bg-royal-900/95 border-l border-gold-500/10 flex flex-col">
            <div className="p-3 border-b border-gold-500/10 text-sm font-medium text-white">Meeting Chat</div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
              <div className="text-gray-400 text-xs text-center">Chat messages appear here</div>
            </div>
            <div className="p-3 border-t border-gold-500/10">
              <input className="input-field text-sm" placeholder="Type a message..." />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 py-4 bg-royal-900/80 border-t border-gold-500/10">
        <ControlButton icon={micOn ? Mic : MicOff} active={micOn} onClick={() => setMicOn(!micOn)} label={micOn ? 'Mute' : 'Unmute'} />
        <ControlButton icon={videoOn ? Video : VideoOff} active={videoOn} onClick={() => setVideoOn(!videoOn)} label={videoOn ? 'Stop Video' : 'Start Video'} />
        <ControlButton icon={Monitor} active={screenShare} onClick={() => setScreenShare(!screenShare)} label="Share Screen" />
        <ControlButton icon={MessageSquare} active={chatOpen} onClick={() => setChatOpen(!chatOpen)} label="Chat" />
        <ControlButton icon={Bot} active={avatarMode} onClick={() => setAvatarMode(!avatarMode)} label="AI Avatar" special />
        <ControlButton icon={Hand} label="Raise Hand" />
        <ControlButton icon={Maximize} label="Fullscreen" />

        <div className="w-px h-8 bg-gold-500/20 mx-2" />

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 text-white font-semibold transition-colors"
        >
          <Phone className="w-4 h-4 rotate-[135deg]" /> End
        </button>
      </div>
    </div>
  )
}

function ControlButton({ icon: Icon, active, onClick, label, special }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
        special ? (active ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10') :
        active ? 'text-white hover:bg-royal-700' : 'text-gray-500 hover:text-white hover:bg-royal-700'
      }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px]">{label}</span>
    </button>
  )
}
