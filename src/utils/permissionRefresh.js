
export const refreshUserPermissions = async () => {
  try {
    const event = new Event('permissionsUpdated');
    window.dispatchEvent(event);
    window.dispatchEvent(new Event('sidebarRefresh'));
    
    return true;
  } catch (error) {
    console.error('Error refreshing permissions:', error);
    return false;
  }
};

export const shouldRefreshForCurrentUser = (updatedUserId, updatedRoleId = null) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (currentUser._id === updatedUserId) {
    return true;
  }
  if (updatedRoleId && currentUser.roles) {
    const userHasRole = currentUser.roles.some(role => role._id === updatedRoleId);
    if (userHasRole) {
      return true;
    }
  }
  
  return false;
};