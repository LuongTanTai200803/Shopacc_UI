// File: src/components/Chatbox.jsx (Nút bấm đã được cập nhật)

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
  const audioRef = useRef(null);
  const [playbackState, setPlaybackState] = useState('idle'); // 'idle', 'playing', 'paused'

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // useEffect để phát âm thanh từ URL của gTTS
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.from === 'bot' && lastMessage.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const newAudio = new Audio(lastMessage.audioUrl);
      newAudio.onplay = () => setPlaybackState('playing');
      newAudio.onpause = () => setPlaybackState('paused');
      newAudio.onended = () => setPlaybackState('idle');

      newAudio.play().catch(error => {
        console.error("Lỗi khi tự động phát âm thanh:", error);
        setPlaybackState('idle');
      });
      
      audioRef.current = newAudio;
    }
  }, [messages]);

  // Thiết lập và dọn dẹp kết nối Socket.IO khi mở/đóng chatbox
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 10000,
        transports: ['websocket'],
        withCredentials: true,
      });

      socketRef.current.on('connect', () => {
        console.log('Đã kết nối tới chat server!');
        setMessages([{ from: 'bot', text: 'Chào bạn, tôi có thể giúp gì cho bạn?', audioUrl: null }]);
      });

      socketRef.current.on('bot_reply', (data) => {
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message, audioUrl: data.audioUrl }]);
      });
      
      socketRef.current.on('live_reply', (data) => {
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message, audioUrl: null }]);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Đã mất kết nối với chat server.');
      });
    } else if (!isOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlaybackState('idle');
    }
    
    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() && socketRef.current) {
      const userMessage = { from: 'user', text: inputValue, audioUrl: null };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      socketRef.current.emit('user_message', { message: inputValue });
      setInputValue('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleTogglePlayback = () => {
      if (!audioRef.current) return;
      if (playbackState === 'playing') {
          audioRef.current.pause();
      } else if (playbackState === 'paused') {
          audioRef.current.play();
      }
  };

  return (
    <div className="chatbox-container">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <p>ShopACC Hỗ trợ</p>
            {playbackState !== 'idle' && (
                <button onClick={handleTogglePlayback} className="playback-btn" title={playbackState === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}>
                    {playbackState === 'playing' 
                        ? <i className="bi bi-pause-fill"></i> 
                        : <i className="bi bi-play-fill"></i>
                    }
                </button>
            )}
            <button onClick={toggleChat} className="close-btn">-</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
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
       ) : (
        // ---> NÚT BẤM ĐÃ ĐƯỢC THAY ĐỔI Ở ĐÂY <---
        <button onClick={toggleChat} className="chat-toggle-button custom-chat-button btn btn-primary rounded-pill shadow-lg d-flex align-items-center justify-content-center">
          <span className="me-3">Chat với chúng tôi</span>
          <i className="bi bi-chat-dots-fill fs-5"></i>
        </button>
      )}
    </div>
  );
};

export default Chatbox;
