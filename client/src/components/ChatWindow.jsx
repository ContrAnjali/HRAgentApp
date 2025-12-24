
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const ChatWindow = ({ initialMessage, onBack }) => {
  const { t, validateInputLanguage } = useLanguage();

  // Format timestamp like 02:22 am
  const formatTime = (ts) => {
    const d = new Date(ts);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const [messages, setMessages] = useState([
    { sender: "bot-message", text: t("botWelcome"), timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Guards / refs
  const initialHandled = useRef(false);      // ensure initialMessage is processed once
  const initialTimeoutRef = useRef(null);    // initial bot reply timer
  const sendTimeoutRef = useRef(null);       // send-time bot reply timer

  // --- Bot response resolver ---
  const getBotResponse = useCallback(
    (userMessage) => {
      const message = (userMessage || "").toLowerCase();

      if (
        message.includes("referral") ||
        message.includes("bonus") ||
        message.includes("referencia") ||
        message.includes("bono")
      ) {
        return t("referralBonusResponse");
      } else if (
        message.includes("leave") ||
        message.includes("time off") ||
        message.includes("licencia") ||
        message.includes("vacaciones")
      ) {
        return t("leaveTypesResponse");
      } else if (
        message.includes("refer") ||
        message.includes("referral process") ||
        message.includes("referir")
      ) {
        return t("referralProcessResponse");
      } else if (
        message.includes("harassment") ||
        message.includes("report") ||
        message.includes("acoso") ||
        message.includes("reportar")
      ) {
        return t("harassmentResponse");
      } else {
        return t("processingRequest");
      }
    },
    [t]
  );

  /**
   * INITIAL MESSAGE (runs once, no duplicates)
   * IMPORTANT: Do NOT clear initialTimeout in cleanup — StrictMode's test unmount
   * would cancel the timer and suppress the bot reply in dev.
   */
  useEffect(() => {
    if (!initialMessage || initialHandled.current) return;
    initialHandled.current = true;

    // Add the initial user message
    setMessages((prev) => [
      ...prev,
      { sender: "user-message", text: initialMessage, timestamp: Date.now() },
    ]);

    // Simulate typing + delayed bot reply
    setIsTyping(true);
    initialTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot-message",
          text: getBotResponse(initialMessage),
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
      initialTimeoutRef.current = null;
    }, 300);

    // 🚫 No cleanup here to avoid StrictMode cancelling the initial reply.
  }, [initialMessage, getBotResponse]);

  // --- Input change ---
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);

    if (newValue.length > 3) {
      validateInputLanguage(newValue);
    }
  };

  // --- Send message (user) ---
  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user-message", text, timestamp: Date.now() },
    ]);
    setInput("");

    // Simulate bot reply
    setIsTyping(true);
    // Clear any prior send-timer to avoid overlap
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
      sendTimeoutRef.current = null;
    }
    sendTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot-message",
          text: getBotResponse(text),
          timestamp: Date.now(),          
        },
      ]);
      setIsTyping(false);
      sendTimeoutRef.current = null;

      // Auto-scroll to bottom after bot reply
      const chatWindow = document.querySelector('.chat-window-container');
      if (chatWindow) {
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: 'smooth'
        });       
      }

    }, 1500);
  };

  // --- Enter to send ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();      
    }
  };

  /**
   * Cleanup send-time timers on unmount (safe; does not affect the initial timer
   * which we intentionally keep to survive StrictMode dev double-mount).
   */
  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
        sendTimeoutRef.current = null;
      }
      // We intentionally do NOT clear initialTimeoutRef here to avoid the dev-only
      // StrictMode false-unmount cancelling the initial reply.
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-window chat-window-container">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user-message";
          return (
            <div
              key={index}
              className={`message ${isUser ? "user-message" : "bot-message"}`}
            >
              {/* Meta header: avatar + name + time */}
              <div className="message-meta">
                <span className={`avatar ${isUser ? "user-avatar" : "bot-avatar"}`}>
                  {/* Replace with <img src="/you.png" /> / <img src="/bot.png" /> if you have icons */}
                  {isUser ? <img src="assets/3d_avatar.png" alt="User Icon" className='user-icon' /> : <img src="assets/3d_avatar.png" alt="User Icon" className='user-icon' />}
                </span>
                <div className="meta-text">
                  <span className="name">
                    {/* {isUser ? t("youLabel") || "You" : t("botName") || "EG Assist"} */}
                    {isUser ? "You" : "EG Assist"}
                  </span>
                  <span className="time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>

              {/* Bubble */}
              <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
      </div>

      <div className="message-input">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          placeholder={t("typeMessage")}
          onKeyDown={handleKeyDown}
        />
        <button          
          className={`send-button ${!input.trim() ? 'disabled' : ''}`}
          onClick={handleSend}
          title={t("send")}
          disabled={!input.trim()}
          type="button">
          <img src="assets/send-arrow.svg" alt={t('send')} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
