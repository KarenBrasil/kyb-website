const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      include: { subNiche: true, reference: true, scripts: { select: { id: true, title: true, version: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(ideas);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const idea = await prisma.idea.create({
      data: { ...req.body, subNicheId: req.body.subNicheId || null, referenceId: req.body.referenceId || null },
      include: { subNiche: true, reference: true },
    });
    res.json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const idea = await prisma.idea.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { subNiche: true },
    });
    res.json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const idea = await prisma.idea.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { subNiche: true },
    });
    res.json(idea);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.idea.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
