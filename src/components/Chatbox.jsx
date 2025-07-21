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
  const audioRef = useRef(null);
  const [playbackState, setPlaybackState] = useState('idle'); // 'idle', 'playing', 'paused'

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    // Nếu có tin nhắn mới từ bot VÀ có audioUrl
    if (lastMessage && lastMessage.from === 'bot' && lastMessage.audioUrl) {
      console.log(`[AUDIO] Nhận được URL âm thanh: ${lastMessage.audioUrl}`);

      // Dừng âm thanh đang phát (nếu có)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Tạo và phát âm thanh mới
      const newAudio = new Audio(lastMessage.audioUrl);
       newAudio.onplay = () => setPlaybackState('playing');
       newAudio.onpause = () => setPlaybackState('paused');
       newAudio.onended = () => setPlaybackState('idle'); // Reset khi phát xong
      newAudio.play().catch(error => {
        // Một số trình duyệt chặn tự động phát âm thanh
        console.error("Lỗi khi tự động phát âm thanh:", error);
        console.log("Người dùng cần tương tác với trang để bật âm thanh.");
      });
      
      // Lưu lại để có thể quản lý ở lần sau
      audioRef.current = newAudio;
    }
  }, [messages]); // Hook này vẫn chạy mỗi khi có tin nhắn mới

  // Thiết lập kết nối Socket.IO
  useEffect(() => {
    // Chỉ kết nối một lần duy nhất
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
          reconnection: true,
          reconnectionAttempts: 5
      });

      socketRef.current.on('connect', () => {
        console.log('Đã kết nối tới chat server!');
        // Tin nhắn chào mừng ban đầu không cần phát âm thanh
        setMessages([{ from: 'bot', text: 'Chào bạn, tôi có thể giúp gì cho bạn?', audioUrl: null }]);
      });

      // ---> NÂNG CẤP: Lắng nghe tin nhắn từ bot <---
      // =================================================================
      // BƯỚC 2: CẬP NHẬT CÁCH LƯU TRỮ TIN NHẮN
      // =================================================================
      socketRef.current.on('bot_reply', (data) => {
        console.log("Nhận được bot_reply:", data);
        // Lưu cả văn bản và URL âm thanh vào state
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message, audioUrl: data.audioUrl }]);
      });
      
      // Lắng nghe tin nhắn từ admin (thường không có audio)
      socketRef.current.on('live_reply', (data) => {
        setMessages((prevMessages) => [...prevMessages, { from: 'bot', text: data.message, audioUrl: null }]);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Đã mất kết nối với chat server.');
      });
    }

    else if (!isOpen && socketRef.current) {
        // Dọn dẹp khi đóng chatbox
        socketRef.current.disconnect();
        socketRef.current = null;
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlaybackState('idle');
    }
  }, [isOpen]); // Chạy lại khi `isOpen` thay đổi

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
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>ShopACC Hỗ trợ</p>
            {/* ---> NÂNG CẤP: Hiển thị nút điều khiển audio <--- */}
            {playbackState !== 'idle' && (
                <button onClick={handleTogglePlayback} className="playback-btn">
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
      )}
      <button onClick={toggleChat} className="chat-toggle-button custom-chat-button btn btn-primary rounded-pill shadow-lg d-flex align-items-center justify-content-center">
        Chat với chúng tôi
        {/* Placeholder cho Icon Chat - Bạn có thể dùng Font Awesome hoặc Bootstrap Icons */}
        {/* Ví dụ: <i className="fas fa-comments"></i> */}
        
        💬
      </button>
    </div>
  );
};

export default Chatbox;
