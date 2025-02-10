import { useState, useEffect } from 'react';
import StreamingText from './StreamingText';
import LoadingDots from './LoadingDots';
import horoscopeCSV from '../assets/horoscope.csv?raw';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
}

interface ChatProps {
  onClose: () => void;
  setShowZoltar: (visible: boolean) => void;
  showZoltar: boolean;
  canStartStreaming: boolean;
}

// Simplify the interface to only include description
interface HoroscopeEntry {
  description: string;
}

const predefinedQuestion = "What do the cosmic energies reveal?";

function Chat({ onClose, setShowZoltar, showZoltar, canStartStreaming }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasAsked, setHasAsked] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeEntry[]>([]);
  const [shouldShowResponse, setShouldShowResponse] = useState(false);

  // Reset states when chat is reopened
  useEffect(() => {
    setMessages([]);
    setHasAsked(false);
    setIsThinking(false);
    setShouldShowResponse(false);
  }, []);

  useEffect(() => {
    const csvText = horoscopeCSV;
    const rows = csvText.split('\n');
    const descriptionIndex = 2; // description is the third column (index 2)
    
    const data = rows.slice(1).map(row => {
      // Split by comma but respect quotes
      const values = row.split(/,(?=(?:(?:[^\"]*\"){2})*[^\"]*$)/).map(val => val.replace(/^\"|\"$/g, ''));
      return { description: values[descriptionIndex] };
    });
    setHoroscopeData(data);
  }, []);

  const getRandomHoroscopeDescription = () => {
    if (horoscopeData.length === 0) return "The cosmic energies are currently aligning... Please try again in a moment. 🔮";
    const randomIndex = Math.floor(Math.random() * horoscopeData.length);
    return `${horoscopeData[randomIndex].description} 🔮`;
  };

  const handleQuestionClick = () => {
    setMessages(prev => [...prev, { text: predefinedQuestion, isUser: true, id: Date.now() }]);
    setHasAsked(true);
    setIsThinking(true);
    
    // Only show loading for 1 second if model is already loaded
    setTimeout(() => {
      setIsThinking(false);
      setShouldShowResponse(true);
    }, 1000);

    if (!showZoltar) {
      setShowZoltar(true);
    }
  };

  useEffect(() => {
    if (canStartStreaming && hasAsked) {  // Only add bot message if user has asked the question
      setIsThinking(false);
      setMessages(msgs => [...msgs, { 
        text: getRandomHoroscopeDescription(),
        isUser: false,
        id: Date.now()
      }]);
    }
  }, [canStartStreaming, hasAsked]);  // Add hasAsked to dependencies

  return (
    <div className="chat-interface" style={{ zIndex: 10 }}>
      <div className="chat-header">
        <h3>FutureSight AI</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.isUser ? msg.text : (
              shouldShowResponse && <StreamingText key={msg.id} text={msg.text} speed={25} />
            )}
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
