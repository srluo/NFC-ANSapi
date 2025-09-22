export default function handler(req, res) {
  try {
    // 1. 從環境變數讀取 JSON
    const raw = process.env.BOOK_OF_ANSWERS;
    if (!raw) {
      return res.status(500).json({ error: "BOOK_OF_ANSWERS not set" });
    }

    const answers = JSON.parse(raw);

    // 2. 隨機抽取一筆
    const pick = answers[Math.floor(Math.random() * answers.length)];

    // 3. 回傳
    res.status(200).json(pick);

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
