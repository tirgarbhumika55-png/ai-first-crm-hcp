import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage } from "../api/client";

export default function AIAssistant({ onRefresh }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your AI Medical Science Liaison assistant. I can help you log interactions or retrieve details from your recent logs." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await sendMessage(input);
      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);

      // Trigger refresh in parent if provided
      if (onRefresh) onRefresh();
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error connecting to the brain. Please ensure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px] overflow-hidden sticky top-6">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="p-1 bg-blue-100 rounded-lg">
          <Sparkles className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">AI Assistant</h3>
          <p className="text-xs text-gray-500">Log interaction via chat</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">

        {/* Helper Box - Only show if empty history */}
        {messages.length === 1 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-600 shadow-sm">
            Log interaction details here (e.g., <br />
            "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
          </div>
        )}

        <AnimatePresence>
          {messages.slice(1).map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-700 border border-gray-200 rounded-bl-none"
                }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <input
            className="w-full bg-white border border-gray-300 text-gray-800 rounded-md pl-4 pr-20 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
            placeholder="Describe interaction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-1 top-1 bottom-1 px-4 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
          >
            <Send className="w-3 h-3" /> Log
          </button>
        </div>
      </div>
    </div>
  );
}
