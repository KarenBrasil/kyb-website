const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const [ideas, references, assets, checklists, ugc] = await Promise.all([
      prisma.idea.findMany({ include: { subNiche: true } }),
      prisma.reference.count(),
      prisma.asset.count(),
      prisma.checklist.findMany({ include: { items: true } }),
      prisma.ugcVideo.findMany(),
    ]);

    const pipeline = ['Ideia', 'Aprovado', 'Roteiro', 'Gravação', 'Publicado'].map(status => ({
      status, count: ideas.filter(i => i.status === status).length,
    }));

    const subNichoCount = {};
    for (const idea of ideas) {
      const sn = idea.subNiche?.name || 'Geral';
      subNichoCount[sn] = (subNichoCount[sn] || 0) + 1;
    }
    const topSubNiches = Object.entries(subNichoCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const pendingChecklists = checklists.filter(c => c.items.some(i => !i.done)).length;
    const staleIdeas = ideas.filter(i => i.status === 'Ideia').length;
    const readyToRecord = ideas.filter(i => i.status === 'Gravação').length;

    res.json({
      stats: {
        published: ideas.filter(i => i.status === 'Publicado').length,
        inProduction: ideas.filter(i => i.status === 'Gravação').length,
        staleIdeas,
        totalAssets: assets,
        totalReferences: references,
        totalIdeas: ideas.length,
        ugcAGravar: ugc.filter(u => u.status === 'A gravar').length,
      },
      pipeline,
      topSubNiches,
      alerts: {
        staleIdeas,
        readyToRecord,
        pendingChecklists,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
