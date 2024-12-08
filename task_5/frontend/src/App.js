import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./About.js"; 
import Home from "./Home.js";
import Signup from "./Signup.js"
import Login from "./Login.js"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </Router>
  );
};

export default App;
