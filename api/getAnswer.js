// /api/getAnswer.js
export default function handler(req, res) {
  try {
    const answers = JSON.parse(process.env.BOOK_OF_ANSWERS);

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(500).json({ error: "BOOK_OF_ANSWERS is empty or invalid" });
    }

    const pick = answers[Math.floor(Math.random() * answers.length)];

    res.status(200).json({
      success: true,
      answer: pick,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "BOOK_OF_ANSWERS not configured or parse failed" });
  }
}
