// Fichier : /api/streamAudio.js
export default async function handler(req, res) {
  const { trackId } = req.query;

  if (!trackId) {
    return res.status(400).json({ error: "trackId manquant" });
  }

  const sunoUrl = `https://cdn1.suno.ai/audio/${trackId}.mp3`;

  try {
    const response = await fetch(sunoUrl);
    if (!response.ok) {
      return res.status(404).json({ error: "Audio introuvable chez Suno" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename=track-${trackId}.mp3`);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur", message: error.message });
  }
}
