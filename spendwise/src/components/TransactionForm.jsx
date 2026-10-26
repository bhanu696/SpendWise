import { useState, useEffect } from "react";

function TransactionForm({
  onAddTransaction,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setError("");
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(String(editingTransaction.amount));
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
    } else {
      setTitle("");
      setAmount("");
      setType("expense");
      setCategory("Food");
    }
  }, [editingTransaction]);

  async function handleSubmit(event) {
    event.preventDefault();

    // Stop duplicate submissions
    if (isSubmitting) return;

    if (!title.trim()) {
      setError("Please enter a transaction title.");
      return;
    }

    if (
      amount.trim() === "" ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      setError("Please enter an amount greater than ₹0.");
      return;
    }

    if (title.trim().length > 100) {
      setError("Transaction title cannot exceed 100 characters.");
      return;
    }

    const transactionData = {
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: editingTransaction
        ? editingTransaction.date
        : new Date().toISOString().slice(0, 10),
    };

    setError("");
    setIsSubmitting(true);

    try {
      if (editingTransaction) {
        await onUpdateTransaction({
          ...editingTransaction,
          ...transactionData,
        });
      } else {
        await onAddTransaction(transactionData);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Transaction title
        </label>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Groceries"
          className="w-full rounded-lg border border-gray-300 p-3"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Amount (₹)</label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="e.g. 1200"
          className="w-full rounded-lg border border-gray-300 p-3"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Income">Income</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Saving..."
          : editingTransaction
            ? "Save Changes"
            : "+ Add Transaction"}
      </button>
      {editingTransaction && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancelEdit}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel Editing
        </button>
      )}
    </form>
  );
}

export default TransactionForm;
