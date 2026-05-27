import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Video, FilePlus, Calendar, Users, Bot, Settings, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/new', label: 'New Meeting', icon: FilePlus },
  { to: '/recordings', label: 'Recordings', icon: Video },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/avatar', label: 'AI Avatar', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/admin', label: 'Admin', icon: Shield },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-royal-900/95 border-r border-gold-500/10 transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gold-500/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">Kingdom Connection</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sovereign Conferencing</p>
            </div>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-500/10">
          <button onClick={() => navigate('/new')} className="btn-gold w-full flex items-center justify-center gap-2 text-sm">
            <Video className="w-4 h-4" /> Start Meeting
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 bg-kingdom-dark/80 backdrop-blur border-b border-gold-500/10 px-6 py-3 flex items-center justify-between">
          <button className="lg:hidden p-2 text-gray-400" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xs text-gray-500">connection.kissikingdom.com</span>
          <span className="badge-green text-[10px]">Online</span>
        </header>
        <div className="p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
