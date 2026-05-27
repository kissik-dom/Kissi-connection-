import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import NewMeeting from './pages/NewMeeting'
import MeetingRoom from './pages/MeetingRoom'
import Recordings from './pages/Recordings'
import Calendar from './pages/Calendar'
import Contacts from './pages/Contacts'
import AIAvatar from './pages/AIAvatar'
import Settings from './pages/Settings'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<NewMeeting />} />
        <Route path="/room/:id" element={<MeetingRoom />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/avatar" element={<AIAvatar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
