
export function exportTransactionsToCSV(transactions) {
  if (transactions.length === 0) {
    alert("There are no transactions to export.");
    return;
  }

  const headers = [
    "Title",
    "Amount",
    "Type",
    "Category",
    "Date",
  ];

  const rows = transactions.map((transaction) => [
    transaction.title,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date,
  ]);

  // Escape CSV values containing commas, quotes, or newlines
  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  // Add a BOM to help Excel display UTF-8 characters correctly
  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "spendwise-transactions.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
