import { useState } from "react";
import "./App.css";
import Registration from "./pages/Registration.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes> 
    </>
  );
}

export default App;
