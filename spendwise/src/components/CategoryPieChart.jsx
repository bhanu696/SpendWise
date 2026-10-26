
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

function CategoryPieChart({ transactions }) {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(
      (transaction) => transaction.type === "expense"
    );

    const totals = expenses.reduce((result, transaction) => {
      const category = transaction.category || "Other";
      const amount = Number(transaction.amount) || 0;

      result[category] = (result[category] || 0) + amount;

      return result;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Spending by Category
      </h2>

      <p className="mb-4 mt-1 text-sm text-gray-500">
        See which categories use the most money
      </p>

      {categoryData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          Add an expense to see your spending breakdown.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={3}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Spent",
                ]}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default CategoryPieChart;
