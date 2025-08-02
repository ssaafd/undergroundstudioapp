// /pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const response = await fetch("https://api.sunoapi.org/api/v1/generate", {
    method: "POST",
    headers: {
      "Authorization": "Bearer a71b9a537cc3a41a9f3623ffd3c624e2", // TA CLÉ API
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "Deep dub reggae instrumental for meditation",
      style: "Dub, deep bass, spiritual",
      title: "Zion Dub Meditation",
      customMode: true,
      instrumental: true,
      model: "V4_5",
      callBackUrl: "https://undstudioapp.vercel.app/api/sunoCallback"
    }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}