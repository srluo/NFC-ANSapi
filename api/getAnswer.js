// api/getAnswer.js
import fs from "fs";
import path from "path";

// 用一個簡單的 in-memory cache 記錄，每次 Vercel cold start 會清空
// 如果需要持久化，可換成 DB（例如 KV、Firestore）
let userRecords = {};

export default function handler(req, res) {
  try {
    const { uid } = req.query; // ✅ 從 query 取 uid
    if (!uid) {
      return res.status(400).json({ error: "Missing uid" });
    }

    // 讀取 JSON 檔
    const filePath = path.join(process.cwd(), "data", "book_of_answers_384_full.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const answers = JSON.parse(fileData);

    // 初始化使用者紀錄
    if (!userRecords[uid]) {
      userRecords[uid] = {
        used: [],
        count: 0,
        date: new Date().toISOString().slice(0, 10),
      };
    }

    const today = new Date().toISOString().slice(0, 10);
    if (userRecords[uid].date !== today) {
      // 換日期就重置
      userRecords[uid] = { used: [], count: 0, date: today };
    }

    // 次數限制：每天最多 3 次
    if (userRecords[uid].count >= 3) {
      return res.status(429).json({ error: "今日抽籤次數已達上限（3次）" });
    }

    // 避免重複：從剩下的 pool 隨機取
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
      ...pick,
      remaining: 3 - userRecords[uid].count, // ✅ 額外回傳剩餘次數
    });
  } catch (error) {
    console.error("Error reading answers:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
}
