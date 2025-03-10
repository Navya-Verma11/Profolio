import React from 'react';
import { Link } from 'react-router-dom';
import { useUserData } from '@nhost/react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="card-thumbnail">
        <div className="placeholder-thumbnail">
          {project.thumbnail || 'Design Preview'}
        </div>
      </div>
      <div className="card-details">
        <h3>{project.name}</h3>
        <p>Last modified: {project.lastModified}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = useUserData();
  const projects = [
    { 
      id: 1, 
      name: 'My Portfolio', 
      lastModified: new Date().toLocaleDateString(),
      thumbnail: ''
    },
    // Add more mock projects
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName || 'Designer'}!</h1>
        <Link to="/editor/new" className="create-new-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Design
        </Link>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;