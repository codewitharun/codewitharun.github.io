import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div>
            <Header />
            <main className="p-4">
                <h1 className="text-4xl font-bold mb-4">About Me</h1>
                <p className="text-lg">I am a React Native developer with 2 years of experience. I love technology and have a passion for learning new things.</p>
            </main>
            <Footer />
        </div>
    );
};

export default About;
