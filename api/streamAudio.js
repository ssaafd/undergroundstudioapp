// /pages/api/streamAudio.js

export default async function handler(req, res) { const { trackId } = req.query;

if (!trackId) { return res.status(400).json({ error: 'Missing trackId parameter' }); }

try { // URL du MP3 Suno (modifie ici selon ton infra si besoin) const mp3Url = https://cdn1.suno.ai/${trackId}.mp3;

// Vérifie si le fichier est dispo
const check = await fetch(mp3Url, { method: 'HEAD' });

if (check.status === 200) {
  // Redirige directement vers le MP3 pour téléchargement ou lecture
  res.writeHead(302, {
    Location: mp3Url
  });
  return res.end();
} else {
  // Fichier non encore dispo => auto-poll toutes les 10 secondes (max 60 sec)
  let attempts = 0;
  const maxAttempts = 6;
  const delay = 10000; // 10s

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, delay));
    const retry = await fetch(mp3Url, { method: 'HEAD' });
    if (retry.status === 200) {
      res.writeHead(302, {
        Location: mp3Url
      });
      return res.end();
    }
    attempts++;
  }

  return res.status(202).json({
    status: 'pending',
    message: `Track ${trackId} not ready after ${maxAttempts * 10} seconds.`
  });
}

} catch (error) { return res.status(500).json({ error: 'Internal server error', detail: error.message }); } }

