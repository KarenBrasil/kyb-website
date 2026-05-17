const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { search, subNiche } = req.query;
    const where = {};
    if (search) where.OR = [
      { customTitle: { contains: search } },
      { summary: { contains: search } },
    ];
    if (subNiche && subNiche !== 'Todos') where.subNiche = { name: subNiche };
    const refs = await prisma.reference.findMany({
      where, include: { subNiche: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(refs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { url, customTitle, summary, adaptation, score, subNicheId, originalTitle, thumbnail } = req.body;
    const ref = await prisma.reference.create({
      data: { url, customTitle, summary, adaptation, score: score || 3, subNicheId: subNicheId || null, originalTitle, thumbnail },
      include: { subNiche: true },
    });
    res.json(ref);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const ref = await prisma.reference.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { subNiche: true },
    });
    res.json(ref);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.reference.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
