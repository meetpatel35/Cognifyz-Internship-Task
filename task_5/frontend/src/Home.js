import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./assets/Home.css";
import Typed from "typed.js";
import ExpenseCard from "./ExpenseCard";

const Home = () => {
  const [result, setResult] = useState({ expenses: [] }); // Initialize state for expenses
  const [isLoading, setIsLoading] = useState(false); // Track loading state

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


  const handleDeleteExpense = async (expenseId) => {
    const email = "test@gmail.com"
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Expense deleted successfully!");
        // Fetch updated expenses after deletion
        const updatedResponse = await fetch(`http://localhost:5000/expenses?email=${email}`);
        const updatedData = await updatedResponse.json();
        if (updatedResponse.ok) {
          setResult({ expenses: updatedData.expenses });
        } else {
          alert("Failed to refresh expenses after deletion.");
        }
      } else {
        const data = await response.json();
        alert(`Failed to delete expense: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("An error occurred while deleting the expense.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchExpenses = async () => {
    const email = "test@gmail.com"; // Replace with dynamic email if needed
    try {
      const response = await fetch(`http://localhost:5000/expenses?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setResult({ expenses: data.expenses }); // Update state with expenses
      } else {
        console.error(data.message);
        alert("Failed to fetch expenses.");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("An error occurred while fetching expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses(); // Call the fetch function when component mounts
  }, []);


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const expenseName = document.getElementById("expenseName").value.trim();
    const expenseType = document.getElementById("expenseType").value;
    const expenseAmount = document.getElementById("expenseAmount").value;
    const expenseDate = document.getElementById("expenseDate").value;
    const expenseTime = document.getElementById("expenseTime").value;
    const email = "test@gmail.com";

    if (!expenseName || expenseName.length < 3) {
      alert("Expense name must be at least 3 characters long.");
      return;
    }

    if (expenseAmount <= 0) {
      alert("Expense amount must be greater than 0.");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          expenseName,
          expenseType,
          expenseAmount,
          expenseDate,
          expenseTime,
        }),
      });

      const newResult = await response.json();
      if (response.ok) {
        setResult({ expenses: newResult.expenses }); // Update state with the new data
        alert("Expense added successfully");
        console.log(result.expenses)
      } else {
        alert("Failed to add expense.");
      }
    } catch (err) {
      console.error(err);
      alert("Some error occurred");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const getISTTime = () => {
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istDate = new Date(currentDate.getTime() + istOffset);
    const hours = istDate.getUTCHours().toString().padStart(2, "0");
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`; // Return time in "HH:mm" format
  };

  const defaultISTTime = getISTTime();

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
            <button className="btn btn-danger">
              <Link
                to="/login"
                className="text-white text-decoration-none"
              >
                Logout
              </Link>
            </button>
          </div>
        </div>
      </nav>

      <div className="container my-3 keyframe-cont">
        <h2 className="text-center mb-4">
          <span className="toggle-text"></span>
        </h2>
        <form
          id="expenseForm"
          className="card p-4 shadow"
          onSubmit={handleFormSubmit}
        >
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
            <select
              id="expenseType"
              name="expenseType"
              className="form-select"
              required
            >
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
              defaultValue={defaultISTTime}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Expense"}
          </button>
        </form>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px" }}>My Expenses</h2>

      <div className="cards">
        {result.expenses.length > 0 ? (
          result.expenses.map((expense) => (
            <ExpenseCard key={expense._id} expense={expense} onDelete={handleDeleteExpense} />
          ))
        ) : (
          <p className="text-center">No expenses found. Add one now!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
