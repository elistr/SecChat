const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    // Forward the message to the bot API
    const botResponse = await axios.post('http://localhost:8000/ask_bot', {
      message: message
    });

    // Send back the bot's response
    // Assuming the bot API returns the response in botResponse.data.response
    // Adjust this based on your actual API response structure
    const responseText = botResponse.data.response || botResponse.data;
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error calling bot API:', error.message);
    res.status(500).json({ 
      error: 'Failed to get response from bot',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 