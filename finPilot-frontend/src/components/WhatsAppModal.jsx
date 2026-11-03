import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../services/ExpenseService";
import toast from "react-hot-toast";
import { 
    X, 
    Send, 
    Sparkles, 
    CheckCircle2, 
    Copy, 
    Phone, 
    Bot, 
    Zap,
    ExternalLink,
    Clock,
    ShieldCheck
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppModal({ isOpen, onClose, onTransactionLogged }) {
    const [activeTab, setActiveTab] = useState("simulator"); // 'simulator' | 'setup'
    const [phone, setPhone] = useState(localStorage.getItem("phone") || "9302222361");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            sender: "bot",
            text: "👋 *Namaste! FinPilot WhatsApp Copilot is active.*\n\nSend any expense or income in plain English or Hinglish, e.g.:\n• _Paid 450 for swiggy pizza_\n• _bhai petrol me 500 dale_\n• _Got 65000 salary credited_",
            time: "Live 24x7"
        }
    ]);

    if (!isOpen) return null;

    const samplePrompts = [
        "Paid 450 for swiggy pizza dinner",
        "Uber ride to office 240 rs",
        "bhai 65000 salary aayi hai bank me",
        "Bought groceries from blinkit 680"
    ];

    const handleSendMessage = async (customText) => {
        const textToSend = customText || message;
        if (!textToSend.trim()) {
            toast.error("Please enter a message");
            return;
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message to UI
        const newHistory = [
            ...chatHistory,
            { sender: "user", text: textToSend, time: now }
        ];
        setChatHistory(newHistory);
        setMessage("");
        setLoading(true);

        try {
            // Call Spring Boot WhatsApp simulation webhook
            const response = await axios.post(`${BASE_URL}/webhook/whatsapp/simulate`, {
                phone: phone.trim(),
                message: textToSend.trim()
            });

            const reply = response.data?.reply || "✅ Transaction processed!";

            setChatHistory([
                ...newHistory,
                { sender: "bot", text: reply, time: now }
            ]);

            toast.success("Logged & synced with your FinPilot Dashboard!");
            if (onTransactionLogged) {
                onTransactionLogged();
            }
        } catch (err) {
            console.error("WhatsApp Simulation Error:", err);
            const errReply = "⚠️ Failed to process: Please check if this phone number is registered with your FinPilot account.";
            setChatHistory([
                ...newHistory,
                { sender: "bot", text: errReply, time: now }
            ]);
            toast.error("Could not sync transaction. Check registered phone.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label} to clipboard!`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col max-h-[92vh] min-w-0">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 sm:px-6 py-3.5 sm:py-4">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/25 shrink-0">
                            <FaWhatsapp className="text-white text-xl sm:text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide truncate">
                                    WhatsApp Copilot 24/7
                                </h3>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shrink-0">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active
                                </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-400 truncate">
                                Log expenses hands-free via WhatsApp text
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer shrink-0 active:scale-95"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-3 sm:px-6">
                    <button
                        onClick={() => setActiveTab("simulator")}
                        className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition cursor-pointer flex-1 sm:flex-initial justify-center ${
                            activeTab === "simulator"
                                ? "border-emerald-500 text-emerald-400"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <Zap size={14} />
                        Simulator
                    </button>
                    <button
                        onClick={() => setActiveTab("setup")}
                        className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition cursor-pointer flex-1 sm:flex-initial justify-center ${
                            activeTab === "setup"
                                ? "border-emerald-500 text-emerald-400"
                                : "border-transparent text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        <ShieldCheck size={14} />
                        Webhook Setup
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-4 min-w-0">
                    {activeTab === "simulator" ? (
                        <div className="space-y-3 sm:space-y-4 min-w-0">
                            {/* Phone number banner */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 sm:p-3 text-xs gap-2 sm:gap-0">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Phone size={14} className="text-emerald-400 shrink-0" />
                                    <span>Simulating Registered Mobile:</span>
                                </div>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="10-digit mobile"
                                    className="w-full sm:w-36 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-left sm:text-right font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            {/* Chat Window */}
                            <div className="h-56 sm:h-64 overflow-y-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-3 sm:p-4 space-y-3 font-sans">
                                {chatHistory.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${
                                            item.sender === "user" ? "items-end" : "items-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed shadow-md ${
                                                item.sender === "user"
                                                    ? "bg-emerald-600 text-white rounded-br-xs"
                                                    : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs whitespace-pre-line"
                                            }`}
                                        >
                                            {item.text}
                                        </div>
                                        <span className="text-[10px] text-zinc-500 mt-1 px-1">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 italic">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                        FinPilot AI is parsing transaction & updating database...
                                    </div>
                                )}
                            </div>

                            {/* Quick clickable chips */}
                            <div>
                                <p className="text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                                    Try Quick Test Prompts:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {samplePrompts.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(prompt)}
                                            disabled={loading}
                                            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 active:scale-95 transition cursor-pointer disabled:opacity-50"
                                        >
                                            + {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex items-center gap-2 pt-1"
                            >
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="e.g. Paid 350 for lunch or 1000 petrol..."
                                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-base sm:text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 sm:px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition disabled:opacity-50 cursor-pointer shrink-0"
                                >
                                    <Send size={14} />
                                    <span>Send</span>
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Meta 24/7 Setup Guide */
                        <div className="space-y-3.5 sm:space-y-4 text-xs text-zinc-300 leading-relaxed min-w-0">
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 sm:p-4">
                                <h4 className="font-bold text-emerald-400 text-xs sm:text-sm mb-1 flex items-center gap-2">
                                    <FaWhatsapp className="text-base shrink-0" /> Permanent 24x7 Webhook
                                </h4>
                                <p className="text-zinc-400 text-xs leading-relaxed">
                                    FinPilot AI is natively connected with Meta WhatsApp Cloud API. Messages sent to your number automatically log to your ledger.
                                </p>
                            </div>

                            {/* Step 1 */}
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 sm:p-4 space-y-2 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white">Step 1: Webhook URL</span>
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Endpoint</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2 border border-zinc-800 font-mono text-[11px] sm:text-xs text-emerald-400 min-w-0">
                                    <span className="truncate">https://finpilot-ai-4ygw.onrender.com/api/webhook/whatsapp</span>
                                    <button
                                        onClick={() => copyToClipboard("https://finpilot-ai-4ygw.onrender.com/api/webhook/whatsapp", "Webhook URL")}
                                        className="text-zinc-400 hover:text-white ml-2 cursor-pointer shrink-0 active:scale-95"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 sm:p-4 space-y-2 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white">Step 2: Verification Token</span>
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Secret</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2 border border-zinc-800 font-mono text-[11px] sm:text-xs text-emerald-400 min-w-0">
                                    <span className="truncate">finpilot_secret_token_2026</span>
                                    <button
                                        onClick={() => copyToClipboard("finpilot_secret_token_2026", "Verify Token")}
                                        className="text-zinc-400 hover:text-white ml-2 cursor-pointer shrink-0 active:scale-95"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 sm:p-4 space-y-1.5 min-w-0">
                                <span className="font-bold text-white">Step 3: Webhook Fields</span>
                                <p className="text-zinc-400 text-xs">
                                    Subscribe to the <b>messages</b> field under Webhooks in Meta Console. Done!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-800/80 bg-zinc-900/40 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5 text-[11px] sm:text-xs truncate">
                        <Sparkles size={12} className="text-emerald-400 shrink-0" /> Gemini 3.5 NLP
                    </span>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition cursor-pointer active:scale-95 shrink-0"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

