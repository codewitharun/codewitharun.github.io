import React from 'react';

const ProjectCard = ({ title, description, link }) => (
    <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            View Project
        </a>
    </div>
);

export default ProjectCard;
