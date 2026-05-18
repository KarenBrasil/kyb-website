import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../stores/useStore';
import api from '../lib/api';
import {
  Btn, Card, Modal, Input, Textarea, Select, Badge, CopyBtn,
  Stars, EmptyState, Spinner, FilterBar, ProgressBar, Field
} from '../components/ui';
import { Plus, ExternalLink, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PIPELINE   = ['Ideia','Aprovado','Roteiro','Gravação','Publicado'];
const S_COLORS   = { Ideia:'#5a5a70',Aprovado:'#60b4ff',Roteiro:'#8b5cf6',Gravação:'#ffd060',Publicado:'#00e5a0' };
const A_LABELS   = { hook:'Gancho',cta:'CTA',phrase:'Frase',title:'Título',question:'Pergunta' };
const A_COLORS   = { hook:'#f135a0',cta:'#c8f135',phrase:'#8b5cf6',title:'#60b4ff',question:'#ffd060' };
const UGC_ORDER  = ['Ideia','A gravar','Gravado','Publicado'];
const UGC_COLS   = { Ideia:'#5a5a70','A gravar':'#ffd060',Gravado:'#60b4ff',Publicado:'#00e5a0' };
const CAT_COLS   = { Estratégia:'#60b4ff','BI / Power BI':'#60b4ff','IA / ChatGPT':'#8b5cf6',UGC:'#f135a0',Roteiro:'#c8f135',Produção:'#ffd060' };
const STRUCTURES = ['HIDC','Problema-Solução','Lista','Tutorial','Storytelling','UGC','Carrossel'];
const FORMATS    = ['Screencast Dinâmico','Face to Camera','Cinematográfico / Bastidores','Carrossel','Reels Rápido','Tutorial Passo a Passo'];
const SUBNICHES  = ['BI / Power BI','IA / ChatGPT','UGC','Tech Tools','Roteiro & Estratégia','Bastidores & Setup','Python & Dados'];
const HOOK_NAMES = ['Segredo Revelado','Transformação (Se eu fosse...)','Prova Social / Técnica','Corte de Tempo','Lista de Valor','Medo de Ficar para Trás'];

function PageHeader({ title, sub, action }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-1">{title}</h2>
        {sub && <p className="text-text2 text-sm">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function Dashboard() {
  const { dashboard, fetchDashboard } = useStore();
  useEffect(() => { fetchDashboard(); }, []);

  if (!dashboard) return <Spinner />;
  const { stats, pipeline, topSubNiches, alerts } = dashboard;

  return (
    <div className="fade-in">
      <PageHeader title="Dashboard" sub="Visão geral da sua produção de conteúdo" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Publicados',      value: stats.published,       color: 'var(--green)' },
          { label: 'Gravando',        value: stats.inProduction,    color: 'var(--yellow)' },
          { label: 'Ideias paradas',  value: stats.staleIdeas,      color: 'var(--red)' },
          { label: 'Ativos criativos',value: stats.totalAssets,     color: 'var(--accent2)' },
          { label: 'Referências',     value: stats.totalReferences, color: 'var(--blue)' },
        ].map(s => (
          <Card key={s.label} className="text-center">
            <div className="text-xs text-text3 uppercase tracking-wider mb-2">{s.label}</div>
            <div className="font-display font-black text-3xl" style={{ color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Pipeline */}
        <Card>
          <h3 className="font-display text-base font-bold mb-4">Pipeline de Produção</h3>
          {pipeline.map(({ status, count }) => (
            <div key={status} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text2">{status}</span>
                <span className="font-semibold" style={{ color: S_COLORS[status] }}>{count}</span>
              </div>
              <div className="bg-surface3 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: stats.totalIdeas ? `${count/stats.totalIdeas*100}%` : '0%', background: S_COLORS[status] }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Sub-nichos */}
        <Card>
          <h3 className="font-display text-base font-bold mb-4">Sub-nichos Mais Ativos</h3>
          {topSubNiches.map(({ name, count }) => (
            <div key={name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="text-sm">{name}</span>
              <span className="kyb-chip text-xs">{count} conteúdos</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <h3 className="font-display text-base font-bold mb-4">⚠️ Alertas</h3>
        <div className="flex flex-col gap-3">
          {alerts.staleIdeas > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm">
              🔴 <strong>{alerts.staleIdeas} ideia(s)</strong> paradas sem movimentação no pipeline
            </div>
          )}
          {alerts.readyToRecord > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-sm">
              🟡 <strong>{alerts.readyToRecord} vídeo(s)</strong> prontos para gravar — não deixa esfriar!
            </div>
          )}
          {alerts.pendingChecklists > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 text-sm">
              🔵 <strong>{alerts.pendingChecklists} checklist(s)</strong> com itens pendentes de conclusão
            </div>
          )}
          {!alerts.staleIdeas && !alerts.readyToRecord && !alerts.pendingChecklists && (
            <div className="text-green-400 text-sm">✅ Tudo em dia! Seu pipeline está saudável.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── REFERENCES ───────────────────────────────────────────────────────────────
export function References() {
  const { references, fetchReferences, addReference, deleteReference, subNiches, fetchSubNiches } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({ url:'',customTitle:'',summary:'',adaptation:'',score:3,subNicheId:'',originalTitle:'',thumbnail:'' });

  useEffect(() => { fetchReferences(); fetchSubNiches(); }, []);

  const niches = ['Todos', ...subNiches.map(s => s.name)];
  const filtered = references.filter(r =>
    (filter === 'Todos' || r.subNiche?.name === filter) &&
    r.customTitle?.toLowerCase().includes(search.toLowerCase())
  );

  async function fetchMeta() {
    if (!form.url) return;
    setFetching(true);
    try {
      const { data } = await api.get('/metadata', { params: { url: form.url } });
      setForm(f => ({ ...f, originalTitle: data.title, thumbnail: data.image, customTitle: f.customTitle || data.title }));
    } catch {}
    setFetching(false);
  }

  async function save() {
    setLoading(true);
    try {
      const sn = subNiches.find(s => s.name === form.subNicheId);
      await addReference({ ...form, subNicheId: sn?.id || null });
      setModal(false);
      setForm({ url:'',customTitle:'',summary:'',adaptation:'',score:3,subNicheId:'',originalTitle:'',thumbnail:'' });
    } finally { setLoading(false); }
  }

  return (
    <div className="fade-in">
      <PageHeader title="Referências" sub="Links que inspiram seu conteúdo, adaptados para a sua linguagem"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Nova referência</Btn>} />

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="kyb-input pl-9" placeholder="Buscar por título..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <FilterBar options={niches} active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔗" title="Nenhuma referência ainda" sub="Capture links que te inspiram e adapte ao seu posicionamento"
          action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Primeira referência</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ref => (
            <Card key={ref.id} hover onClick={() => setDetail(ref)}>
              {ref.thumbnail && <img src={ref.thumbnail} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />}
              <div className="flex justify-between items-start mb-2">
                {ref.subNiche && <Badge label={ref.subNiche.name} color="var(--accent2)" />}
                <Stars value={ref.score} />
              </div>
              <h3 className="font-display text-sm font-semibold mb-2 leading-snug">{ref.customTitle}</h3>
              <p className="text-xs text-text2 mb-3 line-clamp-2 leading-relaxed">{ref.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text3">{new Date(ref.createdAt).toLocaleDateString('pt-BR')}</span>
                <a href={ref.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  className="text-xs text-accent hover:underline flex items-center gap-1">
                  Ver <ExternalLink size={10} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Nova Referência">
        <div className="flex gap-2 mb-1">
          <input className="kyb-input flex-1" placeholder="https://..." value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <Btn onClick={fetchMeta} variant="ghost" disabled={fetching}>
            {fetching ? '...' : 'Buscar'}
          </Btn>
        </div>
        {form.thumbnail && <img src={form.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg mt-2 mb-3" />}
        <Input label="Título personalizado" placeholder="Como você quer encontrar isso depois"
          value={form.customTitle} onChange={e => setForm(f => ({ ...f, customTitle: e.target.value }))} />
        <Select label="Sub-nicho" value={form.subNicheId}
          onChange={e => setForm(f => ({ ...f, subNicheId: e.target.value }))}
          options={[{ value:'', label:'Selecionar...' }, ...subNiches.map(s => ({ value: s.name, label: s.name }))]} />
        <Textarea label="Resumo (com suas palavras)" placeholder="O que esse conteúdo ensina?"
          value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
        <Textarea label="✨ Adaptação editorial — Como eu usaria isso?"
          placeholder="Como isso se encaixa no meu posicionamento?" style={{ minHeight: 100 }}
          value={form.adaptation} onChange={e => setForm(f => ({ ...f, adaptation: e.target.value }))} />
        <Field label="Relevância"><Stars value={form.score} onChange={v => setForm(f => ({ ...f, score: v }))} /></Field>
        <Btn onClick={save} className="w-full justify-center mt-2" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar referência'}
        </Btn>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.customTitle}>
        {detail && (
          <div>
            {detail.thumbnail && <img src={detail.thumbnail} alt="" className="w-full h-36 object-cover rounded-lg mb-4" />}
            <div className="flex gap-3 items-center mb-4">
              {detail.subNiche && <Badge label={detail.subNiche.name} color="var(--accent2)" />}
              <Stars value={detail.score} />
              <span className="text-xs text-text3 ml-auto">{new Date(detail.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            {detail.summary && (
              <div className="mb-4">
                <div className="text-xs text-text3 uppercase tracking-wider mb-2">Resumo</div>
                <p className="text-sm text-text2 leading-relaxed">{detail.summary}</p>
              </div>
            )}
            {detail.adaptation && (
              <div className="bg-accent2/10 border border-accent2/30 rounded-xl p-4 mb-4">
                <div className="text-xs text-accent2 font-bold uppercase tracking-wider mb-2">✨ Adaptação Editorial</div>
                <p className="text-sm leading-relaxed">{detail.adaptation}</p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <a href={detail.url} target="_blank" rel="noreferrer"
                className="text-sm text-accent flex items-center gap-1.5 hover:underline">
                🔗 Ver conteúdo original <ExternalLink size={12} />
              </a>
              <Btn variant="danger" small onClick={async () => { await deleteReference(detail.id); setDetail(null); }}>
                <Trash2 size={12} /> Excluir
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── IDEAS KANBAN ─────────────────────────────────────────────────────────────
export function Ideas() {
  const { ideas, fetchIdeas, addIdea, moveIdea, deleteIdea, subNiches, fetchSubNiches } = useStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:'',format:'Screencast Dinâmico',subNicheId:'',status:'Ideia',context:'' });
  const [aiPanel, setAiPanel] = useState(false);
  const [aiIdea, setAiIdea] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSubniche, setAiSubniche] = useState('');

  useEffect(() => { fetchIdeas(); fetchSubNiches(); }, []);

  async function save() {
    const sn = subNiches.find(s => s.name === form.subNicheId);
    await addIdea({ ...form, subNicheId: sn?.id || null });
    setModal(false);
    setForm({ title:'',format:'Screencast Dinâmico',subNicheId:'',status:'Ideia',context:'' });
  }

  async function generateAiIdea() {
    setAiLoading(true);
    try {
      const params = aiSubniche ? `?subniche=${encodeURIComponent(aiSubniche)}` : '';
      const { data } = await api.get(`/intelligence/generate-idea${params}`);
      setAiIdea(data);
    } catch (e) { console.error(e); }
    setAiLoading(false);
  }

  async function saveAiIdea() {
    if (!aiIdea) return;
    const sn = subNiches.find(s => s.name === aiIdea.subniche);
    const context = `Fórmula: ${aiIdea.formula} | Gatilho: ${aiIdea.gatilho}\n\nH: ${aiIdea.estrutura.h}\n\nI: ${aiIdea.estrutura.i}\n\nD: ${aiIdea.estrutura.d}\n\nC: ${aiIdea.estrutura.c}`;
    await addIdea({ title: aiIdea.titulo, format: aiIdea.formato, subNicheId: sn?.id || null, status: 'Ideia', context });
    setAiPanel(false);
    setAiIdea(null);
  }


  return (
    <div className="fade-in">
      <PageHeader title="Banco de Ideias" sub="Pipeline visual de produção de conteúdo"
        action={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setAiPanel(p => !p)}>🧠 Gerar Ideia</Btn>
            <Btn onClick={() => setModal(true)}><Plus size={15}/>Nova ideia</Btn>
          </div>
        } />

      {/* Painel de Inteligência KyB */}
      {aiPanel && (
        <div className="mb-6 rounded-xl border border-accent/40 p-5" style={{background:'linear-gradient(135deg,rgba(248,55,160,0.05),rgba(139,92,246,0.05))'}}>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-display font-bold text-base">🧠 Gerador de Ideias KyB</span>
            <span className="text-xs text-text3 ml-2">Baseado nas suas fórmulas de gancho e posicionamento</span>
          </div>
          <div className="flex gap-3 mb-4 flex-wrap">
            <select className="kyb-input flex-1 min-w-40" value={aiSubniche} onChange={e => setAiSubniche(e.target.value)}>
              <option value="">Sub-nicho aleatório</option>
              {SUBNICHES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Btn onClick={generateAiIdea} disabled={aiLoading}>
              {aiLoading ? 'Gerando...' : '⚡ Gerar Ideia'}
            </Btn>
          </div>

          {aiIdea && (
            <div className="bg-surface2 rounded-xl p-4 border border-border">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="kyb-chip text-xs">{aiIdea.subniche}</span>
                <span className="kyb-chip text-xs">{aiIdea.formato}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:'#f135a022',color:'#f135a0'}}>{aiIdea.formula}</span>
              </div>
              <h3 className="font-display font-bold text-base leading-snug mb-1">{aiIdea.titulo}</h3>
              <p className="text-xs text-text3 mb-3">⚡ Gatilho: {aiIdea.gatilho}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {[{k:'h',label:'H — Hook'},{k:'i',label:'I — Introdução'},{k:'d',label:'D — Desenvolvimento'},{k:'c',label:'C — CTA'}].map(({k,label}) => (
                  <div key={k} className="bg-surface3 rounded-lg p-3">
                    <div className="text-xs font-bold text-accent mb-1">{label}</div>
                    <p className="text-xs text-text2 leading-relaxed">{aiIdea.estrutura[k]}</p>
                  </div>
                ))}
              </div>
              <div className="mb-3 p-3 bg-surface3 rounded-lg">
                <div className="text-xs font-bold text-text3 mb-2">✅ Checklist de Viralidade</div>
                {aiIdea.checklist_viralidade.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <span className="text-xs text-accent mt-0.5">•</span>
                    <p className="text-xs text-text2">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Btn onClick={saveAiIdea} className="flex-1 justify-center">✅ Salvar no Pipeline</Btn>
                <Btn variant="ghost" onClick={generateAiIdea} disabled={aiLoading}>🔄 Gerar outra</Btn>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE.map(status => {
          const cols = ideas.filter(i => i.status === status);
          return (
            <div key={status} className="min-w-[210px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: S_COLORS[status] }} />
                <span className="text-xs font-bold" style={{ color: S_COLORS[status] }}>{status}</span>
                <span className="ml-auto text-xs text-text3 bg-surface2 rounded-full px-2 py-0.5">{cols.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {cols.map(idea => {
                  const idx = PIPELINE.indexOf(status);
                  return (
                    <Card key={idea.id} className="p-3.5">
                      {idea.subNiche && <span className="kyb-chip text-[10px] mb-2 inline-block">{idea.subNiche.name}</span>}
                      <p className="text-sm font-semibold leading-snug mb-1.5">{idea.title}</p>
                      <p className="text-xs text-text3 mb-3">{idea.format}</p>
                      <div className="flex gap-1.5">
                        {idx > 0 && (
                          <button onClick={() => moveIdea(idea.id, PIPELINE[idx-1])}
                            className="flex-1 text-[11px] bg-surface3 border border-border text-text2 rounded-md py-1 hover:bg-surface2 transition-colors flex items-center justify-center gap-0.5">
                            <ChevronLeft size={10}/> Voltar
                          </button>
                        )}
                        {idx < PIPELINE.length-1 && (
                          <button onClick={() => moveIdea(idea.id, PIPELINE[idx+1])}
                            className="flex-1 text-[11px] rounded-md py-1 transition-colors flex items-center justify-center gap-0.5 font-semibold"
                            style={{ background: S_COLORS[PIPELINE[idx+1]]+'22', color: S_COLORS[PIPELINE[idx+1]], border:`1px solid ${S_COLORS[PIPELINE[idx+1]]}44` }}>
                            Avançar <ChevronRight size={10}/>
                          </button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nova Ideia">
        <Input label="Título" placeholder="Ex: 3 erros que todo criador comete no início"
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Select label="Formato" value={form.format}
          onChange={e => setForm(f => ({ ...f, format: e.target.value }))} options={FORMATS} />
        <Select label="Sub-nicho" value={form.subNicheId}
          onChange={e => setForm(f => ({ ...f, subNicheId: e.target.value }))}
          options={[{ value:'', label:'Selecionar...' }, ...subNiches.map(s => ({ value: s.name, label: s.name }))]} />
        <Textarea label="Contexto / ângulo" placeholder="De onde veio essa ideia? Qual o ângulo?"
          value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar ideia</Btn>
      </Modal>
    </div>
  );
}

// ─── ASSETS ───────────────────────────────────────────────────────────────────
export function Assets() {
  const { assets, fetchAssets, addAsset, deleteAsset } = useStore();
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type:'hook', content:'', subNiche:'Geral' });

  useEffect(() => { fetchAssets(); }, []);

  const types = ['Todos', ...Object.keys(A_LABELS)];
  const filtered = assets.filter(a => filter === 'Todos' || a.type === filter);

  async function save() {
    await addAsset(form);
    setModal(false);
    setForm({ type:'hook', content:'', subNiche:'Geral' });
  }

  return (
    <div className="fade-in">
      <PageHeader title="Ativos Criativos" sub="Ganchos, CTAs, frases, títulos e perguntas de engajamento"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Novo ativo</Btn>} />

      <div className="mb-5">
        <FilterBar options={types.map(t => t === 'Todos' ? 'Todos' : A_LABELS[t])}
          active={filter === 'Todos' ? 'Todos' : A_LABELS[filter]}
          onChange={v => setFilter(v === 'Todos' ? 'Todos' : Object.entries(A_LABELS).find(([,l]) => l === v)?.[0] || 'Todos')} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="⚡" title="Sem ativos ainda" sub="Cadastre ganchos, CTAs e frases para usar em qualquer roteiro"
          action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Primeiro ativo</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(a => (
            <Card key={a.id} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <Badge label={A_LABELS[a.type]} color={A_COLORS[a.type]} />
                <div className="flex gap-2">
                  <CopyBtn text={a.content} />
                  <button onClick={() => deleteAsset(a.id)} className="text-text3 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-2">{a.content}</p>
              <span className="text-xs text-text3">{a.subNiche?.name || a.subNiche}</span>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Ativo Criativo">
        <Select label="Tipo" value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          options={Object.entries(A_LABELS).map(([v,l]) => ({ value:v, label:l }))} />
        <Textarea label="Conteúdo" placeholder="Escreva o gancho, CTA ou frase..."
          value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        <Select label="Sub-nicho" value={form.subNiche}
          onChange={e => setForm(f => ({ ...f, subNiche: e.target.value }))} options={SUBNICHES} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar ativo</Btn>
      </Modal>
    </div>
  );
}

// ─── SCRIPTS ─────────────────────────────────────────────────────────────────
export function Scripts() {
  const { scripts, ideas, fetchScripts, fetchIdeas, addScript, updateScript } = useStore();
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title:'',structure:'Problema-Solução',duration:'60s',version:'v1',ideaId:'',content:'' });

  useEffect(() => { fetchScripts(); fetchIdeas(); }, []);
  useEffect(() => { if (scripts.length && !selected) setSelected(scripts[0]); }, [scripts]);

  async function save() {
    const s = await addScript({ ...form, ideaId: form.ideaId ? parseInt(form.ideaId) : null });
    setSelected(s);
    setModal(false);
  }

  async function saveEdit() {
    if (!selected) return;
    const s = await updateScript(selected.id, { content: selected.content, title: selected.title });
    setSelected(s);
    setEditing(false);
  }

  return (
    <div className="fade-in flex gap-5" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Sidebar list */}
      <div className="w-60 flex-shrink-0 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold">Roteiros</h2>
          <Btn small onClick={() => setModal(true)}><Plus size={13}/></Btn>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
          {scripts.map(s => (
            <Card key={s.id} hover onClick={() => { setSelected(s); setEditing(false); }}
              className={`p-3.5 cursor-pointer ${selected?.id === s.id ? '!border-accent2' : ''}`}>
              <div className="flex justify-between mb-1.5">
                <span className="kyb-chip text-[10px]">{s.structure}</span>
                <span className="text-xs text-accent2 font-bold">{s.version}</span>
              </div>
              <p className="text-xs font-semibold leading-snug">{s.title}</p>
              <p className="text-[11px] text-text3 mt-1">{s.duration}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-w-0 flex flex-col">
        {selected ? (
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-border flex-shrink-0">
              <div>
                {editing ? (
                  <input className="kyb-input font-display text-base font-bold mb-2"
                    value={selected.title} onChange={e => setSelected(s => ({ ...s, title: e.target.value }))} />
                ) : (
                  <h3 className="font-display text-lg font-bold mb-1">{selected.title}</h3>
                )}
                <div className="flex gap-2 flex-wrap">
                  <span className="kyb-chip">{selected.structure}</span>
                  <span className="kyb-chip">{selected.duration}</span>
                  <Badge label={selected.version} color="var(--accent2)" />
                </div>
              </div>
              <div className="flex gap-2">
                <CopyBtn text={selected.content} />
                {editing
                  ? <Btn small onClick={saveEdit}>Salvar</Btn>
                  : <Btn small variant="ghost" onClick={() => setEditing(true)}>Editar</Btn>
                }
              </div>
            </div>
            {editing ? (
              <textarea className="kyb-input flex-1 resize-none text-sm leading-relaxed font-mono"
                value={selected.content} onChange={e => setSelected(s => ({ ...s, content: e.target.value }))} />
            ) : (
              <pre className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed font-body text-text">
                {selected.content}
              </pre>
            )}
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <p className="text-text3">Selecione um roteiro</p>
          </Card>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Roteiro">
        <Input label="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <div className="flex gap-3">
          <div className="flex-1">
            <Select label="Estrutura" value={form.structure}
              onChange={e => setForm(f => ({ ...f, structure: e.target.value }))} options={STRUCTURES} />
          </div>
          <div className="w-24">
            <Input label="Duração" placeholder="60s" value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <div className="w-20">
            <Input label="Versão" placeholder="v1" value={form.version}
              onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
          </div>
        </div>
        <Select label="Ideia vinculada (opcional)" value={form.ideaId}
          onChange={e => setForm(f => ({ ...f, ideaId: e.target.value }))}
          options={[{ value:'', label:'Nenhuma' }, ...ideas.map(i => ({ value: i.id, label: i.title }))]} />
        <Textarea label="Conteúdo do roteiro" placeholder="Escreva o roteiro completo..."
          value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          style={{ minHeight: 180 }} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar roteiro</Btn>
      </Modal>
    </div>
  );
}

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
export function Prompts() {
  const { prompts, fetchPrompts, addPrompt } = useStore();
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:'', useCase:'', content:'' });

  useEffect(() => { fetchPrompts(); }, []);
  useEffect(() => { if (prompts.length && !selected) setSelected(prompts[0]); }, [prompts]);

  async function save() {
    const p = await addPrompt(form);
    setSelected(p);
    setModal(false);
    setForm({ title:'', useCase:'', content:'' });
  }

  return (
    <div className="fade-in flex gap-5" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="w-60 flex-shrink-0 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold">Prompts</h2>
          <Btn small onClick={() => setModal(true)}><Plus size={13}/></Btn>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
          {prompts.map(p => (
            <Card key={p.id} hover onClick={() => setSelected(p)}
              className={`p-3.5 cursor-pointer ${selected?.id === p.id ? '!border-accent2' : ''}`}>
              <p className="text-xs font-semibold mb-1">{p.title}</p>
              <p className="text-[11px] text-text3">{p.useCase}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-border flex-shrink-0">
              <div>
                <h3 className="font-display text-lg font-bold mb-1">{selected.title}</h3>
                <p className="text-xs text-text3">Uso: {selected.useCase}</p>
              </div>
              <CopyBtn text={selected.content} />
            </div>
            <pre className="flex-1 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed font-body">
              {selected.content}
            </pre>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <p className="text-text3">Selecione um prompt</p>
          </Card>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Prompt">
        <Input label="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Input label="Caso de uso" placeholder="Ex: Vídeo curto educativo"
          value={form.useCase} onChange={e => setForm(f => ({ ...f, useCase: e.target.value }))} />
        <Textarea label="Conteúdo do prompt" value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ minHeight: 160 }} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar prompt</Btn>
      </Modal>
    </div>
  );
}

// ─── CHECKLISTS ───────────────────────────────────────────────────────────────
export function Checklists() {
  const { checklists, fetchChecklists, addChecklist, toggleItem } = useStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', ideaTitle:'', items:[''] });

  useEffect(() => { fetchChecklists(); }, []);

  async function save() {
    await addChecklist({ name: form.name, ideaTitle: form.ideaTitle, items: form.items.filter(i => i.trim()) });
    setModal(false);
    setForm({ name:'', ideaTitle:'', items:[''] });
  }

  return (
    <div className="fade-in">
      <PageHeader title="Checklists" sub="Acompanhe cada etapa da produção de conteúdo"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Novo checklist</Btn>} />

      {checklists.length === 0 ? (
        <EmptyState icon="✅" title="Sem checklists ainda" sub="Crie checklists de pré-produção, gravação e publicação"
          action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Primeiro checklist</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklists.map(c => {
            const done = c.items.filter(i => i.done).length;
            return (
              <Card key={c.id}>
                <div className="mb-3">
                  <h3 className="font-display text-base font-bold mb-0.5">{c.name}</h3>
                  {c.ideaTitle && <p className="text-xs text-text3">{c.ideaTitle}</p>}
                </div>
                <div className="mb-4">
                  <ProgressBar done={done} total={c.items.length} />
                </div>
                <div className="flex flex-col gap-2.5">
                  {c.items.map(item => (
                    <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)}
                        className="mt-0.5 accent-accent w-4 h-4 cursor-pointer" />
                      <span className={`text-sm leading-snug transition-colors ${item.done ? 'text-text3 line-through' : 'text-text'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Checklist">
        <Input label="Nome do checklist" placeholder="Ex: Pré-produção, Gravação, Publicação"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Input label="Vídeo relacionado" placeholder="Nome da ideia ou vídeo"
          value={form.ideaTitle} onChange={e => setForm(f => ({ ...f, ideaTitle: e.target.value }))} />
        <Field label="Itens">
          <div className="flex flex-col gap-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input className="kyb-input flex-1" placeholder={`Item ${idx+1}...`} value={item}
                  onChange={e => setForm(f => ({ ...f, items: f.items.map((it, ii) => ii === idx ? e.target.value : it) }))} />
                {idx === form.items.length-1 && (
                  <button onClick={() => setForm(f => ({ ...f, items: [...f.items, ''] }))}
                    className="bg-surface3 border border-border text-accent rounded-lg px-3 font-bold hover:bg-surface2 transition-colors">+</button>
                )}
              </div>
            ))}
          </div>
        </Field>
        <Btn onClick={save} className="w-full justify-center mt-2">Criar checklist</Btn>
      </Modal>
    </div>
  );
}

// ─── UGC ─────────────────────────────────────────────────────────────────────
export function UGC() {
  const { ugc, fetchUgc, addUgc, moveUgc } = useStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:'', brand:'', type:'Portfólio', status:'Ideia', format:'60s vertical' });

  useEffect(() => { fetchUgc(); }, []);

  async function save() {
    await addUgc(form);
    setModal(false);
    setForm({ title:'', brand:'', type:'Portfólio', status:'Ideia', format:'60s vertical' });
  }

  return (
    <div className="fade-in">
      <PageHeader title="UGC & Portfólio" sub="Lista de vídeos UGC para portfólio e parcerias com marcas"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Novo vídeo UGC</Btn>} />

      {ugc.length === 0 ? (
        <EmptyState icon="🎬" title="Sem vídeos UGC ainda" sub="Registre vídeos de portfólio e parcerias com marcas"
          action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Primeiro vídeo</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ugc.map(u => {
            const idx = UGC_ORDER.indexOf(u.status);
            return (
              <Card key={u.id}>
                <div className="flex justify-between mb-3">
                  <Badge label={u.type} color={u.type === 'Portfólio' ? 'var(--accent2)' : 'var(--accent3)'} />
                  <Badge label={u.status} color={UGC_COLS[u.status]} />
                </div>
                <h3 className="font-display text-sm font-semibold mb-2 leading-snug">{u.title}</h3>
                <p className="text-xs text-text3 mb-1">🏷️ {u.brand}</p>
                <p className="text-xs text-text3 mb-4">📐 {u.format}</p>
                {idx < UGC_ORDER.length-1 && (
                  <Btn small variant="ghost" onClick={() => moveUgc(u.id, UGC_ORDER[idx+1])} className="w-full justify-center">
                    Avançar → {UGC_ORDER[idx+1]}
                  </Btn>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Vídeo UGC">
        <Input label="Título / descrição do vídeo" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Input label="Marca / empresa" value={form.brand}
          onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
        <Select label="Tipo" value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={['Portfólio','Parceria']} />
        <Select label="Formato" value={form.format}
          onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
          options={['30s vertical','45s vertical','60s vertical','90s vertical','Horizontal']} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar</Btn>
      </Modal>
    </div>
  );
}

// ─── LIBRARY ─────────────────────────────────────────────────────────────────
export function Library() {
  const { library, fetchLibrary, addLibrary } = useStore();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ title:'', category:'Dica', tags:'', content:'' });

  useEffect(() => { fetchLibrary(); }, []);

  function doSearch() { fetchLibrary({ search }); }

  async function save() {
    await addLibrary({ ...form, tags: form.tags });
    setModal(false);
    setForm({ title:'', category:'Dica', tags:'', content:'' });
  }

  return (
    <div className="fade-in">
      <PageHeader title="Biblioteca de Ideias" sub="Dicas, insights e conhecimento sobre seu nicho"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Novo insight</Btn>} />

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
          <input className="kyb-input pl-9" placeholder="Buscar na biblioteca..."
            value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && doSearch()} />
        </div>
        <Btn variant="ghost" onClick={doSearch}>Buscar</Btn>
      </div>

      {library.length === 0 ? (
        <EmptyState icon="📚" title="Biblioteca vazia" sub="Registre dicas, insights e conhecimento do seu nicho" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {library.map(l => (
            <Card key={l.id} hover onClick={() => setDetail(l)}>
              <div className="mb-3">
                <Badge label={l.category} color={CAT_COLS[l.category] || 'var(--accent2)'} />
              </div>
              <h3 className="font-display text-sm font-semibold mb-2 leading-snug">{l.title}</h3>
              <p className="text-xs text-text2 leading-relaxed line-clamp-3">{l.content}</p>
              {l.tags && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {l.tags.split(',').filter(Boolean).map(t => (
                    <span key={t} className="kyb-chip text-[10px]">#{t.trim()}</span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.title} wide>
        {detail && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge label={detail.category} color={CAT_COLS[detail.category] || 'var(--accent2)'} />
              {detail.tags?.split(',').filter(Boolean).map(t => (
                <span key={t} className="kyb-chip text-xs">#{t.trim()}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed">{detail.content}</p>
          </div>
        )}
      </Modal>

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Insight">
        <Input label="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <Select label="Categoria" value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          options={['Dica','Mindset','UGC','Produção','Marketing']} />
        <Input label="Tags (separadas por vírgula)" placeholder="algoritmo, estratégia, ugc"
          value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        <Textarea label="Conteúdo" value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))} style={{ minHeight: 120 }} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar insight</Btn>
      </Modal>
    </div>
  );
}

// ─── ACERVO ───────────────────────────────────────────────────────────────────
export function Acervo() {
  const { acervo, fetchAcervo, addAcervo } = useStore();
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', category:'Identidade Visual', url:'', description:'' });

  useEffect(() => { fetchAcervo(); }, []);

  const cats = ['Todos', ...new Set(acervo.map(a => a.category))];
  const filtered = acervo.filter(a => filter === 'Todos' || a.category === filter);
  const CAT_ICONS = { 'Identidade Visual':'🎨', 'Documentos':'📄', 'Mídia':'🎞️', 'Pessoal':'👤', 'Formatos de Vídeo':'🎬' };

  async function save() {
    await addAcervo(form);
    setModal(false);
    setForm({ name:'', category:'Identidade Visual', url:'', description:'' });
  }

  return (
    <div className="fade-in">
      <PageHeader title="Acervo" sub="Identidade visual, documentos, mídias e arquivos da KyB"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Novo arquivo</Btn>} />

      <div className="mb-5">
        <FilterBar options={cats} active={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(a => (
          <Card key={a.id} className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-surface3 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {CAT_ICONS[a.category] || '📁'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-semibold mb-1">{a.name}</h3>
              {a.description && <p className="text-xs text-text2 mb-2 leading-relaxed">{a.description}</p>}
              <div className="flex gap-3 items-center">
                <span className="kyb-chip text-[10px]">{a.category}</span>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer"
                    className="text-xs text-accent hover:underline flex items-center gap-1">
                    Abrir <ExternalLink size={10}/>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Novo Arquivo">
        <Input label="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Select label="Categoria" value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          options={['Identidade Visual','Documentos','Mídia','Pessoal','Formatos de Vídeo']} />
        <Input label="Link (Drive, Dropbox...)" placeholder="https://..."
          value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <Textarea label="Descrição" value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar</Btn>
      </Modal>
    </div>
  );
}

// ─── TOOLS ───────────────────────────────────────────────────────────────────
export function Tools() {
  const { tools, fetchTools, addTool } = useStore();
  const [filter, setFilter] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name:'', url:'', category:'Edição', icon:'🔧' });

  useEffect(() => { fetchTools(); }, []);

  const cats = ['Todos', ...new Set(tools.map(t => t.category))];
  const filtered = tools.filter(t => filter === 'Todos' || t.category === filter);

  async function save() {
    await addTool(form);
    setModal(false);
    setForm({ name:'', url:'', category:'Edição', icon:'🔧' });
  }

  return (
    <div className="fade-in">
      <PageHeader title="Ferramentas" sub="Acesso rápido a tudo que você usa no dia a dia"
        action={<Btn onClick={() => setModal(true)}><Plus size={15}/>Nova ferramenta</Btn>} />

      <div className="mb-5">
        <FilterBar options={cats} active={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(t => (
          <a key={t.id} href={t.url} target="_blank" rel="noreferrer" className="block no-underline">
            <Card hover className="text-center p-5 cursor-pointer">
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="font-display text-xs font-bold text-text mb-1">{t.name}</h3>
              <span className="text-[10px] text-text3">{t.category}</span>
            </Card>
          </a>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Nova Ferramenta">
        <div className="flex gap-3">
          <div className="w-20"><Input label="Emoji" value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} /></div>
          <div className="flex-1"><Input label="Nome" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        </div>
        <Input label="URL" placeholder="https://..." value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        <Select label="Categoria" value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          options={['Edição','Design','IA','Organização','YouTube','Agendamento','Música','Mídia']} />
        <Btn onClick={save} className="w-full justify-center mt-2">Salvar ferramenta</Btn>
      </Modal>
    </div>
  );
}
