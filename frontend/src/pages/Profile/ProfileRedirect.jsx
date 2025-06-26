import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    
    switch (userType) {
      case 'user':
        navigate('/profile/ProfileOverview');
        break;
      case 'vehicle-owner':
        navigate('/profile/rentee-profile');
        break;
      case 'chauffeur':
        navigate('/chauffeur/dashboard');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/login');
        break;
    }
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default ProfileRedirect;
