import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Blog from './pages/blog';
import AiTesting from './pages/test';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/ai' element={<AiTesting />} />
      </Routes>
    </Router>
  );
}

export default App;
