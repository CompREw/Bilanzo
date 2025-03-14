import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { motion } from "framer-motion";

export default function Login({ setShowLogin, onAuthSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if email is verified before allowing login
            if (!user.emailVerified) {
                setError("Please verify your email before logging in.");
                return;
            }

            onAuthSuccess(); // Redirect after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onAuthSuccess();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset link has been sent to your email.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/your-image.jpg')" }}>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                class="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md relative overflow-hidden transform transition-all hover:scale-105"
            >
                {/* Floating Circles for Creative Effect */}
                {/* <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-300 dark:bg-gray-700 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-300 dark:bg-gray-700 rounded-full opacity-30"></div> */}

                {/* Login Heading */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Login to continue</p>


                {/* TWo switching buttons */}
                <div className="flex justify-center mb-6 space-x-4">
                    <button
                        onClick={() => setShowLogin(true)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${true ? "bg-gray-400 text-white cursor-default"
                                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                            }`}
                        disabled={true} // Always disabled on Login page
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setShowLogin(false)}
                        className="px-6 py-2 rounded-lg font-semibold transition-all bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    >
                        Signup
                    </button>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Email Field */}
                <div className="relative mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none"
                    />
                </div>

                {/* Password Field */}
                <div className="relative mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none"
                    />
                </div>

                {/* Login Button */}
                <button
                    className="w-full bg-black text-white font-semibold py-4 rounded-lg text-lg hover:bg-gray-900 transition"
                    onClick={handleLogin}
                >
                    Login
                </button>

                {/* Google Sign-In */}
                <div className="text-center my-4 text-gray-500 dark:text-gray-400">or</div>
                <button
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-4 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition"
                    onClick={handleGoogleSignIn}
                >
                    <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />
                    Sign in with Google
                </button>

                {/* Forgot Password */}
                <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                    Forgot Password?{" "}
                    <button onClick={handleResetPassword} className="text-blue-500 hover:underline">
                        Reset Password
                    </button>
                </p>
            </motion.div>
        </div>

    );

}
