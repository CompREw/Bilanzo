import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Signup({ onAuthSuccess }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);
      setSuccess("Signup successful! Please verify your email before logging in.");

      console.log("User signed up:", { name, company, phone });

      // Do not auto-login until email is verified
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setSuccess("Signed up successfully using Google!");
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-400 dark:from-gray-900 dark:to-black">
      
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden transform transition-all hover:scale-105">
        {/* Floating Circles for Creative Effect */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-300 dark:bg-gray-700 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-300 dark:bg-gray-700 rounded-full opacity-30"></div>
  
        {/* Signup Heading */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Create an Account</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Join us today!</p>
  
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
        {/* Name Field */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 transition-all"
          />
        </div>
  
        {/* Email Field */}
        <div className="relative mb-4">
          <input 
            type="email" 
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 transition-all"
          />
        </div>
  
        {/* Password Field */}
        <div className="relative mb-4">
          <input 
            type="password" 
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 transition-all"
          />
        </div>
  
        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input 
            type="password" 
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 transition-all"
          />
        </div>
  
        {/* Signup Button */}
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg"
          onClick={handleSignup}
        >
          Sign Up
        </button>
  
        {/* Google Signup */}
        <div className="text-center my-4 text-gray-500 dark:text-gray-400">or</div>
        <button 
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all shadow-lg"
          onClick={handleGoogleSignup}
        >
          <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
  
}