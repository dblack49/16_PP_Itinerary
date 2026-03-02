import { Link } from "react-router";
import { ArrowLeft, DollarSign, Plus, Check, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Participant {
  id: string;   // e.g. "Pearl_1"
  name: string; // e.g. "Pearl 1"
}

interface Expense {
  description: string;
  amount: number;
  paidBy: string;        // display name (e.g. "Pearl 1")
  splitAmong: string[];  // display names
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

const FUNCTIONS_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60`;

export function SplitPaymentPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const pearlNames = useMemo(() => participants.map((p) => p.name), [participants]);

  const [expenses, setExpenses] = useState<Array<Expense & { id: string }>>([]);
  const [summary, setSummary] = useState<Record<string, PaymentSummary>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPearl, setSelectedPearl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  useEffect(() => {
    fetchParticipants();
    fetchExpenses();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const response = await fetch(`${FUNCTIONS_BASE}/participants`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.participants)) {
        setParticipants(data.participants);

        // Optional: if paidBy isn't set and there are participants, default it
        // setPaidBy((prev) => prev || (data.participants[0]?.name ?? ""));
      } else {
        console.error("Participants response unexpected:", data);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE}/expenses`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();

      if (data.success && data.expenses) {
        // NOTE: your existing function returns KV records; keep your current mapping logic
        const expensesWithIds = data.expenses.map((expense: any, index: number) => ({
          ...expense,
          id: Object.keys(expense)[0] || `expense-${index}`,
        }));
        setExpenses(expensesWithIds.sort((a: any, b: any) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE}/payment-summary`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();

      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const addExpense = async () => {
    if (!description || !amount || !paidBy || splitAmong.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          paidBy,        // display name
          splitAmong,    // display names
          status: "open",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDescription("");
        setAmount("");
        setPaidBy("");
        setSplitAmong([]);
        setShowAddForm(false);
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (expenseId: string, pearlName: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE}/expenses/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          pearlName,           // display name
          hasPaid: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchExpenses();
        fetchSummary();
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment. Please try again.");
    }
  };

  const toggleSplitPearl = (pearlDisplayName: string) => {
    setSplitAmong((prev) =>
      prev.includes(pearlDisplayName)
        ? prev.filter((p) => p !== pearlDisplayName)
        : [...prev, pearlDisplayName]
    );
  };

  const selectAllPearls = () => {
    setSplitAmong(pearlNames);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-pink-600 py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="glitter-effect"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-green-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-4">
            <DollarSign className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Rye', serif" }}>
                Split Payment Tracker 💰
              </h1>
              <p className="text-white/90 text-lg mt-2">Keep track of shared expenses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Select Your Name */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <label className="block text-lg mb-4 text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Select Your Name (to see your summary):
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
        </div>

        {/* Personal Summary */}
        {selectedPearl && summary[selectedPearl] && (
          <div className="bg-gradient-to-br from-pink-100 to-green-100 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-3xl mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Payment Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">You Owe</p>
                <p className="text-4xl font-bold text-red-600">
                  ${summary[selectedPearl].owes.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-2">You Are Owed</p>
                <p className="text-4xl font-bold text-green-600">
                  ${summary[selectedPearl].owed.toFixed(2)}
                </p>
              </div>
            </div>

            {summary[selectedPearl].details.length > 0 && (
              <div className="mt-6 bg-white rounded-xl p-6">
                <h3 className="text-xl mb-4 font-semibold text-gray-800">Details:</h3>
                <div className="space-y-3">
                  {summary[selectedPearl].details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-200 pb-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{detail.description}</p>
                        <p className="text-sm text-gray-600">Owes to: {detail.owesTo}</p>
                      </div>
                      <p className="text-lg font-bold text-red-600">${detail.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Expense Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-lg font-semibold"
          >
            <Plus className="w-6 h-6" />
            {showAddForm ? "Cancel" : "Add New Expense"}
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-green-300 mb-12">
            <h2 className="text-3xl mb-6 text-green-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Add New Expense
            </h2>

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
                        className="w-5 h-5 text-pink-600"
                      />
                      <span className="text-gray-700">{p.name}</span>
                    </label>
                  ))}
                </div>

                {splitAmong.length > 0 && amount && (
                  <p className="mt-2 text-sm text-gray-600">
                    ${(parseFloat(amount) / splitAmong.length).toFixed(2)} per person
                  </p>
                )}
              </div>

              <button
                onClick={addExpense}
                disabled={loading || !description || !amount || !paidBy || splitAmong.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "✨ Add Expense"}
              </button>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-6">
          <h2 className="text-3xl text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            All Expenses
          </h2>

          {expenses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No expenses yet. Add one to get started!</p>
            </div>
          ) : (
            expenses.map((expense) => {
              const perPerson = expense.amount / expense.splitAmong.length;

              return (
                <div
                  key={expense.id}
                  className={`bg-white rounded-xl p-6 shadow-lg border-4 ${
                    expense.status === "settled" ? "border-green-300" : "border-pink-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{expense.description}</h3>
                      <p className="text-gray-600 mt-1">
                        Paid by <span className="font-semibold text-pink-600">{expense.paidBy}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${perPerson.toFixed(2)} each</p>
                      <span
                        className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                          expense.status === "settled"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {expense.status === "settled" ? "✓ Settled" : "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-3">Payment Status:</p>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {expense.splitAmong.map((pearl) => {
                        const isPayer = pearl === expense.paidBy;
                        const hasPaid = expense.payments && expense.payments[pearl];

                        return (
                          <div
                            key={pearl}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isPayer
                                ? "bg-blue-50 border-2 border-blue-300"
                                : hasPaid
                                ? "bg-green-50 border-2 border-green-300"
                                : "bg-gray-50 border-2 border-gray-300"
                            }`}
                          >
                            <span className="text-sm font-semibold text-gray-800">{pearl}</span>
                            {isPayer ? (
                              <span className="text-blue-600 text-xs">Payer</span>
                            ) : hasPaid ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : selectedPearl === pearl || selectedPearl === expense.paidBy ? (
                              <button
                                onClick={() => togglePayment(expense.id, pearl, hasPaid || false)}
                                className="text-pink-600 hover:text-pink-700 text-xs font-semibold"
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <X className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Added on {new Date(expense.timestamp).toLocaleDateString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}