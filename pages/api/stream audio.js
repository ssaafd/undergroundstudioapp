export default async function handler(req, res) {
  const { trackId } = req.query;

  if (!trackId) {
    return res.status(400).json({ error: "Missing trackId" });
  }

  const audioUrl = `https://cdn1.suno.ai/tracks/${trackId}.mp3`;

  try {
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error('Audio not ready');

    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (err) {
    res.status(503).json({ error: "Track not ready or doesn't exist yet" });
  }
}
