import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './styles.css';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const [displayText, setDisplayText] = useState('');
    const targetText = "I am a React Native developer with 2 years of experience. Check out my projects below.";
    const navigate = useNavigate()
    useEffect(() => {
        let index = 0;
        const typingSpeed = 50; // Adjust typing speed here (milliseconds)
        let timeout;

        const typeText = () => {
            if (index < targetText.length) {
                setDisplayText(prevText => prevText + targetText[index]);
                index++;
                timeout = setTimeout(typeText, typingSpeed);
            } else {
                clearTimeout(timeout); // Clear timeout to stop further execution
            }
        };

        typeText(); // Start typing when component mounts

        // Clean up the timeout on component unmount
        return () => clearTimeout(timeout);
    }, []);

    // Animation for the welcome message
    const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <>
            <Header />
            <div className="home-container">
                <animated.div style={fadeIn} className="content">
                    <h1 className="text-5xl">
                        Welcome to My Portfolio
                    </h1>
                    <animated.p style={fadeIn} className="fancy-text">
                        {displayText}
                    </animated.p>
                    <animated.button style={fadeIn} onClick={() => { navigate("/projects") }} className="cta-button">
                        Hire Me
                    </animated.button>

                </animated.div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
