import { useState } from 'react'
import './App.css'
import Chat from './components/Chat'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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

      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}

export default App
