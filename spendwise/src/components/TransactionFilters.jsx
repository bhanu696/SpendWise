
function TransactionFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="rounded-lg border border-gray-300 p-3"
      />

      <select
        value={typeFilter}
        onChange={(event) => onTypeChange(event.target.value)}
        className="rounded-lg border border-gray-300 p-3"
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="rounded-lg border border-gray-300 p-3"
      >
        
        <option value="all">All categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
        <option value="Shopping">Shopping</option>
        <option value="Income">Income</option>
        <option value="Other">Other</option>
      </select>

      

      <select
        value={sortOrder}
        onChange={(event) => onSortChange(event.target.value)}
        className="rounded-lg border border-gray-300 p-3"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="amountHigh">Amount: high to low</option>
        <option value="amountLow">Amount: low to high</option>
      </select>
    </div>
  );
}

export default TransactionFilters;
