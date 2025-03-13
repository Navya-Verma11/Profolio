import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData, useNhostClient, useSignOut } from '@nhost/react';
import Profile from '../Profile/Profile';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const nhost = useNhostClient();
  const user = useUserData();
  const { signOut } = useSignOut();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const query = `
          query GetPortfolios($userId: uuid!) {
            portfolios(where: { user_id: { _eq: $userId } }) {
              id
              data
              background
              created_at
              name
            }
          }
        `;
        const { data, error } = await nhost.graphql.request(query, { userId: user.id });

        if (error) throw error;

        console.log('Portfolios:', data.portfolios);

        const formattedProjects = data.portfolios.map((portfolio) => ({
          id: portfolio.id,
          name: portfolio.name || `Design - ${new Date(portfolio.created_at).toLocaleDateString()}`,
          lastModified: new Date(portfolio.created_at).toLocaleDateString(),
        }));

        setProjects(formattedProjects);
      } catch (err) {
        console.error('Error loading portfolios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user, nhost]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName || 'Designer'}!</h1>
        <div className="dashboard-actions">
          <Link to="/editor/new" className="create-new-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Design
          </Link>
          <button className="profile-btn" onClick={toggleProfile}>
            {showProfile ? "Hide Profile" : "Edit Profile"}
          </button>
          <LogoutCard onLogout={handleLogout} />
        </div>
      </div>

      {showProfile && (
        <div className="profile-section">
          <Profile onProfileUpdate={() => setShowProfile(false)} />
        </div>
      )}

      {!showProfile && (
        loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/editor/${project.id}`);
  };

  return (
    <div className="project-card" onClick={handleClick}>
      <div className="card-details">
        <h3>{project.name}</h3>
        <p>Last modified: {project.lastModified}</p>
      </div>
    </div>
  );
};

const LogoutCard = ({ onLogout }) => {
  return (
    <div className="project-card logout-card" onClick={onLogout}>
      <div className="card-details">
        <h3>Logout</h3>
      </div>
    </div>
  );
};

export default Dashboard;