"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import SalesForm from "@/components/SalesForm";
import SalesTable from "@/components/SalesTable";
import Summary from "@/components/Summary";
import Sidebar from "./Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoriesPage from "./CategoriesPage"; // Import new page
import { motion, AnimatePresence } from "framer-motion";


export default function SalesRecordApp() {
  const [sales, setSales] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Add this line to initialize categories




  //toggle darkmode

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };





  // Fetch user data and sales
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          setUser(currentUser);
          await fetchSalesFromFirestore(currentUser.uid); // Fetch sales
        } else {
          setUser(null);
          alert("Please verify your email before accessing the app.");
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false when done
    });

    // Check for saved dark mode preference
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    return () => unsubscribe();
  }, []); // Only run this effect on initial mount

  // Fetch categories from Firestore (Moved to its own useEffect)
  useEffect(() => {
    if (user) {
      const fetchCategories = async () => {
        try {
          const q = query(collection(db, "categories"));
          const querySnapshot = await getDocs(q);
          const categoryData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCategories(categoryData); // Update categories state
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories(); // Call fetch categories after user is authenticated
    }
  }, [user]); // Re-run this effect when the user changes




  // Fetch sales data from Firestore when user logs in
  const fetchSalesFromFirestore = async (userId) => {
    try {
      console.log("Fetching sales for user:", userId); // Debugging log
      const salesRef = collection(db, "sales");
      const q = query(salesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched sales from Firestore:", salesData); // Debugging log
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching sales from Firestore:", error);
    }
  };


  // Fetch exchange rate API
  const fetchExchangeRate = async (date) => {
    console.log(`Fetching historical exchange rate for date: ${date}`);
    const API_KEY = "eafde981a5e297fd4a73b4de8f95861a"; // Replace with your actual key
    const url = `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=USD&to=INR&amount=1&date=${date}`;

    try {
      console.log(`API URL: ${url}`);
      const response = await fetch(url);
      const data = await response.json();

      console.log("Exchange Rate API Full Response:", data);

      if (data.success && data.info && data.info.quote) {
        console.log(`Exchange rate on ${date}: 1 USD = ${data.info.quote} INR`);
        return data.info.quote;
      } else {
        console.warn(`API error or no exchange rate found for ${date}. Defaulting to 1.`);
        return 1;
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 1;
    }
  };

  // Add a new sale to Firestore
  const addSale = async (newSale) => {
    if (!user) {
      console.error("User not authenticated, cannot add sale.");
      return;
    }

    let amountInINR = parseFloat(newSale.amount);
    let originalAmount = parseFloat(newSale.amount);
    let originalCurrency = newSale.currency;

    if (newSale.currency === "USD") {
      const exchangeRate = await fetchExchangeRate(newSale.date); // Assume you have this function
      amountInINR *= exchangeRate;
    }

    try {
      const saleData = {
        ...newSale,
        userId: user.uid,
        amount: amountInINR,
        originalAmount,
        originalCurrency
      };

      const docRef = await addDoc(collection(db, "sales"), saleData);
      console.log("Sale added with ID:", docRef.id); // Debug log

      setSales([...sales, { id: docRef.id, ...saleData }]); // Update the sales state to reflect the new sale
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  // Delete a sale entry from Firestore
  const deleteSale = async (saleId) => {
    try {
      console.log("Deleting sale with ID:", saleId);

      // Delete from Firestore
      await deleteDoc(doc(db, "sales", saleId));

      // Remove the deleted sale from state
      setSales((prevSales) => prevSales.filter(sale => sale.id !== saleId));

      console.log("Sale deleted successfully!");
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  // Calculate totals
  const totalSales = sales.filter(s => s.type === "sales").reduce((acc, sale) => acc + sale.amount, 0);
  const totalSpends = sales.filter(s => s.type === "spends").reduce((acc, sale) => acc + sale.amount, 0);
  const totalProfitLoss = totalSales - totalSpends;

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setSales([]);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar Component */}
        <Sidebar onLogout={handleLogout} />

        {/* Main Content Area */}
        <div className="flex-grow p-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center space-y-4 animate-fadeIn">
                {/* Loading Spinner */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Preparing your dashboard...
                </p>
              </div>
            </div>
          ) : (
            <motion.div
                    key="main-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
            <Routes>
              {/* Default Dashboard Route */}
              <Route
                path="/"
                element={
                  !user ? (
                    showLogin ? (
                      <Login setShowLogin={setShowLogin} onAuthSuccess={() => setUser(auth.currentUser)} />
                    ) : (
                      <Signup setShowLogin={setShowLogin} onAuthSuccess={() => setUser(auth.currentUser)} />
                    )
                  ) : (
                    <div className="dashboard-container">
                      {/* Header Section */}
                      <div className="top-section">
                        <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
                        {/* <Button className="logout-btn" onClick={handleLogout}>
                          Logout
                        </Button> */}


                        {/* Dark Mode Toggle
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full 
        peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
        peer-checked:bg-blue-600">
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                          </span>
                        </label> */}

                      </div>

                      {/* Layout: Form & Summary are Fixed, Table Scrolls */}
                      <div className="dashboard-layout">
                        {/* Left Side: Form & Summary (Fixed) */}
                        <div className="fixed-section">
                          <div className="form-section">
                            <SalesForm addSale={addSale} categories={categories} />
                          </div>
                          <div className="summary-section">
                            <Summary totalSales={totalSales} totalSpends={totalSpends} totalProfitLoss={totalProfitLoss} />
                          </div>
                        </div>

                        {/* Right Side: Table (Scrollable) */}
                        <div className="scrollable-table">
                          <SalesTable sales={sales} deleteSale={deleteSale} categories={categories} />
                        </div>
                      </div>
                    </div>
                  )
                }
              />

              {/* Categories Management Page Route */}
              <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
            </motion.div>
          )}
        </div>
      </div>
    </Router>
  );
}
