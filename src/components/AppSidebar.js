import logo1 from 'src/assets/images/logo1.png'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSpinner,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import getNav from '../_nav'
import { useAuth } from 'src/context/AuthContext'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { permissions, loading, user, refreshPermissions } = useAuth()
  
  const [refreshKey, setRefreshKey] = useState(0)
  

  useEffect(() => {
    const handlePermissionUpdate = () => {
      console.log('Sidebar: Permission update event received')
      refreshPermissions() 
      setRefreshKey(prev => prev + 1)
    }

    const handleSidebarRefresh = () => {
      console.log('Sidebar: Sidebar refresh event received')
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener('permissionsUpdated', handlePermissionUpdate)
    window.addEventListener('sidebarRefresh', handleSidebarRefresh)

    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionUpdate)
      window.removeEventListener('sidebarRefresh', handleSidebarRefresh)
    }
  }, [refreshPermissions])

  const navItems = getNav(permissions)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        width: '250px', 
        height: '100vh',
        backgroundColor: '#2f4050'
      }}>
        <CSpinner color="light" />
      </div>
    )
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      key={refreshKey}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img src={logo1} height={32} alt='Gandhi TVS'></img>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* <div className="sidebar-user-info p-3 border-bottom">
        <div className="d-flex flex-column">
          <h6 className="mb-1 text-white">{user?.name || 'User'}</h6>
          <small className="text-muted">
            {user?.roles?.[0]?.name || 'No Role'} • {user?.branch?.name || 'No Branch'}
          </small>
        </div>
      </div>
       */}
      <AppSidebarNav items={navItems} key={`nav-${refreshKey}`} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)