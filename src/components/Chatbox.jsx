// File: src/components/Chatbox.jsx

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chatbox.css'; // File CSS để tạo kiểu cho chatbox

// Lấy địa chỉ backend từ biến môi trường
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Thiết lập kết nối Socket.IO
  useEffect(() => {
    // Chỉ kết nối một lần duy nhất
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],  // Ép chỉ dùng websocket
      withCredentials: true,       // Nếu backend yêu cầu CORS gửi cookie
      reconnectionAttempts: 10,   // Thử lại tối đa 10 lần nếu fail
      reconnectionDelay: 2000,    // Mỗi lần cách 1 giây
      timeout: 10000              // Chờ tối đa 20 giây để kết nối
    });
    

      socketRef.current.on('connect', () => {
        console.log('Đã kết nối tới chat server!');
        // Thêm tin nhắn chào mừng khi kết nối thành công
        setMessages([{ from: 'bot', text: 'Chào bạn, tôi có thể giúp gì cho bạn?' }]);
      });

      // Lắng nghe tin nhắn từ bot
      socketRef.current.on('bot_reply', (data) => {
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message }]);
      });
      
      // Lắng nghe tin nhắn từ admin
      socketRef.current.on('live_reply', (data) => {
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message }]);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Đã mất kết nối với chat server.');
      });
    }

    // Dọn dẹp kết nối khi component bị hủy
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && socketRef.current) {
      const userMessage = { from: 'user', text: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      
      // Gửi tin nhắn lên server
      socketRef.current.emit('user_message', { message: inputValue });
      
      setInputValue('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbox-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>ShopACC Hỗ trợ</p>
            <button onClick={toggleChat} className="close-btn">-</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoComplete="off"
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      )}
      <button onClick={toggleChat} className="chat-toggle-button">
        💬
      </button>
    </div>
  );
};

export default Chatbox;
