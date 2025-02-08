import { useState } from 'react';
import StreamingText from './StreamingText';
import LoadingDots from './LoadingDots';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
}

interface ChatProps {
  onClose: () => void;
}

const predefinedQuestion = "What do the cosmic energies reveal?";
const botResponse = "I sense a shifting in the ethereal planes... The cosmic winds whisper of transformative energies aligning in your realm. Ancient wisdom suggests remaining receptive to the subtle vibrations that guide your path... 🔮";

function Chat({ onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasAsked, setHasAsked] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleQuestionClick = () => {
    setMessages(prev => [...prev, { text: predefinedQuestion, isUser: true, id: Date.now() }]);
    setHasAsked(true);
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setMessages(msgs => [...msgs, { 
        text: botResponse,
        isUser: false,
        id: Date.now()
      }]);
    }, 2000);
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
            {msg.isUser ? msg.text : <StreamingText key={msg.id} text={msg.text} speed={25} />}
          </div>
        ))}
        {isThinking && <LoadingDots />}
      </div>
      <div className="questions-container">
        <button
          onClick={handleQuestionClick}
          className={`question-button ${hasAsked ? 'asked' : ''}`}
          disabled={hasAsked}
        >
          {predefinedQuestion}
        </button>
      </div>
    </div>
  );
}

export default Chat;
