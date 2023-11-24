import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { data } from "./data";
import Q1 from "./components/table";
import Q2 from "./components/form";
import Q3 from "./components/CategoriyTable";
import Q4 from "./components/customerTable";
import Create from "./components/form";
import Navbar from "./components/navbar";
import LoginPage from "./pages/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Q4 />} />
      </Routes>
    </Router>
  );
};

export default App;
