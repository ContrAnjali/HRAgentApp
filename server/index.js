import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const PVA_TOKEN_ENDPOINT = process.env.PVA_TOKEN_ENDPOINT;
const PVA_SECRET = process.env.PVA_SECRET;

console.log('PVA_TOKEN_ENDPOINT:', process.env.PVA_TOKEN_ENDPOINT);
console.log('PVA_SECRET length:', process.env.PVA_SECRET?.length);

app.get('/api/directline/token', async (_req, res) => {
  try {
    const r = await fetch(PVA_TOKEN_ENDPOINT, {
      method: 'GET',
      headers: { Authorization: `Bearer ${PVA_SECRET}` }
    });

    const data = await r.json(); // { token, conversationId? ... }
    if (!r.ok) {
      return res.status(r.status).json(data); // show the Copilot error details
    }

    res.json({ token: data.token, conversationId: data.conversationId });
  } catch (e) {
    console.error('PVA token error:', e);
    res.status(500).json({ error: 'Failed to fetch PVA token' });
  }
});

app.listen(process.env.PORT || 3987, () =>
  console.log(`Token server listening on http://localhost:${process.env.PORT || 3987}`)
);
