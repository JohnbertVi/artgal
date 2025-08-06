import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/bg.png";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Swal from "sweetalert2";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setEmail("");
      setPassword("");
      setError("");

      if (userCredential.user.email === "admin@gmail.com") {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin/dashboard");
        });
      } else {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/home");
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Forgot Password",
      text: "Enter your email address:",
      input: "email",
      inputLabel: "Email address",
      inputPlaceholder: "Enter your email",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Email address is required";
        }
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          title: "Password Reset Email Sent",
          text: `A password reset link has been sent to ${email}. Please check your inbox.`,
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      <img
        className="fixed inset-0 w-full h-full object-cover opacity-70 pointer-events-none select-none"
        src={bg}
        alt="background"
      />
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col gap-8 relative z-10">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Log in
          </h2>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80 transition"
            >
              Register
            </Link>
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-gray-100 text-gray-900 transition"
                  placeholder="Name@email.com"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser className="w-5 h-5" />
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-gray-100 text-gray-900 transition"
                  placeholder="Password"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock className="w-5 h-5" />
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs text-primary hover:underline hover:text-primary/80 transition"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-base shadow hover:bg-primary/90 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
