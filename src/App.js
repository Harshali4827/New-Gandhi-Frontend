// import React, { Suspense, useEffect } from 'react'
// import { HashRouter, Route, Routes } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// import { CSpinner, useColorModes } from '@coreui/react'
// import './scss/style.scss'

// import './scss/examples.scss'
// import VerifyOTP from './views/pages/verify-otp/VerifyOTP'
// import ProtectedRoute from './utils/ProtectedRoutes'

// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const App = () => {
//   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const storedTheme = useSelector((state) => state.theme)

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
//     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
//     if (theme) {
//       setColorMode(theme)
//     }

//     if (isColorModeSet()) {
//       return
//     }

//     setColorMode(storedTheme)
//   }, [])

//   return (
//     <HashRouter>
//       <Suspense
//         fallback={
//           <div className="pt-3 text-center">
//             <CSpinner color="primary" variant="grow" />
//           </div>
//         }
//       >
//         <Routes>
//           <Route exact path="/login" name="Login Page" element={<Login />} />
//           <Route exact path="/verify-otp" name="Verify OTP" element={<VerifyOTP />} />
//           <Route path="*" element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>} />
//         </Routes>
//       </Suspense>
//     </HashRouter>
//   )
// }

// export default App



// import React, { Suspense, useEffect } from 'react'
// import { HashRouter, Route, Routes } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { CSpinner, useColorModes } from '@coreui/react'

// import './scss/style.scss'
// import './scss/examples.scss'
// import PublicRoute from './utils/PublicRoute'
// import ProtectedRoute from './utils/ProtectedRoutes'


// // Lazy pages
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const VerifyOTP = React.lazy(() => import('./views/pages/verify-otp/VerifyOTP'))

// const App = () => {
//   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const storedTheme = useSelector((state) => state.theme)

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
//     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
//     if (theme) {
//       setColorMode(theme)
//     }

//     if (isColorModeSet()) {
//       return
//     }

//     setColorMode(storedTheme)
//   }, []) 

//   return (
//     <HashRouter>
//       <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
//         <Routes>

//           {/* PUBLIC ROUTES */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />

//           <Route
//             path="/verify-otp"
//             element={
//               <PublicRoute>
//                 <VerifyOTP />
//               </PublicRoute>
//             }
//           />

//           {/* PROTECTED ROUTES */}
//           <Route
//             path="*"
//             element={
//               <ProtectedRoute>
//                 <DefaultLayout />
//               </ProtectedRoute>
//             }
//           />

//         </Routes>
//       </Suspense>
//     </HashRouter>
//   )
// }

// export default App



import React, { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

import './scss/style.scss'
import './scss/examples.scss'
import PublicRoute from './utils/PublicRoute'
import ProtectedRoute from './utils/ProtectedRoutes'
import { AuthProvider } from './context/AuthContext'

// Lazy pages
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const VerifyOTP = React.lazy(() => import('./views/pages/verify-otp/VerifyOTP'))

const App = () => {
  return (
    <AuthProvider>
    <HashRouter>
      <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOTP />
              </PublicRoute>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </HashRouter>
    </AuthProvider>
  )
}

export default App
