import React, { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import './ProfilePictureUpload.css';

const ProfilePictureUpload = ({ currentProfilePic, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to update your profile picture');
      }

      const response = await fetch('http://localhost:5000/api/auth/users/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }

      const data = await response.json();

      // Call the success callback with the new URL
      if (onSuccess) {
        onSuccess(data.profilePictureUrl);
      }

      // Clear the form
      setFile(null);
      setPreviewUrl(null);

    } catch (error) {
      setError(error.message);
      console.error('Error uploading profile picture:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="current-profile-container">
        <img
          src={previewUrl || currentProfilePic}
          alt="Profile"
          className="current-profile-pic"
        />
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <label htmlFor="profile-picture" className="file-input-label">
            <FaUpload /> Choose Image
          </label>
          <input
            type="file"
            id="profile-picture"
            className="file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="file-name">
            {file ? file.name : 'No file chosen'}
          </span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="upload-button"
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" /> Uploading...
            </>
          ) : (
            'Update Profile Picture'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;
