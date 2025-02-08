import { useState } from 'react';
import StreamingText from './StreamingText';

interface Message {
  text: string;
  isUser: boolean;
  id: number;  // Add an id to force re-render of TypewriterText
}

interface ChatProps {
  onClose: () => void;
}

function Chat({ onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isUser: true, id: Date.now() }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { 
        text: "I sense great possibilities in your future... 🔮", 
        isUser: false,
        id: Date.now()
      }]);
    }, 1000);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>FutureSight AI</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.isUser ? msg.text : <StreamingText key={msg.id} text={msg.text} speed={40} />}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your future..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
