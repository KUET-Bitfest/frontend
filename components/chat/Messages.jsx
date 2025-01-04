"use client"
import { useEffect, useRef } from 'react';
import Message from './Message';

export default function Messages({ messages }) {
  const messagesEndRef = useRef(null);
  console.log(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFileNameFromUrl = (url) => {
    if (!url) return null;
    // Split by '/' and get the last part
    const parts = url.split('/');
    // Get the last part and remove any UUID if present
    const fullName = parts[parts.length - 1];
    // Remove the UUID part (assuming UUID_filename format)
    const nameWithoutUuid = fullName.split('_').slice(1).join('_');
    // Decode URI to handle special characters
    return decodeURIComponent(nameWithoutUuid);
  };

  return (
    <div className="p-4 space-y-4">
      {messages.map(message => (
        <Message 
          key={message.id}
          type={message.type}
          message={message.message}
          image={message.image}
          fileName={message.file_url ? getFileNameFromUrl(message.file_url) : null}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 