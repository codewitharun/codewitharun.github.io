import Home from "./home/Home";
import About from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Blog from "./blog/Blog";
import BlogSection from "./blog/BlogSection";
import BlogDetails from "./blog/BlogDetails";

export default function MultiPageRoutes() {
    return (
        <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/portfolio'} element={<Portfolio />} />
            {/* <Route exact path={'/blog'} element={<Blog />} /> */}
            <Route path="/blog" element={<BlogSection />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
        </Routes>
    )
}