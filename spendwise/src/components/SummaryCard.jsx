
const colorStyles = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  red: "text-red-600 bg-red-50",
};

function SummaryCard({ title, value, color = "blue" }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2
        className={`mt-3 text-2xl font-bold ${
          colorStyles[color] || colorStyles.blue
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

export default SummaryCard;
