import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./components/PublicLayout";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  AdminPage,
  CalendarPage,
  DashboardPage,
  DiplomaticPage,
  JoinMeetingPage,
  LandingPage,
  LoginPage,
  MeetingPage,
  RoomsPage,
  SettingsPage,
  SignupPage,
} from "./pages";
import CentillionAI from "@/components/CentillionAI";


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
          </Route>

          {/* Join meeting — public, no auth required */}
          <Route path="/join" element={<JoinMeetingPage />} />

          {/* Meeting page — standalone layout (Zoom-like fullscreen) */}
          <Route path="/meeting/:slug" element={<MeetingPage />} />

          {/* Protected app routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/diplomatic" element={<DiplomaticPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
      <CentillionAI appName="Kissi Connection" accentColor="#FF6B6B" systemContext="You are Kissi Connection AI. Help with social connections, messaging, networking, and community building within the Kissi Kingdom." />
  );
}

export default App;
