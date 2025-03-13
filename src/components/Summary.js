"use client";

export default function Summary({ totalSales, totalSpends, totalProfitLoss }) {
  return (
    <div className="mt-4 p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-3">Summary</h2>
      <p className="text-green-600 dark:text-green-400 font-semibold">
        Total Sales: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSales)}
      </p>
      <p className="text-red-500 dark:text-red-400 font-semibold">
        Total Spends: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpends)}
      </p>
      <p className={`font-bold ${totalProfitLoss >= 0 ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500'}`}>
        Profit/Loss: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalProfitLoss)}
      </p>
    </div>
  );

}
