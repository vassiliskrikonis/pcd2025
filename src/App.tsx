import { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import ZoltarScene from './components/ZoltarScene';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showZoltar, setShowZoltar] = useState(false);
  const [canStartStreaming, setCanStartStreaming] = useState(false);

  const handleModelStart = () => {
    setCanStartStreaming(true);
  };

  const handleModelClick = () => {
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>FutureSight AI</h1>
        <p className="subtitle">Your window into tomorrow's possibilities</p>
      </header>
      
      <main>
        <div className="crystal-ball">🔮</div>
        <div className="description">
          <h2>Ask me about your future</h2>
          <p>
            Powered by advanced AI, FutureSight helps you explore potential futures
            and make better decisions today.
          </p>
        </div>
        
        <button className="cta-button" onClick={() => setIsChatOpen(true)}>
          Start Your Reading
        </button>
      </main>
      
      <footer>
        <p className="disclaimer">
          For entertainment purposes only. The future is yours to create.
        </p>
      </footer>

      {isChatOpen && (
        <Chat 
          onClose={() => setIsChatOpen(false)} 
          setShowZoltar={setShowZoltar} 
          showZoltar={showZoltar} 
          canStartStreaming={canStartStreaming} 
        />
      )}
      {showZoltar && (
        <ZoltarScene 
          visible={showZoltar} 
          onModelStart={handleModelStart}
          onModelClick={handleModelClick}
        />
      )}
    </div>
  );
}

export default App;
