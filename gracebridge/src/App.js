import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import JoinPage from './pages/JoinPage';
import WaitingRoomPage from './pages/WaitingRoomPage';
import SessionPage from './pages/SessionPage';
import SessionEndPage from './pages/SessionEndPage';

function App() {
  return (
    <div className="min-h-screen font-inter bg-gradient-to-b from-blue-50 to-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/waiting" element={<WaitingRoomPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/session-end" element={<SessionEndPage />} />
      </Routes>
    </div>
  );
}

export default App; 