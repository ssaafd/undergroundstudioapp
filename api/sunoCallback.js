// /api/sunoCallback.js

import fs from 'fs'; import path from 'path';

const callbackFile = path.resolve('./public/music-data.json');

export default async function handler(req, res) { if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

try { const { code, msg, data } = req.body; console.log('[Suno Callback Received]', { code, msg });

if (code !== 200 || data?.callbackType !== 'complete') {
  return res.status(200).json({ status: 'ignored (not complete)' });
}

const taskId = data.task_id;
const tracks = data.data;

let previous = [];
if (fs.existsSync(callbackFile)) {
  const raw = fs.readFileSync(callbackFile);
  previous = JSON.parse(raw);
}

// Ajoute chaque track à la base
const updated = [...tracks.map(track => ({
  taskId,
  id: track.id,
  title: track.title,
  prompt: track.prompt,
  duration: track.duration,
  audio_url: track.audio_url,
  image_url: track.image_url,
  createTime: track.createTime
})), ...previous];

fs.writeFileSync(callbackFile, JSON.stringify(updated, null, 2));
console.log('[✅ Suno Track Saved]', tracks.length);

return res.status(200).json({ status: 'saved', count: tracks.length });

} catch (err) { console.error('[❌ Callback Error]', err); return res.status(500).json({ error: 'Internal Server Error' }); } }

