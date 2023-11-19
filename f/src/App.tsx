import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import { data } from "./data";
import Q1 from "./components/table";
import Q2 from "./components/form";
import Create from "./components/form";
import Navbar from "./components/navbar";

function App() {
  return (
    <div>
      <Q2></Q2>
    </div>
  );
}

export default App;
