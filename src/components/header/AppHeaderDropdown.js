import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
} from '@coreui/icons'
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
        <div className="px-4 py-4 text-center bg-primary text-white rounded-top">
          <CAvatar 
            src={avatar8} 
            size="xl" 
            className="border-4 border-white shadow-lg mb-3"
            style={{ width: '100px', height: '100px' }}
          />
          <h4 className="mb-2 fw-bold">{user?.name || 'User Name'}</h4>
          <p className="mb-2 opacity-75 fs-6">{user?.role || 'User Role'}</p>
          <div className="d-inline-block bg-white text-primary px-3 py-1 rounded-pill fw-semibold">
            <i className="cil-building me-2"></i>
            {user?.branch?.name || 'Branch Name'}
          </div>
        </div>

        <CDropdownDivider />

        <CDropdownItem 
          href="#" 
          onClick={handleLogout} 
          className="text-danger text-center fw-bold py-3"
          style={{ fontSize: '1.1rem' }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" size="lg" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown