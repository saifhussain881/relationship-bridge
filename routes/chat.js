const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// System prompt for the Christian counselor
const SYSTEM_PROMPT = `You are a wise, neutral, and empathetic Christian counselor helping two people resolve a relationship challenge. Respond with biblical encouragement, compassion, and balance. Ask thoughtful questions. Never take sides. Use Bible verses gently and only when helpful.`;

/**
 * @route   POST /api/chat
 * @desc    Process chat messages and get AI response
 * @access  Public
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing chat request:', { message: message.substring(0, 30) + '...', historyLength: history?.length || 0 });

    // Format chat history for Cohere
    const chatHistory = history.map(msg => ({
      role: 'USER',
      message: `${msg.user_name}: ${msg.message}`
    }));

    // Get response from Cohere
    const response = await cohere.chat({
      model: 'command-r-plus',
      message,
      chatHistory,
      temperature: 0.6,
      preamble: SYSTEM_PROMPT,
    });

    console.log('Received response from Cohere');

    // Return the AI response
    return res.json({ 
      reply: response.text 
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

module.exports = router; 