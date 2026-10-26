function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  deletingTransactionId,
}) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">No transactions yet.</p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0"
        >
          <div className="min-w-0">
            <h3 className="truncate font-medium text-gray-900">
              {transaction.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {transaction.category} · {transaction.date}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`font-semibold ${
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}₹
              {Number(transaction.amount).toLocaleString("en-IN")}
            </span>

            <button
              type="button"
              disabled={deletingTransactionId === transaction._id}
              onClick={() => onDeleteTransaction(transaction._id)}
              aria-label={`Delete ${transaction.title}`}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                deletingTransactionId === transaction._id
                  ? "Deleting transaction"
                  : "Delete transaction"
              }
            >
              {deletingTransactionId === transaction._id ? "..." : "Delete"}
            </button>

            <button
              type="button"
              onClick={() => onEditTransaction(transaction)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
