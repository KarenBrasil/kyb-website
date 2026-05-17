import { NavLink } from 'react-router-dom';
import { useStore } from '../../stores/useStore';
import {
  LayoutDashboard, Link2, Lightbulb, Zap, FileText,
  Brain, CheckSquare, Video, BookOpen, Archive, Wrench, LogOut
} from 'lucide-react';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/references',icon: Link2,           label: 'Referências' },
  { to: '/ideas',     icon: Lightbulb,       label: 'Banco de Ideias' },
  { to: '/assets',    icon: Zap,             label: 'Ativos Criativos' },
  { to: '/scripts',   icon: FileText,        label: 'Roteiros' },
  { to: '/prompts',   icon: Brain,           label: 'Prompts' },
  { to: '/checklists',icon: CheckSquare,     label: 'Checklists' },
  { to: '/ugc',       icon: Video,           label: 'UGC & Portfólio' },
  { to: '/library',   icon: BookOpen,        label: 'Biblioteca de Ideias' },
  { to: '/acervo',    icon: Archive,         label: 'Acervo' },
  { to: '/tools',     icon: Wrench,          label: 'Ferramentas' },
];

export default function Sidebar() {
  const { user, logout } = useStore();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-surface border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="font-display font-black text-2xl tracking-tight">
          Ky<span className="text-accent">B</span>
        </div>
        <div className="text-[10px] text-text3 uppercase tracking-[1.5px] mt-0.5">Content CRM</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2 ${
                isActive
                  ? 'border-accent bg-surface2 text-text font-semibold'
                  : 'border-transparent text-text2 hover:text-text hover:bg-surface2/50'
              }`
            }>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-border">
        {user && <div className="text-xs text-text3 mb-2 truncate">{user.name}</div>}
        <button onClick={logout}
          className="flex items-center gap-2 text-xs text-text3 hover:text-red-400 transition-colors">
          <LogOut size={13} /> Sair
        </button>
      </div>
    </aside>
  );
}
