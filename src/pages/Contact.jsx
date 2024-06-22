import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <div>
            <Header />
            <main className="p-4">
                <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
