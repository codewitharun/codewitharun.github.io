import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Myapi from "./test";
import ResponsiveAppBar from "./header";
import Contact from "./Screen/Contact";
import Signup from "./Screen/Signup/Signup";
import Login from "./Screen/login/Login";

function Layout() {
  return (
    <div>
      <ResponsiveAppBar />
      <Outlet /> {/* Renders the nested child routes */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ResponsiveAppBar />
      <Routes>
        <Route index path="/" element={<Myapi />} />
        <Route path="about" element={<Contact />} />
        <Route path="contact" element={<Contact />} />
        <Route path="projects" element={<Contact />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
