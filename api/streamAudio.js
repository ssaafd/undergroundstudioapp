export default async function handler(req, res) {
  const { trackId } = req.query;

  if (!trackId) {
    return res.status(400).json({ error: 'trackId manquant' });
  }

  const audioUrl = `https://cdn1.suno.ai/tracks/${trackId}.mp3`;

  try {
    const response = await fetch(audioUrl);
    if (!response.ok) {
      return res.status(404).json({ error: 'Fichier audio introuvable sur Suno' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (error) {
    console.error('Erreur lors du streaming audio :', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
}
