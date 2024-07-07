import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';  // Adjust the import path as necessary
import { collection, addDoc } from 'firebase/firestore';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'contacts'), formData);
            alert('Form submitted!');
            setFormData({ name: '', email: '', message: '' });
            showNotification('Form submitted successfully!', 'Thank you for contacting us.');

        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error submitting form');
        }
    };

    useEffect(() => {
        // Request notification permission when the component mounts
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);
    const showNotification = (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
        </form>
    );
};

export default ContactForm;
