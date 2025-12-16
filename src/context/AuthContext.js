// import React, { createContext, useState, useEffect, useContext } from 'react'
// import PropTypes from 'prop-types'
// import axiosInstance from 'src/axiosInstance'
// import { showError } from 'src/utils/sweetAlerts'

// // Create context
// export const AuthContext = createContext()

// // Create custom hook for using the context
// export const useAuth = () => {
//   const context = useContext(AuthContext)
  
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
  
//   return context
// }

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [permissions, setPermissions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false)

//   const fetchUser = async () => {
//     const token = localStorage.getItem('token')
    
//     if (!token) {
//       setLoading(false)
//       return
//     }

//     try {
//       const res = await axiosInstance.get('/auth/me', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
      
//       if (res.data.success) {
//         const userData = res.data.data
//         setUser(userData)
//         setPermissions(userData.permissions || [])
        
//         // Check if user is superadmin
//         const isSuperAdminUser = userData.roles?.some(role => role.name === 'SUPERADMIN')
//         setIsSuperAdmin(isSuperAdminUser)
        
//         // Store in localStorage for quick access
//         localStorage.setItem('user', JSON.stringify(userData))
//         localStorage.setItem('permissions', JSON.stringify(userData.permissions || []))
//         localStorage.setItem('isSuperAdmin', isSuperAdminUser)
//       }
//     } catch (err) {
//       const message = err?.response?.data?.message;

//       if (message === "Your token has expired. Please log in again." || 
//           message === "Your account has been disabled. Please contact administrator." ||
//           err.response?.status === 401) {
        
//         localStorage.clear()
//         showError(message || "Session expired. Please login again.")
//         window.location.href = "/login"
//         return
//       }
      
//       console.error('Error fetching user info:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUser()
//   }, [])

//   const refreshPermissions = async () => {
//     await fetchUser()
//   }

//   const login = async (token, userData) => {
//     localStorage.setItem('token', token)
//     await fetchUser()
//   }

//   const logout = () => {
//     localStorage.clear()
//     setUser(null)
//     setPermissions([])
//     setIsSuperAdmin(false)
//     window.location.href = "/login"
//   }

//   const value = {
//     user,
//     permissions,
//     isSuperAdmin,
//     loading,
//     refreshPermissions,
//     login,
//     logout,
//     fetchUser
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// }



import React, { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import axiosInstance from 'src/axiosInstance'
import { showError } from 'src/utils/sweetAlerts'

// Create context
export const AuthContext = createContext()

// Create custom hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axiosInstance.get('/auth/me')
      
      if (res.data.success) {
        const userData = res.data.data
        setUser(userData)
        
        // Get permissions from user data (combines role permissions + user-specific permissions)
        const userPermissions = userData.permissions || []
        setPermissions(userPermissions)
        
        // Check if user is superadmin
        const isSuperAdminUser = userData.roles?.some(role => role.name === 'SUPERADMIN')
        setIsSuperAdmin(isSuperAdminUser)
        
        // Store in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('permissions', JSON.stringify(userPermissions))
        localStorage.setItem('isSuperAdmin', isSuperAdminUser)
        
        console.log('Permissions fetched from /auth/me:', userPermissions)
      }
    } catch (err) {
      const message = err?.response?.data?.message;

      if (message === "Your token has expired. Please log in again." || 
          message === "Your account has been disabled. Please contact administrator." ||
          err.response?.status === 401) {
        
        localStorage.clear()
        showError(message || "Session expired. Please login again.")
        window.location.href = "/login"
        return
      }
      
      console.error('Error fetching user info:', err)
    } finally {
      setLoading(false)
    }
  }

  // Listen for permission update events
  useEffect(() => {
    const handlePermissionUpdate = () => {
      console.log('Permission update event received, refreshing permissions...')
      fetchUser()
    }

    // Custom event for permission updates
    window.addEventListener('permissionsUpdated', handlePermissionUpdate)
    
    // Also listen for storage events (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'permissions' || e.key === 'user') {
        fetchUser()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [])

  const refreshPermissions = async () => {
    console.log('Manual permission refresh triggered')
    await fetchUser()
  }

  const login = async (token, userData) => {
    localStorage.setItem('token', token)
    await fetchUser()
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setPermissions([])
    setIsSuperAdmin(false)
    window.location.href = "/login"
  }

  // Function to trigger permission refresh from other components
 const triggerPermissionRefresh = () => {
    const event = new Event('permissionsUpdated')
    window.dispatchEvent(event)
  }

  const value = {
    user,
    permissions,
    isSuperAdmin,
    loading,
    refreshPermissions,
    login,
    logout,
    fetchUser,
    triggerPermissionRefresh
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}