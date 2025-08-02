export default async function handler(req, res) {
  const { trackId } = req.query;

  if (!trackId) {
    return res.status(400).json({ error: 'Track ID manquant' });
  }

  const SUNO_API_URL = `https://studio-api.suno.ai/api/v1/song/${trackId}`;
  const MAX_RETRIES = 12;
  const RETRY_DELAY = 10000; // 10 sec

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(SUNO_API_URL, {
        headers: {
          'x-api-key': process.env.SUNO_API_KEY,
        },
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const html = await response.text();
        return res.status(502).json({
          error: 'Suno API returned non-JSON',
          detail: html.slice(0, 300),
        });
      }

      const data = await response.json();
      const mp3Url = data?.audio_url || data?.audioUrl;

      if (mp3Url) {
        return res.redirect(mp3Url);
      } else {
        console.log(`Tentative ${i + 1}/${MAX_RETRIES} – Audio pas prêt`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
      }
    } catch (err) {
      console.error('Erreur Suno API :', err);
      return res.status(500).json({
        error: 'Suno API request failed',
        detail: err.message,
      });
    }
  }

  return res.status(504).json({
    error: 'Audio non prêt après plusieurs tentatives',
  });
}