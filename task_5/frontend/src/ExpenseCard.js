import React from "react";

const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <div className="card" style={{ width: "18rem", margin: "20px" }}>
      <div className="card-body">
        <h5 className="card-title">{expense.expenseName}</h5>
        <p className="card-text mb-1">Type: {expense.expenseType}</p>
        <p className="card-text mb-1">Amount: {expense.expenseAmount}</p>
        <p className="card-text mb-1">Time: {expense.expenseTime}</p>
        <p className="card-text mb-1">Date: {expense.expenseDate}</p>
        <button className="btn btn-secondary">Edit</button>
        <button
          className="btn btn-danger mx-2"
          onClick={() => onDelete(expense._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
