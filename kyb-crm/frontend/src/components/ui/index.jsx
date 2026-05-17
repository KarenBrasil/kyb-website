import { useState } from 'react';
import { X, Copy, Check, Star } from 'lucide-react';

export function Btn({ children, onClick, variant = 'primary', small, className = '', type = 'button', disabled }) {
  const base = 'inline-flex items-center gap-1.5 font-semibold cursor-pointer transition-all duration-150 rounded-lg font-body';
  const size = small ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';
  const variants = {
    primary:   'bg-accent text-bg border-0 hover:opacity-90',
    secondary: 'bg-transparent text-text2 border border-border hover:bg-surface2',
    ghost:     'bg-surface2 text-text border border-border hover:bg-surface3',
    danger:    'bg-transparent text-red-400 border border-red-500/40 hover:bg-red-500/10',
    purple:    'bg-accent2 text-white border-0 hover:opacity-90',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${size} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div onClick={onClick}
      className={`kyb-card ${hover ? 'cursor-pointer hover:border-accent2/50' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div className={`modal-box ${wide ? 'max-w-3xl' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-lg">{title}</h3>
          <button onClick={onClose} className="text-text3 hover:text-text transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-xs text-text3 font-semibold uppercase tracking-wider mb-1.5">{label}</label>}
      {children}
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <Field label={label}>
      <input className="kyb-input" {...props} />
    </Field>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <Field label={label}>
      <textarea className="kyb-input" style={{ minHeight: 80, resize: 'vertical' }} {...props} />
    </Field>
  );
}

export function Select({ label, options, ...props }) {
  return (
    <Field label={label}>
      <select className="kyb-input" {...props}>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </Field>
  );
}

export function Badge({ label, color = '#8b5cf6' }) {
  return (
    <span className="kyb-badge" style={{ background: color + '22', color }}>
      {label}
    </span>
  );
}

export function CopyBtn({ text, onCopy }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle}
      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${copied ? 'bg-accent text-bg' : 'bg-surface3 text-text2 border border-border hover:text-text'}`}>
      {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
    </button>
  );
}

export function Stars({ value = 3, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={18} onClick={() => onChange?.(n)}
          className={`${onChange ? 'cursor-pointer' : ''} transition-colors`}
          fill={n <= value ? '#ffd060' : 'none'}
          stroke={n <= value ? '#ffd060' : '#5a5a70'} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display text-lg mb-2 text-text2">{title}</h3>
      {sub && <p className="text-text3 text-sm mb-6 max-w-xs">{sub}</p>}
      {action}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-accent2 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function FilterBar({ options, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${active === o ? 'bg-accent text-bg border-transparent' : 'bg-surface2 text-text2 border-border hover:text-text'}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ done, total, color = 'var(--accent)' }) {
  const pct = total ? Math.round(done / total * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-text3 mb-1.5">
        <span>{done}/{total} concluídos</span>
        <span style={{ color: pct === 100 ? 'var(--green)' : color }}>{pct}%</span>
      </div>
      <div className="bg-surface3 rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : color }} />
      </div>
    </div>
  );
}
