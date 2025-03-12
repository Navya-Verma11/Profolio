import React, { useState } from 'react';
import { useUserData, useNhostClient } from '@nhost/react';

const Profile = ({ onProfileUpdate }) => {
  const user = useUserData();
  const nhost = useNhostClient();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage({ text: '', type: '' });

    try {
      const { error } = await nhost.auth.updateUser({
        metadata: { displayName }
      });
      

      if (error) {
        throw error;
      }

      setUpdateMessage({ 
        text: 'Profile updated successfully!', 
        type: 'success' 
      });
      
      if (typeof onProfileUpdate === 'function') {
        setTimeout(() => {
          onProfileUpdate();
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateMessage({ 
        text: `Failed to update profile: ${err.message}`, 
        type: 'error' 
      });
    } finally {
      setIsUpdating(false);
    }
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

      {updateMessage.text && (
        <div className={`profile-message ${updateMessage.type}`}>
          {updateMessage.text}
        </div>
      )}

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
          <p className="input-helper">Email address cannot be changed</p>
        </div>

        <button 
          type="submit" 
          className="save-profile-btn"
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
