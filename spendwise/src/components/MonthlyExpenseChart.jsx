
import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function MonthlyExpenseChart({ transactions }) {
  const monthlyData = useMemo(() => {
    const totals = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        if (!transaction.date) return;

        // Extract year and month from YYYY-MM-DD
        const month = transaction.date.slice(0, 7);
        const amount = Number(transaction.amount) || 0;

        totals[month] = (totals[month] || 0) + amount;
      });

    return Object.entries(totals)
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([month, expenses]) => ({
        month: new Date(`${month}-15T12:00:00`).toLocaleDateString(
          "en-IN",
          { month: "short", year: "numeric" }
        ),
        expenses,
      }));
  }, [transactions]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Monthly Expense Trend
      </h2>

      <p className="mb-5 mt-1 text-sm text-gray-500">
        Track how your spending changes over time
      </p>

      {monthlyData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          Add an expense to see your monthly trend.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="month" />

              <YAxis
                width={75}
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Expenses",
                ]}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MonthlyExpenseChart;
