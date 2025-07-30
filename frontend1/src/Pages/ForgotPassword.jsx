import React, { useState } from "react";

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Send reset link to:", emailOrPhone);
    // Add actual API logic here
  };

  return (
    <div className="min-h-screen bg-white-to-tr from-white to-sky-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-xl px-6 py-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-sky-500">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address, phone number or username and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email address, phone number or username"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded font-medium transition"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
