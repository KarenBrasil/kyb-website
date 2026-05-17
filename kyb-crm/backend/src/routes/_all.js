// ─── ASSETS ───────────────────────────────────────────────────────────────────
const assetsRouter = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

assetsRouter.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const where = type && type !== 'Todos' ? { type } : {};
    const assets = await prisma.asset.findMany({ where, include: { subNiche: true }, orderBy: { createdAt: 'desc' } });
    res.json(assets);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
assetsRouter.post('/', async (req, res) => {
  try {
    const asset = await prisma.asset.create({ data: { ...req.body, subNicheId: req.body.subNicheId || null }, include: { subNiche: true } });
    res.json(asset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
assetsRouter.patch('/:id/usage', async (req, res) => {
  try {
    const asset = await prisma.asset.update({ where: { id: parseInt(req.params.id) }, data: { usageCount: { increment: 1 } } });
    res.json(asset);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
assetsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.asset.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.assetsRouter = assetsRouter;

// ─── SCRIPTS ──────────────────────────────────────────────────────────────────
const scriptsRouter = require('express').Router();
scriptsRouter.get('/', async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({ include: { idea: { select: { id: true, title: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(scripts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
scriptsRouter.post('/', async (req, res) => {
  try {
    const script = await prisma.script.create({ data: { ...req.body, ideaId: req.body.ideaId || null }, include: { idea: true } });
    res.json(script);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
scriptsRouter.put('/:id', async (req, res) => {
  try {
    const script = await prisma.script.update({ where: { id: parseInt(req.params.id) }, data: req.body, include: { idea: true } });
    res.json(script);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
scriptsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.script.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.scriptsRouter = scriptsRouter;

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const promptsRouter = require('express').Router();
promptsRouter.get('/', async (req, res) => {
  try {
    const prompts = await prisma.prompt.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(prompts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
promptsRouter.post('/', async (req, res) => {
  try {
    const prompt = await prisma.prompt.create({ data: req.body });
    res.json(prompt);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
promptsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.prompt.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.promptsRouter = promptsRouter;

// ─── CHECKLISTS ───────────────────────────────────────────────────────────────
const checklistsRouter = require('express').Router();
checklistsRouter.get('/', async (req, res) => {
  try {
    const cls = await prisma.checklist.findMany({ include: { items: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' } });
    res.json(cls);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
checklistsRouter.post('/', async (req, res) => {
  try {
    const { name, ideaTitle, ideaId, items } = req.body;
    const cl = await prisma.checklist.create({
      data: { name, ideaTitle, ideaId: ideaId || null, items: { create: items.map((label, i) => ({ label, order: i })) } },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    res.json(cl);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
checklistsRouter.patch('/items/:itemId/toggle', async (req, res) => {
  try {
    const item = await prisma.checklistItem.findUnique({ where: { id: parseInt(req.params.itemId) } });
    const updated = await prisma.checklistItem.update({ where: { id: parseInt(req.params.itemId) }, data: { done: !item.done } });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
checklistsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.checklist.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.checklistsRouter = checklistsRouter;

// ─── UGC ──────────────────────────────────────────────────────────────────────
const ugcRouter = require('express').Router();
ugcRouter.get('/', async (req, res) => {
  try {
    const ugc = await prisma.ugcVideo.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(ugc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
ugcRouter.post('/', async (req, res) => {
  try {
    const ugc = await prisma.ugcVideo.create({ data: req.body });
    res.json(ugc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
ugcRouter.patch('/:id/status', async (req, res) => {
  try {
    const ugc = await prisma.ugcVideo.update({ where: { id: parseInt(req.params.id) }, data: { status: req.body.status } });
    res.json(ugc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
ugcRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.ugcVideo.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.ugcRouter = ugcRouter;

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
const libraryRouter = require('express').Router();
libraryRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const where = search ? { OR: [{ title: { contains: search } }, { category: { contains: search } }, { tags: { contains: search } }] } : {};
    const items = await prisma.libraryItem.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
libraryRouter.post('/', async (req, res) => {
  try {
    const item = await prisma.libraryItem.create({ data: { ...req.body, tags: Array.isArray(req.body.tags) ? req.body.tags.join(',') : req.body.tags || '' } });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
libraryRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.libraryItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.libraryRouter = libraryRouter;

// ─── ACERVO ───────────────────────────────────────────────────────────────────
const acervoRouter = require('express').Router();
acervoRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'Todos' ? { category } : {};
    const items = await prisma.acervoItem.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
acervoRouter.post('/', async (req, res) => {
  try {
    const item = await prisma.acervoItem.create({ data: req.body });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
acervoRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.acervoItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.acervoRouter = acervoRouter;

// ─── TOOLS ────────────────────────────────────────────────────────────────────
const toolsRouter = require('express').Router();
toolsRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'Todos' ? { category } : {};
    const tools = await prisma.tool.findMany({ where, orderBy: { name: 'asc' } });
    res.json(tools);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
toolsRouter.post('/', async (req, res) => {
  try {
    const tool = await prisma.tool.create({ data: req.body });
    res.json(tool);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
toolsRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.tool.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.toolsRouter = toolsRouter;

// ─── SUB-NICHOS ───────────────────────────────────────────────────────────────
const subnichesRouter = require('express').Router();
subnichesRouter.get('/', async (req, res) => {
  try {
    const subniches = await prisma.subNiche.findMany({ orderBy: { name: 'asc' } });
    res.json(subniches);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
subnichesRouter.post('/', async (req, res) => {
  try {
    const sn = await prisma.subNiche.create({ data: req.body });
    res.json(sn);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports.subnichesRouter = subnichesRouter;
