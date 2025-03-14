"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SalesForm({ addSale }) {
  // States for managing categories and popup for creating new ones
  const [categories, setCategories] = useState([]); // State to store categories
  const [showCategoryModal, setShowCategoryModal] = useState(false); // State to manage category modal visibility
  const [newCategoryName, setNewCategoryName] = useState(""); // State to store new category name
  const [newCategoryColor, setNewCategoryColor] = useState("#000000"); // State to store new category color
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    currency: "INR",
    category: "", // Add category to form data
    type: "sales",

  });





  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
        const user = auth.currentUser; // ✅ Get logged-in user

        if (!user) return; // If no user, don't fetch

        try {
            const q = query(collection(db, "categories"), where("userId", "==", user.uid)); // ✅ Fetch only this user's categories
            const querySnapshot = await getDocs(q);
            setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    fetchCategories();
}, []);


  // Function to Save Category (Update Existing or Add New)
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      if (editingCategory) {
        // ✅ Update existing category in Firebase
        await updateDoc(doc(db, "categories", editingCategory.id), {
          name: newCategoryName,
          color: newCategoryColor,
        });

        // ✅ Update UI
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, name: newCategoryName, color: newCategoryColor }
              : cat
          )
        );

        setEditingCategory(null); // ✅ Reset editing state
      } else {
        // ✅ Add new category to Firebase
        const categoryRef = await addDoc(collection(db, "categories"), {
          name: newCategoryName,
          color: newCategoryColor,
        });

        // ✅ Update UI with new category
        setCategories((prev) => [
          ...prev,
          { id: categoryRef.id, name: newCategoryName, color: newCategoryColor },
        ]);
      }

      // ✅ Close popup and reset fields
      setShowCategoryModal(false);
      setNewCategoryName("");
      setNewCategoryColor("#000000");
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category. Check console for details.");
    }
  };

  // Function to Edit Category
  const handleEditCategory = (category) => {
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
    setEditingCategory(category); // Store current category for update
    setShowCategoryModal(true);
  };

  // Function to Delete Category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // const fetchCategories = async () => {
  //   const q = query(collection(db, "categories"), where("userId", "==", user.uid));
  //   const querySnapshot = await getDocs(q);
  //   const categoriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //   setCategories(categoriesData);
  // };

  const handleCategoryChange = (e) => {
    if (e.target.value === "create") {
        navigate("/categories"); // Redirect instead of opening modal
    } else {
        setFormData({ ...formData, category: e.target.value });
    }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.description || !formData.amount) return;
    addSale(formData);
    setFormData({ date: "", description: "", amount: "", currency: "INR", type: "sales", category: "" });
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

        {/* Category Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Category</label>
          <div className="relative">
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="create">➕ Create One</option>
            </select>
          </div>
        </div>

        {/* Category List with Edit & Delete Options */}
        {/* <ul className="mt-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg my-1">
              {/* Category Name with Color */}
        {/* <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                {cat.name}
              </span> */}

        {/* Edit & Delete Buttons */}
        {/* <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="text-blue-500 hover:text-blue-700 transition"
                > */}
        {/* ✏ Edit */}
        {/* </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul> */}

        {/* AnimatePresence ensures smooth exit animations */}
        <AnimatePresence>
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[99999]">

<div className="fixed inset-0 flex items-center justify-center z-[10000]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96 relative z-[10001]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
                >
                  ✖
                </button>

                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Create New Category</h2>

                {/* Category Name Input */}
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500"
                />

                {/* Category Color Picker */}
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="mb-4 w-full h-10 cursor-pointer"
                />

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Cancel

                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
              </div>
            </div>
          )}

        </AnimatePresence>

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
