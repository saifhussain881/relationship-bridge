import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center container-custom py-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">GraceBridge</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            A space for healing, guided by grace.
          </p>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto">
            Connect with your partner and our AI counselor for faith-based guidance, 
            support, and spiritual growth in a safe, confidential environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/join" 
              className="btn-primary text-center px-8 py-3 text-lg"
            >
              Start Session
            </Link>
            <button 
              onClick={() => {
                document.getElementById('learn-more').scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-center px-8 py-3 text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
        
        <div id="learn-more" className="mt-24 max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">How GraceBridge Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-primary">1</div>
              <h3 className="font-bold mb-2">Create a Session</h3>
              <p className="text-gray-600">
                Start a private session and invite your partner to join using a unique code.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-primary">2</div>
              <h3 className="font-bold mb-2">Share Your Concerns</h3>
              <p className="text-gray-600">
                Discuss your relationship challenges in a safe, guided environment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4 text-primary">3</div>
              <h3 className="font-bold mb-2">Receive Guidance</h3>
              <p className="text-gray-600">
                Get Biblical wisdom and practical advice from our AI counselor.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/join" className="btn-primary px-8 py-3">
              Begin Your Journey
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} GraceBridge - A Christian Counseling Service
          </p>
          <p className="text-gray-500 text-xs mt-1">
            This is a demonstration project. Not affiliated with any organization.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 