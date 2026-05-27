import { Users, Plus, Search, Video, Mail, Shield, Star } from 'lucide-react'

const CONTACTS = [
  { id: 1, name: 'Ambassador K. Mensah', role: 'Embassy of Ghana', email: 'k.mensah@ghana.gov', status: 'authorized', tier: 'head-of-state', meetings: 12 },
  { id: 2, name: 'Dr. A. Koroma', role: 'Kingdom Legal Counsel', email: 'a.koroma@kissikingdom.com', status: 'authorized', tier: 'official', meetings: 28 },
  { id: 3, name: 'M. Dupont', role: 'Geneva Private Bank', email: 'm.dupont@gpbank.ch', status: 'authorized', tier: 'banking', meetings: 6 },
  { id: 4, name: 'J. Williams', role: 'Sotheby\'s International Realty', email: 'j.williams@sir.com', status: 'pending', tier: 'guest', meetings: 0 },
  { id: 5, name: 'Prof. Y. Touré', role: 'Cultural Advisory Board', email: 'y.toure@uniabj.edu', status: 'authorized', tier: 'official', meetings: 3 },
]

const TIER_COLORS = {
  'head-of-state': 'bg-gold-500/20 text-gold-400',
  'official': 'bg-purple-500/20 text-purple-400',
  'banking': 'bg-emerald-500/20 text-emerald-400',
  'guest': 'bg-blue-500/20 text-blue-400',
}

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">Authorized meeting participants</p>
        </div>
        <button className="btn-gold flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Invite Contact</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input className="input-field pl-10" placeholder="Search contacts..." />
      </div>

      <div className="space-y-3">
        {CONTACTS.map(contact => (
          <div key={contact.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-lg font-bold text-gold-400">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">{contact.name}</h3>
                  {contact.tier === 'head-of-state' && <Star className="w-3 h-3 text-gold-400" />}
                </div>
                <p className="text-xs text-gray-500">{contact.role}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${TIER_COLORS[contact.tier]}`}>{contact.tier.replace('-', ' ')}</span>
                  <span className="text-[10px] text-gray-500">{contact.meetings} meetings</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1"><Video className="w-3 h-3" /> Call</button>
              <button className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gold-500/5 border-gold-500/20 text-center text-sm text-gray-400">
        <Shield className="w-5 h-5 text-gold-400 mx-auto mb-2" />
        Kingdom Connection is invite-only. All contacts must be authorized before they can join meetings.
      </div>
    </div>
  )
}
