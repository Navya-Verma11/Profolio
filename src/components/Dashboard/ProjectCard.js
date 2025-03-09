import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <Link to={`/editor/${project.id}`}>
        <div className="card-thumbnail">
          {project.thumbnail || <div className="placeholder-thumbnail" />}
        </div>
        <div className="card-details">
          <h3>{project.name}</h3>
          <p>Last modified: {project.lastModified}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;