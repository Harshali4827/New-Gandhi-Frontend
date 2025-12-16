import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../context/AuthContext';

const WithPermissions = (WrappedComponent) => {
  return function WithPermissionsWrapper(props) {
    const { fetchUserData, loading } = useAuth();
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    useEffect(() => {
      const loadPermissions = async () => {
        // Check if we already have user data
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('token');
        
        if (token && !user) {
          // Fetch user data if we have token but no user data
          await fetchUserData();
        }
        setPermissionsLoaded(true);
      };

      loadPermissions();
    }, [fetchUserData]);

    if (loading || !permissionsLoaded) {
      // You can show a loading spinner here
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithPermissions;