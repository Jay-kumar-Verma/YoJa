import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign Up") {
      console.log("Signing up with phone:", phone);
    } else {
      console.log("Logging in...");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-[90%] sm:max-w-xl m-auto mt-14 bg-white p-8 rounded-lg shadow-md text-gray-800 mb-20"
    >
      <h2 className="text-2xl font-bold mb-1 text-center text-black-500">
        {currentState === "Login" ? "Sign In" : "Create your account"}
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        {currentState === "Login"
          ? "Welcome back! Please login to your account."
          : "Join thousands of users perfecting their yoga practice with AI"}
      </p>

      {currentState === "Sign Up" && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="First name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="number"
              placeholder="Weight"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
            <input
              type="number"
              placeholder="Height"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full">
              <label htmlFor="gender" className="text-sm mb-1 font-medium">Gender</label>
              <select
                id="gender"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                required
              >
                <option>Male</option>
                <option>Female</option>
                <option>Prefer Not to Say</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="level" className="text-sm mb-1 font-medium">Level</label>
              <select
                id="level"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                required
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <PhoneInput
            country={"in"}
            value={phone}
            onChange={setPhone}
            enableSearch={true}
            placeholder="Phone Number"
            containerClass="w-full mb-4"
            inputClass="!w-full !h-[42px] !pl-12 !border !border-gray-300 !rounded !text-sm !text-gray-800"
            buttonClass="!bg-white !border-r !border-gray-300"
            dropdownClass="!text-sm"
            searchClass="!text-sm"
          />
        </>
      )}

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm"
        required
      />
      <input
        type="password"
        placeholder={
          currentState === "Sign Up" ? "Create a password" : "Enter your password"
        }
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm"
        required
      />
      {currentState === "Sign Up" && (
        <input
          type="password"
          placeholder="Confirm your password"
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-sm"
          required
        />
      )}

      {currentState === "Sign Up" && (
        <div className="flex items-center text-sm mb-4">
          <input type="checkbox" id="terms" className="mr-2" required />
          <label htmlFor="terms">
            I agree to the{" "}
            <a href="#" className="text-sky-500 underline">Terms of Service</a> and{" "}
            <a href="#" className="text-sky-500 underline">Privacy Policy</a>
          </label>
        </div>
      )}

      {currentState === "Login" && (
  <p
    className="text-center text-sm text-sky-500 underline mb-4 cursor-pointer"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </p>
)}

      <button
        type="submit"
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 rounded transition"
      >
        {currentState === "Login" ? "Sign In" : "Create Account"}
      </button>

      <p className="text-center text-sm mt-4">
        {currentState === "Login" ? (
          <>
            Don’t have an account?{" "}
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create Account
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-sky-500 cursor-pointer"
              onClick={() => setCurrentState("Login")}
            >
              Sign in
            </span>
          </>
        )}
      </p>
    </form>
  );
};

export default Login;
