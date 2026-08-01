import { useState, useRef, useEffect } from "react";
import { 
  AiOutlineRobot, 
  AiOutlineSend, 
  AiOutlineClose, 
  AiOutlineReload, 
  AiOutlineRight 
} from "react-icons/ai";
import axios from "axios";

// 1. Static Hybrid FAQ Flow Tree
const FAQ_TREE = [
  {
    id: "orders",
    title: "📦 Orders & Tracking",
    subcategories: [
      {
        id: "track_order",
        label: "How do I track my order?",
        answer: "You can track your order in real-time under 'My Orders' in your account profile by clicking 'Track Package'."
      },
      {
        id: "cancel_order",
        label: "Can I cancel my order?",
        answer: "Orders can be canceled within 2 hours of placement via 'My Orders'. If dispatched, you can refuse delivery upon arrival."
      }
    ]
  },
  {
    id: "shipping",
    title: "🚚 Shipping & Delivery",
    subcategories: [
      {
        id: "delivery_time",
        label: "What are the standard delivery times?",
        answer: "Standard delivery takes 3–5 business days for metro areas and 5–7 business days for other regions."
      },
      {
        id: "shipping_charges",
        label: "Are there any shipping charges?",
        answer: "We offer FREE delivery on all orders above ₹499. Orders below ₹499 incur a small ₹49 delivery fee."
      }
    ]
  },
  {
    id: "returns",
    title: "🔄 Returns & Refunds",
    subcategories: [
      {
        id: "return_policy",
        label: "What is the return policy?",
        answer: "We offer a 7-day hassle-free return window for unused items in original packaging with tags intact."
      },
      {
        id: "refund_time",
        label: "When will I receive my refund?",
        answer: "Refunds are processed within 3-5 business days back to your original payment method after quality inspection."
      }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    role: "ai",
    type: "options",
    text: "Hi! I'm ZenzBot. Choose a topic below for instant help, or type your question below!"
  }
];

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // RESET CHAT HANDLER
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setIsLoading(false);
  };

  // CATEGORY SELECT HANDLER
  const handleSelectCategory = (category) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: category.title },
      {
        role: "ai",
        type: "subcategories",
        text: `Frequent queries about ${category.title}:`,
        options: category.subcategories
      }
    ]);
  };

  // SUBCATEGORY / INSTANT FAQ ANSWER HANDLER
  const handleSelectSubcategory = (sub) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: sub.label },
      { role: "ai", type: "text", text: sub.answer },
      {
        role: "ai",
        type: "options",
        text: "Need anything else? Select a topic or ask a custom question below:"
      }
    ]);
  };

  // CUSTOM AI QUERY HANDLER
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      // Extended timeout to 30s to avoid TLE from free models
      const { data } = await axios.post(
        "https://zenzloom-fg7a.onrender.com/api/chat",
        { message: userText },
        { timeout: 30000 }
      );

      setMessages((prev) => [
        ...prev,
        { role: "ai", type: "text", text: data.reply },
      ]);
    } catch (error) {
      console.error("Chat Error:", error.response?.data || error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          type: "text",
          text: "Sorry, I'm having trouble reaching AI right now. Please select an instant FAQ topic above!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineRobot size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[500px]">
          
          {/* Header */}
          <div className="bg-pink-600 p-4 text-white font-bold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Zenzloom AI Assistant</span>
              <span className="text-[10px] bg-pink-800 px-2 py-0.5 rounded">Hybrid</span>
            </div>
            
            {/* RESET BUTTON */}
            <button
              onClick={handleResetChat}
              title="Reset Chat"
              className="hover:bg-pink-700 p-1 rounded-lg transition-colors"
            >
              <AiOutlineReload size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-2">
                
                {/* Text bubble */}
                {msg.text && (
                  <div
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
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
                )}

                {/* Main FAQ Categories */}
                {msg.type === "options" && (
                  <div className="space-y-2 pt-1">
                    {FAQ_TREE.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat)}
                        className="w-full text-left p-2.5 bg-gray-800 hover:bg-gray-700 text-pink-400 font-medium border border-gray-700 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <span>{cat.title}</span>
                        <AiOutlineRight size={12} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Sub-questions under chosen Category */}
                {msg.type === "subcategories" && msg.options && (
                  <div className="space-y-2 pt-1">
                    {msg.options.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubcategory(sub)}
                        className="w-full text-left p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-pink-600/30 hover:border-pink-500 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <span>{sub.label}</span>
                        <AiOutlineRight size={12} className="text-pink-500" />
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}

            {/* AI Loading State */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-pink-400 p-3 rounded-2xl text-xs animate-pulse border border-gray-700">
                  ZenzBot is typing...
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-gray-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
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