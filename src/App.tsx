import './App.css'

function App() {
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
        
        <button className="cta-button">
          Start Your Reading
        </button>
      </main>
      
      <footer>
        <p className="disclaimer">
          For entertainment purposes only. The future is yours to create.
        </p>
      </footer>
    </div>
  )
}

export default App
