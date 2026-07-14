"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses: Record<string, string> = {
  // Greetings
  "مرحبا": "مرحباً بك في Apex Athletics! 👋 كيف يمكنني مساعدتك اليوم؟",
  "السلام عليكم": "وعليكم السلام ورحمة الله! أهلاً بك 😊 كيف أقدر أساعدك؟",
  "هاي": "أهلاً! 👋 أنا المساعد الذكي لـ Apex Athletics. اسألني عن أي شيء!",
  "hello": "Hello! Welcome to Apex Athletics 👋 How can I help you today?",
  
  // Products
  "الأسعار": "أسعارنا تبدأ من $999 لنظام مغسلة السيارات وتصل إلى $9,999 لنظام المستشفيات. جميع الأنظمة لديها خصومات تصل إلى 44%! 💰",
  "سعر": "يمكنك تصفح جميع الأسعار في قسم المنتجات. لدينا خصومات كبيرة على جميع الأنظمة! هل تريد معرفة سعر نظام معين؟",
  "خصم": "نعم! لدينا خصومات رائعة تصل إلى 44% على جميع الأنظمة 🎉 تصفح المنتجات لترى العروض الحالية.",
  
  // Systems
  "صيدلية": "نظام إدارة الصيدلية يشمل: إدارة المخزون، تتبع الوصفات، تنبيهات الصلاحية، مسح الباركود، ودعم الفروع المتعددة. السعر: $2,999 (خصم 40%) 💊",
  "جيم": "نظام إدارة الجيم يشمل: إدارة الأعضاء، خطط الاشتراك، تتبع التمارين، جدولة المدربين، وتطبيق جوال. السعر: $1,999 (خصم 43%) 💪",
  "مطعم": "نظام المطاعم يشمل: حجز الطاولات، إدارة القوائم، شاشة المطبخ، تتبع الطلبات، والتكامل مع التوصيل. السعر: $2,499 (خصم 38%) 🍽️",
  "مستشفى": "نظام المستشفيات يشمل: السجلات الطبية، جدولة المواعيد، إدارة المختبر، الفوترة والتأمين. السعر: $9,999 (خصم 33%) 🏥",
  "فندق": "نظام الفنادق يشمل: حجز الغرف، تسجيل النزلاء، التدبير المنزلي، إدارة الإيرادات. السعر: $7,999 (خصم 33%) 🏨",
  "مدرسة": "نظام المدارس يشمل: سجلات الطلاب، الحضور والغياب، الدرجات، بوابة الأهل، والتعليم الإلكتروني. السعر: $4,999 (خصم 38%) 🎓",
  
  // Support
  "دعم": "نوفر دعم فني على مدار الساعة 24/7 📞 يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة.",
  "تواصل": "يمكنك التواصل معنا عبر:\n📧 البريد: support@apexathletics.com\n📱 الهاتف: +20 123 456 789\n💬 أو من خلال هذه الدردشة!",
  "ضمان": "جميع أنظمتنا تأتي مع ضمان سنة كاملة + تحديثات مجانية + دعم فني مستمر ✅",
  
  // Payment
  "دفع": "نقبل جميع طرق الدفع: فيزا، ماستركارد، باي بال، والتحويل البنكي. كما نوفر خيار التقسيط! 💳",
  "تقسيط": "نعم! نوفر خيار التقسيط على 3، 6، أو 12 شهر بدون فوائد للمشتريات فوق $2,000 💰",
  
  // Company
  "الشركة": "Apex Athletics شركة رائدة في تطوير الأنظمة البرمجية. نخدم أكثر من 500 عميل في مختلف المجالات 🚀",
  "من نحن": "نحن فريق من المطورين المحترفين متخصصين في بناء أنظمة إدارة متكاملة للشركات والمؤسسات. هدفنا تسهيل إدارة أعمالك! 💼",
};

function findBestResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  for (const [key, response] of Object.entries(botResponses)) {
    if (lowerInput.includes(key.toLowerCase()) || lowerInput.includes(key)) {
      return response;
    }
  }
  
  // AI-like contextual responses
  if (lowerInput.includes("كيف") || lowerInput.includes("how")) {
    return "يسعدني مساعدتك! هل يمكنك توضيح سؤالك أكثر؟ أنا هنا لمساعدتك في معرفة المزيد عن أنظمتنا 😊";
  }
  if (lowerInput.includes("شكر") || lowerInput.includes("thank")) {
    return "عفواً! سعيد بمساعدتك 😊 هل هناك شيء آخر يمكنني مساعدتك فيه؟";
  }
  if (lowerInput.includes("؟") || lowerInput.includes("?")) {
    return "سؤال جيد! للحصول على إجابة تفصيلية، يمكنك التواصل مع فريق المبيعات أو تصفح قسم المنتجات للمزيد من المعلومات 📋";
  }

  if (lowerInput.includes("مشكلة") || lowerInput.includes("problem") || lowerInput.includes("خطأ") || lowerInput.includes("error")) {
    return "يمكنك الآن استخدام خدمة العملاء في الشريط الجانبي أو إرسال طلب دعم مباشرة، وسنقوم بالرد في أسرع وقت ممكن. إذا كان هناك خطأ في الصور أو الدفع أو الحساب، أخبرنا بالتفصيل وسنساعدك فوراً 🔧";
  }
  
  return "شكراً لتواصلك! 😊 يمكنني مساعدتك في:\n• معرفة أسعار الأنظمة\n• تفاصيل أي نظام\n• طرق الدفع والتقسيط\n• الدعم الفني\n\nاكتب ما تحتاجه!";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً! 👋 أنا المساعد الذكي لـ Apex Athletics. كيف يمكنني مساعدتك اليوم؟",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const quickActions = [
    { text: "الأسعار", icon: "💰" },
    { text: "الدعم", icon: "🛠️" },
    { text: "طرق الدفع", icon: "💳" },
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${isOpen ? "scale-0" : "scale-100"}`}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-100px)] bg-dark-card rounded-2xl shadow-2xl border border-primary/20 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white">المساعد الذكي</h3>
                <p className="text-xs text-white/80">متصل الآن</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                  msg.isBot 
                    ? "bg-dark-surface text-gray-200 rounded-tr-sm" 
                    : "bg-gradient-to-r from-primary to-accent text-white rounded-tl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-surface p-3 rounded-2xl rounded-tr-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 flex gap-2">
            {quickActions.map((action) => (
              <button
                key={action.text}
                onClick={() => { setInput(action.text); }}
                className="px-3 py-1.5 bg-dark-surface rounded-full text-xs text-gray-300 hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-primary/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-dark-surface border border-primary/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 bg-gradient-to-r from-primary to-accent rounded-xl text-white disabled:opacity-50 transition-all hover:shadow-lg"
              >
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
