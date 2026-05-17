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

  // SUB-NICHOS
  const nichos = [
    { name: 'UGC', color: '#f135a0' },
    { name: 'Roteiro', color: '#8b5cf6' },
    { name: 'Marketing', color: '#60b4ff' },
    { name: 'Mindset', color: '#c8f135' },
    { name: 'Bastidores', color: '#ffd060' },
    { name: 'Produto', color: '#00e5a0' },
    { name: 'Geral', color: '#888899' },
  ];
  for (const n of nichos) {
    await prisma.subNiche.upsert({ where: { name: n.name }, update: {}, create: n });
  }

  const ugcId = (await prisma.subNiche.findUnique({ where: { name: 'UGC' } })).id;
  const rotId = (await prisma.subNiche.findUnique({ where: { name: 'Roteiro' } })).id;
  const mktId = (await prisma.subNiche.findUnique({ where: { name: 'Marketing' } })).id;
  const mndId = (await prisma.subNiche.findUnique({ where: { name: 'Mindset' } })).id;
  const bstId = (await prisma.subNiche.findUnique({ where: { name: 'Bastidores' } })).id;

  // REFERÊNCIAS
  const ref1 = await prisma.reference.create({ data: {
    url: 'https://youtube.com/watch?v=abc123',
    customTitle: 'Como criar UGC que vende em 60s',
    originalTitle: 'How to create UGC that sells',
    summary: 'Os primeiros 3 segundos definem tudo. Gancho visual + frase de impacto = retenção máxima.',
    adaptation: 'Usar enquadramento próximo + fala direta pra câmera. Linha KyB: menos é mais, mas o que aparece tem que pesar.',
    score: 5, subNicheId: ugcId,
  }});
  const ref2 = await prisma.reference.create({ data: {
    url: 'https://youtube.com/watch?v=xyz456',
    customTitle: 'Estrutura problema-solução em roteiros',
    originalTitle: 'Problem Solution Framework',
    summary: 'Fórmula: Problema (5s) > Agitação (10s) > Solução (20s) > CTA (5s). Funciona pra qualquer nicho.',
    adaptation: 'Adaptar pra dicas de criação de conteúdo. Problema: não saber o que gravar. Solução: o sistema KyB.',
    score: 4, subNicheId: rotId,
  }});
  await prisma.reference.create({ data: {
    url: 'https://instagram.com/p/def789',
    customTitle: 'Carrossel de posicionamento de marca pessoal',
    summary: 'Primeiro slide = afirmação polêmica. Últimos slides = prova social. Engajamento altíssimo.',
    adaptation: 'Carrossel: por que a maioria dos criadores falha — sem sistema, sem acervo, sem consistência.',
    score: 3, subNicheId: mktId,
  }});
  await prisma.reference.create({ data: {
    url: 'https://youtube.com/watch?v=qrs101',
    customTitle: 'Como fechar parcerias UGC sem seguidores',
    summary: 'Portfólio é mais importante que audiência. 5 vídeos bem feitos valem mais que 10k seguidores.',
    adaptation: 'Criar lista de vídeos de portfólio para apresentar a marcas. Focar em produto físico e lifestyle.',
    score: 5, subNicheId: ugcId,
  }});

  // IDEIAS
  const idea1 = await prisma.idea.create({ data: {
    title: 'Por que você nunca termina o que começa (e como resolver)',
    format: 'Vídeo curto', status: 'Roteiro', subNicheId: mndId,
    context: 'Ângulo: o problema não é motivação, é sistema.', referenceId: ref2.id,
  }});
  await prisma.idea.create({ data: {
    title: 'Unboxing + review produto físico — modelo KyB',
    format: 'UGC', status: 'Ideia', subNicheId: ugcId,
    context: 'Quero ter esse modelo no portfólio para fechar parcerias com marcas físicas.', referenceId: ref1.id,
  }});
  const idea3 = await prisma.idea.create({ data: {
    title: '3 ganchos que dobram retenção em vídeos curtos',
    format: 'Carrossel', status: 'Gravação', subNicheId: rotId,
    context: 'Conteúdo educativo pro meu nicho de criadores.', referenceId: ref1.id,
  }});
  await prisma.idea.create({ data: {
    title: 'Meu processo de criar 10 vídeos em 1 dia',
    format: 'Vlog', status: 'Publicado', subNicheId: bstId,
    context: 'Mostrar o sistema por dentro. Conteúdo de autoridade.',
  }});
  await prisma.idea.create({ data: {
    title: '5 erros de quem começa no UGC',
    format: 'Vídeo curto', status: 'Aprovado', subNicheId: ugcId,
    context: 'Baseado nas minhas próprias dificuldades no início.',
  }});

  // ATIVOS CRIATIVOS
  const assets = [
    { type: 'hook', content: 'Você tá perdendo dinheiro porque não sabe disso...', subNicheId: null },
    { type: 'hook', content: 'Ninguém vai te falar isso, mas eu vou:', subNicheId: ugcId },
    { type: 'hook', content: 'Para tudo. Olha só o que acontece quando você faz isso:', subNicheId: null },
    { type: 'hook', content: 'Eu errei por 6 meses até descobrir isso:', subNicheId: mndId },
    { type: 'cta', content: 'Comenta aqui qual é o seu maior bloqueio hoje', subNicheId: null },
    { type: 'cta', content: 'Salva esse vídeo — você vai precisar dele amanhã', subNicheId: null },
    { type: 'cta', content: 'Me manda DM com a palavra SISTEMA que eu te mando o template', subNicheId: null },
    { type: 'cta', content: 'Segue para não perder a parte 2', subNicheId: null },
    { type: 'phrase', content: 'Consistência bate talento. Sistema bate inspiração.', subNicheId: mndId },
    { type: 'phrase', content: 'KyB: conteúdo que converte porque foi pensado antes de ser gravado.', subNicheId: null },
    { type: 'title', content: '[Número] coisas que todo criador de UGC precisa saber', subNicheId: ugcId },
    { type: 'title', content: 'Por que seu conteúdo não converte (e o que fazer agora)', subNicheId: mktId },
    { type: 'question', content: 'Qual seu maior bloqueio pra gravar hoje?', subNicheId: null },
    { type: 'question', content: 'Você já tem um sistema de criação de conteúdo?', subNicheId: null },
  ];
  for (const a of assets) await prisma.asset.create({ data: a });

  // ROTEIROS
  await prisma.script.create({ data: {
    title: '3 ganchos que dobram retenção',
    version: 'v2', structure: 'Lista', duration: '60s', ideaId: idea3.id,
    content: `🎬 GANCHO (0-3s)\nPara tudo. 3 ganchos que eu usei pra dobrar minha retenção.\n\n📌 DESENVOLVIMENTO (4-45s)\n1. Gancho visual — começa com movimento ou close no produto\n2. Gancho de curiosidade — afirmação que gera pergunta\n3. Gancho de problema — "Se você faz X, você está errando"\n\n🎯 CTA (46-60s)\nSalva esse vídeo. Qual dos três você vai testar hoje? Comenta aqui.`,
  }});
  await prisma.script.create({ data: {
    title: 'Por que você nunca termina o que começa',
    version: 'v1', structure: 'Problema-Solução', duration: '90s', ideaId: idea1.id,
    content: `🎬 GANCHO (0-5s)\nVocê não tem problema de motivação. Você tem problema de sistema.\n\n😤 PROBLEMA (6-25s)\nToda semana você começa cheio de energia. Na quinta, travou. Por quê? Sem estrutura, criatividade vira ansiedade.\n\n💡 SOLUÇÃO (26-75s)\nO que funciona: acervo de ideias prontas + pipeline visual. Quando você abre o sistema, já sabe o próximo passo.\n\n🎯 CTA (76-90s)\nCria hoje uma lista das suas próximas 5 ideias. Não precisa ser perfeito. Precisa existir.`,
  }});

  // PROMPTS
  const prompts = [
    { title: 'Roteiro Problema-Solução 60s', useCase: 'Vídeo curto educativo', content: 'Crie um roteiro de 60 segundos no formato problema-solução sobre [TEMA]. Estrutura: Gancho impactante (3s) + Problema que o público sente (15s) + Agitação emocional (10s) + Solução clara (25s) + CTA específico (7s). Tom: direto, sem rodeios, linguagem de criador brasileiro.' },
    { title: 'UGC Produto Físico', useCase: 'Parceria com marca', content: 'Crie um roteiro UGC de 30-60s para o produto [PRODUTO]. Inclua: abertura com produto em mãos, problema que resolve, demonstração rápida, resultado emocional, CTA orgânico. Tom natural, como recomendação espontânea.' },
    { title: 'Carrossel de Posicionamento', useCase: 'Instagram / LinkedIn', content: 'Crie carrossel de 7 slides sobre [TEMA]. Slide 1: afirmação polêmica. Slides 2-5: desenvolvimento, 1 ideia por slide. Slide 6: síntese em 1 frase. Slide 7: CTA com pergunta. Máximo 15 palavras por slide.' },
    { title: 'Briefing para Equipe de Edição', useCase: 'Enviar para editor', content: 'Crie um briefing de edição para o vídeo "[TÍTULO]". Inclua: referência de estilo, ritmo de cortes, trilha (mood), textos na tela (momentos e duração), transições, formato de entrega (vertical/horizontal, resolução).' },
  ];
  for (const p of prompts) await prisma.prompt.create({ data: p });

  // CHECKLISTS
  const cl1 = await prisma.checklist.create({ data: { name: 'Pré-produção', ideaTitle: '3 ganchos que dobram retenção', ideaId: idea3.id }});
  const items1 = ['Ideia aprovada no kanban', 'Roteiro escrito e revisado', 'Gancho e CTA definidos', 'Equipamento checado (câmera, mic, luz)', 'Set montado e cenário arrumado'];
  for (let i = 0; i < items1.length; i++) {
    await prisma.checklistItem.create({ data: { label: items1[i], done: i < 3, order: i, checklistId: cl1.id }});
  }
  const cl2 = await prisma.checklist.create({ data: { name: 'Publicação', ideaTitle: 'Meu processo de criar 10 vídeos' }});
  const items2 = ['Vídeo editado e aprovado', 'Thumbnail criada', 'Descrição com SEO escrita', 'Agendado na plataforma', 'Stories de lançamento publicados'];
  for (let i = 0; i < items2.length; i++) {
    await prisma.checklistItem.create({ data: { label: items2[i], done: i < 4, order: i, checklistId: cl2.id }});
  }

  // UGC & PORTFÓLIO
  const ugcItems = [
    { title: 'Unboxing skincare — close + reação', brand: 'Marca de Beleza X', type: 'Portfólio', status: 'A gravar', format: '60s vertical' },
    { title: 'Review tênis casual lifestyle', brand: 'Loja de Moda Y', type: 'Parceria', status: 'Gravado', format: '30s vertical' },
    { title: 'Tutorial produto de limpeza casa', brand: 'Marca Casa Z', type: 'Portfólio', status: 'Publicado', format: '45s vertical' },
    { title: 'Depoimento suplemento energia', brand: 'Nutri Brand W', type: 'Parceria', status: 'A gravar', format: '60s vertical' },
    { title: 'GRWM com produto de beleza', brand: 'Portfolio KyB', type: 'Portfólio', status: 'Ideia', format: '90s vertical' },
  ];
  for (const u of ugcItems) await prisma.ugcVideo.create({ data: u });

  // BIBLIOTECA
  const libItems = [
    { title: 'O algoritmo não é seu inimigo — é seu espelho', category: 'Dica', tags: 'algoritmo,estratégia', content: 'O conteúdo que você mais evita postar geralmente é o que mais performa. O algoritmo amplifica autenticidade, não perfeição.' },
    { title: 'Por que consistência bate frequência', category: 'Mindset', tags: 'consistência,rotina', content: 'Postar todo dia com conteúdo médio é pior que postar 3x por semana com conteúdo pensado. Qualidade de intenção vence quantidade de output.' },
    { title: 'UGC vs conteúdo próprio — a diferença que ninguém fala', category: 'UGC', tags: 'ugc,criador', content: 'No UGC você vende o produto da marca. No conteúdo próprio você vende sua autoridade. Os dois constroem patrimônio, mas de formas diferentes.' },
    { title: 'Como transformar um vídeo em 5 formatos diferentes', category: 'Produção', tags: 'reaproveitamento,produção', content: '1 gravação → vídeo longo no YouTube → corte pra Reels → carrossel com prints → thread no X → story com poll. Um esforço, cinco distribuições.' },
  ];
  for (const l of libItems) await prisma.libraryItem.create({ data: l });

  // ACERVO
  const acervoItems = [
    { name: 'Logo KyB — versão escura', category: 'Identidade Visual', url: 'https://drive.google.com/logo-kyb-dark', description: 'Logo principal em fundo escuro, PNG e SVG' },
    { name: 'Paleta de cores KyB', category: 'Identidade Visual', url: 'https://drive.google.com/paleta-kyb', description: 'Hex codes, gradientes e aplicações corretas da marca' },
    { name: 'Contrato modelo UGC', category: 'Documentos', url: 'https://drive.google.com/contrato-ugc', description: 'Modelo de contrato para parcerias UGC com marcas' },
    { name: 'Mídia kit KyB 2025', category: 'Documentos', url: 'https://drive.google.com/midia-kit', description: 'Apresentação de dados, nichos e formatos de parceria' },
    { name: 'Preset Lightroom — aesthetic KyB', category: 'Mídia', url: 'https://drive.google.com/preset-lightroom', description: 'Preset de edição de foto para identidade visual' },
    { name: 'Pack de músicas — uso livre', category: 'Mídia', url: 'https://drive.google.com/musicas', description: 'Trilhas sem direitos autorais organizadas por mood' },
  ];
  for (const a of acervoItems) await prisma.acervoItem.create({ data: a });

  // FERRAMENTAS
  const tools = [
    { name: 'CapCut', url: 'https://capcut.com', category: 'Edição', icon: '🎬' },
    { name: 'Canva', url: 'https://canva.com', category: 'Design', icon: '🎨' },
    { name: 'ChatGPT', url: 'https://chatgpt.com', category: 'IA', icon: '🤖' },
    { name: 'Notion', url: 'https://notion.so', category: 'Organização', icon: '📋' },
    { name: 'TubeBuddy', url: 'https://tubebuddy.com', category: 'YouTube', icon: '📊' },
    { name: 'Later', url: 'https://later.com', category: 'Agendamento', icon: '📅' },
    { name: 'Epidemic Sound', url: 'https://epidemicsound.com', category: 'Música', icon: '🎵' },
    { name: 'Remove.bg', url: 'https://remove.bg', category: 'Design', icon: '✂️' },
    { name: 'VidIQ', url: 'https://vidiq.com', category: 'YouTube', icon: '📈' },
    { name: 'Pexels', url: 'https://pexels.com', category: 'Mídia', icon: '📷' },
  ];
  for (const t of tools) await prisma.tool.create({ data: t });

  console.log('✅ Seed concluído! Banco de dados KyB populado com sucesso.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
