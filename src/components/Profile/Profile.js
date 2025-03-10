import React, { useState } from 'react';
import { useUserData } from '@nhost/react';

const Profile = () => {
  const user = useUserData();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add profile update logic
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1>Profile Settings</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>

        <button type="submit" className="save-profile-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;