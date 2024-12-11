import React from "react";
import "./assets/Signup.css";
import { Link } from "react-router-dom";
const Signup = () => {

  const handleSignup = async (event) => {
    event.preventDefault();
    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const confirmPassword = event.target.confirmPassword.value.trim();

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }
    // Password strength check regex
    const hasNumber = /[0-9]/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const minLength = 8;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    else if (password.length < minLength) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    else if (!hasNumber.test(password)) {
      alert("Password must include at least one number.");
      return;
    }
    else if (!hasUpperCase.test(password)) {
      alert("Password must include at least one uppercase letter.");
      return;
    }
    else if (!hasLowerCase.test(password)) {
      alert("Password must include at least one lowercase letter.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Signup successful:", result);
        alert("Signup successful Proceed for login!");
      } else {
        console.error("Signup failed:", result.message);
        alert(`Signup failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup.");
    }
  };


return (
  <div className="signup-container">
    <div className="card p-4 shadow">
      <h2 className="text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter a password"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
    </div>
    <Link to="/login" className="mt-2">Already have an account ? Login Here</Link>
  </div>
);
};

export default Signup;
