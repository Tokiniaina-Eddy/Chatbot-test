import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Trash2, Loader2 } from 'lucide-react';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://chatbot-test-83tq.onrender.com/api/chat", {
        messages: newHistory
      });

      const botMessage = { role: "assistant", content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Miala tsiny, nisy olana kely ny fifandraisana." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
    
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Miarahaba AI</h1>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="text-slate-400 hover:text-red-500 transition-colors"
          title="Hamafa ny resaka"
        >
          <Trash2 size={20} />
        </button>
      </header>

    
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Bot size={48} className="opacity-20" />
            <p className="text-lg">Inona no azo ampiana anao androany?</p>
          </div>
        ) : (
          messages.map((m, index) => (
            <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"}`}>
                  {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                  m.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center animate-spin">
              <Loader2 size={18} className="text-slate-500" />
            </div>
            <span className="text-slate-400 text-sm italic">Andraso kely...</span>
          </div>
        )}
      </main>


      <footer className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text"
            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 transition-all shadow-inner"
            placeholder="Manorata hafatra eto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Powered by OpenRouter & Flask</p>
      </footer>
    </div>
  );
}

export default App;
