import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Myapi from "./test";
import ResponsiveAppBar from "./header";
import Contact from "./Screen/Contact";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
