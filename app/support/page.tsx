'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Mail, FileText, ArrowRight, ShieldCheck, Clock, UserCheck, Send, X, ChevronDown, Sparkles, Loader2, User, Bot } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer, fadeUp, fadeUpItem } from "@/lib/animations";
import { supabase } from "@/lib/supabase";
import { fetchUserAvatars, getActiveConversation, getMessages, sendCustomerChatMessage } from './actions';

interface ChatMessage {
  id: string;
  sender: 'system' | 'user';
  text: string;
  time: string;
  avatarUrl?: string | null;
}

const FAQ_ITEMS = [
  {
    question: "How long does a live chat response take?",
    answer: "Our average live chat response time is under 2 minutes. Dedicated account managers are active 24/7 to assist with your transactions."
  },
  {
    question: "What information should I provide for order issues?",
    answer: "Please have your Order ID or Transaction Hash ready. You can easily find these in your Transaction History tab."
  },
  {
    question: "How can I escalate an urgent payment inquiry?",
    answer: "Select the 'WhatsApp Support' option for direct line access to senior compliance and transaction operators."
  }
];

export default function SupportPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open chat if navigated from notification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('chat') === 'open') {
        setIsChatOpen(true);
      }
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch current user & active conversation
  useEffect(() => {
    const initChat = async () => {
      const res = await getActiveConversation();
      if (res.conversation_id) {
        setConversationId(res.conversation_id);
      }
    };

    initChat();
  }, []);

  // Fetch messages when conversationId changes
  const fetchMessages = useCallback(async (convId: string) => {
    setLoading(true);
    try {
      const msgs = await getMessages(convId);

      if (msgs && msgs.length > 0) {
        const senderIds = [...new Set(msgs.map(m => m.sender_id).filter(Boolean))];
        let avatarMap: Record<string, string> = {};
        
        if (senderIds.length > 0) {
          avatarMap = await fetchUserAvatars(senderIds);
        }

        setMessages(msgs.map(m => ({
          id: m.id,
          sender: m.sender_type === 'customer' ? 'user' : 'system',
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatarUrl: avatarMap[m.sender_id] || null
        })));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);

      // Subscribe to real-time incoming messages for this conversation
      const channel = supabase
        .channel(`cust-chat-${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'communication_messages',
          filter: `conversation_id=eq.${conversationId}`,
        }, async (payload: { new: { id: string; sender_id: string; sender_type: string; visibility: string; text: string; created_at: string } }) => {
          const msg = payload.new;
          if (msg.visibility === 'customer') {
            let avatarUrl = null;
            if (msg.sender_id) {
              const avatars = await fetchUserAvatars([msg.sender_id]);
              if (avatars[msg.sender_id]) avatarUrl = avatars[msg.sender_id];
            }

            setMessages(prev => {
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, {
                id: msg.id,
                sender: msg.sender_type === 'customer' ? 'user' : 'system',
                text: msg.text,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatarUrl
              }];
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, fetchMessages]);

  // Helper to ensure a conversation exists


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isSending) return;

    const text = inputMsg.trim();
    setInputMsg('');
    setIsSending(true);

    try {
      const res = await sendCustomerChatMessage(text);
      if (res.error) {
        console.error("Failed to send message:", res.error);
        return;
      }

      if (res.conversation_id) {
        setConversationId(res.conversation_id);
      }

      // Optimistically add to UI if realtime hasn't added it yet
      if (res.message_id) {
        // Find our own avatar from auth
        const { data: { user } } = await supabase.auth.getUser();
        let myAvatarUrl = null;
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).maybeSingle();
          if (profile?.avatar_url) myAvatarUrl = profile.avatar_url;
        }

        setMessages(prev => {
          if (prev.some(m => m.id === res.message_id)) return prev;
          return [...prev, {
            id: res.message_id!,
            sender: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatarUrl: myAvatarUrl
          }];
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = async (promptText: string) => {
    setInputMsg(promptText);
  };

  return (
    <motion.div 
      className="flex-1 flex flex-col gap-8 md:gap-10 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header with Live Pulsing Badge */}
      <motion.header variants={fadeUp} className="border-b-2 border-foreground pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Assistance</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground opacity-30" />
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 border border-foreground bg-emerald-100 text-emerald-950 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-[2px_2px_0px_var(--color-foreground)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Agents Online
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Live Support</h1>
        </div>

        <div className="text-xs uppercase font-bold tracking-wider opacity-70 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>Average Wait: <strong className="text-foreground">&lt; 2 Mins</strong></span>
        </div>
      </motion.header>

      {/* Main Support Options Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Animated Hero Live Chat Box */}
        <motion.div 
          variants={fadeUpItem}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="border-2 border-foreground bg-primary text-primary-foreground p-8 flex flex-col items-center text-center justify-center min-h-[320px] relative overflow-hidden shadow-[6px_6px_0px_var(--color-foreground)] group"
        >
          {/* Subtle background graphic */}
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <MessageCircle className="w-64 h-64 text-white" />
          </div>

          {/* Floating animated icon badge */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 border-2 border-foreground bg-white text-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)] relative"
          >
            <MessageCircle className="w-10 h-10 text-primary" />
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-foreground rounded-full"
            />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold font-heading uppercase mb-2 tracking-tight">Live Chat</h2>
          <p className="text-xs uppercase font-bold opacity-90 tracking-widest max-w-xs mb-8">
            Speak to a dedicated account manager instantly.
          </p>

          <motion.button 
            onClick={() => setIsChatOpen(true)}
            whileHover={{ scale: 1.04, y: -2, boxShadow: '6px 6px 0px var(--color-foreground)' }}
            whileTap={{ scale: 0.96 }}
            className="border-2 border-foreground bg-white text-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm flex items-center gap-3 shadow-[4px_4px_0px_var(--color-foreground)] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '4s' }} />
            Start Chat
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Right Side Support Channels */}
        <div className="flex flex-col gap-5">
          
          {/* WhatsApp Support */}
          <motion.div variants={fadeUpItem}>
            <motion.a 
              href="https://wa.me" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ x: 6, y: -3, boxShadow: '6px 6px 0px var(--color-foreground)' }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-foreground bg-white p-6 flex items-center justify-between group shadow-[4px_4px_0px_var(--color-foreground)] transition-all"
            >
              <div className="flex items-center gap-5">
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-14 h-14 border-2 border-foreground bg-emerald-100 flex items-center justify-center shadow-[2px_2px_0px_var(--color-foreground)] shrink-0"
                >
                  <MessageCircle className="w-7 h-7 text-emerald-700" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold uppercase text-base group-hover:underline">WhatsApp Support</h3>
                    <span className="px-2 py-0.5 border border-foreground bg-emerald-200 text-emerald-950 text-[9px] font-bold uppercase tracking-wider">Fastest</span>
                  </div>
                  <p className="text-[11px] uppercase font-bold opacity-60 tracking-widest mt-0.5">Connect via WhatsApp</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.a>
          </motion.div>

          {/* Email Support */}
          <motion.div variants={fadeUpItem}>
            <motion.a 
              href="mailto:support@converto.app"
              whileHover={{ x: 6, y: -3, boxShadow: '6px 6px 0px var(--color-foreground)' }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-foreground bg-white p-6 flex items-center justify-between group shadow-[4px_4px_0px_var(--color-foreground)] transition-all"
            >
              <div className="flex items-center gap-5">
                <motion.div 
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  className="w-14 h-14 border-2 border-foreground bg-blue-100 flex items-center justify-center shadow-[2px_2px_0px_var(--color-foreground)] shrink-0"
                >
                  <Mail className="w-7 h-7 text-blue-700" />
                </motion.div>
                <div>
                  <h3 className="font-bold uppercase text-base group-hover:underline">Email Support</h3>
                  <p className="text-[11px] uppercase font-bold opacity-60 tracking-widest mt-0.5">support@converto.app</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.a>
          </motion.div>

          {/* My Tickets */}
          <motion.div variants={fadeUpItem}>
            <Link href="/track" className="block">
              <motion.div 
                whileHover={{ x: 6, y: -3, boxShadow: '6px 6px 0px var(--color-foreground)' }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-foreground bg-white p-6 flex items-center justify-between group shadow-[4px_4px_0px_var(--color-foreground)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <motion.div 
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    className="w-14 h-14 border-2 border-foreground bg-amber-100 flex items-center justify-center shadow-[2px_2px_0px_var(--color-foreground)] shrink-0"
                  >
                    <FileText className="w-7 h-7 text-amber-700" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold uppercase text-base group-hover:underline">My Tickets & Tracking</h3>
                    <p className="text-[11px] uppercase font-bold opacity-60 tracking-widest mt-0.5">View past support requests & order status</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Live System Metrics Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <motion.div 
          whileHover={{ y: -3 }}
          className="border-2 border-foreground bg-white p-4 flex items-center gap-4 shadow-[3px_3px_0px_var(--color-foreground)]"
        >
          <div className="w-10 h-10 border-2 border-foreground bg-secondary flex items-center justify-center font-bold text-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold opacity-60">Avg Response Time</div>
            <div className="text-lg font-bold font-heading uppercase">&lt; 1.5 Minutes</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="border-2 border-foreground bg-white p-4 flex items-center gap-4 shadow-[3px_3px_0px_var(--color-foreground)]"
        >
          <div className="w-10 h-10 border-2 border-foreground bg-emerald-100 flex items-center justify-center font-bold text-sm">
            <UserCheck className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold opacity-60">Active Operators</div>
            <div className="text-lg font-bold font-heading uppercase">12 Managers Online</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          className="border-2 border-foreground bg-white p-4 flex items-center gap-4 shadow-[3px_3px_0px_var(--color-foreground)]"
        >
          <div className="w-10 h-10 border-2 border-foreground bg-blue-100 flex items-center justify-center font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold opacity-60">Satisfaction Score</div>
            <div className="text-lg font-bold font-heading uppercase">99.8% Resolution</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated FAQ Section */}
      <motion.section variants={fadeUp} className="border-2 border-foreground bg-white p-6 md:p-8 shadow-[6px_6px_0px_var(--color-foreground)]">
        <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 block">Knowledge Base</span>
            <h2 className="text-xl md:text-2xl font-bold font-heading uppercase">Frequently Asked Questions</h2>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border-2 border-foreground overflow-hidden bg-background"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold uppercase text-sm md:text-base hover:bg-secondary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs opacity-50 font-mono">0{index + 1}.</span>
                    {faq.question}
                  </span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <div className="p-4 pt-0 border-t border-foreground/10 text-xs md:text-sm opacity-80 leading-relaxed font-mono bg-white">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Interactive Animated Live Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-lg border-2 border-foreground bg-white shadow-[8px_8px_0px_var(--color-foreground)] flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="border-b-2 border-foreground bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 border-2 border-foreground bg-white text-foreground flex items-center justify-center font-bold text-xs">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-foreground rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-bold font-heading uppercase text-base leading-tight">Live Support Assistant</h3>
                    <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Active Session • Response &lt; 1m</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 border border-foreground bg-white text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Body / Messages */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[280px] max-h-[380px] bg-amber-50/20">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-primary opacity-40" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-50">
                    <MessageCircle className="w-8 h-8 text-primary mb-2 opacity-40" />
                    <p className="text-xs font-bold uppercase tracking-wider">Start a conversation</p>
                    <p className="text-[10px] font-mono opacity-70 mt-1">Send a message below and an account manager will assist you live.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 w-full ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 shrink-0 rounded-full border-2 border-foreground flex items-center justify-center shadow-[2px_2px_0px_var(--color-foreground)] overflow-hidden ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-emerald-100 text-emerald-900'}`}>
                        {msg.avatarUrl ? (
                          <img src={msg.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div 
                          className={`p-3 border-2 border-foreground text-xs md:text-sm font-medium leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_var(--color-foreground)]' 
                              : 'bg-white text-foreground shadow-[3px_3px_0px_var(--color-foreground)]'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] uppercase font-bold opacity-40 mt-1 px-1">
                          {msg.time}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-2 border-t border-foreground/10 bg-white flex gap-2 overflow-x-auto text-[10px] font-bold uppercase">
                <button 
                  onClick={() => handleQuickPrompt("Check my Order status")}
                  className="px-3 py-1.5 border border-foreground bg-secondary hover:bg-primary hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  📌 Track Order
                </button>
                <button 
                  onClick={() => handleQuickPrompt("Live Exchange Rates query")}
                  className="px-3 py-1.5 border border-foreground bg-secondary hover:bg-primary hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  💱 Exchange Rates
                </button>
                <button 
                  onClick={() => handleQuickPrompt("Payment method query")}
                  className="px-3 py-1.5 border border-foreground bg-secondary hover:bg-primary hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  💳 Payments
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="border-t-2 border-foreground p-3 bg-white flex gap-2">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={isSending}
                  className="flex-1 border-2 border-foreground px-3 py-2 text-xs md:text-sm font-mono focus:outline-none focus:bg-secondary disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isSending || !inputMsg.trim()}
                  className="border-2 border-foreground bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_var(--color-foreground)] hover:translate-y-[-1px] transition-transform cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

