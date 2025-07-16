# GraceBridge - Christian Counseling Chat Application

GraceBridge is a React application with a Node.js backend that provides a 3-way Christian counseling chatbot experience. It allows users to create or join a counseling session where they can interact with a partner and an AI counselor that provides faith-based guidance.

## Features

- **Landing Page**: Introduction to GraceBridge with call-to-action buttons
- **Join Session**: Create a new session or join with a code
- **Waiting Room**: Display session code and wait for partner
- **Chat Interface**: 3-way conversation with user, partner, and AI counselor
- **Ad Breaks**: Support messages with countdown timer every 15 messages
- **Session End**: Thank you page with reflection journal

## Technologies Used

- React.js (with functional components and hooks)
- Node.js and Express for backend
- Socket.io for real-time communication
- Cohere AI for counseling responses
- React Router v6 for navigation
- Tailwind CSS for styling
- Google Fonts (Inter/Nunito)

## Project Structure

```
gracebridge/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AdBlock.jsx
│   │   ├── ChatInput.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── DonateButton.jsx
│   │   ├── Header.jsx
│   │   └── TypingIndicator.jsx
│   ├── pages/
│   │   ├── JoinPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── SessionEndPage.jsx
│   │   ├── SessionPage.jsx
│   │   └── WaitingRoomPage.jsx
│   ├── services/
│   │   └── socketService.js
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── reportWebVitals.js
├── routes/
│   └── chat.js
├── server.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 14+ installed
- A Cohere API key (sign up at https://cohere.ai/)

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Cohere API key:
   ```
   COHERE_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

We've provided several options for deploying GraceBridge for free:

### Quick Deploy

Run our deployment helper script:
```
npm run deploy:helper
```

This will guide you through the deployment preparation process.

### Deployment Options

For detailed deployment instructions to various platforms including Render.com, Heroku, Glitch, and Vercel, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Notes

The application uses Cohere AI for generating counseling responses. You'll need a valid Cohere API key for the counselor functionality to work properly.

## Future Enhancements

- User authentication and session persistence
- Enhanced AI counselor capabilities
- Mobile app version
- Session history and saved reflections 