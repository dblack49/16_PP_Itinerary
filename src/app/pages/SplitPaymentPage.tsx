import { Link } from "react-router";
import { ArrowLeft, DollarSign, Plus, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Participant {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  status: string;
  payments: Record<string, boolean>;
  timestamp: number;
}

interface PaymentSummary {
  owes: number;
  owed: number;
  details: Array<{
    description: string;
    amount: number;
    owesTo: string;
    status: string;
  }>;
}

const FUNCTIONS_BASE = `https://${projectId}.supabase.co/functions/v1/server`;

export function SplitPaymentPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const pearlNames = useMemo(() => participants.map((p) => p.name), [participants]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Record<string, PaymentSummary>>({});

  const [selectedPearl, setSelectedPearl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettled, setShowSettled] = useState(false);

  // form
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); // string input
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    fetchParticipants();
    fetchExpenses();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default paidBy to selectedPearl if payer is adding an expense
  useEffect(() => {
    if (selectedPearl && !paidBy) setPaidBy(selectedPearl);
  }, [selectedPearl, paidBy]);

  const fetchParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/participants`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.participants)) {
        setParticipants(data.participants);
      }
    } catch (e) {
      console.error("fetchParticipants error:", e);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/expenses`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();

      // NEW: DB endpoint already returns an array of expenses with ids
      if (data?.success && Array.isArray(data.expenses)) {
        setExpenses(data.expenses.sort((a: Expense, b: Expense) => b.timestamp - a.timestamp));
      }
    } catch (e) {
      console.error("fetchExpenses error:", e);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/payment-summary`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      if (data?.success && data.summary) setSummary(data.summary);
    } catch (e) {
      console.error("fetchSummary error:", e);
    }
  };

  const toggleSplitPearl = (pearlDisplayName: string) => {
    setSplitAmong((prev) =>
      prev.includes(pearlDisplayName)
        ? prev.filter((p) => p !== pearlDisplayName)
        : [...prev, pearlDisplayName],
    );
  };

  const selectAllPearls = () => setSplitAmong(pearlNames);

  const addExpense = async () => {
    const amt = Number(amount);

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }
    if (!paidBy) {
      alert("Please select who paid.");
      return;
    }
    if (splitAmong.length === 0) {
      alert("Please select at least one person to split among.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: amt,
          paidBy, // display name
          splitAmong, // display names
          status: "open",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        console.error("addExpense failed:", data);
        alert(data?.error ?? "Failed to add expense.");
        return;
      }

      // reset form
      setDescription("");
      setAmount("");
      setPaidBy(selectedPearl || ""); // keep default payer if selected
      setSplitAmong([]);
      setShowAddForm(false);

      await Promise.all([fetchExpenses(), fetchSummary()]);
    } catch (e) {
      console.error("addExpense error:", e);
      alert("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (expenseId: string, pearlName: string, current: boolean) => {
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/expenses/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          pearlName, // display name
          hasPaid: !current,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        console.error("togglePayment failed:", data);
        alert(data?.error ?? "Failed to update payment.");
        return;
      }

      await Promise.all([fetchExpenses(), fetchSummary()]);
    } catch (e) {
      console.error("togglePayment error:", e);
      alert("Failed to update payment. Please try again.");
    }
  };

  const computeFinancials = (expense: Expense) => {
    const perPerson = expense.amount / expense.splitAmong.length;

    const unpaidCount = expense.splitAmong.filter((name) => {
      if (name === expense.paidBy) return false;
      return !(expense.payments && expense.payments[name]);
    }).length;

    const remaining = unpaidCount * perPerson;

    const payerShare = expense.splitAmong.includes(expense.paidBy) ? perPerson : 0;
    const collected = (expense.amount - payerShare) - remaining;

    return { perPerson, remaining, collected };
  };

  const currentExpenses = expenses.filter((e) => computeFinancials(e).remaining >= 0.01);
  const settledExpenses = expenses.filter((e) => computeFinancials(e).remaining < 0.01);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-pink-600 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-white" />
            <h1 className="text-4xl text-white font-bold">Split Payment Tracker 💰</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Select Your Name */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <label className="block text-lg mb-3 text-gray-800 font-semibold">
            Select Your Name (to view and update payments):
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedPearl}
              onChange={(e) => setSelectedPearl(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-pink-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
              disabled={loadingParticipants}
            >
              <option value="">
                {loadingParticipants ? "Loading names..." : "Choose your name..."}
              </option>
              {participants.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={fetchParticipants}
              disabled={loadingParticipants}
              className="px-5 py-3 rounded-xl border-2 border-green-300 text-green-700 hover:bg-green-50 transition disabled:opacity-50"
            >
              {loadingParticipants ? "Refreshing..." : "Refresh Names"}
            </button>
          </div>

          {/* Quick summary (optional, but nice) */}
          {selectedPearl && summary[selectedPearl] && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-xl p-4 text-center border border-pink-200">
                <p className="text-gray-600 mb-1">You Owe</p>
                <p className="text-3xl font-bold text-red-600">
                  ${summary[selectedPearl].owes.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <p className="text-gray-600 mb-1">You Are Owed</p>
                <p className="text-3xl font-bold text-green-700">
                  ${summary[selectedPearl].owed.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add Expense Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAddForm((s) => !s)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-lg font-semibold"
          >
            <Plus className="w-6 h-6" />
            {showAddForm ? "Cancel" : "Add New Expense"}
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-green-300">
            <h2 className="text-3xl mb-6 text-green-800 font-bold">Add New Expense</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">What was it for?</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Airbnb, Party Bus, Dinner..."
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-600 text-lg">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Who paid?</label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={loadingParticipants}
                >
                  <option value="">Select who paid...</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {selectedPearl && (
                  <p className="text-xs text-gray-500 mt-2">
                    Tip: selecting your name above will auto-fill “Who paid?”
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-gray-700 font-semibold">Split among:</label>
                  <button
                    onClick={selectAllPearls}
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
                    type="button"
                  >
                    Select All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto border-2 border-green-300 rounded-xl p-4">
                  {participants.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={splitAmong.includes(p.name)}
                        onChange={() => toggleSplitPearl(p.name)}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-700">{p.name}</span>
                    </label>
                  ))}
                </div>

                {splitAmong.length > 0 && Number.isFinite(Number(amount)) && Number(amount) > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    ${(Number(amount) / splitAmong.length).toFixed(2)} per person
                  </p>
                )}
              </div>

              <button
                onClick={addExpense}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "✨ Add Expense"}
              </button>
            </div>
          </div>
        )}

        {/* CURRENT EXPENSES */}
        <section>
          <h2 className="text-3xl mb-6 font-bold">Current Expenses</h2>

          {currentExpenses.length === 0 ? (
            <p className="text-gray-500">All expenses settled 🎉</p>
          ) : (
            currentExpenses.map((expense) => {
              const { perPerson, remaining, collected } = computeFinancials(expense);

              return (
                <div
                  key={expense.id}
                  className="bg-white p-6 rounded-xl shadow-lg mb-6 border-4 border-pink-300"
                >
                  <div className="flex justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold">{expense.description}</h3>
                      <p className="text-gray-600">
                        Paid by <span className="font-semibold text-pink-600">{expense.paidBy}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${perPerson.toFixed(2)} each</p>
                      <p className="text-sm mt-1">
                        Remaining: <span className="font-bold">${remaining.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-gray-500">Collected: ${collected.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {expense.splitAmong.map((pearl) => {
                      const isPayer = pearl === expense.paidBy;
                      const hasPaid = Boolean(expense.payments?.[pearl]);

                      const canToggle =
                        // payer can mark received for anyone
                        selectedPearl === expense.paidBy ||
                        // a person can mark themselves paid
                        selectedPearl === pearl;

                      return (
                        <div
                          key={pearl}
                          className={`p-3 rounded-lg border flex justify-between items-center ${
                            isPayer
                              ? "bg-blue-50 border-blue-300"
                              : hasPaid
                              ? "bg-green-50 border-green-300"
                              : "bg-gray-50 border-gray-300"
                          }`}
                        >
                          <span className="text-sm font-semibold text-gray-800">{pearl}</span>

                          {isPayer ? (
                            <span className="text-blue-600 text-xs font-semibold">Payer</span>
                          ) : hasPaid ? (
                            <Check className="text-green-600 w-5 h-5" />
                          ) : canToggle ? (
                            <button
                              onClick={() => togglePayment(expense.id, pearl, hasPaid)}
                              className="text-pink-600 hover:text-pink-700 text-xs font-semibold"
                            >
                              {selectedPearl === expense.paidBy ? "Mark Received" : "Mark Paid"}
                            </button>
                          ) : (
                            <X className="text-gray-400 w-5 h-5" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Added on {new Date(expense.timestamp).toLocaleDateString()}
                  </p>
                </div>
              );
            })
          )}
        </section>

        {/* SETTLED SECTION */}
        {settledExpenses.length > 0 && (
          <section>
            <button
              onClick={() => setShowSettled((s) => !s)}
              className="text-lg font-semibold text-gray-700 hover:text-gray-900"
            >
              {showSettled ? "Hide" : "Show"} Settled ({settledExpenses.length})
            </button>

            {showSettled &&
              settledExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-6 rounded-xl shadow-md mt-4 border-4 border-green-300"
                >
                  <h3 className="text-xl font-bold">{expense.description}</h3>
                  <p className="text-green-700 font-semibold">✓ Settled</p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}