import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <header className="bg-gray-800 text-white p-4">
        <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <div>
                <Link to="/" className="px-4">Home</Link>
                <Link to="/about" className="px-4">About</Link>
                <Link to="/projects" className="px-4">Projects</Link>
                <Link to="/contact" className="px-4">Contact</Link>
                <Link to="/blog" className="px-4">Blogs</Link>
            </div>
        </nav>
    </header>
);

export default Header;
