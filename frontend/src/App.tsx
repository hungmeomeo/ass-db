import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import Q1 from "./components/a";
import Q2 from "./components/form";
import Q3 from "./components/CategoriyTable";
import Q4 from "./components/customerTable";
import Create from "./components/form";
import Navbar from "./components/navbar";
import LoginPage from "./pages/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/q4" element={<Q4 />} />
        <Route path="/q3" element={<Q3 />} />
        <Route path="/q1" element={<Q1 />} />
        <Route path="/q2" element={<Q2 />} />
      </Routes>
    </Router>
  );
}

export default App;
