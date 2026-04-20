import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Clients from './pages/Clients';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import { canAccessRoute } from './config/rbac';
import type { UserRole } from './types/auth';

function ProtectedRoutes() {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Layout />;
}

function RoleProtectedRoute({ role, path, element }: { role: UserRole | null | undefined; path: '/dashboard' | '/candidates' | '/clients' | '/pipeline' | '/tasks' | '/reports'; element: JSX.Element }) {
  if (!canAccessRoute(role, path)) {
    return <Navigate to="/dashboard" replace />;
  }
  return element;
}

function PublicRoute() {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<RoleProtectedRoute role={user?.role} path="/dashboard" element={<Dashboard />} />} />
        <Route path="/candidates" element={<RoleProtectedRoute role={user?.role} path="/candidates" element={<Candidates />} />} />
        <Route path="/clients" element={<RoleProtectedRoute role={user?.role} path="/clients" element={<Clients />} />} />
        <Route path="/pipeline" element={<RoleProtectedRoute role={user?.role} path="/pipeline" element={<Pipeline />} />} />
        <Route path="/tasks" element={<RoleProtectedRoute role={user?.role} path="/tasks" element={<Tasks />} />} />
        <Route path="/reports" element={<RoleProtectedRoute role={user?.role} path="/reports" element={<Reports />} />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
