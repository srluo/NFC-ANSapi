export default function handler(req, res) {
  try {
    const answers = JSON.parse(process.env.ANSWERS_JSON);

    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "缺少 UID" });

    // 使用今日日期作為 key
    const today = new Date().toISOString().slice(0, 10);

    // 用記憶體模擬（注意：Serverless 無法跨請求保存）
    // 👉 真正要保存「剩餘次數」請移到資料庫（如 Supabase、Firestore）
    // 這裡我們交由前端 localStorage 控制，API 單純回傳答案。

    const pick = answers[Math.floor(Math.random() * answers.length)];
    res.status(200).json({
      ...pick,
      date: today,
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "讀取答案失敗" });
  }
}
