// /pages/api/sunoCallback.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const track = req.body;
  console.log("🎵 Nouveau track reçu :", track);

  const filePath = path.join(process.cwd(), "public", "data-music.json");
  let data = [];

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(content);
    }
  } catch (err) {
    console.error("Erreur lecture fichier :", err);
  }

  data.unshift(track); // Ajoute en haut

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: "Erreur écriture fichier" });
  }
}