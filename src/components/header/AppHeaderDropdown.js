import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import './appHeader.css';
import avatar8 from './../../assets/images/profile.jpg'

const AppHeaderDropdown = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = (e) => {
    e?.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md"/>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 profile-dropdown-menu" placement="bottom-end" style={{ minWidth: '280px' }}>
        <div className="px-3 py-3 bg-primary text-white rounded-top">
      
          <div className="d-flex align-items-center mb-3">
            <CAvatar 
              src={avatar8} 
              className="border-3 border-white shadow me-3"
              style={{ width: '60px', height: '60px' }}
            />
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{user?.name || 'User Name'}</h6>
              <p className="mb-0 opacity-75" style={{ fontSize: '0.85rem' }}>{user?.role || 'User Role'}</p>
            </div>
          </div>

      
          <div className="d-flex align-items-center bg-white text-primary rounded px-2 py-1">
         
            <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
              {user?.branch?.name || 'Branch Name'}
            </span>
          </div>
        </div>

        <CDropdownDivider className="my-0" />

        <CDropdownItem 
          href="#" 
          onClick={handleLogout} 
          className="text-danger fw-semibold py-2 d-flex align-items-center justify-content-center"
          style={{ fontSize: '0.9rem' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" size="sm" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown