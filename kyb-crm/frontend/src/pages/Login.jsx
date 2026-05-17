import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'karen@kyb.com', password: 'kyb2025' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-5xl mb-2">
            Ky<span className="text-accent">B</span>
          </h1>
          <p className="text-text3 text-sm">Content Intelligence CRM</p>
        </div>

        <div className="kyb-card">
          <form onSubmit={handle} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text3 font-semibold uppercase tracking-wider mb-1.5">Email</label>
              <input className="kyb-input" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-text3 font-semibold uppercase tracking-wider mb-1.5">Senha</label>
              <input className="kyb-input" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="kyb-btn-primary justify-center w-full mt-2">
              {loading ? 'Entrando...' : 'Entrar no KyB CRM'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-surface2 rounded-lg border border-border">
            <p className="text-xs text-text3">
              <strong className="text-text2">Demo:</strong> karen@kyb.com / kyb2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
