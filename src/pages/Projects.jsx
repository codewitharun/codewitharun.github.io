import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
    const projects = [
        { title: 'Task Flow', description: 'Description of project one.', link: '#' },
        { title: 'Sociable', description: 'Description of project two.', link: '#' },
        // Add more projects here
    ];

    return (
        <div>
            <Header />
            <main className="p-4">
                <h1 className="text-4xl font-bold mb-4">My Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Projects;
