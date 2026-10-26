import { useState, useEffect } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import SummaryCard from "../components/SummaryCard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionFilters from "../components/TransactionFilters";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";
import { exportTransactionsToCSV } from "../utils/exportTransactions";

function Dashboard() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getTransactions();
        setTransactions(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "spendwise-transactions",
        JSON.stringify(transactions),
      );
    } catch (error) {
      console.error("Failed to save transactions:", error);
    }
  }, [transactions]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = transactions
    .filter((transaction) =>
      transaction.title.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .filter((transaction) =>
      typeFilter === "all" ? true : transaction.type === typeFilter,
    )
    .filter((transaction) =>
      categoryFilter === "all" ? true : transaction.category === categoryFilter,
    )

    .filter((transaction) => {
      if (startDate && transaction.date < startDate) {
        return false;
      }

      if (endDate && transaction.date > endDate) {
        return false;
      }

      return true;
    });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOrder) {
      case "oldest":
        return a.date.localeCompare(b.date);

      case "amountHigh":
        return b.amount - a.amount;

      case "amountLow":
        return a.amount - b.amount;

      case "newest":
      default:
        return b.date.localeCompare(a.date);
    }
  });

  async function handleAddTransaction(newTransaction) {
    setSuccessMessage("");
    try {
      setError("");
      setSuccessMessage("");

      const savedTransaction = await createTransaction(newTransaction);

      setTransactions((previous) => [savedTransaction, ...previous]);

      setSuccessMessage("Transaction added successfully!");
    } catch (err) {
      setError(err.message || "Failed to create transaction");
      throw err;
    }
  }

  async function handleDeleteTransaction(id) {
    if (deletingTransactionId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) return;

    setDeletingTransactionId(id);
    setError("");
    setSuccessMessage("");

    try {
      await deleteTransaction(id);

      setTransactions((previous) =>
        previous.filter((transaction) => transaction._id !== id),
      );

      setSuccessMessage("Transaction deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete transaction");
    } finally {
      setDeletingTransactionId(null);
    }
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
  }

  async function handleUpdateTransaction(updatedTransaction) {
    setSuccessMessage("");
    try {
      setError("");
      setSuccessMessage("");

      const savedTransaction = await updateTransaction(
        updatedTransaction._id,
        updatedTransaction,
      );

      setTransactions((previous) =>
        previous.map((transaction) =>
          transaction._id === savedTransaction._id
            ? savedTransaction
            : transaction,
        ),
      );

      setEditingTransaction(null);
      setSuccessMessage("Transaction updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update transaction");
      throw err;
    }
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      {successMessage && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-green-700"
        >
          {successMessage}
        </p>
      )}
      {loading && <p className="mb-4 text-gray-500">Loading transactions...</p>}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      )}

      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Good afternoon</h1>

          <p className="mt-2 text-gray-500">Here's your financial overview.</p>
        </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Balance"
            value={`₹${balance.toLocaleString()}`}
            color="blue"
          />

          <SummaryCard
            title="Income"
            value={`₹${totalIncome.toLocaleString()}`}
            color="green"
          />

          <SummaryCard
            title="Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
            color="red"
          />

          <SummaryCard
            title="Saving"
            value={`₹${(totalIncome - totalExpenses).toLocaleString()}`}
            color="green"
          />
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Search & Filter
        </h2>

        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Add Transaction
        </h2>

        <TransactionForm
          onAddTransaction={handleAddTransaction}
          editingTransaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />
      </section>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your latest financial activity
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportTransactionsToCSV(transactions)}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
        >
          Export CSV
        </button>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Start date</label>

            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">End date</label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Clear dates
        </button>

        <TransactionList
          transactions={sortedTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
           deletingTransactionId={deletingTransactionId}
        />
      </section>
      <IncomeExpenseChart transactions={transactions} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IncomeExpenseChart transactions={transactions} />

        <CategoryPieChart transactions={transactions} />
      </div>
      <MonthlyExpenseChart transactions={transactions} />
    </main>
  );
}

export default Dashboard;
