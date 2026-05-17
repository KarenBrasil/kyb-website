import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './stores/useStore';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import {
  Dashboard, References, Ideas, Assets, Scripts, Prompts,
  Checklists, UGC, Library, Acervo, Tools
} from './pages/Modules';

function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[220px] flex-1 p-8 min-h-screen bg-bg">
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/references" element={<References />} />
          <Route path="/ideas"      element={<Ideas />} />
          <Route path="/assets"     element={<Assets />} />
          <Route path="/scripts"    element={<Scripts />} />
          <Route path="/prompts"    element={<Prompts />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/ugc"        element={<UGC />} />
          <Route path="/library"    element={<Library />} />
          <Route path="/acervo"     element={<Acervo />} />
          <Route path="/tools"      element={<Tools />} />
        </Routes>
      </main>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { token } = useStore();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute><Layout /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
