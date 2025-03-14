"use client";


import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, query, where  } from "firebase/firestore";
import { motion } from "framer-motion";
import SalesForm from "./SalesForm"; // Import the form

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("#000000");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [user, setUser] = useState(null);


    
    
    // Fetch categories from Firebase
    
    useEffect(() => {
        const fetchCategories = async () => {
            const user = auth.currentUser;
            if (!user) {
                setCategories([]); // ✅ Clear categories if logged out
                return;
            }
    
            try {
                const q = query(collection(db, "categories"), where("userId", "==", user.uid)); // ✅ Fetch only this user's categories
                const querySnapshot = await getDocs(q);
    
                const userCategories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                console.log("Fetched Categories:", userCategories); // ✅ Debugging
                setCategories(userCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
    
        fetchCategories();
    }, []);
    
    
    
    useEffect(() => {
        // ✅ Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
            setUser(loggedInUser);
            if (loggedInUser) {
                fetchCategories(loggedInUser.uid); // ✅ Fetch categories when user logs in
            } else {
                setCategories([]); // ✅ Clear categories when logged out
            }
        });
    
        return () => unsubscribe(); // ✅ Clean up listener
    }, []);
    
    const fetchCategories = async () => {
        const user = auth.currentUser;
        if (!user) {
            setCategories([]);
            return;
        }
    
        try {
            const q = query(collection(db, "categories"), where("userId", "==", user.uid)); // ✅ Fetch only the logged-in user's categories
            const querySnapshot = await getDocs(q);
    
            const userCategories = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            console.log("Fetched Categories:", userCategories); // ✅ Debugging
            setCategories(userCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    
    

    

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            alert("Category name cannot be empty!");
            return;
        }
    
        const user = auth.currentUser;
        if (!user) {
            alert("You need to be logged in to create categories.");
            return;
        }
    
        try {
            const docRef = await addDoc(collection(db, "categories"), {
                name: newCategoryName,
                color: newCategoryColor,
                userId: user.uid, // ✅ Store the user ID
            });
    
            setCategories([...categories, { id: docRef.id, name: newCategoryName, color: newCategoryColor, userId: user.uid }]);
            alert("Category created successfully!");
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category.");
        }
    };
    
    
    
    // Handle category update
    const handleUpdateCategory = async () => {
        if (editingCategory) {
            await updateDoc(doc(db, "categories", editingCategory.id), {
                name: newCategoryName,
                color: newCategoryColor,
            });

            setCategories(categories.map(cat => cat.id === editingCategory.id
                ? { ...cat, name: newCategoryName, color: newCategoryColor }
                : cat));
            setEditingCategory(null);
        }
    };

    // Handle category delete

    const handleDeleteCategory = async (categoryId) => {
        const user = auth.currentUser; // ✅ Get the currently logged-in user
    
        if (!user) {
            alert("You need to be logged in to delete categories.");
            return;
        }
    
        // ✅ Find the category to get the owner ID
        const categoryToDelete = categories.find(cat => cat.id === categoryId);
    
        if (!categoryToDelete) {
            alert("Category not found.");
            return;
        }
    
        console.log("Logged-in User ID:", user.uid);
        console.log("Category Owner ID:", categoryToDelete.userId);
    
        if (user.uid !== categoryToDelete.userId) {
            alert("You can only delete your own categories.");
            return;
        }
    
        try {
            await deleteDoc(doc(db, "categories", categoryId));
            setCategories(categories.filter((cat) => cat.id !== categoryId)); // ✅ Remove from state
            alert("Category deleted successfully!");
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category.");
        }
    };
    
    
    // const handleDeleteCategory = async (categoryId) => {
    //     await deleteDoc(doc(db, "categories", categoryId));
    //     setCategories(categories.filter(cat => cat.id !== categoryId));
    // };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

            {/* Create Category Button */}
            <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                ➕ Create Category
            </button>


            {/* List of Categories */}
            <ul>
                {categories.map((cat) => (
                    <li key={cat.id} className="flex justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2">
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            {cat.name}
                        </span>
                        <div>
                            <button onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); setNewCategoryColor(cat.color); }} className="text-blue-500 hover:text-blue-700 mx-2">✏ Edit</button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700">🗑 Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {showCategoryModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-2xl w-96"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
                        >
                            ✖
                        </button>

                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-200">Create New Category</h2>

                        {/* Category Name Input */}
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 w-full bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Category Color Picker */}
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">Choose Color:</label>
                        <input
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) => setNewCategoryColor(e.target.value)}
                            className="mb-4 w-full h-10 cursor-pointer rounded-md bg-gray-200 dark:bg-gray-600"
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
                                onClick={handleCreateCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Category Modal */}


            {editingCategory && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow-xl w-96 relative backdrop-blur-lg"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setEditingCategory(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
                        >
                            ✖
                        </button>

                        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Edit Category</h2>

                        {/* Category Name Input */}
                        <input
                            type="text"
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
                                onClick={() => setEditingCategory(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                        </div>


                    </motion.div>
                </div>
            )}
        </div>
    );
}
