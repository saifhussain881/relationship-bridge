import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import DonateButton from '../components/DonateButton';

const SessionEndPage = () => {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReflection = (e) => {
    e.preventDefault();
    // In a real app, this would save the reflection to a database
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-lavender rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-primary">✝️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-primary mb-2">
              Thank You for Using GraceBridge
            </h1>
            
            <p className="text-gray-600">
              We pray that this conversation has brought healing and guidance to your relationship.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Scripture for Reflection</h2>
            <div className="bg-lavender p-4 rounded-md italic">
              "Therefore encourage one another and build each other up, just as in fact you are doing."
              <div className="text-right font-medium mt-2">— 1 Thessalonians 5:11</div>
            </div>
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmitReflection} className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Journal Your Thoughts</h2>
              <p className="text-sm text-gray-600 mb-3">
                Take a moment to reflect on your conversation. What insights did you gain? 
                How do you feel God is guiding you?
              </p>
              
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Share your reflections here (optional)..."
              ></textarea>
              
              <button
                type="submit"
                className="mt-3 btn-primary py-2 px-4"
              >
                Save Reflection
              </button>
            </form>
          ) : (
            <div className="mb-8 bg-green-50 p-4 rounded-md">
              <p className="text-green-700">
                Your reflection has been saved. Thank you for sharing your thoughts.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="btn-primary text-center py-2 px-6">
              Start New Session
            </Link>
            
            <DonateButton />
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} GraceBridge - A Christian Counseling Service
          </p>
          <p className="text-gray-500 text-xs mt-1">
            "For where two or three gather in my name, there am I with them." — Matthew 18:20
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SessionEndPage; 