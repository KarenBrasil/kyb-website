const router = require('express').Router();

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL obrigatória' });
  try {
    const ogs = require('open-graph-scraper');
    const { result } = await ogs({ url });
    res.json({
      title: result.ogTitle || result.twitterTitle || '',
      description: result.ogDescription || result.twitterDescription || '',
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || '',
      siteName: result.ogSiteName || '',
    });
  } catch {
    res.json({ title: '', description: '', image: '', siteName: '' });
  }
});

module.exports = router;
