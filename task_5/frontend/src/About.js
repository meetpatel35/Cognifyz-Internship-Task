import React from "react";
import { Link } from "react-router-dom";
import "./assets/About.css"; // Move your styles to a separate CSS file.

const About = () => {
  return (
    <div className="About-main">
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
            <button className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="about">
        <h2>About Expense Tracker</h2>
        <p>
          Expense Tracker is a simple and effective web application designed to
          help users manage their daily expenses and stay in control of their
          finances. With an intuitive interface and powerful features, it
          allows you to track expenses by name, type, amount, and date with
          ease.
        </p>
        <p>
          This project is part of a web development series focusing on
          implementing modern development practices such as server-side
          rendering, form validation, and responsive design using Node.js and
          Bootstrap.
        </p>

        <div className="contact-info">
          <h4>Developer Information</h4>
          <p>
            <span>Name:</span> Meet Patel <br />
            <span>Email:</span>{" "}
            <a href="mailto:patelmeet0625@gmail.com">patelmeet0625@gmail.com</a>{" "}
            <br />
            <span>GitHub:</span>{" "}
            <a href="https://github.com/meetpatel35" target="_blank" rel="noreferrer">
              github.com/meetpatel35
            </a>
            <br />
            <span>LinkedIn:</span>{" "}
            <a
              href="https://www.linkedin.com/in/meetp35/"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/meetp35
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
