"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalesForm({ addSale }) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    currency: "INR",
    type: "sales",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.description || !formData.amount) return;
    addSale(formData);
    setFormData({ date: "", description: "", amount: "", currency: "INR", type: "sales" });
  };

  return (
    <Card className="p-6 mb-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl transition-all duration-300 hover:shadow-xl">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Date</label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <Input
            type="text"
            name="description"
            placeholder="Enter transaction details"
            value={formData.description}
            onChange={handleChange}
            className="border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Amount</label>
          <Input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            className="border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Currency Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Currency</label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Type Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Type</label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="sales">Sales</option>
            <option value="spends">Spends</option>
          </select>
        </div>
      </CardContent>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md transition-all duration-300"
        >
          ➕ Add Record
        </Button>
      </div>
    </Card>
  );
}
