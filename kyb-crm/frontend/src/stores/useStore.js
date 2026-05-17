import { create } from 'zustand';
import api from '../lib/api';

export const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('kyb_token'),

  // AUTH
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('kyb_token', data.token);
    set({ token: data.token, user: data.user });
  },
  logout: () => {
    localStorage.removeItem('kyb_token');
    set({ token: null, user: null });
  },

  // DASHBOARD
  dashboard: null,
  fetchDashboard: async () => {
    const { data } = await api.get('/dashboard');
    set({ dashboard: data });
  },

  // REFERENCES
  references: [],
  fetchReferences: async (params = {}) => {
    const { data } = await api.get('/references', { params });
    set({ references: data });
  },
  addReference: async (ref) => {
    const { data } = await api.post('/references', ref);
    set(s => ({ references: [data, ...s.references] }));
    get().fetchDashboard();
    return data;
  },
  deleteReference: async (id) => {
    await api.delete(`/references/${id}`);
    set(s => ({ references: s.references.filter(r => r.id !== id) }));
  },

  // SUBNICHES
  subNiches: [],
  fetchSubNiches: async () => {
    const { data } = await api.get('/subniches');
    set({ subNiches: data });
  },

  // IDEAS
  ideas: [],
  fetchIdeas: async () => {
    const { data } = await api.get('/ideas');
    set({ ideas: data });
  },
  addIdea: async (idea) => {
    const { data } = await api.post('/ideas', idea);
    set(s => ({ ideas: [data, ...s.ideas] }));
    get().fetchDashboard();
    return data;
  },
  moveIdea: async (id, status) => {
    const { data } = await api.patch(`/ideas/${id}/status`, { status });
    set(s => ({ ideas: s.ideas.map(i => i.id === id ? { ...i, status: data.status } : i) }));
    get().fetchDashboard();
  },
  deleteIdea: async (id) => {
    await api.delete(`/ideas/${id}`);
    set(s => ({ ideas: s.ideas.filter(i => i.id !== id) }));
    get().fetchDashboard();
  },

  // ASSETS
  assets: [],
  fetchAssets: async (params = {}) => {
    const { data } = await api.get('/assets', { params });
    set({ assets: data });
  },
  addAsset: async (asset) => {
    const { data } = await api.post('/assets', asset);
    set(s => ({ assets: [data, ...s.assets] }));
    get().fetchDashboard();
    return data;
  },
  deleteAsset: async (id) => {
    await api.delete(`/assets/${id}`);
    set(s => ({ assets: s.assets.filter(a => a.id !== id) }));
  },

  // SCRIPTS
  scripts: [],
  fetchScripts: async () => {
    const { data } = await api.get('/scripts');
    set({ scripts: data });
  },
  addScript: async (script) => {
    const { data } = await api.post('/scripts', script);
    set(s => ({ scripts: [data, ...s.scripts] }));
    return data;
  },
  updateScript: async (id, updates) => {
    const { data } = await api.put(`/scripts/${id}`, updates);
    set(s => ({ scripts: s.scripts.map(sc => sc.id === id ? data : sc) }));
    return data;
  },

  // PROMPTS
  prompts: [],
  fetchPrompts: async () => {
    const { data } = await api.get('/prompts');
    set({ prompts: data });
  },
  addPrompt: async (prompt) => {
    const { data } = await api.post('/prompts', prompt);
    set(s => ({ prompts: [data, ...s.prompts] }));
    return data;
  },

  // CHECKLISTS
  checklists: [],
  fetchChecklists: async () => {
    const { data } = await api.get('/checklists');
    set({ checklists: data });
  },
  addChecklist: async (cl) => {
    const { data } = await api.post('/checklists', cl);
    set(s => ({ checklists: [data, ...s.checklists] }));
    return data;
  },
  toggleItem: async (itemId) => {
    const { data } = await api.patch(`/checklists/items/${itemId}/toggle`);
    set(s => ({
      checklists: s.checklists.map(c => ({
        ...c,
        items: c.items.map(i => i.id === itemId ? data : i),
      })),
    }));
    get().fetchDashboard();
  },

  // UGC
  ugc: [],
  fetchUgc: async () => {
    const { data } = await api.get('/ugc');
    set({ ugc: data });
  },
  addUgc: async (ugc) => {
    const { data } = await api.post('/ugc', ugc);
    set(s => ({ ugc: [data, ...s.ugc] }));
    return data;
  },
  moveUgc: async (id, status) => {
    const { data } = await api.patch(`/ugc/${id}/status`, { status });
    set(s => ({ ugc: s.ugc.map(u => u.id === id ? data : u) }));
  },

  // LIBRARY
  library: [],
  fetchLibrary: async (params = {}) => {
    const { data } = await api.get('/library', { params });
    set({ library: data });
  },
  addLibrary: async (item) => {
    const { data } = await api.post('/library', item);
    set(s => ({ library: [data, ...s.library] }));
    return data;
  },

  // ACERVO
  acervo: [],
  fetchAcervo: async (params = {}) => {
    const { data } = await api.get('/acervo', { params });
    set({ acervo: data });
  },
  addAcervo: async (item) => {
    const { data } = await api.post('/acervo', item);
    set(s => ({ acervo: [data, ...s.acervo] }));
    return data;
  },

  // TOOLS
  tools: [],
  fetchTools: async (params = {}) => {
    const { data } = await api.get('/tools', { params });
    set({ tools: data });
  },
  addTool: async (tool) => {
    const { data } = await api.post('/tools', tool);
    set(s => ({ tools: [data, ...s.tools] }));
    return data;
  },
}));
