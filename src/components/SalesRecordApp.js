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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SalesRecordApp() {
  const [sales, setSales] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(false);


  //toggle darkmode

  const toggleDarkMode = () => {
    setShowSplash(true); // Show splash screen

    setTimeout(() => {
      if (darkMode) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
      setDarkMode(!darkMode);
      setShowSplash(false); // Hide splash after animation
    }, 700); // Adjust timing to match animation
  };





  useEffect(() => {
    // Check Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          setUser(currentUser);
          await fetchSalesFromFirestore(currentUser.uid);
        } else {
          setUser(null);
          alert("Please verify your email before accessing the app.");
        }
      } else {
        setUser(null);
      }
    });

    // Check for saved dark mode preference
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    return () => unsubscribe();
  }, []);

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
      console.log(`Fetching exchange rate for ${newSale.date}...`);
      const exchangeRate = await fetchExchangeRate(newSale.date);
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

      console.log("Saving to Firestore:", saleData); // Debug log

      const docRef = await addDoc(collection(db, "sales"), saleData);
      console.log("Sale added with ID:", docRef.id); // Debug log

      setSales([...sales, { id: docRef.id, ...saleData }]);
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-6 max-w-2xl mx-auto">

        {/* 🔹 Splash Screen Effect (Appears when switching themes) */}
        {showSplash && (
          <div className="fixed inset-0 bg-blue-500 dark:bg-black z-50 flex items-center justify-center animate-fadeOut">
            <span className="text-white text-2xl font-bold animate-scaleUp">
              Switching Theme...
            </span>
          </div>
        )}

        {/* 🌙 Dark Mode Toggle Button */}
        <div className="flex justify-end mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </span>
          </label>
        </div>
        {!user ? (
          showLogin ? (
            <Login onAuthSuccess={() => setUser(auth.currentUser)} />
          ) : (
            <Signup onAuthSuccess={() => setUser(auth.currentUser)} />
          )
        ) : (
          <>
            <h1 className="text-xl font-bold mb-4">Sales Record</h1>
            <Button className="bg-red-500 text-white p-2 mb-4" onClick={handleLogout}>Logout</Button>
            <SalesForm addSale={addSale} />
            <SalesTable sales={sales} deleteSale={deleteSale} />
            <Summary totalSales={totalSales} totalSpends={totalSpends} totalProfitLoss={totalProfitLoss} />
          </>
        )}

        {!user && (
          <Button className="mt-4 p-2 border rounded" onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Go to Signup" : "Go to Login"}
          </Button>
        )}
      </div>
    </div>
  );
}
