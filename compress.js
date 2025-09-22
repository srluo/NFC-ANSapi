const fs = require("fs");

// 讀取完整 JSON
const input = fs.readFileSync("./data/book_of_answers_384_full.json", "utf-8");

// 壓縮成單行字串
const compressed = JSON.stringify(JSON.parse(input));

// 輸出檔案
fs.writeFileSync("./data/book_of_answers_min.json", compressed);

console.log("✅ 壓縮完成！");
console.log("長度:", compressed.length, "字元");
console.log("➡️ 請打開 data/book_of_answers_min.json，複製內容到 Vercel 環境變數 ANSWERS_JSON");