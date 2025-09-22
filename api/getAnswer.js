// api/getAnswer.js
let userRecords = {}; // 紀錄每日使用次數（in-memory）

export default function handler(req, res) {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    // 讀取環境變數
    const answers = JSON.parse(process.env.BOOK_OF_ANSWERS);
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(500).json({ error: "BOOK_OF_ANSWERS not configured or empty" });
    }

    // 初始化使用者紀錄
    const today = new Date().toISOString().slice(0, 10);
    if (!userRecords[uid] || userRecords[uid].date !== today) {
      userRecords[uid] = { used: [], count: 0, date: today };
    }

    // 次數限制
    if (userRecords[uid].count >= 3) {
      return res.status(429).json({ error: "今日抽籤次數已達上限（3次）" });
    }

    // 避免重複
    let available = answers.filter(a => !userRecords[uid].used.includes(a.id));
    if (available.length === 0) {
      available = [...answers];
      userRecords[uid].used = [];
    }

    const pick = available[Math.floor(Math.random() * available.length)];

    // 更新紀錄
    userRecords[uid].used.push(pick.id);
    userRecords[uid].count++;

    res.status(200).json({
      success: true,
      ...pick,
      remaining: 3 - userRecords[uid].count,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
