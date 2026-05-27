import { Shield, Users, Video, Clock, Ban, Check, AlertTriangle } from 'lucide-react'

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage access, monitor usage, and configure Kingdom Connection</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <p className="text-xs text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-gray-500">Active Now</p>
          <p className="text-2xl font-bold text-emerald-400">2</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-gray-500">Meetings This Month</p>
          <p className="text-2xl font-bold text-white">23</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-gray-500">Storage Used</p>
          <p className="text-2xl font-bold text-gold-400">2.1 GB</p>
        </div>
      </div>

      {/* Access control */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">Access Control</h3>
        <div className="space-y-2">
          {[
            { name: 'Heads of State', count: 3, access: 'full', icon: '👑' },
            { name: 'Banking Partners', count: 2, access: 'meetings-only', icon: '🏦' },
            { name: 'Legal Counsel', count: 2, access: 'full', icon: '⚖️' },
            { name: 'Kingdom Officials', count: 3, access: 'full', icon: '🏛️' },
            { name: 'Authorized Guests', count: 2, access: 'invite-only', icon: '🎫' },
          ].map(group => (
            <div key={group.name} className="flex items-center justify-between p-3 rounded-lg bg-royal-800/30">
              <div className="flex items-center gap-3">
                <span>{group.icon}</span>
                <div>
                  <span className="text-sm text-white">{group.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({group.count} users)</span>
                </div>
              </div>
              <span className="badge-gold text-[10px] capitalize">{group.access}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform info */}
      <div className="card">
        <h3 className="font-semibold text-white mb-3">Platform</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500 block">Backend</span><span className="text-white">LiveKit / Jitsi (Open-source)</span></div>
          <div><span className="text-gray-500 block">Encryption</span><span className="text-white">CRYSTALS-Kyber (Post-quantum)</span></div>
          <div><span className="text-gray-500 block">AI Pipeline</span><span className="text-white">DeepFaceLive + MuseTalk + Gaze</span></div>
          <div><span className="text-gray-500 block">GPU Provider</span><span className="text-white">RunPod / Vast.ai (on-demand)</span></div>
          <div><span className="text-gray-500 block">Domain</span><span className="text-gold-400">connection.kissikingdom.com</span></div>
          <div><span className="text-gray-500 block">Connected To</span><span className="text-white">kissikingdom.com (Contact page)</span></div>
        </div>
      </div>
    </div>
  )
}
