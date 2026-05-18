// ─────────────────────────────────────────────────────────────────────────────
// KyB INTELLIGENCE ENGINE
// Motor de geração de conteúdo baseado na estratégia da Karen
// Alimentado pelas suas diretrizes, fórmulas e posicionamento
// ─────────────────────────────────────────────────────────────────────────────

const router = require('express').Router();

// ── BIBLIOTECA DE CONHECIMENTO DA KAREN ──────────────────────────────────────

const SUBNICHES = [
  'BI / Power BI',
  'IA / ChatGPT',
  'UGC',
  'Tech Tools',
  'Roteiro & Estratégia',
  'Bastidores & Setup',
  'Python & Dados',
];

const FORMATOS = [
  'Screencast Dinâmico',
  'Face to Camera',
  'Cinematográfico / Bastidores',
  'Carrossel',
  'Reels Rápido',
  'Tutorial Passo a Passo',
];

// Fórmulas de Gancho (Hook) — baseadas nas diretrizes estratégicas da Karen
const HOOK_FORMULAS = [
  {
    id: 'segredo_revelado',
    nome: 'Segredo Revelado',
    formula: 'O [TIPO] que [AUTORIDADE] não quer que você descubra.',
    exemplos: [
      'O site que as agências de marketing não querem que você descubra.',
      'A ferramenta de BI que os analistas sênior guardam a sete chaves.',
      'O prompt de IA que consultores cobram R$500 para te dar.',
    ],
    gatilho: 'Curiosidade + Medo de ficar para trás',
  },
  {
    id: 'transformacao',
    nome: 'Transformação (Se eu fosse...)',
    formula: 'Se eu fosse [PROFISSÃO], é exatamente isso que eu faria para [RESULTADO] usando [FERRAMENTA/IA].',
    exemplos: [
      'Se eu fosse nutricionista, é exatamente isso que eu faria para lotar a agenda usando IA.',
      'Se eu fosse gestor de tráfego, usaria essas 3 fórmulas de Power BI para mostrar resultado ao cliente.',
      'Se eu fosse criador de conteúdo iniciante, começaria por essa ferramenta gratuita antes de qualquer outra coisa.',
    ],
    gatilho: 'Identificação + Aspiração',
  },
  {
    id: 'prova_social',
    nome: 'Prova Social / Técnica',
    formula: 'Como eu [AÇÃO CONCRETA] em [TEMPO] usando [FERRAMENTA].',
    exemplos: [
      'Como eu construí esse dashboard em 5 minutos usando Power BI.',
      'Como eu automatizei minha produção de roteiros com ChatGPT em menos de 1 hora.',
      'Como eu analisei 3 meses de dados em 10 minutos com Python.',
    ],
    gatilho: 'Prova de resultado + Confiança',
  },
  {
    id: 'corte_tempo',
    nome: 'O Corte de Tempo',
    formula: 'Essa [FERRAMENTA/IA] vai cortar o tempo do seu [TAREFA] pela metade.',
    exemplos: [
      'Essa IA escondida vai cortar o tempo do seu trabalho pela metade.',
      'Esse plugin do Power BI vai te salvar 4 horas toda semana.',
      'Esse prompt de ChatGPT elimina 80% do tempo que você gasta criando roteiros.',
    ],
    gatilho: 'Alívio + Ganho de tempo',
  },
  {
    id: 'lista_numerada',
    nome: 'A Lista de Valor',
    formula: '[NÚMERO] [FERRAMENTAS/SITES/PROMPTS] que [PROFISSIONAL] usa para [RESULTADO].',
    exemplos: [
      '5 sites gratuitos para criar apresentações como designer profissional.',
      '3 prompts de IA que substituem um analista de dados júnior.',
      '7 ferramentas que todo criador de UGC deveria conhecer.',
    ],
    gatilho: 'Curiosidade + Alta salvabilidade',
  },
  {
    id: 'medo_ficar_atras',
    nome: 'Medo de Ficar para Trás',
    formula: 'Se você não souber [TECNOLOGIA/FERRAMENTA] em [ANO/PRAZO], vai perder [OPORTUNIDADE].',
    exemplos: [
      'Quem ainda não sabe usar IA em 2025 vai perder espaço no mercado.',
      'Essa habilidade de Power BI vai separar os analistas que crescem dos que ficam estagnados.',
      'Os criadores de conteúdo que dominam UGC estão faturando o dobro. E você?',
    ],
    gatilho: 'Medo de perder + Urgência',
  },
];

// Dores do Público
const DORES = [
  'falta de tempo para criar conteúdo',
  'bloqueio criativo constante',
  'não sabe usar tecnologia a favor do negócio',
  'planilhas desorganizadas sem visualização',
  'design amador que não converte',
  'dificuldade para conseguir clientes',
  'não sabe como usar IA no dia a dia',
  'relatórios que ninguém entende',
  'produção de conteúdo sem estratégia (fazer por fazer)',
];

// Desejos do Público
const DESEJOS = [
  'processos automáticos com IA',
  'previsibilidade financeira com BI',
  'autoridade no próprio nicho',
  'vídeos com estética profissional (UGC)',
  'engajamento e vendas constantes',
  'dashboards que impressionam clientes',
  'roteiros prontos sem esforço criativo',
  'ferramenta que trabalha enquanto dorme',
];

// CTAs por formato
const CTAS = [
  'Salva esse vídeo para aplicar amanhã.',
  'Comenta [PALAVRA-CHAVE] que te mando o link da ferramenta.',
  'Me segue para mais estratégias de conteúdo com tecnologia.',
  'Manda esse vídeo para alguém que precisa otimizar o trabalho.',
  'Qual dessas ferramentas você já usa? Comenta aqui embaixo.',
  'Segue o perfil para o próximo da série — vai ser ainda melhor.',
];

// Estruturas de Conteúdo
const ESTRUTURAS_HIDC = {
  hook: 'Hook (0–3s): Promessa forte visual + verbal. Pare o scroll.',
  intro: 'Introdução/Contexto (3–8s): Por que isso importa. Valide sua autoridade rapidamente.',
  dev: 'Desenvolvimento/Ouro (8–45s): A dica prática, o tutorial, a estratégia. Rápido e denso.',
  cta: 'CTA (últimos 5s): Comando claro. Uma ação específica para o espectador.',
};

// Checklist de Viralidade da Karen
const CHECKLIST_VIRALIDADE = [
  'Qual o gatilho emocional deste vídeo? (Curiosidade, Alívio, Medo de ficar para trás, Inspiração)',
  'O Hook dos primeiros 3 segundos é visual ou verbalmente magnético?',
  'Esse conteúdo é altamente "Salvável"? (Listas, tutoriais, prompts que a pessoa vai querer consultar depois)',
  'Esse conteúdo é altamente "Compartilhável"? (Tem uma chamada para marcar alguém?)',
  'Existe uma quebra de padrão a cada 3–5 segundos? (Mudança de ângulo, zoom, texto, transição sonora)',
];

// ── FUNÇÕES AUXILIARES ────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gerarHook(subniche, formula) {
  // Retorna um gancho baseado na fórmula e sub-nicho
  const exemplo = pick(formula.exemplos);
  return exemplo;
}

function gerarIdeiaCompleta(subnicheEscolhido) {
  const subniche = subnicheEscolhido || pick(SUBNICHES);
  const formula = pick(HOOK_FORMULAS);
  const formato = pick(FORMATOS);
  const dor = pick(DORES);
  const desejo = pick(DESEJOS);
  const cta = pick(CTAS);

  const hook = gerarHook(subniche, formula);

  const titulos = {
    'BI / Power BI': `Dashboard de ${pick(['vendas', 'performance', 'resultados', 'clientes'])} em ${pick(['5 minutos', '10 minutos', '1 hora'])} com Power BI`,
    'IA / ChatGPT': `Prompt de IA que ${pick(['substitui', 'automatiza', 'elimina'])} ${pick(['horas de trabalho', 'tarefas manuais', 'o brainstorming'])}`,
    'UGC': `UGC que converte: o roteiro que ${pick(['marcas pagam caro', 'agências não ensinam', 'triplicou o engajamento'])}`,
    'Tech Tools': `${pick(['5', '3', '7'])} ferramentas gratuitas para ${pick(['criar conteúdo', 'analisar dados', 'automatizar processos', 'apresentar resultados'])}`,
    'Roteiro & Estratégia': `A estrutura de roteiro que ${pick(['para o scroll', 'gera salvamentos', 'retém atenção até o final'])}`,
    'Bastidores & Setup': `Meu processo real de ${pick(['criação de conteúdo', 'análise de dados', 'produção de UGC'])} (sem enrolação)`,
    'Python & Dados': `Python na prática: ${pick(['automatize', 'analise', 'visualize'])} ${pick(['em minutos', 'sem complicação', 'do jeito certo'])}`,
  };

  const titulo = titulos[subniche] || `Conteúdo sobre ${subniche}: como ${desejo}`;

  return {
    titulo,
    subniche,
    formato,
    formula: formula.nome,
    gatilho: formula.gatilho,
    hook,
    estrutura: {
      h: `HOOK: "${hook}"`,
      i: `INTRODUÇÃO: Apresente o problema da sua audiência — especificamente a dor: ${dor}. Posicione-se como quem já resolveu isso.`,
      d: `DESENVOLVIMENTO: Mostre o passo a passo / ferramenta / estratégia. Foco no ${subniche}. Resultado: ${desejo}.`,
      c: `CTA: "${cta}"`,
    },
    dor_abordada: dor,
    desejo_gerado: desejo,
    checklist_viralidade: CHECKLIST_VIRALIDADE,
    gerado_em: new Date().toISOString(),
  };
}

// ── ROTAS ─────────────────────────────────────────────────────────────────────

// GET /api/intelligence/generate-idea?subniche=BI%20/%20Power%20BI
router.get('/generate-idea', (req, res) => {
  try {
    const { subniche } = req.query;
    const ideia = gerarIdeiaCompleta(subniche || null);
    res.json(ideia);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/intelligence/hooks — retorna todas as fórmulas de gancho
router.get('/hooks', (req, res) => {
  res.json(HOOK_FORMULAS);
});

// GET /api/intelligence/generate-hook?titulo=...&subniche=...
router.get('/generate-hook', (req, res) => {
  try {
    const { titulo, subniche } = req.query;
    const variacoes = HOOK_FORMULAS.map(f => ({
      formula: f.nome,
      gatilho: f.gatilho,
      sugestao: pick(f.exemplos),
    }));
    res.json({ titulo, subniche, variacoes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/intelligence/checklist — checklist de viralidade
router.get('/checklist', (req, res) => {
  res.json({ items: CHECKLIST_VIRALIDADE });
});

// GET /api/intelligence/hidc?titulo=...&subniche=...&formato=...
router.get('/hidc', (req, res) => {
  try {
    const { titulo, subniche, formato } = req.query;
    const formula = pick(HOOK_FORMULAS);
    const hook = pick(formula.exemplos);
    const dor = pick(DORES);
    const desejo = pick(DESEJOS);
    const cta = pick(CTAS);

    res.json({
      titulo: titulo || 'Sem título',
      subniche: subniche || 'Geral',
      formato: formato || 'Reels',
      h: `🎬 HOOK (0–3s)\n"${hook}"\n\nGatilho: ${formula.gatilho}`,
      i: `💡 INTRODUÇÃO (3–8s)\nO problema real: ${dor}.\nPor que você precisa ouvir isso de mim: [insira sua prova de autoridade aqui — dados, resultado, experiência].`,
      d: `🔑 DESENVOLVIMENTO (8–45s)\nA solução / ferramenta / estratégia relacionada a: ${subniche || 'seu nicho'}.\nResultado esperado para quem aplicar: ${desejo}.\n\n[Insira o passo a passo, o tutorial ou a lista de ferramentas aqui]`,
      c: `📢 CTA (últimos 5s)\n${cta}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/intelligence/context — retorna todo o contexto da Karen para referência
router.get('/context', (req, res) => {
  res.json({
    identidade: {
      arquetipo: 'Sábio + Criador',
      promessa: 'Ouro técnico (Data, BI, IA, Tech) em embalagem visual premium e fácil de aplicar',
      inimigo: 'Complicação desnecessária da tecnologia e criação de conteúdo sem estratégia',
      tom: 'Didático, Sofisticado, Inspirador, Direto',
    },
    subniches: SUBNICHES,
    formatos: FORMATOS,
    hook_formulas: HOOK_FORMULAS.map(f => ({ id: f.id, nome: f.nome, formula: f.formula, gatilho: f.gatilho })),
    dores: DORES,
    desejos: DESEJOS,
    checklist_viralidade: CHECKLIST_VIRALIDADE,
    estrutura_roteiro: ESTRUTURAS_HIDC,
    ctas: CTAS,
  });
});

module.exports = router;
