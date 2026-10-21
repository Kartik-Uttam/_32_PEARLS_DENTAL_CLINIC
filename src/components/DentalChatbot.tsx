import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Bot, User, Trash2, ArrowUpRight, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { AnimatedTooth } from './AnimatedTooth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DentalChatbotProps {
  onOpenBooking: (serviceName?: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  'What should I do for a sudden toothache?',
  'How often should I get teeth cleaning?',
  'What teeth whitening options do you have?',
  'How long does a root canal treatment take?',
  'Where is the clinic located in Jalahalli?',
];

export const DentalChatbot: React.FC<DentalChatbotProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content:
          "Hello! I'm Pearl, your AI dental assistant at 32 Pearls Dental Care in Jalahalli East. How can I help you today? You can ask about treatments, toothache relief, clinic timings, or booking a visit!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now().toString(36),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the multi-turn history to the server-side proxy endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      const data = await response.json();

      let replyContent = '';
      if (response.ok && data.reply) {
        replyContent = data.reply;
      } else if (data.fallbackReply) {
        replyContent = data.fallbackReply;
      } else {
        replyContent =
          "I'm here to assist with your dental questions! Please feel free to call our desk at +91 90199 53164 or click 'Book Appointment' to schedule a consultation with our dentist.";
      }

      const botMessage: ChatMessage = {
        id: 'bot_' + Date.now().toString(36),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_err_' + Date.now(),
          role: 'assistant',
          content:
            "I'm experiencing a brief network pause. Our clinic is located at J & J Complex, Kalathur Layout, Jalahalli East. Please call us directly at +91 90199 53164 or use the Book Appointment button!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'assistant',
        content:
          "Chat reset! I'm Pearl from 32 Pearls Dental Care. What questions can I answer for you about our dental services or oral health?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-700 to-[#132f3a] text-white shadow-xl shadow-teal-950/20 border-2 border-white/80 transition-all focus:outline-hidden focus:ring-4 focus:ring-teal-400"
          aria-label={isOpen ? 'Close dental chatbot' : 'Open dental assistant chat'}
        >
          <div className="relative">
            <AnimatedTooth size={26} interactive={false} showSparkles={false} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-teal-900 animate-pulse" />
          </div>

          <div className="text-left pr-1 hidden sm:block">
            <span className="block text-xs font-bold font-heading leading-tight tracking-tight">Ask Pearl</span>
            <span className="block text-[9px] text-teal-200/90 font-medium">Dental AI Assistant</span>
          </div>

          <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            {isOpen ? <X className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="fixed bottom-22 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[75vh] bg-white rounded-2xl shadow-2xl border border-teal-100 flex flex-col overflow-hidden"
            role="dialog"
            aria-label="32 Pearls Dental Chatbot"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#132f3a] to-teal-800 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-teal-200">
                  <AnimatedTooth size={24} interactive={false} showSparkles={false} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold font-heading leading-tight">Pearl</h3>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-teal-200/80 leading-none mt-0.5">32 Pearls Dental Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear Chat */}
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model & Speed Selector Bar */}
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Model:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-3.8-flash')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedModel === 'gemini-3.8-flash'
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Recommended general dental knowledge"
                >
                  gemini-3.8-flash (General)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedModel === 'gemini-3.1-flash-lite'
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Fast responses for quick triage"
                >
                  <Zap className="w-2.5 h-2.5 inline mr-0.5 text-amber-500" />
                  flash-lite (Fast)
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#fafcfb] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#132f3a] text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</div>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        msg.role === 'user' ? 'text-teal-200/70' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] text-teal-700">Pearl is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length <= 3 && !isLoading && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[9px] font-bold text-teal-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                  Ask:
                </span>
                {DEFAULT_SUGGESTIONS.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] border border-teal-200/60 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Booking Callout shortcut button inside Chat */}
            <div className="px-3 py-1.5 bg-teal-50/70 border-t border-teal-100 flex items-center justify-between">
              <span className="text-[10px] text-teal-900 font-medium">Ready to see the dentist?</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-semibold transition-colors"
              >
                <span>Book a Visit</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Pearl anything about your smile..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
