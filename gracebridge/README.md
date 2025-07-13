# GraceBridge - Christian Counseling Chat Application

GraceBridge is a frontend-only React application that simulates a 3-way Christian counseling chatbot experience. It allows users to create or join a counseling session where they can interact with a simulated partner and an AI counselor that provides faith-based guidance.

## Features

- **Landing Page**: Introduction to GraceBridge with call-to-action buttons
- **Join Session**: Create a new session or join with a code
- **Waiting Room**: Display session code and wait for partner
- **Chat Interface**: 3-way conversation with user, partner, and AI counselor
- **Ad Breaks**: Support messages with countdown timer every 15 messages
- **Session End**: Thank you page with reflection journal

## Technologies Used

- React.js (with functional components and hooks)
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
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── reportWebVitals.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Notes

This is a frontend-only demonstration with no backend integration. All chat interactions are simulated using mock data and timeouts. In a production environment, this would be connected to a real-time backend service with actual AI counseling capabilities.

## Future Enhancements

- Backend integration with real-time chat functionality
- User authentication and session persistence
- Actual AI counselor integration
- Mobile app version
- Session history and saved reflections 