const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.json())

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwcpaQUHP9nf49QXrxVffHJCJ3Xxc5cwasIi9Hq0wM5oGWaFTLvPvBgWDTiUeTzpFZH/exec'  // ←改成GAS網址

app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events
    if (!events || events.length === 0) return res.sendStatus(200)

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text
        const userId = event.source.userId
        const timestamp = new Date().toISOString()

        // 呼叫 GAS，把資料傳過去
        await axios.post(GAS_URL, 
  {
    userId: userId,
    message: userMessage,
    timestamp: timestamp
  },
  {
    headers: { "Content-Type": "application/json" }
  }
)

        console.log(`✅ 已送出到 GAS：${userId} - ${userMessage}`)
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('❌ Error sending to GAS:', error)
    res.sendStatus(500)
  }
})

app.get('/', (req, res) => {
  res.send("LINE Webhook is running")
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})



