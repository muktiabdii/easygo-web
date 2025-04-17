import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Maps from "../pages/Maps";
import AddPlace from "../pages/AddPlace";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/tambah-tempat" element={<AddPlace />} />
      </Routes>
    </BrowserRouter>
  );
}
