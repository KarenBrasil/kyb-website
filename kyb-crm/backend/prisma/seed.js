const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados KyB...');

  // USER
  const hash = await bcrypt.hash('kyb2025', 10);
  await prisma.user.upsert({
    where: { email: 'karen@kyb.com' },
    update: {},
    create: { name: 'Karen', email: 'karen@kyb.com', password: hash },
  });

  // SUB-NICHOS — posicionamento real da Karen
  const nichos = [
    { name: 'BI / Power BI',        color: '#60b4ff' },
    { name: 'IA / ChatGPT',         color: '#8b5cf6' },
    { name: 'UGC',                  color: '#f135a0' },
    { name: 'Tech Tools',           color: '#00e5a0' },
    { name: 'Roteiro & Estratégia', color: '#c8f135' },
    { name: 'Bastidores & Setup',   color: '#ffd060' },
    { name: 'Python & Dados',       color: '#ff6b35' },
  ];
  for (const n of nichos) {
    await prisma.subNiche.upsert({ where: { name: n.name }, update: {}, create: n });
  }

  const biId   = (await prisma.subNiche.findUnique({ where: { name: 'BI / Power BI' } })).id;
  const iaId   = (await prisma.subNiche.findUnique({ where: { name: 'IA / ChatGPT' } })).id;
  const ugcId  = (await prisma.subNiche.findUnique({ where: { name: 'UGC' } })).id;
  const techId = (await prisma.subNiche.findUnique({ where: { name: 'Tech Tools' } })).id;
  const rotId  = (await prisma.subNiche.findUnique({ where: { name: 'Roteiro & Estratégia' } })).id;
  const bstId  = (await prisma.subNiche.findUnique({ where: { name: 'Bastidores & Setup' } })).id;
  const pyId   = (await prisma.subNiche.findUnique({ where: { name: 'Python & Dados' } })).id;

  // REFERÊNCIAS
  const ref1 = await prisma.reference.create({ data: {
    url: 'https://youtube.com/watch?v=abc123',
    customTitle: 'Como criar UGC que vende em 60s',
    originalTitle: 'How to create UGC that sells',
    summary: 'Os primeiros 3 segundos definem tudo. Gancho visual + frase de impacto = retenção máxima.',
    adaptation: 'Enquadramento próximo + fala direta pra câmera. Padrão KyB: menos é mais, mas o que aparece tem que pesar.',
    score: 5, subNicheId: ugcId,
  }});
  const ref2 = await prisma.reference.create({ data: {
    url: 'https://youtube.com/watch?v=xyz456',
    customTitle: 'Estrutura HIDC para roteiros que retêm',
    originalTitle: 'Hook-Intro-Dev-CTA Framework',
    summary: 'Fórmula: Hook (3s) > Introdução (8s) > Desenvolvimento (45s) > CTA (5s). Funciona para qualquer nicho técnico.',
    adaptation: 'Base de todo roteiro KyB. Aplicar especialmente em tutoriais de Power BI e IA.',
    score: 5, subNicheId: rotId,
  }});

  // IDEIAS — baseadas nos sub-nichos reais da Karen
  const idea1 = await prisma.idea.create({ data: {
    title: 'Dashboard de vendas em 5 minutos com Power BI',
    format: 'Screencast Dinâmico', status: 'Roteiro', subNicheId: biId,
    context: 'Gancho: Prova Social. Mostrar o resultado final primeiro, depois o passo a passo. Alta salvabilidade.', referenceId: ref2.id,
  }});
  await prisma.idea.create({ data: {
    title: 'O prompt de ChatGPT que substituiu 3 horas de trabalho',
    format: 'Face to Camera', status: 'Ideia', subNicheId: iaId,
    context: 'Gancho: Corte de Tempo. Antes (manual demorado) vs depois (prompt em segundos). Alta salvabilidade.', referenceId: ref1.id,
  }});
  const idea3 = await prisma.idea.create({ data: {
    title: '5 ferramentas gratuitas que todo analista deveria conhecer',
    format: 'Carrossel', status: 'Gravação', subNicheId: techId,
    context: 'Gancho: Lista de Valor. Alta salvabilidade. Carrossel denso com print de cada ferramenta.', referenceId: ref1.id,
  }});
  await prisma.idea.create({ data: {
    title: 'Meu setup de criação de conteúdo + dados em 2025',
    format: 'Cinematográfico / Bastidores', status: 'Publicado', subNicheId: bstId,
    context: 'Conteúdo de autoridade. Mostrar o stack completo: câmera, mic, Power BI, Python, IA.',
  }});
  await prisma.idea.create({ data: {
    title: 'UGC para marcas de Tech: o roteiro que funciona',
    format: 'Face to Camera', status: 'Aprovado', subNicheId: ugcId,
    context: 'Gancho: Segredo Revelado. Posicionar como especialista em UGC para tecnologia.',
  }});
  await prisma.idea.create({ data: {
    title: 'Python em 60 segundos: automação que todo iniciante faz',
    format: 'Screencast Dinâmico', status: 'Ideia', subNicheId: pyId,
    context: 'Gancho: Transformação. Mostrar código simples com resultado visual impressionante.',
  }});

  // ATIVOS CRIATIVOS — 6 fórmulas de gancho + CTAs + frases
  const assets = [
    { type: 'hook', content: 'O site que as agências de marketing não querem que você descubra.', subNicheId: techId },
    { type: 'hook', content: 'A ferramenta de BI que os analistas sênior guardam a sete chaves.', subNicheId: biId },
    { type: 'hook', content: 'O prompt de IA que consultores cobram R$500 para te dar.', subNicheId: iaId },
    { type: 'hook', content: 'Se eu fosse nutricionista, usaria essa IA para lotar a agenda sem gastar 1 real em anúncio.', subNicheId: iaId },
    { type: 'hook', content: 'Como eu construí esse dashboard de vendas em 5 minutos usando Power BI.', subNicheId: biId },
    { type: 'hook', content: 'Essa IA escondida vai cortar o tempo do seu trabalho pela metade.', subNicheId: iaId },
    { type: 'hook', content: '5 sites gratuitos para criar apresentações como designer profissional.', subNicheId: techId },
    { type: 'hook', content: 'Quem ainda não sabe usar IA em 2025 vai perder espaço no mercado.', subNicheId: iaId },
    { type: 'cta', content: 'Salva esse vídeo para aplicar amanhã.', subNicheId: null },
    { type: 'cta', content: 'Comenta "IA" que te mando o link da ferramenta.', subNicheId: iaId },
    { type: 'cta', content: 'Comenta "POWER BI" que te mando o template gratuito.', subNicheId: biId },
    { type: 'cta', content: 'Me segue para mais estratégias de conteúdo com tecnologia.', subNicheId: null },
    { type: 'phrase', content: 'Tecnologia complexa, resultado simples. Esse é o padrão KyB.', subNicheId: null },
    { type: 'phrase', content: 'Dados sem visualização são só números. BI é comunicação.', subNicheId: biId },
    { type: 'phrase', content: 'IA não vai te substituir. Mas quem sabe usar IA vai.', subNicheId: iaId },
    { type: 'title', content: '[N] ferramentas de BI que ninguém te conta (mas deveriam)', subNicheId: biId },
    { type: 'title', content: 'A IA que analistas de dados estão usando em silêncio', subNicheId: iaId },
    { type: 'question', content: 'Você usa BI no seu trabalho ou ainda é planilha pura?', subNicheId: biId },
    { type: 'question', content: 'Qual ferramenta de IA mudou a sua rotina de trabalho?', subNicheId: iaId },
    { type: 'question', content: 'Você já fez UGC para alguma marca de tecnologia?', subNicheId: ugcId },
  ];
  for (const a of assets) await prisma.asset.create({ data: a });

  // ROTEIROS com estrutura HIDC
  await prisma.script.create({ data: {
    title: 'Dashboard Power BI — 60s HIDC',
    version: 'v1', structure: 'HIDC', duration: '60s', ideaId: idea1.id,
    content: `🎬 H — HOOK (0–3s)\n"Como eu construí esse dashboard de vendas em 5 minutos usando Power BI."\n[Mostrar tela do dashboard pronto. Impressiona antes de explicar.]\n\n💡 I — INTRODUÇÃO (3–8s)\nMuita gente passa horas em planilhas para gerar um relatório que ninguém consegue ler. Existe um jeito mais inteligente.\n\n🔑 D — DESENVOLVIMENTO (8–50s)\nPasso 1: Conectar fonte de dados\nPasso 2: Escolher o visual certo para cada dado\nPasso 3: Filtro dinâmico por período\nPasso 4: Exportar e compartilhar com 1 clique\nResultado: Dashboard interativo em tempo real.\n\n📢 C — CTA (50–60s)\nComenta "POWER BI" que te mando o template gratuito.\nSegue para mais estratégias de dados e BI.`,
  }});
  await prisma.script.create({ data: {
    title: '5 Ferramentas Tech — Carrossel 7 Slides',
    version: 'v1', structure: 'Lista', duration: '7 slides', ideaId: idea3.id,
    content: `🎬 SLIDE 1 — HOOK\n"5 ferramentas gratuitas que todo analista de dados deveria conhecer"\n\n🔧 SLIDES 2–6 — [Ferramenta + Print + Para que serve em 1 linha]\n\n📢 SLIDE 7 — CTA\nSalva esse carrossel!\nQual dessas você já usa? Comenta aqui.\nMe segue para mais ferramentas de Tech e Dados.`,
  }});

  // PROMPTS — fórmulas de gancho + roteiros HIDC
  const prompts = [
    {
      title: '🎬 Gerador HIDC — Roteiro Completo 60s',
      useCase: 'Qualquer sub-nicho (BI, IA, UGC, Tech)',
      content: 'Crie um roteiro de 60s no formato HIDC para o tema [TEMA] no sub-nicho [SUB-NICHO].\n\nH (0–3s): Gancho forte. Fórmula: [Segredo Revelado / Prova Social / Corte de Tempo / Transformação].\nI (3–8s): Contexto do problema. Por que [PÚBLICO-ALVO] se identifica com isso?\nD (8–50s): Desenvolvimento com passo a passo / ferramenta / estratégia. Denso e direto.\nC (50–60s): CTA específico com uma ação clara.\n\nTom: sofisticado, direto, sem enrolação. Linguagem de criador tech brasileiro.',
    },
    {
      title: '🔑 Fórmula: Segredo Revelado',
      useCase: 'Hook para Tech Tools e BI',
      content: 'Crie 5 variações de gancho "Segredo Revelado" para o tema [TEMA].\nFórmula: "O [TIPO] que [AUTORIDADE] não quer que você descubra."\nGatilho: Curiosidade + Medo de ficar para trás.\nEx: "O site que as agências de marketing não querem que você descubra."',
    },
    {
      title: '🔄 Fórmula: Transformação (Se eu fosse...)',
      useCase: 'Vídeos de identificação e autoridade',
      content: 'Crie 5 variações "Se eu fosse [Profissão]" para o tema [TEMA].\nFórmula: "Se eu fosse [PROFISSÃO], é exatamente isso que eu faria para [RESULTADO] usando [FERRAMENTA]."\nGatilho: Identificação + Aspiração.',
    },
    {
      title: '📊 UGC Tech — Roteiro para Parceria',
      useCase: 'UGC para marcas de tecnologia',
      content: 'Crie um roteiro UGC de 30–60s para a marca [MARCA] / produto [PRODUTO] do nicho tech.\nEstrutura: produto em uso real (3s) + problema que resolve (10s) + demonstração (25s) + resultado + CTA orgânico (7s).\nTom: natural, como recomendação espontânea de especialista.',
    },
    {
      title: '📋 Checklist de Viralidade — Validação',
      useCase: 'Validar qualquer ideia antes de gravar',
      content: 'Avalie a ideia "[TÍTULO]" usando o Checklist KyB:\n1. Qual o gatilho emocional? (Curiosidade / Alívio / Medo / Inspiração)\n2. O Hook dos primeiros 3s é magnético?\n3. Conteúdo altamente salvável?\n4. Conteúdo compartilhável?\n5. Quebra de padrão a cada 3–5s?\n\n4–5 "sim" = grave. 3 = revise o gancho. Abaixo de 3 = reformule a ideia.',
    },
    {
      title: '🐍 Python Screencast — Tutorial Rápido',
      useCase: 'Tutoriais de Python e dados',
      content: 'Crie roteiro de screencast para [CONCEITO DE PYTHON] em 60–90s.\nMostrar o resultado final nos primeiros 3s > código simples > executar passo a passo > mostrar resultado > CTA.\nTom: didático, acessível, sem jargão. "Se eu consegui, você também consegue."',
    },
  ];
  for (const p of prompts) await prisma.prompt.create({ data: p });

  // CHECKLISTS
  const cl1 = await prisma.checklist.create({ data: { name: 'Pré-produção — Dashboard Power BI', ideaTitle: 'Dashboard de vendas Power BI', ideaId: idea1.id }});
  const items1 = ['Dados fonte definidos e acessíveis', 'Ideia aprovada no pipeline', 'Roteiro HIDC escrito', 'Screencast configurado', 'Câmera e microfone testados', 'Gancho e CTA definidos'];
  for (let i = 0; i < items1.length; i++) {
    await prisma.checklistItem.create({ data: { label: items1[i], done: i < 3, order: i, checklistId: cl1.id }});
  }
  const cl2 = await prisma.checklist.create({ data: { name: 'Checklist de Viralidade', ideaTitle: '5 ferramentas gratuitas Tech', ideaId: idea3.id }});
  const items2 = ['Gatilho emocional identificado', 'Hook dos primeiros 3s magnético', 'Conteúdo altamente salvável', 'Conteúdo compartilhável', 'Quebra de padrão a cada 3–5s'];
  for (let i = 0; i < items2.length; i++) {
    await prisma.checklistItem.create({ data: { label: items2[i], done: false, order: i, checklistId: cl2.id }});
  }

  // UGC & PORTFÓLIO — nicho Tech
  const ugcItems = [
    { title: 'Review ferramenta de BI — lifestyle office', brand: 'SaaS de Dados X', type: 'Parceria', status: 'A gravar', format: '60s vertical' },
    { title: 'Unboxing gadget de setup criador de conteúdo', brand: 'Tech Store Y', type: 'Portfólio', status: 'Gravado', format: '45s vertical' },
    { title: 'Tutorial rápido — app de produtividade', brand: 'App Z', type: 'Parceria', status: 'Publicado', format: '30s vertical' },
    { title: 'Depoimento curso de IA para negócios', brand: 'EduTech W', type: 'Portfólio', status: 'A gravar', format: '60s vertical' },
    { title: 'GRWM + setup de analista de dados', brand: 'Portfolio KyB', type: 'Portfólio', status: 'Ideia', format: '90s vertical' },
  ];
  for (const u of ugcItems) await prisma.ugcVideo.create({ data: u });

  // BIBLIOTECA — curadoria editorial do nicho
  const libItems = [
    { title: 'Por que conteúdo Tech tem maior taxa de salvamento', category: 'Estratégia', tags: 'tech,algoritmo,salvamento', content: 'Conteúdo técnico com utilidade prática (tutoriais, ferramentas, prompts) tem taxa de salvamento 3x maior que entretenimento. Isso sinaliza autoridade ao algoritmo.' },
    { title: 'HIDC: a estrutura que para qualquer scroll', category: 'Roteiro', tags: 'roteiro,HIDC,retenção', content: 'H(0–3s): para o scroll. I(3–8s): valida autoridade. D(8–45s): entrega o ouro. C(últimos 5s): comando claro. Essa é a base de todo roteiro KyB.' },
    { title: 'UGC para nicho Tech: o que marcas precisam', category: 'UGC', tags: 'ugc,tech,parceria', content: 'Marcas de tecnologia querem criadores que entendam o produto. UGC tech precisa: linguagem técnica acessível, demonstração real, resultado claro, tom de especialista.' },
    { title: 'Power BI vs Excel: como posicionar esse conteúdo', category: 'BI / Power BI', tags: 'powerbi,excel,estratégia', content: 'A audiência que usa Excel quer aprender BI, mas tem medo. O ângulo certo: "Power BI é mais simples que você pensa, e mais poderoso que qualquer planilha."' },
    { title: 'Os 3 tipos de conteúdo IA que mais engajam', category: 'IA / ChatGPT', tags: 'ia,chatgpt,engajamento', content: '1. Prompt reveal. 2. Antes/depois (sem IA vs com IA). 3. Substituição de tarefa. Os três têm alta salvabilidade e compartilhamento.' },
  ];
  for (const l of libItems) await prisma.libraryItem.create({ data: l });

  // ACERVO
  const acervoItems = [
    { name: 'Logo KyB — versão escura', category: 'Identidade Visual', url: 'https://drive.google.com/logo-kyb', description: 'Logo principal PNG e SVG' },
    { name: 'Paleta de cores KyB', category: 'Identidade Visual', url: 'https://drive.google.com/paleta', description: 'Hex codes, gradientes e aplicações da marca' },
    { name: 'Contrato modelo UGC Tech', category: 'Documentos', url: 'https://drive.google.com/contrato-ugc', description: 'Modelo de contrato para parcerias UGC com marcas de tecnologia' },
    { name: 'Mídia kit KyB 2025 — Tech & Data', category: 'Documentos', url: 'https://drive.google.com/midia-kit', description: 'Apresentação de dados, nichos e formatos de parceria' },
    { name: 'Templates Power BI — KyB Pack', category: 'Templates', url: 'https://drive.google.com/powerbi-templates', description: 'Templates de dashboard prontos para customizar' },
    { name: 'Pack de prompts IA — 50 prompts KyB', category: 'Templates', url: 'https://drive.google.com/prompts-pack', description: 'Prompts para ChatGPT, Gemini e Claude organizados por uso' },
  ];
  for (const a of acervoItems) await prisma.acervoItem.create({ data: a });

  // FERRAMENTAS — stack real da Karen
  const tools = [
    { name: 'Power BI',       url: 'https://powerbi.microsoft.com',    category: 'BI / Dados',   icon: '📊' },
    { name: 'ChatGPT',        url: 'https://chatgpt.com',              category: 'IA',            icon: '🤖' },
    { name: 'Python (Colab)', url: 'https://colab.google',             category: 'BI / Dados',   icon: '🐍' },
    { name: 'Looker Studio',  url: 'https://lookerstudio.google.com',  category: 'BI / Dados',   icon: '📉' },
    { name: 'CapCut',         url: 'https://capcut.com',               category: 'Edição',        icon: '🎬' },
    { name: 'Canva',          url: 'https://canva.com',                category: 'Design',        icon: '🎨' },
    { name: 'Claude',         url: 'https://claude.ai',                category: 'IA',            icon: '🧠' },
    { name: 'Gemini',         url: 'https://gemini.google.com',        category: 'IA',            icon: '✨' },
    { name: 'n8n',            url: 'https://n8n.io',                   category: 'Automação',     icon: '⚡' },
    { name: 'Perplexity',     url: 'https://perplexity.ai',            category: 'IA',            icon: '🔍' },
    { name: 'Notion',         url: 'https://notion.so',                category: 'Organização',   icon: '📋' },
    { name: 'Remove.bg',      url: 'https://remove.bg',                category: 'Design',        icon: '✂️' },
    { name: 'Pexels',         url: 'https://pexels.com',               category: 'Mídia',         icon: '📷' },
    { name: 'Epidemic Sound', url: 'https://epidemicsound.com',        category: 'Música',        icon: '🎵' },
    { name: 'VidIQ',          url: 'https://vidiq.com',                category: 'YouTube',       icon: '📈' },
  ];
  for (const t of tools) await prisma.tool.create({ data: t });

  console.log('✅ Seed concluído! Banco de dados KyB populado com sucesso.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
