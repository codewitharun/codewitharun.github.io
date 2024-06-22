import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Header />
            <main className="p-4">
                <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
                <p className="text-lg">I am a React Native developer with 2 years of experience. Check out my projects below.</p>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
