import React, { useEffect  } from "react";
import { Link } from "react-router-dom";
import "./assets/Home.css";
import Typed from "typed.js";

const Home = () => {
  useEffect(() => {
    const options = {
      strings: [
        "Add your daily Expenses here",
        "Manage your finances with ease.",
      ],
      typeSpeed: 55,
      backSpeed: 50,
      loop: true,
    };
    const typed = new Typed(".toggle-text", options);
    return () => {
      typed.destroy();
    };
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const name = document.getElementById("expenseName").value.trim();
    const amount = document.getElementById("expenseAmount").value;

    if (!name || name.length < 3) {
      alert("Expense name must be at least 3 characters long.");
      return;
    }

    if (amount <= 0) {
      alert("Expense amount must be greater than 0.");
      return;
    }

    alert("Form submitted successfully!");
  };

  return (
    <div className="Home-main">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <img
            src="https://m.media-amazon.com/images/I/614y4xnqgdL.png"
            width="40px"
            style={{ marginRight: "15px" }}
            alt="Logo"
          />
          <Link className="navbar-brand nav-head" to="/">
            Expense-Tracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link nav-element" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-element" to="/about">
                  About
                </Link>
              </li>
            </ul>
            <button className="btn btn-danger"><Link to="/login" className="text-white text-decoration-none">Logout</Link></button>
          </div>
        </div>
      </nav>

      <div className="container my-3 keyframe-cont">
        <h2 className="text-center mb-4">
          <span className="toggle-text"></span>
        </h2>
         <form id="expenseForm" className="card p-4 shadow" onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="expenseName" className="form-label">
              Expense Name
            </label>
            <input
              type="text"
              id="expenseName"
              name="expenseName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expenseType" className="form-label">
              Expense Type
            </label>
            <select id="expenseType" name="expenseType" className="form-select" required>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="expenseAmount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              id="expenseAmount"
              name="expenseAmount"
              className="form-control"
              required
              min="1"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expenseDate" className="form-label">
              Expense Date
            </label>
            <input
              type="date"
              id="expenseDate"
              name="expenseDate"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="expenseTime" className="form-label">
              Expense Time
            </label>
            <input
              type="time"
              id="expenseTime"
              name="expenseTime"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit Expense
          </button>
        </form> 
      </div>

      <h2 style={{ textAlign: "center", margin: "20px" }}>My Expenses</h2>

      <div className="cards">
        <ExpenseCard
          title="Fees"
          type="Other"
          amount={12345}
          time="22:27"
          date="2024-12-19"
        />
        <ExpenseCard
          title="Grocery"
          type="Grocery"
          amount={432}
          time="18:58"
          date="2024-12-19"
        />
        <ExpenseCard
          title="College Expenses"
          type="Others"
          amount={1200}
          time="16:23"
          date="2024-11-30"
        />
      </div>
    </div>
  );
};

const ExpenseCard = ({ title, type, amount, time, date }) => {
  return (
    <div className="card" style={{ width: "18rem", margin: "20px" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text mb-1">Type: {type}</p>
        <p className="card-text mb-1">Amount: {amount}</p>
        <p className="card-text mb-1">Time: {time}</p>
        <p className="card-text mb-1">Date: {date}</p>
        <button className="btn btn-secondary">Edit</button>
        <button className="btn btn-danger mx-2">Delete</button>
      </div>
    </div>
  );
};

export default Home;
