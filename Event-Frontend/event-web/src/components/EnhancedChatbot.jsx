import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';

const EnhancedChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const API_KEY = "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";

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'WSP ChatBot',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: userText }],
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      const botText = data.choices?.[0]?.message?.content || 'No response received.';
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Error: ' + error.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Chat cleared! How can I help you today?',
      timestamp: new Date()
    }]);
  };

  const goBack = () => {
    navigate("/events");
  };

  return (
    <div 
      className="min-vh-100 position-relative d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: 'url("../../assests/image2.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed',
        backgroundColor: '#000',
        padding: '20px'
      }}
    >
      {/* Dark overlay matching EventsPage */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}></div>
      
      {/* Back Button */}
      <button 
        className="btn btn-outline-light btn-lg position-fixed"
        onClick={goBack}
        style={{ 
          top: '20px', 
          left: '20px',
          borderRadius: '50px',
          zIndex: 1001,
          padding: '10px 20px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        ← Back
      </button>

      <div className="chat-container position-relative" style={{
        width: '500px',
        maxWidth: '90vw',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden'
      }}>
        
        {/* Chat Header */}
        <div className="chat-header d-flex justify-content-between align-items-center position-relative" style={{
          background: 'linear-gradient(135deg, #800000, #a00000)',
          color: '#fff',
          padding: '25px 30px',
          borderRadius: '30px 30px 0 0'
        }}>
          {/* Decorative pattern */}
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
                 backgroundSize: '30px 30px'
               }}></div>
          
          <div className="d-flex align-items-center position-relative">
            <div className="me-3 position-relative" style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              🤖
              {/* Glow effect */}
              <div className="position-absolute w-100 h-100 rounded-circle"
                   style={{
                     background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                     animation: 'glow 3s ease-in-out infinite alternate'
                   }}></div>
            </div>
            <div>
              <h4 className="mb-1 fw-bold">AI Assistant</h4>
              <div className="d-flex align-items-center">
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#28a745',
                  borderRadius: '50%',
                  marginRight: '8px',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 10px #28a745'
                }}></div>
                <small className="opacity-90">Online & Ready</small>
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-center position-relative">
            <button 
              className="btn btn-sm me-3"
              onClick={clearChat}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px',
                padding: '8px 16px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatBoxRef}
          className="chat-box"
          style={{
            padding: '25px',
            height: '450px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            position: 'relative'
          }}
        >
          {/* Background pattern */}
          <div className="position-absolute top-0 start-0 w-100 h-100 opacity-3"
               style={{
                 backgroundImage: 'radial-gradient(circle at 25% 25%, #800000 1px, transparent 1px), radial-gradient(circle at 75% 75%, #800000 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}></div>
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message mb-4 position-relative ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              style={{
                display: 'flex',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                animation: 'slideInUp 0.4s ease-out'
              }}
            >
              {/* Avatar */}
              <div className="avatar me-2 ms-2 position-relative" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                background: message.type === 'user' 
                  ? 'linear-gradient(135deg, #800000, #a00000)' 
                  : 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                flexShrink: 0,
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                {message.type === 'user' ? '👤' : '🤖'}
              </div>
              
              {/* Message Content */}
              <div className="message-content position-relative" style={{
                maxWidth: '75%',
                background: message.type === 'user' 
                  ? 'linear-gradient(135deg, #800000, #a00000)' 
                  : 'rgba(255, 255, 255, 0.95)',
                color: message.type === 'user' ? '#fff' : '#333',
                padding: '15px 20px',
                borderRadius: message.type === 'user' 
                  ? '25px 25px 5px 25px' 
                  : '25px 25px 25px 5px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: message.type === 'bot' ? '2px solid rgba(128, 0, 0, 0.1)' : 'none',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Message indicator */}
                <div className="position-absolute"
                     style={{
                       width: '0',
                       height: '0',
                       borderStyle: 'solid',
                       [message.type === 'user' ? 'right' : 'left']: '-8px',
                       bottom: '12px',
                       borderWidth: message.type === 'user' ? '8px 0 8px 8px' : '8px 8px 8px 0',
                       borderColor: message.type === 'user' 
                         ? 'transparent transparent transparent #800000'
                         : 'transparent #fff transparent transparent'
                     }}></div>
                
                <div 
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(message.content)
                  }}
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.5',
                    margin: 0
                  }}
                />
                <div className="message-time mt-2" style={{
                  fontSize: '12px',
                  opacity: 0.7,
                  textAlign: message.type === 'user' ? 'right' : 'left',
                  fontWeight: '500'
                }}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="message bot-message mb-4 position-relative" style={{
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <div className="avatar me-2" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}>
                🤖
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '15px 20px',
                borderRadius: '25px 25px 25px 5px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(128, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input p-4" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 255, 0.95))',
          borderTop: '2px solid rgba(128, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="input-group position-relative">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{
                border: '2px solid rgba(128, 0, 0, 0.2)',
                borderRadius: '30px',
                padding: '15px 25px',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#800000';
                e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 0.2rem rgba(128, 0, 0, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(128, 0, 0, 0.2)';
                e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)';
              }}
            />
            <button
              className="btn ms-3 position-relative"
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              style={{
                background: 'linear-gradient(135deg, #800000, #a00000)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 25px',
                minWidth: '100px',
                boxShadow: '0 6px 20px rgba(128, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
                fontSize: '16px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(128, 0, 0, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(128, 0, 0, 0.4)';
              }}
            >
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '18px', height: '18px' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Sending
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <span className="me-2">Send</span>
                  <span style={{ fontSize: '18px' }}>➤</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          }
          to {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.8), 0 0 10px #28a745;
          }
          70% {
            box-shadow: 0 0 0 15px rgba(40, 167, 69, 0), 0 0 10px #28a745;
          }
          100% {
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0), 0 0 10px #28a745;
          }
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #800000;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .chat-box::-webkit-scrollbar {
          width: 8px;
        }

        .chat-box::-webkit-scrollbar-track {
          background: rgba(128, 0, 0, 0.1);
          border-radius: 10px;
        }

        .chat-box::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #800000, #a00000);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .chat-box::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #a00000, #c00000);
        }

        .message-content:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default EnhancedChatbot;