"use client";

export default function Summary({ totalSales, totalSpends, totalProfitLoss }) {
  return (
    <div className="summary-card">
      <div className="summary-item">
        <span>💰 Sales:</span> <strong>₹{totalSales}</strong>
      </div>
      <div className="summary-item">
        <span>📉 Spends:</span> <strong>₹{totalSpends}</strong>
      </div>
      <div className="summary-item">
        <span>📊 Profit/Loss:</span> <strong>₹{totalProfitLoss}</strong>
      </div>
    </div>
  );
}
