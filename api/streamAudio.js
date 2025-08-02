export default async function handler(req, res) {
  const { trackId } = req.query;
  if (!trackId) {
    return res.status(400).json({ error: "Missing trackId" });
  }

  const apiKey = process.env.SUNO_API_KEY;
  const maxAttempts = 6;
  let attempt = 0;
  let taskData = null;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(`https://studio-api.suno.ai/api/tasks/${trackId}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });

      const result = await response.json();
      taskData = result?.audio_url || result?.audio_url_with_metadata;

      if (taskData) {
        const mp3Url = result.audio_url || result.audio_url_with_metadata;
        return res.redirect(mp3Url);
      }
    } catch (err) {
      return res.status(500).json({ error: "Suno API request failed", detail: err.message });
    }

    // Attente 10s avant nouvelle tentative
    await new Promise(resolve => setTimeout(resolve, 10000));
    attempt++;
  }

  return res.status(404).json({ error: "MP3 not ready after retries" });
}