import { useState, useEffect, useMemo } from "react";
import {
    Users,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    Search,
    CheckCircle2,
    Clock,
    Calendar,
    Trash2,
    DollarSign,
    RefreshCw,
    X,
    UserCheck,
    AlertCircle,
    ArrowRightLeft,
    Sparkles,
    ShieldAlert
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import {
    getKhataOverview,
    getPersonDebtHistory,
    addDebtRecord,
    settlePersonDebt,
    deleteDebtPerson,
    deleteDebtRecord
} from "../services/ExpenseService";
import { formatDateIST, formatTimeIST } from "../utils/dateUtils";

export default function Khata() {
    const [overview, setOverview] = useState({
        totalReceivable: 0,
        totalPayable: 0,
        netBalance: 0,
        persons: []
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | RECEIVABLE | PAYABLE | SETTLED

    // Selected person for History Passbook Modal
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Add Record Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        personName: "",
        amount: "",
        type: "YOU_GAVE", // YOU_GAVE = Lena hai, YOU_GOT = Dena hai / Mile
        notes: "",
        date: new Date().toISOString().split("T")[0]
    });

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await getKhataOverview();
            setOverview(res.data || { totalReceivable: 0, totalPayable: 0, netBalance: 0, persons: [] });
        } catch (err) {
            console.error("Failed to load Khata overview:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, []);

    const openPersonHistory = async (person) => {
        setSelectedPerson(person);
        setHistoryLoading(true);
        try {
            const res = await getPersonDebtHistory(person.id);
            setHistoryList(res.data || []);
        } catch (err) {
            console.error("Failed to load history:", err);
            setHistoryList([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSettle = async (personId, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Kya aap pura hisab settle (₹0) karna chahte hain?")) return;
        try {
            await settlePersonDebt(personId);
            await fetchOverview();
            if (selectedPerson && selectedPerson.id === personId) {
                const res = await getPersonDebtHistory(personId);
                setHistoryList(res.data || []);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Settlement failed");
        }
    };

    const handleDeletePerson = async (personId, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Kya aap is vyakti aur inke saare hisab ko delete karna chahte hain?")) return;
        try {
            await deleteDebtPerson(personId);
            if (selectedPerson?.id === personId) setSelectedPerson(null);
            await fetchOverview();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleDeleteRecord = async (recordId) => {
        try {
            await deleteDebtRecord(recordId);
            if (selectedPerson) {
                const res = await getPersonDebtHistory(selectedPerson.id);
                setHistoryList(res.data || []);
            }
            await fetchOverview();
        } catch (err) {
            alert("Failed to delete record");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!formData.personName.trim() || !formData.amount || Number(formData.amount) <= 0) {
            alert("Kripya person ka naam aur valid amount dalein");
            return;
        }

        try {
            setSubmitting(true);
            await addDebtRecord({
                personName: formData.personName.trim(),
                amount: Number(formData.amount),
                type: formData.type,
                notes: formData.notes.trim(),
                date: formData.date
            });
            setIsAddModalOpen(false);
            setFormData({
                personName: "",
                amount: "",
                type: "YOU_GAVE",
                notes: "",
                date: new Date().toISOString().split("T")[0]
            });
            await fetchOverview();
            if (selectedPerson) {
                const res = await getPersonDebtHistory(selectedPerson.id);
                setHistoryList(res.data || []);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add record");
        } finally {
            setSubmitting(false);
        }
    };

    // Filtered persons
    const filteredPersons = useMemo(() => {
        let list = overview.persons || [];
        if (search.trim()) {
            list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (filter === "RECEIVABLE") {
            list = list.filter((p) => Number(p.netBalance) > 0);
        } else if (filter === "PAYABLE") {
            list = list.filter((p) => Number(p.netBalance) < 0);
        } else if (filter === "SETTLED") {
            list = list.filter((p) => Number(p.netBalance) === 0);
        }
        return list;
    }, [overview.persons, search, filter]);

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full min-w-0 pb-16">
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <SectionTitle
                    title="Khata (Hisab-Kitab)"
                    subtitle="Track friends lending, debts & who owes you what with WhatsApp AI sync."
                />
                <button
                    onClick={() => {
                        setFormData({
                            personName: "",
                            amount: "",
                            type: "YOU_GAVE",
                            notes: "",
                            date: new Date().toISOString().split("T")[0]
                        });
                        setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer shrink-0"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Naya Hisab Jodein</span>
                </button>
            </div>

            {/* 2. WhatsApp Hint Banner */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-900/40 p-4 sm:p-5 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <span className="font-semibold text-white">WhatsApp Se Direct Log Karein: </span>
                            <span className="text-zinc-300">
                                Kisi bhi vyakti ka hisab bina app khole update karein!
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="bg-zinc-800/90 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            500 Rupam <span className="text-zinc-400 font-sans">(Aapne diye)</span>
                        </span>
                        <span className="bg-zinc-800/90 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30">
                            -400 Rupam <span className="text-zinc-400 font-sans">(Usne diye)</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Receivable */}
                <div className="rounded-2xl border border-emerald-500/30 bg-zinc-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-zinc-400">Aapko Lena Hai (You will get)</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <ArrowDownLeft size={16} />
                        </div>
                    </div>
                    <div className="mt-3 text-2xl sm:text-3xl font-black text-emerald-400">
                        ₹{Number(overview.totalReceivable || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Logon se wapas aane wala paisa</div>
                </div>

                {/* Total Payable */}
                <div className="rounded-2xl border border-rose-500/30 bg-zinc-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-zinc-400">Aapko Dena Hai (You owe)</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div className="mt-3 text-2xl sm:text-3xl font-black text-rose-400">
                        ₹{Number(overview.totalPayable || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">Aapko jo chukana hai</div>
                </div>

                {/* Net Balance */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-zinc-400">Net Khata Balance</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                            <ArrowRightLeft size={16} />
                        </div>
                    </div>
                    <div className={`mt-3 text-2xl sm:text-3xl font-black ${
                        Number(overview.netBalance) > 0 ? "text-emerald-400" : Number(overview.netBalance) < 0 ? "text-rose-400" : "text-zinc-200"
                    }`}>
                        {Number(overview.netBalance) > 0 ? "+" : ""}
                        ₹{Number(overview.netBalance || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                        {Number(overview.netBalance) >= 0 ? "In your favor (Fayde me)" : "You owe more overall"}
                    </div>
                </div>
            </div>

            {/* 4. Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Person ka naam search karein (e.g. Rupam)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
                    {[
                        { key: "ALL", label: "Sabhi" },
                        { key: "RECEIVABLE", label: "Lena Hai (+)" },
                        { key: "PAYABLE", label: "Dena Hai (-)" },
                        { key: "SETTLED", label: "Settled (₹0)" }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`rounded-lg px-3 py-1.5 transition-colors cursor-pointer shrink-0 ${
                                filter === tab.key
                                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 5. Persons Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
                    <RefreshCw className="animate-spin text-emerald-400" size={32} />
                    <p className="mt-3 text-sm">Khata ledger load ho raha hai...</p>
                </div>
            ) : filteredPersons.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-10 text-center text-zinc-400">
                    <Users size={40} className="mx-auto text-zinc-600 mb-3" />
                    <h3 className="text-base font-semibold text-white">Koi Hisab Nahi Mila</h3>
                    <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
                        Aap WhatsApp se message bhej kar (e.g. "500 Rupam") ya upar "Naya Hisab Jodein" button se entry start kar sakte hain.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPersons.map((person) => {
                        const net = Number(person.netBalance || 0);
                        const isReceivable = net > 0;
                        const isPayable = net < 0;
                        const isSettled = net === 0;

                        return (
                            <div
                                key={person.id}
                                onClick={() => openPersonHistory(person)}
                                className={`group relative rounded-2xl border p-4 sm:p-5 shadow-lg transition-all duration-200 backdrop-blur-sm cursor-pointer ${
                                    isReceivable
                                        ? "border-emerald-500/30 bg-zinc-900/60 hover:border-emerald-500/60 hover:bg-zinc-900/90"
                                        : isPayable
                                        ? "border-rose-500/30 bg-zinc-900/60 hover:border-rose-500/60 hover:bg-zinc-900/90"
                                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-base ${
                                            isReceivable
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                : isPayable
                                                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                        }`}>
                                            {person.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                                {person.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <span>{person.recordsCount} entries</span>
                                                {person.lastCreatedAt && (
                                                    <span>• {formatDateIST(person.lastDate, person.lastCreatedAt)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Net Balance Badge */}
                                    <div className="text-right shrink-0">
                                        <div className={`text-lg font-black ${
                                            isReceivable ? "text-emerald-400" : isPayable ? "text-rose-400" : "text-zinc-400"
                                        }`}>
                                            {isReceivable ? "+" : ""}
                                            ₹{Math.abs(net).toLocaleString("en-IN")}
                                        </div>
                                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            isReceivable
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : isPayable
                                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                        }`}>
                                            {isReceivable ? "Lena Hai" : isPayable ? "Dena Hai" : "Settled"}
                                        </span>
                                    </div>
                                </div>

                                {/* Summary breakdown */}
                                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                                    <div>
                                        <span className="text-zinc-500">Diye: </span>
                                        <span className="font-semibold text-zinc-300">₹{Number(person.totalGiven || 0)}</span>
                                    </div>
                                    <div>
                                        <span className="text-zinc-500">Mile: </span>
                                        <span className="font-semibold text-zinc-300">₹{Number(person.totalReceived || 0)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {!isSettled && (
                                            <button
                                                onClick={(e) => handleSettle(person.id, e)}
                                                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/20 cursor-pointer"
                                                title="Hisab zero karein"
                                            >
                                                Settle
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDeletePerson(person.id, e)}
                                            className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                                            title="Delete person"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 6. Person History / Passbook Modal */}
            {selectedPerson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 p-5 bg-zinc-900/50">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                    {selectedPerson.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {selectedPerson.name}
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                            Number(selectedPerson.netBalance) > 0
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                : Number(selectedPerson.netBalance) < 0
                                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                                : "bg-zinc-800 text-zinc-400"
                                        }`}>
                                            {Number(selectedPerson.netBalance) > 0
                                                ? `₹${selectedPerson.netBalance} Lena Hai`
                                                : Number(selectedPerson.netBalance) < 0
                                                ? `₹${Math.abs(selectedPerson.netBalance)} Dena Hai`
                                                : "Settled"}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-zinc-400">Complete transaction timeline & passbook</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Quick Actions */}
                        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-3 bg-zinc-900/20 text-xs">
                            <span className="text-zinc-400">Total Entries: {historyList.length}</span>
                            <div className="flex items-center gap-2">
                                {Number(selectedPerson.netBalance) !== 0 && (
                                    <button
                                        onClick={() => handleSettle(selectedPerson.id)}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-all"
                                    >
                                        <CheckCircle2 size={13} /> Settle Full Account
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setFormData({
                                            personName: selectedPerson.name,
                                            amount: "",
                                            type: "YOU_GAVE",
                                            notes: "",
                                            date: new Date().toISOString().split("T")[0]
                                        });
                                        setIsAddModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1 font-semibold text-white transition-all"
                                >
                                    <Plus size={13} /> Nayi Entry
                                </button>
                            </div>
                        </div>

                        {/* History Passbook List */}
                        <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-800/60">
                            {historyLoading ? (
                                <div className="py-12 text-center text-zinc-400">
                                    <RefreshCw className="animate-spin mx-auto text-emerald-400" size={24} />
                                    <p className="mt-2 text-xs">Loading passbook...</p>
                                </div>
                            ) : historyList.length === 0 ? (
                                <div className="py-12 text-center text-zinc-500 text-xs">
                                    Koi entries nahi hain.
                                </div>
                            ) : (
                                historyList.map((item) => {
                                    const isGave = item.type === "YOU_GAVE";
                                    return (
                                        <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                                                    isGave
                                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                        : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                                }`}>
                                                    {isGave ? "↑" : "↓"}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {isGave ? "Aapne diye (Lena hai)" : "Usne diye (Mile / Wapas)"}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                                        <span className="flex items-center gap-1 text-[11px]">
                                                            <Calendar size={11} className="text-zinc-500" />
                                                            {formatDateIST(item.date, item.createdAt)}
                                                        </span>
                                                        {item.createdAt && (
                                                            <span className="flex items-center gap-1 text-[11px] bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60">
                                                                <Clock size={11} className="text-sky-400" />
                                                                {formatTimeIST(item.createdAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.notes && (
                                                        <p className="mt-1 text-xs text-zinc-500 italic max-w-sm">
                                                            {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className={`text-right font-black text-sm sm:text-base ${
                                                    isGave ? "text-emerald-400" : "text-rose-400"
                                                }`}>
                                                    {isGave ? "+" : "-"}₹{Number(item.amount).toLocaleString("en-IN")}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteRecord(item.id)}
                                                    className="text-zinc-600 hover:text-rose-400 p-1.5 rounded transition-colors"
                                                    title="Delete this entry"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 7. Add Record Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users size={18} className="text-emerald-400" />
                                Naya Hisab Jodein
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Vyakti ka Naam (Person Name)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rupam, Rahul, Aman..."
                                    value={formData.personName}
                                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    placeholder="500"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Transaction Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "YOU_GAVE" })}
                                        className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                                            formData.type === "YOU_GAVE"
                                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                                                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                                        }`}
                                    >
                                        Aapne Diye (+ Lena hai)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "YOU_GOT" })}
                                        className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                                            formData.type === "YOU_GOT"
                                                ? "border-rose-500 bg-rose-500/15 text-rose-400 shadow-md shadow-rose-500/10"
                                                : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                                        }`}
                                    >
                                        Usne Diye (- Lautaye)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Notes (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Lunch split, movie ticket, loan..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:from-emerald-400 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? "Save ho raha hai..." : "Save Entry"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
