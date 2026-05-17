require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── ROTAS ────────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/references',  require('./routes/references'));
app.use('/api/ideas',       require('./routes/ideas'));
app.use('/api/assets',      require('./routes/assets'));
app.use('/api/scripts',     require('./routes/scripts'));
app.use('/api/prompts',     require('./routes/prompts'));
app.use('/api/checklists',  require('./routes/checklists'));
app.use('/api/ugc',         require('./routes/ugc'));
app.use('/api/library',     require('./routes/library'));
app.use('/api/acervo',      require('./routes/acervo'));
app.use('/api/tools',       require('./routes/tools'));
app.use('/api/subniches',   require('./routes/subniches'));
app.use('/api/metadata',    require('./routes/metadata'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', system: 'KyB CRM', version: '1.0.0' }));

app.listen(PORT, () => {
  console.log(`\n🟢 KyB CRM Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:5173\n`);
});
