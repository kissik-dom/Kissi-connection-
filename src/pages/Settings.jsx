import { useState } from 'react'
import { Settings as SettingsIcon, Save, Check, Video, Shield, Bot, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your meeting preferences</p>
        </div>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-semibold ${saved ? 'bg-emerald-500 text-white' : 'btn-gold'}`}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
        </button>
      </div>

      <div className="card space-y-6">
        <h3 className="font-semibold text-white flex items-center gap-2"><Video className="w-4 h-4 text-gold-400" /> Video & Audio</h3>
        <Toggle label="Auto-enable camera on join" desc="Start meetings with your camera on" value={true} />
        <Toggle label="Auto-enable microphone on join" desc="Start meetings with your mic on" value={true} />
        <Toggle label="HD Video (720p)" desc="Use higher quality video (requires more bandwidth)" value={true} />
        <Toggle label="Noise suppression" desc="AI-powered background noise removal" value={true} />
      </div>

      <div className="card space-y-6">
        <h3 className="font-semibold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-gold-400" /> Security</h3>
        <Toggle label="End-to-End Encryption (default)" desc="All meetings use E2EE by default" value={true} />
        <Toggle label="Waiting room" desc="Require approval before participants join" value={true} />
        <Toggle label="Require invitation" desc="Only invited contacts can join meetings" value={true} />
      </div>

      <div className="card space-y-6">
        <h3 className="font-semibold text-white flex items-center gap-2"><Bot className="w-4 h-4 text-gold-400" /> AI Avatar</h3>
        <Toggle label="Enable AI Avatar option" desc="Show AI Avatar toggle in meeting controls" value={true} />
        <Toggle label="Auto-activate for diplomatic calls" desc="Automatically enable AI Avatar for head-of-state meetings" value={false} />
        <Toggle label="GPU auto-provisioning" desc="Automatically spin up GPU when avatar is activated" value={false} />
      </div>

      <div className="card space-y-6">
        <h3 className="font-semibold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-gold-400" /> Notifications</h3>
        <Toggle label="Meeting reminders" desc="Get notified 15 minutes before scheduled meetings" value={true} />
        <Toggle label="Recording ready alerts" desc="Notify when a recording has been processed" value={true} />
      </div>
    </div>
  )
}

function Toggle({ label, desc, value }) {
  const [on, setOn] = useState(value)
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-gold-500' : 'bg-royal-600'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}
