import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/generate';  // Updated URL to match the Flask backend

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Handle sending the message
  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');  // Clear input field

      try {
        // Send the message to the backend
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),  // Key should match Flask backend
        });

        const data = await response.json();
        const botMessage = { text: data.response, sender: 'bot' };
        setMessages([...messages, userMessage, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { text: 'Sorry, there was an error. Please try again.', sender: 'bot' };
        setMessages([...messages, userMessage, errorMessage]);
      }
    }
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="App">
      {/* Chatbox Container */}
      <div className="chat-container">
        <div className="chat-header">
          <h5>AI Student Assistant</h5>
        </div>

        {/* Chat History */}
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input and Send Button */}
        <div className="chat-footer">
          <input
            type="text"
            className="form-control"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
