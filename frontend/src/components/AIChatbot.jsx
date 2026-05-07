import { useState, useRef, useEffect } from "react";
import { AiOutlineRobot, AiOutlineSend, AiOutlineClose } from "react-icons/ai";
import axios from "axios";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm ZenzBot. How can I help you with your shopping today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Replace with your actual backend URL when testing locally vs production
      const { data } = await axios.post("https://zenzloom-fg7a.onrender.com/api/chat", { message: input } );
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting. Try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 1. Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineRobot size={24} />}
      </button>

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-pink-600 p-4 text-white font-bold flex justify-between items-center">
            <span>Zenzloom AI Assistant</span>
            <span className="text-xs bg-pink-800 px-2 py-1 rounded">Beta</span>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                    ? "bg-pink-600 text-white rounded-tr-none" 
                    : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 p-3 rounded-2xl text-xs animate-pulse">
                  ZenzBot is typing...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="text-pink-500 hover:text-pink-400 disabled:text-gray-500 transition-colors"
            >
              <AiOutlineSend size={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;