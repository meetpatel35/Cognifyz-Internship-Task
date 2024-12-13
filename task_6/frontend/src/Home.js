import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./assets/Home.css";
import Typed from "typed.js";
import ExpenseCard from "./ExpenseCard";
import { jwtDecode } from "jwt-decode";

const Home = () => {

  //Props
  const [result, setResult] = useState({ expenses: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [editExpense, setEditExpense] = useState({
    id: "",
    email: "",
    expenseName: "",
    expenseType: "",
    expenseAmount: "",
    expenseDate: "",
    expenseTime: ""
  })

  //Verify that token is present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      window.location.href = "/login";
      return;
    } else {
      // console.log("Token:", token);
    }

    try {
      const decoded = jwtDecode(token);
      setUserEmail(decoded.email);
      fetchExpenses(decoded.email);
    } catch (error) {
      console.error("Invalid token:", error);
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  //typed strings 
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

  //Delete Expense
  const handleDeleteExpense = async (expenseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
        },
      });

      if (response.ok) {
        alert("Expense deleted successfully!");
        fetchExpenses(userEmail); // Refresh the expense list after deletion
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

  //Fetch all expenses of user
  const fetchExpenses = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/expenses?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
        },
      });

      const data = await response.json();
      if (response.ok) {
        setResult({ expenses: data.expenses });
      } else {
        console.error(data.message);
        alert("Failed to fetch expenses.");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("An error occurred while fetching expenses.");
    }
  };

  //Add Expense
  const handleFormSubmit = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please log in.");
      window.location.href = "/login";
      return;
    }
    event.preventDefault();
    const expenseName = document.getElementById("expenseName").value.trim();
    const expenseType = document.getElementById("expenseType").value;
    const expenseAmount = document.getElementById("expenseAmount").value;
    const expenseDate = document.getElementById("expenseDate").value;
    const expenseTime = document.getElementById("expenseTime").value;

    if (!expenseName || expenseName.length < 3) {
      alert("Expense name must be at least 3 characters long.");
      return;
    }

    if (expenseAmount <= 0) {
      alert("Expense amount must be greater than 0.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: userEmail,
          expenseName,
          expenseType,
          expenseAmount,
          expenseDate,
          expenseTime,
        }),
      });


      const newResult = await response.json();
      if (response.ok) {
        setResult({ expenses: newResult.expenses });
        alert("Expense added successfully");
      } else {
        alert("Failed to add expense.");
      }
    } catch (err) {
      console.error(err);
      alert("Some error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  //Edit Expense 
  const ref = useRef(null)
  const updateExpense = (expense) => {
    console.log(expense)
    setEditExpense({ id: expense._id, email: expense.email, expenseName: expense.expenseName, expenseType: expense.expenseType, expenseAmount: expense.expenseAmount, expenseDate: expense.expenseDate, expenseTime: expense.expenseTime })
    console.log(editExpense)
  }

  const openModal = () => {
    ref.current.click();
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setEditExpense({ ...editExpense, [name]: value });
  };

  const refClose = useRef(null)

  const handleEditExpense = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please log in.");
      window.location.href = "/login";
      return;
    }
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/expenses/${editExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editExpense.email,
          expenseName: editExpense.expenseName,
          expenseType: editExpense.expenseType,
          expenseAmount: editExpense.expenseAmount,
          expenseDate: editExpense.expenseDate,
          expenseTime: editExpense.expenseTime,
        }),
      });

      const newResult = await response.json();
      if (response.ok) {
        setResult({ expenses: newResult.expenses });
        alert("Expense updated successfully!");
      } else {
        alert(`Failed to update expense: ${newResult.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the expense.");
    } finally {
      setIsLoading(false);
    }

    refClose.current.click();
  };

  // Date and time 
  const currentDate = new Date();
  const getISTTime = () => {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(currentDate.getTime() + istOffset);
    const hours = istDate.getUTCHours().toString().padStart(2, "0");
    const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const defaultISTTime = getISTTime();

  //HTML Code
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
                onClick={() => localStorage.removeItem("token")}
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
              <option value="Academics">Academics</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Personal Expenses">Personal Expenses</option>
              <option value="Utilities">Utilities</option>
              <option value="Bills">Bills</option>
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
              defaultValue={currentDate.toISOString().split("T")[0]}
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
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onDelete={handleDeleteExpense}
              updateExpense={updateExpense}
              openModal={openModal}
            />
          ))
        ) : (
          <p className="text-center">No expenses found. Add one now!</p>
        )}
      </div>

      <button type="button" ref={ref} className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
            </div>

            <div className="modal-body">
              <form id="expenseForm" className="card p-4 shadow">
                <div className="mb-3">
                  <label htmlFor="expenseName" className="form-label">
                    Expense Name
                  </label>
                  <input
                    type="text"
                    id="expenseName"
                    name="expenseName"
                    className="form-control"
                    value={editExpense.expenseName}
                    onChange={onChange}
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
                    value={editExpense.expenseType}
                    onChange={onChange}
                    required
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Academics">Academics</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Personal Expenses">Personal Expenses</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Bills">Bills</option>
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
                    value={editExpense.expenseAmount}
                    onChange={onChange}
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
                    value={editExpense.expenseDate}
                    onChange={onChange}
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
                    value={editExpense.expenseTime}
                    onChange={onChange}
                    required
                  />
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleEditExpense}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;