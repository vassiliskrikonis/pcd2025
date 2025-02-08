import { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
}

const StreamingText = ({ text, speed = 50 }: StreamingTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0); // Reset index when text changes
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setIndex(i => i + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, speed, text]);

  return <span>{text.substring(0, index)}</span>;
};

export default StreamingText;