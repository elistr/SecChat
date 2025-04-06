'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/chat', {
        message: userMessage.text,
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get response from the bot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-60 bg-[#001C64] flex flex-col flex-shrink-0 border-r border-[#142C8E]">
        {/* Workspace Header */}
        <div className="h-14 bg-[#001C64] border-b border-[#142C8E] px-4 flex items-center">
          <h1 className="text-white font-bold text-lg">SecChat</h1>
        </div>

        {/* Channels Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <div className="flex items-center text-[#CBD5E1] mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            {/* Active Channel */}
            <div className="flex items-center -mx-2 px-2 h-8 bg-[#0070BA] rounded text-white">
              <span className="text-sm font-medium"># general</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 border-b border-[#142C8E] px-6 flex items-center justify-between bg-[#001C64]">
          <div className="flex items-center space-x-3">
            <span className="text-white font-medium"># general</span>
            <span className="text-[#CBD5E1] text-sm">AI Bot is active</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-[#002872]">
          <div className="px-6 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="group flex items-start space-x-3 hover:bg-[#003087] rounded px-2 py-1 -mx-2"
              >
                {message.sender === 'bot' ? (
                  <div className="w-9 h-9 rounded bg-gradient-to-br from-[#0070BA] to-[#005EA6] flex items-center justify-center text-white font-medium flex-shrink-0">
                    AI
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded bg-gradient-to-br from-[#142C8E] to-[#001C64] flex items-center justify-center text-white font-medium flex-shrink-0">
                    You
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline">
                    <span className="text-white font-medium mr-2">
                      {message.sender === 'bot' ? 'AI Assistant' : 'You'}
                    </span>
                    <span className="text-xs text-[#CBD5E1]">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white mt-1 leading-relaxed break-words">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 pt-3 border-t border-[#142C8E] bg-[#001C64]">
          <form onSubmit={sendMessage} className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message AI Assistant..."
                className="w-full px-4 py-2.5 bg-[#002872] text-white rounded-lg border border-[#142C8E] focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-transparent placeholder-[#CBD5E1]"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                isLoading
                  ? 'bg-[#0070BA]/50 text-white/70 cursor-not-allowed'
                  : 'bg-[#0070BA] text-white hover:bg-[#0070BA]/90'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending</span>
                </>
              ) : (
                <span>Send</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 