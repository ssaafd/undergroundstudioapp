export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenue dans Underground Studio</h1>
      <p>Accède à <a href="/test.html">test.html</a> pour tester un stream audio.</p>
    </div>
  );<button onclick="generateSong()">🎶 Générer musique Suno</button>
<script>
  async function generateSong() {
    const res = await fetch("/api/generate", { method: "POST" });
    const data = await res.json();
    alert("Track lancé : " + (data.data?.taskId || "erreur"));
  }
</script>
}
