import React from "react";
import "./assets/Login.css";
import { Link } from "react-router-dom";
const Login = () => {
  const handleLogin = async(event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    if (!email || !password) {
      alert("Both fields are required.");
      return;
    }
    alert("Login Successful!");
    try{
      const response = await fetch("http://localhost:5000/login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
      });
      if (response.ok) {
        alert("login successful")
      }
    }catch(err){
      console.log(err)
      alert("Some error occured")
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
      <Link to="/login" className="mt-2">Dont have an account ? signup for free !</Link>
    </div>
  );
};

export default Login;
