// import React, { useState, useContext } from 'react'
// import {
// CButton,
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
// //import { AuthContext } from 'src/context/AuthContext'

// const VerifyOTP = () => {
//     const [otp, setOtp] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();
  
//     const handleVerify = async (e) => {
//       e.preventDefault();
//       setIsSubmitting(true);
//       setErrorMessage('');
  
//       try {
//         const mobile = localStorage.getItem('mobile');
//         const response = await axiosInstance.post('/auth/verify-otp', { mobile, otp });
  
//         if (response.data.success) {
//           localStorage.setItem('token', response.data.token);
  
//           localStorage.setItem('user', JSON.stringify(response.data.user));
//           localStorage.setItem('userPermissions', JSON.stringify(response.data.user.permissions));
  
//           const userRole = response.data.user.roles && response.data.user.roles.length > 0 ? response.data.user.roles[0].name : '';
  
//           localStorage.setItem('userRole', userRole);
//         //   triggerMenuRefresh();
  
//           console.log('Login successful', {
//             token: response.data.token,
//             user: response.data.user,
//             permissions: response.data.user.permissions,
//             role: userRole
//           });
  
//           navigate('/dashboard');
//         } else {
//           setErrorMessage('Invalid OTP. Please try again.');
//         }
//       } catch (error) {
//         console.error('OTP verification error:', error);
//         setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

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
//               <h1 className="display-4 fw-bold">Your Project Name</h1>
//               <p className="lead">Welcome to our platform</p>
//             </div>
//           </CCol>

//           <CCol md={4} className="me-5">
//             <CCardGroup>
//               <CCard className="p-4 shadow login-card">
//                 <CCardBody>
//                   <h5 className="text-center mb-4">Verify OTP</h5>
//                   <p className="text-center text-muted">
//                     Enter the OTP sent to your mobile number
//                   </p>
                
//                   <CForm onSubmit={handleVerify}>
//                     {errorMessage && (
//                       <CAlert color="danger" className="mb-3">
//                         {errorMessage}
//                       </CAlert>
//                     )}

//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         placeholder="OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         maxLength="6"
//                         required
//                       />
//                     </CInputGroup>

//                     <CRow className="text-end mt-3">
//                       <CCol>
//                         <CButton
//                           className="px-4 login-button mb-2"
//                           type="submit"
//                           disabled={isSubmitting}
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

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      const login = localStorage.getItem('login');
      const otpMethod = localStorage.getItem('otpMethod');

      // Validate that we have the required data
      if (!login || !otpMethod) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post('/auth/verify-otp', {
        login: login,
        otp: otp,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        // Store authentication data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userPermissions', JSON.stringify(response.data.user.permissions));

        // Extract user role
        const userRole = response.data.user.roles && response.data.user.roles.length > 0 
          ? response.data.user.roles[0].name 
          : '';
        localStorage.setItem('userRole', userRole);

        console.log('Login successful', {
          token: response.data.token,
          user: response.data.user,
          permissions: response.data.user.permissions,
          role: userRole
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
      const login = localStorage.getItem('login');
      const otpMethod = localStorage.getItem('otpMethod');

      if (!login || !otpMethod) {
        setErrorMessage('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post('/auth/request-otp', {
        login: login,
        otpMethod: otpMethod
      });

      if (response.data.success) {
        setErrorMessage('OTP resent successfully!');
      } else {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrorMessage('Failed to resend OTP. Please try again.');
    }
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
                  <p className="text-center text-muted">
                    {localStorage.getItem('otpMethod') === 'EMAIL' 
                      ? 'Enter the OTP sent to your email address'
                      : 'Enter the OTP sent to your mobile number'}
                  </p>
                
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
                      />
                    </CInputGroup>

                    <CRow className="text-end mt-3">
                      <CCol>
                        <CButton
                          className="px-4 login-button mb-2"
                          type="submit"
                          disabled={isSubmitting || otp.length !== 6}
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

                    <CRow className="text-center">
                      <CCol>
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={handleResendOTP}
                          disabled={isSubmitting}
                        >
                          Resend OTP
                        </CButton>
                      </CCol>
                    </CRow>

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