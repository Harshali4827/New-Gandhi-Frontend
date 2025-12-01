// import React, { useContext, useState } from 'react'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
//   CAlert,
//   CSpinner,
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilEnvelopeClosed, cilFolderOpen, cilLockLocked, cilUser, cilPhone } from '@coreui/icons'
// import backgroundImage from '../../../assets/images/background.jpg'
// import logo from '../../../assets/images/logo.png'
// import axiosInstance from 'src/axiosInstance'
// import { useNavigate } from 'react-router-dom'
// import './login.css'
// // import { AuthContext } from 'src/context/AuthContext'
// import * as Yup from 'yup'

// const Login = () => {
//   const [loading, setLoading] = useState(false)
//   const [otpLoading, setOtpLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState(1)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [mobile, setMobile] = useState('')
//   const [email, setEmail] = useState('')
//   const [mobileError, setMobileError] = useState('')
//   const [emailError, setEmailError] = useState('')

//   const navigate = useNavigate()

//   // Validation schemas
//   const mobileSchema = Yup.string()
//     .matches(/^[0-9]{10}$/, 'Invalid mobile number (must be 10 digits)')
//     .required('Mobile number is required')

//   const emailSchema = Yup.string()
//     .email('Invalid email address')
//     .required('Email is required')

//   const validateMobile = (value) => {
//     try {
//       mobileSchema.validateSync(value)
//       setMobileError('')
//       return true
//     } catch (error) {
//       setMobileError(error.message)
//       return false
//     }
//   }

//   const validateEmail = (value) => {
//     try {
//       emailSchema.validateSync(value)
//       setEmailError('')
//       return true
//     } catch (error) {
//       setEmailError(error.message)
//       return false
//     }
//   }

//   const handleMobileChange = (e) => {
//     const value = e.target.value.replace(/[^0-9]/g, '')
//     setMobile(value)
//     if (value) validateMobile(value)
//   }

//   const handleEmailChange = (e) => {
//     const value = e.target.value
//     setEmail(value)
//     if (value) validateEmail(value)
//   }

//   const handleMobileLogin = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (!validateMobile(mobile)) {
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await axiosInstance.post('/auth/request-otp', {
//         mobile: mobile
//       })

//       if (response.data.success) {
//         localStorage.setItem('mobile', mobile)
//         setSuccess('OTP sent successfully to your mobile number!')
//         setTimeout(() => {
//           navigate('/verify-otp')
//         }, 1500)
//       } else {
//         setError('Failed to send OTP. Please try again.')
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong. Try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEmailLogin = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (!validateEmail(email)) {
//       return
//     }

//     setOtpLoading(true)
//     try {
//       const response = await axiosInstance.post('/auth/request-email-otp', {
//         email: email
//       })

//       if (response.data.success) {
//         localStorage.setItem('email', email)
//         setSuccess('OTP sent successfully to your email!')
//         setTimeout(() => {
//           navigate('/verify-otp')
//         }, 1500)
//       } else {
//         setError('Failed to send OTP. Please try again.')
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong. Try again.')
//     } finally {
//       setOtpLoading(false)
//     }
//   }

//   const handleTabChange = (tab) => {
//     setActiveTab(tab)
//     setError('')
//     setSuccess('')
//     setMobileError('')
//     setEmailError('')
//   }

//   return (
//     <div
//       className="min-vh-100 d-flex flex-row align-items-center"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       <CContainer fluid>
//         <CRow className="justify-content-center align-items-center min-vh-100">
//           <CCol md={6} className="d-flex justify-content-center align-items-center">
//             <div className="text-center text-white">
//               <img
//                 src={logo}
//                 alt="Company Logo"
//                 style={{ maxWidth: '450px', marginTop: '50px' }}
//               />
//               <h1 className="display-4 fw-bold">Gandhi TVS</h1>
//               <p className="lead">Welcome to our Gandhi TVS</p>
//             </div>
//           </CCol>

//           <CCol md={4} className="me-5">
//             <CCardGroup>
//               <CCard className="p-4 shadow login-card">
//                 <CCardBody>
//                   <p className="text-center">Sign in to start your session Login</p>
                
//                   <CNav variant="tabs" className="mb-3">
//                     <CNavItem className="login-tab-item">
//                       <CNavLink
//                         active={activeTab === 1}
//                         onClick={() => handleTabChange(1)}
//                       >
//                         Mobile OTP
//                       </CNavLink>
//                     </CNavItem>
//                     <CNavItem className="login-tab-item">
//                       <CNavLink
//                         active={activeTab === 2}
//                         onClick={() => handleTabChange(2)}
//                       >
//                         Email OTP
//                       </CNavLink>
//                     </CNavItem>
//                   </CNav>

//                   {error && (
//                     <CAlert color="danger" className="mb-3">
//                       {error}
//                     </CAlert>
//                   )}
//                   {success && (
//                     <CAlert color="success" className="mb-3">
//                       {success}
//                     </CAlert>
//                   )}

//                   <CTabContent>
//                     {/* Mobile OTP Form */}
//                     <CTabPane visible={activeTab === 1}>
//                       <CForm onSubmit={handleMobileLogin}>
//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilPhone} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="text"
//                             name="mobile"
//                             placeholder="Mobile Number"
//                             autoComplete="tel"
//                             maxLength="10"
//                             value={mobile}
//                             onChange={handleMobileChange}
//                             onBlur={() => validateMobile(mobile)}
//                             required={activeTab === 1} // Only required when active
//                           />
//                         </CInputGroup>
//                         {mobileError && (
//                           <div className="text-danger small mb-3">{mobileError}</div>
//                         )}
                        
//                         <CRow className="text-end mt-3">
//                           <CCol>
//                             <CButton
//                               className="px-4 login-button mb-2"
//                               type="submit"
//                               disabled={loading || !mobile || mobileError}
//                             >
//                               {loading ? (
//                                 <>
//                                   <CSpinner
//                                     component="span"
//                                     size="sm"
//                                     aria-hidden="true"
//                                   />
//                                   <span className="ms-2">Sending OTP...</span>
//                                 </>
//                               ) : (
//                                 'Send OTP'
//                               )}
//                             </CButton>
//                           </CCol>
//                         </CRow>
//                       </CForm>
//                     </CTabPane>

//                     {/* Email OTP Form */}
//                     <CTabPane visible={activeTab === 2}>
//                       <CForm onSubmit={handleEmailLogin}>
//                         <CInputGroup className="mb-3">
//                           <CInputGroupText>
//                             <CIcon icon={cilEnvelopeClosed} />
//                           </CInputGroupText>
//                           <CFormInput
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={handleEmailChange}
//                             onBlur={() => validateEmail(email)}
//                             required={activeTab === 2} // Only required when active
//                           />
//                         </CInputGroup>
//                         {emailError && (
//                           <div className="text-danger small mb-3">{emailError}</div>
//                         )}
                        
//                         <CRow className="text-end mt-3">
//                           <CCol>
//                             <CButton
//                               className="px-4 login-button"
//                               type="submit"
//                               disabled={otpLoading || !email || emailError}
//                             >
//                               {otpLoading ? (
//                                 <>
//                                   <CSpinner
//                                     component="span"
//                                     size="sm"
//                                     aria-hidden="true"
//                                   />
//                                   <span className="ms-2">Sending OTP...</span>
//                                 </>
//                               ) : (
//                                 'Send OTP'
//                               )}
//                             </CButton>
//                           </CCol>
//                         </CRow>
//                       </CForm>
//                     </CTabPane>
//                   </CTabContent>

//                   <hr />
//                   <CRow>
//                     <p className="footer-text">
//                       Design and Developed by{' '}
//                       <a href="https://softcrowdtechnologies.com/">
//                         <span className="sub-footer">
//                           Softcrowd Technologies
//                         </span>
//                       </a>
//                     </p>
//                   </CRow>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   )
// }

// export default Login




import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilPhone } from '@coreui/icons'
import backgroundImage from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
import axiosInstance from 'src/axiosInstance'
import { useNavigate } from 'react-router-dom'
import './login.css'
import * as Yup from 'yup'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [emailError, setEmailError] = useState('')

  const navigate = useNavigate()

  // Validation schemas
  const mobileSchema = Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number (must be 10 digits)')
    .required('Mobile number is required')

  const emailSchema = Yup.string()
    .email('Invalid email address')
    .required('Email is required')

  const validateMobile = (value) => {
    try {
      mobileSchema.validateSync(value)
      setMobileError('')
      return true
    } catch (error) {
      setMobileError(error.message)
      return false
    }
  }

  const validateEmail = (value) => {
    try {
      emailSchema.validateSync(value)
      setEmailError('')
      return true
    } catch (error) {
      setEmailError(error.message)
      return false
    }
  }

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setMobile(value)
    if (value) validateMobile(value)
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (value) validateEmail(value)
  }

  const handleMobileLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateMobile(mobile)) {
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/request-otp', {
        login: mobile, // Changed from "mobile" to "login"
        otpMethod: 'SMS' // Added otpMethod field
      })

      if (response.data.success) {
        localStorage.setItem('login', mobile)
        localStorage.setItem('otpMethod', 'SMS')
        setSuccess('OTP sent successfully to your mobile number!')
        setTimeout(() => {
          navigate('/verify-otp')
        }, 1500)
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateEmail(email)) {
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/request-otp', {
        login: email, // Changed from "email" to "login"
        otpMethod: 'EMAIL' // Added otpMethod field
      })

      if (response.data.success) {
        localStorage.setItem('login', email)
        localStorage.setItem('otpMethod', 'EMAIL')
        setSuccess('OTP sent successfully to your email!')
        setTimeout(() => {
          navigate('/verify-otp')
        }, 1500)
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    setSuccess('')
    setMobileError('')
    setEmailError('')
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CContainer fluid>
        <CRow className="justify-content-center align-items-center min-vh-100">
          <CCol md={6} className="d-flex justify-content-center align-items-center">
            <div className="text-center text-white">
              <img
                src={logo}
                alt="Company Logo"
                style={{ maxWidth: '450px', marginTop: '50px' }}
              />
              <h1 className="display-4 fw-bold">Gandhi TVS</h1>
              <p className="lead">Welcome to our Gandhi TVS</p>
            </div>
          </CCol>

          <CCol md={4} className="me-5">
            <CCardGroup>
              <CCard className="p-4 shadow login-card">
                <CCardBody>
                  <p className="text-center">Sign in to start your session Login</p>
                
                  <CNav variant="tabs" className="mb-3">
                    <CNavItem className="login-tab-item">
                      <CNavLink
                        active={activeTab === 1}
                        onClick={() => handleTabChange(1)}
                      >
                        Mobile OTP
                      </CNavLink>
                    </CNavItem>
                    <CNavItem className="login-tab-item">
                      <CNavLink
                        active={activeTab === 2}
                        onClick={() => handleTabChange(2)}
                      >
                        Email OTP
                      </CNavLink>
                    </CNavItem>
                  </CNav>

                  {error && (
                    <CAlert color="danger" className="mb-3">
                      {error}
                    </CAlert>
                  )}
                  {success && (
                    <CAlert color="success" className="mb-3">
                      {success}
                    </CAlert>
                  )}

                  <CTabContent>
                    {/* Mobile OTP Form */}
                    <CTabPane visible={activeTab === 1}>
                      <CForm onSubmit={handleMobileLogin}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilPhone} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            autoComplete="tel"
                            maxLength="10"
                            value={mobile}
                            onChange={handleMobileChange}
                            onBlur={() => validateMobile(mobile)}
                            required={activeTab === 1}
                          />
                        </CInputGroup>
                        {mobileError && (
                          <div className="text-danger small mb-3">{mobileError}</div>
                        )}
                        
                        <CRow className="text-end mt-3">
                          <CCol>
                            <CButton
                              className="px-4 login-button mb-2"
                              type="submit"
                              disabled={loading || !mobile || mobileError}
                            >
                              {loading ? (
                                <>
                                  <CSpinner
                                    component="span"
                                    size="sm"
                                    aria-hidden="true"
                                  />
                                  <span className="ms-2">Sending OTP...</span>
                                </>
                              ) : (
                                'Send OTP'
                              )}
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CTabPane>

                    {/* Email OTP Form */}
                    <CTabPane visible={activeTab === 2}>
                      <CForm onSubmit={handleEmailLogin}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilEnvelopeClosed} />
                          </CInputGroupText>
                          <CFormInput
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => validateEmail(email)}
                            required={activeTab === 2}
                          />
                        </CInputGroup>
                        {emailError && (
                          <div className="text-danger small mb-3">{emailError}</div>
                        )}
                        
                        <CRow className="text-end mt-3">
                          <CCol>
                            <CButton
                              className="px-4 login-button"
                              type="submit"
                              disabled={loading || !email || emailError}
                            >
                              {loading ? (
                                <>
                                  <CSpinner
                                    component="span"
                                    size="sm"
                                    aria-hidden="true"
                                  />
                                  <span className="ms-2">Sending OTP...</span>
                                </>
                              ) : (
                                'Send OTP'
                              )}
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CTabPane>
                  </CTabContent>

                  <hr />
                  <CRow>
                    <p className="footer-text">
                      Design and Developed by{' '}
                      <a href="https://softcrowdtechnologies.com/">
                        <span className="sub-footer">
                          Softcrowd Technologies
                        </span>
                      </a>
                    </p>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login