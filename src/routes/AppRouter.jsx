import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
