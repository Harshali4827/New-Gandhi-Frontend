// import React, { useState } from 'react'
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
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import { cilLockLocked } from '@coreui/icons'
// import backgroundImage from '../../../assets/images/background.jpg'
// import logo from '../../../assets/images/logo.png'
// import axiosInstance from 'src/axiosInstance'
// import { useNavigate } from 'react-router-dom'

// const VerifyOTP = () => {
//   const [otp, setOtp] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleVerify = async (e) => {
//     e.preventDefault();
    
//     if (otp.length !== 6) {
//       setErrorMessage('OTP must be 6 digits');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setErrorMessage('');

//     try {
//       // Get stored values from localStorage
//       const login = localStorage.getItem('login');
//       const otpMethod = localStorage.getItem('otpMethod');

//       // Validate that we have the required data
//       if (!login || !otpMethod) {
//         setErrorMessage('Session expired. Please login again.');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//         return;
//       }

//       const response = await axiosInstance.post('/auth/verify-otp', {
//         login: login,
//         otp: otp,
//         otpMethod: otpMethod
//       });

//       if (response.data.success) {
//         // Store authentication data
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         localStorage.setItem('userPermissions', JSON.stringify(response.data.user.permissions));

//         // Extract user role
//         const userRole = response.data.user.roles && response.data.user.roles.length > 0 
//           ? response.data.user.roles[0].name 
//           : '';
//         localStorage.setItem('userRole', userRole);

//         console.log('Login successful', {
//           token: response.data.token,
//           user: response.data.user,
//           permissions: response.data.user.permissions,
//           role: userRole
//         });

//         // Navigate to dashboard
//         navigate('/dashboard');
//       } else {
//         setErrorMessage('Invalid OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('OTP verification error:', error);
      
//       // Handle specific error cases
//       if (error.response?.status === 404) {
//         setErrorMessage('Invalid login credentials. Please try again.');
//       } else if (error.response?.status === 400) {
//         setErrorMessage(error.response?.data?.message || 'Invalid OTP.');
//       } else {
//         setErrorMessage('Verification failed. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setErrorMessage('');
    
//     try {
//       const login = localStorage.getItem('login');
//       const otpMethod = localStorage.getItem('otpMethod');

//       if (!login || !otpMethod) {
//         setErrorMessage('Session expired. Please login again.');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//         return;
//       }

//       const response = await axiosInstance.post('/auth/request-otp', {
//         login: login,
//         otpMethod: otpMethod
//       });

//       if (response.data.success) {
//         setErrorMessage('OTP resent successfully!');
//       } else {
//         setErrorMessage('Failed to resend OTP. Please try again.');
//       }
//     } catch (error) {
//       console.error('Resend OTP error:', error);
//       setErrorMessage('Failed to resend OTP. Please try again.');
//     }
//   };

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
//               <p className="lead">Welcome to our platform</p>
//             </div>
//           </CCol>

//           <CCol md={4} className="me-5">
//             <CCardGroup>
//               <CCard className="p-4 shadow login-card">
//                 <CCardBody>
//                   <h5 className="text-center mb-4">Verify OTP</h5>
//                   <p className="text-center text-muted">
//                     {localStorage.getItem('otpMethod') === 'EMAIL' 
//                       ? 'Enter the OTP sent to your email address'
//                       : 'Enter the OTP sent to your mobile number'}
//                   </p>
                
//                   <CForm onSubmit={handleVerify}>
//                     {errorMessage && (
//                       <CAlert 
//                         color={errorMessage.includes('successfully') ? 'success' : 'danger'} 
//                         className="mb-3"
//                       >
//                         {errorMessage}
//                       </CAlert>
//                     )}

//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) => {
//                           const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                           setOtp(value);
//                           setErrorMessage('');
//                         }}
//                         maxLength="6"
//                         required
//                       />
//                     </CInputGroup>

//                     <CRow className="text-end mt-3">
//                       <CCol>
//                         <CButton
//                           className="px-4 login-button mb-2"
//                           type="submit"
//                           disabled={isSubmitting || otp.length !== 6}
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <CSpinner
//                                 component="span"
//                                 size="sm"
//                                 aria-hidden="true"
//                               />
//                               <span className="ms-2">Verifying...</span>
//                             </>
//                           ) : (
//                             'Verify OTP'
//                           )}
//                         </CButton>
//                       </CCol>
//                     </CRow>

//                     <CRow className="text-center">
//                       <CCol>
//                         <CButton
//                           color="link"
//                           className="px-0"
//                           onClick={handleResendOTP}
//                           disabled={isSubmitting}
//                         >
//                           Resend OTP
//                         </CButton>
//                       </CCol>
//                     </CRow>

//                     <hr />
//                     <CRow>
//                       <p className="footer-text">
//                         Design and Developed by{' '}
//                         <a href="https://softcrowdtechnologies.com/">
//                           <span className="sub-footer">
//                             Softcrowd Technologies
//                           </span>
//                         </a>
//                       </p>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   )
// }

// export default VerifyOTP



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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import backgroundImage from '../../../assets/images/background.jpg'
import logo from '../../../assets/images/logo.png'
import axiosInstance from 'src/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/context/AuthContext'

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setErrorMessage('OTP must be 6 digits');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Get stored values from localStorage
      const loginIdentifier = localStorage.getItem('login');
      const otpMethod = localStorage.getItem('otpMethod');

      // Validate that we have the required data
      if (!loginIdentifier || !otpMethod) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post('/auth/verify-otp', {
        login: loginIdentifier,
        otp: otp,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        // Store token temporarily
        const token = response.data.token;
        
        // Use the login function from AuthContext which will:
        // 1. Store the token in localStorage
        // 2. Call /auth/me API to get complete user data with permissions
        // 3. Update the AuthContext state
        // 4. Store user data in localStorage
        await login(token, response.data.data);
        
        console.log('Login successful', {
          token: token,
          userData: response.data.data
        });

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        setErrorMessage('Invalid login credentials. Please try again.');
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response?.data?.message || 'Invalid OTP.');
      } else if (error.response?.status === 401) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage('Verification failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setErrorMessage('');
    
    try {
      const loginIdentifier = localStorage.getItem('login');
      const otpMethod = localStorage.getItem('otpMethod');

      if (!loginIdentifier || !otpMethod) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post('/auth/request-otp', {
        login: loginIdentifier,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        setErrorMessage('OTP resent successfully! Check your email/phone.');
      } else {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      if (error.response?.status === 400) {
        setErrorMessage(error.response?.data?.message || 'Failed to resend OTP.');
      } else if (error.response?.status === 404) {
        setErrorMessage('User not found. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
    }
  };

  const handleBackToLogin = () => {
    // Clear the stored login data
    localStorage.removeItem('login');
    localStorage.removeItem('otpMethod');
    navigate('/login');
  };

  const getOtpMethodDisplay = () => {
    const otpMethod = localStorage.getItem('otpMethod');
    const loginIdentifier = localStorage.getItem('login') || '';
    
    if (otpMethod === 'EMAIL') {
      return `Enter the OTP sent to your email address`;
    } else if (otpMethod === 'SMS') {
      return `Enter the OTP sent to your mobile number`;
    }
    
    return 'Enter the OTP sent to you';
  };

  const formatLoginIdentifier = () => {
    const loginIdentifier = localStorage.getItem('login') || '';
    const otpMethod = localStorage.getItem('otpMethod');
    
    if (otpMethod === 'EMAIL') {
      return `Email: ${loginIdentifier}`;
    } else if (otpMethod === 'SMS') {
      return `Mobile: ${loginIdentifier}`;
    }
    
    return loginIdentifier;
  };

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
              <p className="lead">Welcome to our platform</p>
            </div>
          </CCol>

          <CCol md={4} className="me-5">
            <CCardGroup>
              <CCard className="p-4 shadow login-card">
                <CCardBody>
                  <h5 className="text-center mb-4">Verify OTP</h5>
                  
                  <div className="text-center mb-3">
                    <p className="text-muted mb-1">
                      {getOtpMethodDisplay()}
                    </p>
                    <p className="text-primary fw-bold">
                      {formatLoginIdentifier()}
                    </p>
                  </div>
                
                  <CForm onSubmit={handleVerify}>
                    {errorMessage && (
                      <CAlert 
                        color={errorMessage.includes('successfully') ? 'success' : 'danger'} 
                        className="mb-3"
                      >
                        {errorMessage}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtp(value);
                          setErrorMessage('');
                        }}
                        maxLength="6"
                        required
                        autoFocus
                      />
                    </CInputGroup>

                    <CRow className="text-center mt-3">
                      <CCol>
                        <CButton
                          className="px-4 login-button mb-2"
                          type="submit"
                          disabled={isSubmitting || otp.length !== 6}
                          style={{ minWidth: '120px' }}
                        >
                          {isSubmitting ? (
                            <>
                              <CSpinner
                                component="span"
                                size="sm"
                                aria-hidden="true"
                              />
                              <span className="ms-2">Verifying...</span>
                            </>
                          ) : (
                            'Verify OTP'
                          )}
                        </CButton>
                      </CCol>
                    </CRow>

                    <CRow className="text-center mt-2">
                      <CCol>
                        <p className="mb-2">
                          Didn't receive OTP?{' '}
                          <CButton
                            color="link"
                            className="p-0"
                            onClick={handleResendOTP}
                            disabled={isSubmitting}
                          >
                            Resend OTP
                          </CButton>
                        </p>
                        
                        <CButton
                          color="link"
                          className="p-0 text-muted"
                          onClick={handleBackToLogin}
                          disabled={isSubmitting}
                        >
                          ← Back to Login
                        </CButton>
                      </CCol>
                    </CRow>

                    <hr className="mt-4" />
                    <CRow>
                      <p className="footer-text text-center">
                        Design and Developed by{' '}
                        <a href="https://softcrowdtechnologies.com/" target="_blank" rel="noopener noreferrer">
                          <span className="sub-footer">
                            Softcrowd Technologies
                          </span>
                        </a>
                      </p>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default VerifyOTP