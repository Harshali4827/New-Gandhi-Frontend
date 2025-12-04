// import React, { useState, useEffect } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     branch: '',
//     roleId: '',
//     discount: '',
//     permissions: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [permissionsData, setPermissionsData] = useState([]);
//   const [groupedPermissions, setGroupedPermissions] = useState({});
//   const [availableActions, setAvailableActions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     fetchRoles();
//     fetchBranches();
//     fetchAllPermissions();
//     if (id) fetchUser(id);
//   }, [id]);

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
//       const rolePermissions = userData.roles[0]?.permissions || [];
//       const userPermissions = userData.permissions?.map(p => p.permission) || [];
      
//       setFormData({
//         name: userData.name,
//         email: userData.email,
//         mobile: userData.mobile,
//         branch: userData.branchDetails?._id || '',
//         roleId: userData.roles[0]?._id || '',
//         discount: userData.discount || '',
//         permissions: [...rolePermissions]
//       });

//       if (userData.roles[0]?._id) {
//         setShowPermissions(true);
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       showError(error);
//     }
//   };

//   const fetchAllPermissions = async () => {
//     try {
//       const res = await axiosInstance.get('/permissions');
//       setPermissionsData(res.data.data);
      
//       const grouped = res.data.data.reduce((acc, permission) => {
//         const module = permission.module;
//         if (!acc[module]) {
//           acc[module] = [];
//         }
//         acc[module].push({
//           action: permission.action,
//           id: permission._id
//         });
//         return acc;
//       }, {});

//       setGroupedPermissions(grouped);

//       const actions = [...new Set(res.data.data.map((p) => p.action))];
//       setAvailableActions(actions);
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//     }
//   };

//   const fetchRolePermissions = async (roleId) => {
//     if (!roleId) return;
    
//     setIsLoadingPermissions(true);
//     try {
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const rolePermissions = res.data.data.permissions || [];
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissions
//       }));
//     } catch (error) {
//       console.error('Error fetching role permissions:', error);
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
//       await fetchRolePermissions(value);
//     }
//   };

//   const toggleAction = (module, action) => {
//     setFormData(prev => {
//       const permission = permissionsData.find(p => p.module === module && p.action === action);
//       if (!permission) return prev;

//       const newPermissions = prev.permissions.includes(permission._id)
//         ? prev.permissions.filter(id => id !== permission._id)
//         : [...prev.permissions, permission._id];

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleGlobalAction = (actionType) => {
//     setFormData(prev => {
//       switch (actionType) {
//         case 'none':
//           return { ...prev, permissions: [] };
//         case 'selectAll':
//           return { ...prev, permissions: permissionsData.map(p => p._id) };
//         case 'viewOnly':
//           return { 
//             ...prev, 
//             permissions: permissionsData
//               .filter(p => p.action === 'READ')
//               .map(p => p._id)
//           };
//         default:
//           return prev;
//       }
//     });
//   };

//   const isPermissionEnabled = (module, action) => {
//     const permission = permissionsData.find(p => p.module === module && p.action === action);
//     return permission && formData.permissions.includes(permission._id);
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//     if (!formData.branch) newErrors.branch = 'Branch is required';
//     if (!formData.roleId) newErrors.roleId = 'Role is required';
//     if(!formData.discount) newErrors.discount = 'Discount is required'

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const payload = {
//       name: formData.name,
//       email: formData.email,
//       mobile: formData.mobile,
//       branch: formData.branch,
//       roleId: formData.roleId,
//       permissions: formData.permissions,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) })
//     };

//     try {
//       if (id) {
//         await axiosInstance.put(`/users/${id}`, payload);
//         await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//       } else {
//         await axiosInstance.post('/auth/register', payload);
//         await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   return (
//     <div  className="form-container">
//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Email</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilEnvelopeClosed} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="email" 
//                     name="email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.email && <p className="error">{errors.email}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="branch" 
//                     value={formData.branch} 
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map(branch => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branch && <p className="error">{errors.branch}</p>}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Role</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="roleId" 
//                     value={formData.roleId} 
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     {roles.map(role => (
//                       <option key={role._id} value={role._id}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.roleId && <p className="error">{errors.roleId}</p>}
//               </div>
              
//               {/* {roles.find(role => role._id === formData.roleId)?.name === 'SALES_EXECUTIVE' && ( */}
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Discount</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilDollar} />
//                     </CInputGroupText>
//                     <CFormInput 
//                       type="number" 
//                       name="discount" 
//                       value={formData.discount} 
//                       onChange={handleChange} 
//                       min="0"
//                     />
//                   </CInputGroup>
//                   {errors.discount && <p className="error">{errors.discount}</p>}
//                 </div>
//               {/* )} */}

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Mobile number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="tel" 
//                     name="mobile" 
//                     value={formData.mobile} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.mobile && <p className="error">{errors.mobile}</p>}
//               </div>
//             </div>

//             {showPermissions && (
//               <div className="permissions-section mt-4">
//                 <h5>Permissions</h5>
//                 <div className="permissions-actions mb-3">
//                   <CButtonGroup>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('none')} variant="outline">
//                       None
//                     </CButton>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('selectAll')} variant="outline">
//                       Select All
//                     </CButton>
//                     <CButton color="secondary" onClick={() => handleGlobalAction('viewOnly')} variant="outline">
//                       View Only
//                     </CButton>
//                   </CButtonGroup>
//                 </div>

//                 {isLoadingPermissions ? (
//                   <div className="text-center py-4">Loading permissions...</div>
//                 ) : (
//                   <div className="permissions-table-container">
//                     <div className="permission-table-wrapper">
//                       <CTable bordered responsive hover small className="permission-table">
//                         <CTableHead color="light" className="permission-table-header">
//                           <CTableRow>
//                             <CTableHeaderCell scope="col" className="sticky-module-header">Module</CTableHeaderCell>
//                             {availableActions.map(action => (
//                               <CTableHeaderCell 
//                                 key={action} 
//                                 scope="col" 
//                                 className="text-center sticky-action-header"
//                               >
//                                 {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
//                               </CTableHeaderCell>
//                             ))}
//                           </CTableRow>
//                         </CTableHead>
//                         <CTableBody className="permission-table-body">
//                           {Object.entries(groupedPermissions).map(([module, actions]) => (
//                             <CTableRow key={module}>
//                               <CTableHeaderCell scope="row" className="sticky-module-cell">{module}</CTableHeaderCell>
//                               {availableActions.map(action => (
//                                 <CTableDataCell key={`${module}-${action}`} className="text-center">
//                                   {actions.some(a => a.action === action) ? (
//                                     <CFormCheck
//                                       type="checkbox"
//                                       checked={isPermissionEnabled(module, action)}
//                                       onChange={() => toggleAction(module, action)}
//                                       aria-label={`${module}-${action}`}
//                                     />
//                                   ) : (
//                                     <span>-</span>
//                                   )}
//                                 </CTableDataCell>
//                               ))}
//                             </CTableRow>
//                           ))}
//                         </CTableBody>
//                       </CTable>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="form-footer">
//               <button type="submit" className="cancel-button">
//                 Save
//               </button>
//               <button type="button" className="submit-button" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;



import React, { useState, useEffect } from 'react';
import '../../css/permission.css';
import '../../css/form.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButtonGroup,
  CBadge,
  CCloseButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
import axiosInstance from 'src/axiosInstance';
import { jwtDecode } from 'jwt-decode';

function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'employee',
    branch: '',
    subdealerType: '',
    roleId: '',
    email: '',
    mobile: '',
    discount: '',
    permissions: [],
    totalDeviationAmount: '',
    perTransactionDeviationLimit: '',
    verticles: []
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [verticles, setVerticles] = useState([]);
  const [permissionsData, setPermissionsData] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [availableActions, setAvailableActions] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPermissions, setShowPermissions] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.user_id) {
          setFormData(prev => ({
            ...prev,
            created_by: decoded.user_id
          }));
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchBranches();
    fetchAllPermissions();
    fetchSubdealers();
    fetchVerticles();
    if (id) fetchUser(id);
  }, [id]);

  const fetchUser = async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      const userData = res.data.data;
      
      console.log('User data for debugging:', userData);
      console.log('User verticles array:', userData.verticles);
      console.log('User verticlesDetails array:', userData.verticlesDetails);
      
      const rolePermissions = userData.roles[0]?.permissions || [];
      const userPermissions = userData.permissions?.map(p => p.permission) || [];
      
      // Extract verticles IDs from the response
      let userVerticles = [];
      
      // Check if we have verticles array (this should contain IDs)
      if (Array.isArray(userData.verticles)) {
        userVerticles = [...userData.verticles];
      }
      
      // If verticles is empty, check verticlesDetails
      if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
        if (userData.verticlesDetails.length > 0) {
          userVerticles = userData.verticlesDetails.map(v => v._id);
        }
      }
      
      console.log('Extracted verticles IDs:', userVerticles);
      
      setFormData({
        name: userData.name,
        type: userData.type || 'employee',
        branch: userData.branchDetails?._id || '',
        subdealerType: userData.subdealerType || '',
        roleId: userData.roles[0]?._id || '',
        email: userData.email,
        mobile: userData.mobile,
        discount: userData.discount || '',
        permissions: [...rolePermissions],
        totalDeviationAmount: userData.totalDeviationAmount || '',
        perTransactionDeviationLimit: userData.perTransactionDeviationLimit || '',
        verticles: userVerticles
      });

      if (userData.roles[0]?._id) {
        setShowPermissions(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showFormSubmitError(error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      showFormSubmitError(error);
    }
  };
  

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      showError(error);
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data?.subdealers || []);
    } catch (error) {
      console.error('Error fetching subdealers:', error);
      showError(error);
    }
  };

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      console.log('Fetched verticles from API:', verticlesData);
      setVerticles(verticlesData);
    } catch (error) {
      console.error('Error fetching verticles:', error);
      showError(error);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const res = await axiosInstance.get('/permissions');
      setPermissionsData(res.data.data);
      
      const grouped = res.data.data.reduce((acc, permission) => {
        const module = permission.module;
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push({
          action: permission.action,
          id: permission._id
        });
        return acc;
      }, {});

      setGroupedPermissions(grouped);

      const actions = [...new Set(res.data.data.map((p) => p.action))];
      setAvailableActions(actions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    if (!roleId) return;
    
    setIsLoadingPermissions(true);
    try {
      const res = await axiosInstance.get(`/roles/${roleId}`);
      const rolePermissions = res.data.data.permissions || [];
      
      setFormData(prev => ({
        ...prev,
        permissions: rolePermissions
      }));
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'roleId') {
      setShowPermissions(true);
      await fetchRolePermissions(value);
    }

    if (name === 'type') {
      if (value === 'subdealer') {
        const subdealerRole = roles.find(role => role.name.toLowerCase() === 'subdealer');
        if (subdealerRole) {
          setFormData(prev => ({ 
            ...prev, 
            type: value,
            roleId: subdealerRole._id
          }));
          await fetchRolePermissions(subdealerRole._id);
          setShowPermissions(true);
        }
      } else {
        setFormData(prev => ({ 
          ...prev, 
          type: value,
          subdealerType: ''
        }));
      }
    }
  };

  const handleVerticalChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !formData.verticles.includes(selectedId)) {
      setFormData(prev => ({
        ...prev,
        verticles: [...prev.verticles, selectedId]
      }));
    }
    setErrors(prev => ({ ...prev, verticles: '' }));
  };

  const removeVertical = (verticalId) => {
    console.log('Removing vertical:', verticalId);
    console.log('Current verticles before removal:', formData.verticles);
    
    setFormData(prev => {
      const newVerticles = prev.verticles.filter(id => id !== verticalId);
      console.log('New verticles after removal:', newVerticles);
      return {
        ...prev,
        verticles: newVerticles
      };
    });
  };

  const toggleAction = (module, action) => {
    setFormData(prev => {
      const permission = permissionsData.find(p => p.module === module && p.action === action);
      if (!permission) return prev;

      const newPermissions = prev.permissions.includes(permission._id)
        ? prev.permissions.filter(id => id !== permission._id)
        : [...prev.permissions, permission._id];

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleGlobalAction = (actionType) => {
    setFormData(prev => {
      switch (actionType) {
        case 'none':
          return { ...prev, permissions: [] };
        case 'selectAll':
          return { ...prev, permissions: permissionsData.map(p => p._id) };
        case 'viewOnly':
          return { 
            ...prev, 
            permissions: permissionsData
              .filter(p => p.action === 'READ')
              .map(p => p._id)
          };
        default:
          return prev;
      }
    });
  };

  const isPermissionEnabled = (module, action) => {
    const permission = permissionsData.find(p => p.module === module && p.action === action);
    return permission && formData.permissions.includes(permission._id);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (formData.type === 'subdealer' && !formData.subdealerType) newErrors.subdealerType = 'Subdealer Type is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!formData.discount) newErrors.discount = 'Discount is required';
    
    // REMOVED: No longer validating verticles as required for any role
    // Verticles are now optional for all roles
    
    // Validate manager-specific fields
    const selectedRole = roles.find(role => role._id === formData.roleId);
    if (selectedRole?.name === 'MANAGER') {
      if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
      if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      type: formData.type,
      branch: formData.branch,
      roleId: formData.roleId,
      email: formData.email,
      mobile: formData.mobile,
      permissions: formData.permissions,
      verticles: formData.verticles, // Verticles are included for all roles, can be empty array
      ...(formData.discount !== '' && { discount: Number(formData.discount) }),
      ...(formData.type === 'subdealer' && { subdealerType: formData.subdealerType }),
      ...(formData.totalDeviationAmount && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
      ...(formData.perTransactionDeviationLimit && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
    };

    console.log('Payload being sent:', payload);
    console.log('Verticles in payload:', payload.verticles);

    try {
      if (id) {
        await axiosInstance.put(`/users/${id}`, payload);
        await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
      } else {
        await axiosInstance.post('/auth/register', payload);
        await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/users/users-list');
  };

  const selectedRole = roles.find(role => role._id === formData.roleId);
  const isManager = selectedRole?.name === 'MANAGER';
  // REMOVED: No longer restricting verticles to specific roles

  const getSelectedVerticalNames = () => {
    return formData.verticles.map(verticalId => {
      const vertical = verticles.find(v => v._id === verticalId);
      return vertical ? vertical.name : verticalId;
    });
  };

  return (
    <div className="form-container">
      <div className='title'>{id ? 'Edit' : 'Add'} User</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPeople} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="subdealer">Subdealer</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleChange}
                  >
                    <option value="">-Select-</option>
                    {branches.map(branch => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.branch && <p className="error">{errors.branch}</p>}
              </div>

              {formData.type === 'subdealer' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">Subdealer Type</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="subdealerType" 
                      value={formData.subdealerType} 
                      onChange={handleChange}
                    >
                      <option value="">-Select Subdealer-</option>
                      {subdealers.map(subdealer => (
                        <option key={subdealer.id} value={subdealer.id}>
                          {subdealer.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.subdealerType && <p className="error">{errors.subdealerType}</p>}
                </div>
              )}
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Role</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="roleId" 
                    value={formData.roleId} 
                    onChange={handleChange}
                    disabled={formData.type === 'subdealer'}
                  >
                    <option value="">-Select-</option>
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.roleId && <p className="error">{errors.roleId}</p>}
                {formData.type === 'subdealer' && (
                  <small className="text-muted">Role is automatically set to Subdealer</small>
                )}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Email</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilEnvelopeClosed} />
                  </CInputGroupText>
                  <CFormInput 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Mobile number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput 
                    type="tel" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                  />
                </CInputGroup>
                {errors.mobile && <p className="error">{errors.mobile}</p>}
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Discount</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="discount" 
                    value={formData.discount} 
                    onChange={handleChange} 
                    min="0"
                  />
                </CInputGroup>
                {errors.discount && <p className="error">{errors.discount}</p>}
              </div>

              {/* Verticles field - now available for all roles and optional */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Verticles</span>
                  {/* Removed required asterisk */}
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="vertical" 
                    value="" 
                    onChange={handleVerticalChange}
                  >
                    <option value="">-Select Verticle-</option>
                    {verticles
                      .filter(vertical => vertical.status === 'active')
                      .map(vertical => (
                        <option 
                          key={vertical._id} 
                          value={vertical._id}
                          disabled={formData.verticles.includes(vertical._id)}
                        >
                          {vertical.name}
                        </option>
                      ))}
                  </CFormSelect>
                </CInputGroup>
                {/* Removed error display for verticles since it's optional */}
                
                {/* Display selected verticles as badges */}
                <div className="mt-2">
                  <div className="d-flex flex-wrap gap-2">
                    {getSelectedVerticalNames().map((verticalName, index) => (
                      <CBadge 
                        key={formData.verticles[index]}
                        color="primary"
                        className="d-flex align-items-center"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                      >
                        {verticalName}
                        <CCloseButton 
                          className="ms-2"
                          onClick={() => removeVertical(formData.verticles[index])}
                          style={{ fontSize: '0.75rem' }}
                        />
                      </CBadge>
                    ))}
                  </div>
                  <small className="text-muted">
                    {formData.verticles.length} verticle(s) selected (Optional)
                  </small>
                </div>
              </div>

              {isManager && (
                <>
                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Total Deviation Amount</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilDollar} />
                      </CInputGroupText>
                      <CFormInput 
                        type="number" 
                        name="totalDeviationAmount" 
                        value={formData.totalDeviationAmount} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                      />
                    </CInputGroup>
                    {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
                  </div>

                  <div className="input-box">
                    <div className="details-container">
                      <span className="details">Per Transaction Deviation Limit</span>
                      <span className="required">*</span>
                    </div>
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilDollar} />
                      </CInputGroupText>
                      <CFormInput 
                        type="number" 
                        name="perTransactionDeviationLimit" 
                        value={formData.perTransactionDeviationLimit} 
                        onChange={handleChange} 
                        min="0"
                        step="0.01"
                      />
                    </CInputGroup>
                    {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
                  </div>
                </>
              )}
            </div>

            {showPermissions && (
              <div className="permissions-section mt-4">
                <h5>Permissions</h5>
                <div className="permissions-actions mb-3">
                  <CButtonGroup>
                    <CButton color="secondary" onClick={() => handleGlobalAction('none')} variant="outline">
                      None
                    </CButton>
                    <CButton color="secondary" onClick={() => handleGlobalAction('selectAll')} variant="outline">
                      Select All
                    </CButton>
                    <CButton color="secondary" onClick={() => handleGlobalAction('viewOnly')} variant="outline">
                      View Only
                    </CButton>
                  </CButtonGroup>
                </div>

                {isLoadingPermissions ? (
                  <div className="text-center py-4">Loading permissions...</div>
                ) : (
                  <div className="permissions-table-container">
                    <div className="permission-table-wrapper">
                      <CTable bordered responsive hover small className="permission-table">
                        <CTableHead color="light" className="permission-table-header">
                          <CTableRow>
                            <CTableHeaderCell scope="col" className="sticky-module-header">Module</CTableHeaderCell>
                            {availableActions.map(action => (
                              <CTableHeaderCell 
                                key={action} 
                                scope="col" 
                                className="text-center sticky-action-header"
                              >
                                {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
                              </CTableHeaderCell>
                            ))}
                          </CTableRow>
                        </CTableHead>
                        <CTableBody className="permission-table-body">
                          {Object.entries(groupedPermissions).map(([module, actions]) => (
                            <CTableRow key={module}>
                              <CTableHeaderCell scope="row" className="sticky-module-cell">{module}</CTableHeaderCell>
                              {availableActions.map(action => (
                                <CTableDataCell key={`${module}-${action}`} className="text-center">
                                  {actions.some(a => a.action === action) ? (
                                    <CFormCheck
                                      type="checkbox"
                                      checked={isPermissionEnabled(module, action)}
                                      onChange={() => toggleAction(module, action)}
                                      aria-label={`${module}-${action}`}
                                    />
                                  ) : (
                                    <span>-</span>
                                  )}
                                </CTableDataCell>
                              ))}
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="form-footer">
              <button type="submit" className="cancel-button">
                Save
              </button>
              <button type="button" className="submit-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;





// import React, { useState, useEffect } from 'react';
// import '../../css/permission.css';
// import '../../css/form.css';
// import {
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CFormCheck,
//   CButtonGroup,
//   CBadge,
//   CCloseButton,
//   CAccordion,
//   CAccordionItem,
//   CAccordionHeader,
//   CAccordionBody,
//   CCol,
//   CRow,
//   CSpinner,
//   CAlert
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilDollar, cilEnvelopeClosed, cilLocationPin, cilPhone, cilUser, cilPeople, cilTag, cilSearch } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showError, showFormSubmitError, showFormSubmitToast } from 'src/utils/sweetAlerts';
// import axiosInstance from 'src/axiosInstance';
// import { jwtDecode } from 'jwt-decode';

// function AddUser() {
//   const [formData, setFormData] = useState({
//     name: '',
//     type: 'employee',
//     branch: '',
//     subdealerType: '',
//     roleId: '',
//     email: '',
//     mobile: '',
//     discount: '',
//     permissions: [],
//     totalDeviationAmount: '',
//     perTransactionDeviationLimit: '',
//     verticles: []
//   });

//   const [roles, setRoles] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [verticles, setVerticles] = useState([]);
//   const [permissionsData, setPermissionsData] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [showPermissions, setShowPermissions] = useState(false);
//   const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeModule, setActiveModule] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Main modules structure matching CreateRoleWithHierarchy
//   const mainModules = {
//     Masters: [
//       'ACCESSORIES',
//       'ACCESSORY_CATEGORY',
//       'ATTACHMENTS',
//       'BRANCH',
//       'BROKER',
//       'COLOR',
//       'CSV',
//       'DECLARATION',
//       'EMPLOYEE',
//       'FINANCE_PROVIDER',
//       'HEADER',
//       'INSURANCE',
//       'INSURANCE_PROVIDER',
//       'MODEL',
//       'OFFER',
//       'RTO',
//       'SUBDEALERMODEL',
//       'TERMS_CONDITION'
//     ],
//     Purchase: ['VEHICLE_INWARD', 'STOCK_TRANSFER'],
//     Sales: ['BOOKING', 'FINANCE_LETTER', 'KYC'],
//     Fund_Management: ['CASH_VOUCHER', 'CONTRA_VOUCHER', 'EXPENSE_ACCOUNT', 'WORKSHOP_RECEIPT'],
//     Fund_Master: ['BANK', 'BANK_SUB_PAYMENT_MODE', 'CASH_LOCATION', 'EXPENSE_ACCOUNT'],
//     Accessory_Billing: ['ACCESSORY_BILLING'],
//     Account: ['LEDGER', 'BROKER_LEDGER'],
//     Insurance: ['INSURANCE'],
//     Rto: ['RTO_PROCESS'],
//     Subdealer_Master: ['SUBDEALER', 'SUBDEALER_COMMISSION', 'SUBDEALERMODEL'],
//     Subdealer_Accounts: ['SUBDEALER_ON_ACCOUNT', 'SUBDEALER_COMMISSION'],
//     Quotation: ['CUSTOMER', 'QUOTATION'],
//     User_Management: ['PERMISSION', 'ROLE', 'SUBDEALER', 'USER', 'USER_BUFFER', 'USER_STATUS']
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded && decoded.user_id) {
//           setFormData(prev => ({
//             ...prev,
//             created_by: decoded.user_id
//           }));
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     fetchRoles();
//     fetchBranches();
//     fetchPermissions();
//     fetchSubdealers();
//     fetchVerticles();
//     if (id) fetchUser(id);
//   }, [id]);

//   const fetchPermissions = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get('/permissions');
//       setPermissionsData(res.data.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching permissions:', err);
//       setError('Failed to fetch permissions. Please try again.');
//       setLoading(false);
//     }
//   };

//   const fetchUser = async (userId) => {
//     try {
//       const res = await axiosInstance.get(`/users/${userId}`);
//       const userData = res.data.data;
      
//       console.log('User data for debugging:', userData);
//       console.log('User verticles array:', userData.verticles);
//       console.log('User verticlesDetails array:', userData.verticlesDetails);
      
//       const rolePermissions = userData.roles[0]?.permissions || [];
//       const userPermissions = userData.permissions?.map(p => p.permission) || [];
      
//       // Merge role and user permissions
//       const allPermissions = [...new Set([...rolePermissions, ...userPermissions])];
      
//       // Extract verticles IDs from the response
//       let userVerticles = [];
      
//       // Check if we have verticles array (this should contain IDs)
//       if (Array.isArray(userData.verticles)) {
//         userVerticles = [...userData.verticles];
//       }
      
//       // If verticles is empty, check verticlesDetails
//       if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
//         if (userData.verticlesDetails.length > 0) {
//           userVerticles = userData.verticlesDetails.map(v => v._id);
//         }
//       }
      
//       console.log('Extracted verticles IDs:', userVerticles);
      
//       setFormData({
//         name: userData.name,
//         type: userData.type || 'employee',
//         branch: userData.branchDetails?._id || '',
//         subdealerType: userData.subdealerType || '',
//         roleId: userData.roles[0]?._id || '',
//         email: userData.email,
//         mobile: userData.mobile,
//         discount: userData.discount || '',
//         permissions: allPermissions,
//         totalDeviationAmount: userData.totalDeviationAmount || '',
//         perTransactionDeviationLimit: userData.perTransactionDeviationLimit || '',
//         verticles: userVerticles
//       });

//       if (userData.roles[0]?._id) {
//         setShowPermissions(true);
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const response = await axiosInstance.get('/roles');
//       setRoles(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//       showFormSubmitError(error);
//     }
//   };
  

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching branches:', error);
//       showError(error);
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data?.subdealers || []);
//     } catch (error) {
//       console.error('Error fetching subdealers:', error);
//       showError(error);
//     }
//   };

//   const fetchVerticles = async () => {
//     try {
//       const response = await axiosInstance.get('/verticle-masters');
//       const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
//       console.log('Fetched verticles from API:', verticlesData);
//       setVerticles(verticlesData);
//     } catch (error) {
//       console.error('Error fetching verticles:', error);
//       showError(error);
//     }
//   };

//   const fetchRolePermissions = async (roleId) => {
//     if (!roleId) return;
    
//     setIsLoadingPermissions(true);
//     try {
//       const res = await axiosInstance.get(`/roles/${roleId}`);
//       const rolePermissions = res.data.data.permissions || [];
      
//       setFormData(prev => ({
//         ...prev,
//         permissions: rolePermissions
//       }));
//     } catch (error) {
//       console.error('Error fetching role permissions:', error);
//     } finally {
//       setIsLoadingPermissions(false);
//     }
//   };

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' }));

//     if (name === 'roleId') {
//       setShowPermissions(true);
//       await fetchRolePermissions(value);
//     }

//     if (name === 'type') {
//       if (value === 'subdealer') {
//         const subdealerRole = roles.find(role => role.name.toLowerCase() === 'subdealer');
//         if (subdealerRole) {
//           setFormData(prev => ({ 
//             ...prev, 
//             type: value,
//             roleId: subdealerRole._id
//           }));
//           await fetchRolePermissions(subdealerRole._id);
//           setShowPermissions(true);
//         }
//       } else {
//         setFormData(prev => ({ 
//           ...prev, 
//           type: value,
//           subdealerType: ''
//         }));
//       }
//     }
//   };

//   const handleVerticalChange = (e) => {
//     const selectedId = e.target.value;
//     if (selectedId && !formData.verticles.includes(selectedId)) {
//       setFormData(prev => ({
//         ...prev,
//         verticles: [...prev.verticles, selectedId]
//       }));
//     }
//     setErrors(prev => ({ ...prev, verticles: '' }));
//   };

//   const removeVertical = (verticalId) => {
//     console.log('Removing vertical:', verticalId);
//     console.log('Current verticles before removal:', formData.verticles);
    
//     setFormData(prev => {
//       const newVerticles = prev.verticles.filter(id => id !== verticalId);
//       console.log('New verticles after removal:', newVerticles);
//       return {
//         ...prev,
//         verticles: newVerticles
//       };
//     });
//   };

//   const togglePermission = (permissionId) => {
//     setFormData((prev) => {
//       const newPermissions = [...prev.permissions];
//       const index = newPermissions.indexOf(permissionId);

//       if (index >= 0) {
//         newPermissions.splice(index, 1);
//       } else {
//         newPermissions.push(permissionId);
//       }

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleModuleAction = (actionType, moduleName = null) => {
//     setFormData((prev) => {
//       let newPermissions = [...prev.permissions];

//       const targetModule = moduleName || activeModule;

//       if (!targetModule) return prev;

//       if (actionType === 'none') {
//         const modulePermissionIds = permissionsData.filter((p) => mainModules[targetModule].includes(p.module)).map((p) => p._id);

//         newPermissions = newPermissions.filter((id) => !modulePermissionIds.includes(id));
//       } else if (actionType === 'selectAll') {
//         const modulePermissionIds = permissionsData.filter((p) => mainModules[targetModule].includes(p.module)).map((p) => p._id);
//         modulePermissionIds.forEach((id) => {
//           if (!newPermissions.includes(id)) {
//             newPermissions.push(id);
//           }
//         });
//       } else if (actionType === 'viewOnly') {
//         const moduleReadPermissionIds = permissionsData
//           .filter((p) => mainModules[targetModule].includes(p.module) && p.action === 'READ')
//           .map((p) => p._id);
//         const allModulePermissionIds = permissionsData.filter((p) => mainModules[targetModule].includes(p.module)).map((p) => p._id);

//         newPermissions = newPermissions.filter((id) => !allModulePermissionIds.includes(id));

//         moduleReadPermissionIds.forEach((id) => {
//           if (!newPermissions.includes(id)) {
//             newPermissions.push(id);
//           }
//         });
//       }

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const handleGlobalAction = (actionType) => {
//     setFormData(prev => {
//       let newPermissions = [];

//       if (actionType === 'none') {
//         return { ...prev, permissions: [] };
//       }

//       if (actionType === 'selectAll') {
//         newPermissions = permissionsData.map((p) => p._id);
//       }

//       if (actionType === 'viewOnly') {
//         newPermissions = permissionsData.filter((p) => p.action === 'READ').map((p) => p._id);
//       }

//       return { ...prev, permissions: newPermissions };
//     });
//   };

//   const formatLabel = (text) => {
//     return text
//       .split('_')
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(' ');
//   };

//   const isPermissionEnabled = (permissionId) => {
//     return formData.permissions.includes(permissionId);
//   };

//   const getPermissionsForModule = (module) => {
//     return permissionsData.filter((p) => p.module === module);
//   };

//   // Get available actions for a specific main module
//   const getAvailableActionsForMainModule = (mainModule) => {
//     const allActions = new Set();

//     mainModules[mainModule].forEach((submodule) => {
//       const submodulePermissions = getPermissionsForModule(submodule);
//       submodulePermissions.forEach((permission) => {
//         allActions.add(permission.action);
//       });
//     });

//     return Array.from(allActions).sort();
//   };

//   const getFilteredMainModules = () => {
//     return Object.keys(mainModules).filter((mainModule) => {
//       if (!searchTerm) return true;

//       const mainModuleMatch = mainModule.toLowerCase().includes(searchTerm.toLowerCase());
//       const submoduleMatch = mainModules[mainModule].some((submodule) => submodule.toLowerCase().includes(searchTerm.toLowerCase()));

//       return mainModuleMatch || submoduleMatch;
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.type) newErrors.type = 'Type is required';
//     if (!formData.branch) newErrors.branch = 'Branch is required';
//     if (formData.type === 'subdealer' && !formData.subdealerType) newErrors.subdealerType = 'Subdealer Type is required';
//     if (!formData.roleId) newErrors.roleId = 'Role is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
//     if (!formData.discount) newErrors.discount = 'Discount is required';
    
//     // Validate verticles only for sales_manager or sales_executive roles
//     const selectedRole = roles.find(role => role._id === formData.roleId);
//     if (selectedRole && ['sales_manager', 'sales_executive'].includes(selectedRole.name.toLowerCase())) {
//       if (formData.verticles.length === 0) {
//         newErrors.verticles = 'At least one vertical is required for sales roles';
//       }
//     }
    
//     // Validate manager-specific fields
//     if (selectedRole?.name === 'MANAGER') {
//       if (!formData.totalDeviationAmount) newErrors.totalDeviationAmount = 'Total Deviation Amount is required';
//       if (!formData.perTransactionDeviationLimit) newErrors.perTransactionDeviationLimit = 'Per Transaction Deviation Limit is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const payload = {
//       name: formData.name,
//       type: formData.type,
//       branch: formData.branch,
//       roleId: formData.roleId,
//       email: formData.email,
//       mobile: formData.mobile,
//       permissions: formData.permissions,
//       verticles: formData.verticles,
//       ...(formData.discount !== '' && { discount: Number(formData.discount) }),
//       ...(formData.type === 'subdealer' && { subdealerType: formData.subdealerType }),
//       ...(formData.totalDeviationAmount && { totalDeviationAmount: Number(formData.totalDeviationAmount) }),
//       ...(formData.perTransactionDeviationLimit && { perTransactionDeviationLimit: Number(formData.perTransactionDeviationLimit) })
//     };

//     console.log('Payload being sent:', payload);
//     console.log('Verticles in payload:', payload.verticles);

//     try {
//       if (id) {
//         await axiosInstance.put(`/users/${id}`, payload);
//         await showFormSubmitToast('User updated successfully!', () => navigate('/users/users-list'));
//       } else {
//         await axiosInstance.post('/auth/register', payload);
//         await showFormSubmitToast('User added successfully!', () => navigate('/users/users-list'));
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/users/users-list');
//   };

//   const selectedRole = roles.find(role => role._id === formData.roleId);
//   const isManager = selectedRole?.name === 'MANAGER';
//   const requiresVerticles = selectedRole && ['sales_manager', 'sales_executive'].includes(selectedRole.name.toLowerCase());

//   const getSelectedVerticalNames = () => {
//     return formData.verticles.map(verticalId => {
//       const vertical = verticles.find(v => v._id === verticalId);
//       return vertical ? vertical.name : verticalId;
//     });
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container my-4">
//         <CAlert color="danger">{error}</CAlert>
//         <CButton color="primary" onClick={fetchPermissions}>
//           Retry
//         </CButton>
//       </div>
//     );
//   }

//   return (
//     <div className="form-container">
//       <div className='title'>{id ? 'Edit' : 'Add'} User</div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="text" 
//                     name="name" 
//                     value={formData.name} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Type</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPeople} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="type" 
//                     value={formData.type} 
//                     onChange={handleChange}
//                   >
//                     <option value="employee">Employee</option>
//                     <option value="subdealer">Subdealer</option>
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.type && <p className="error">{errors.type}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Branch</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilLocationPin} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="branch" 
//                     value={formData.branch} 
//                     onChange={handleChange}
//                   >
//                     <option value="">-Select-</option>
//                     {branches.map(branch => (
//                       <option key={branch._id} value={branch._id}>
//                         {branch.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.branch && <p className="error">{errors.branch}</p>}
//               </div>

//               {formData.type === 'subdealer' && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Subdealer Type</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilUser} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="subdealerType" 
//                       value={formData.subdealerType} 
//                       onChange={handleChange}
//                     >
//                       <option value="">-Select Subdealer-</option>
//                       {subdealers.map(subdealer => (
//                         <option key={subdealer.id} value={subdealer.id}>
//                           {subdealer.name}
//                         </option>
//                       ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.subdealerType && <p className="error">{errors.subdealerType}</p>}
//                 </div>
//               )}
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Role</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormSelect 
//                     name="roleId" 
//                     value={formData.roleId} 
//                     onChange={handleChange}
//                     disabled={formData.type === 'subdealer'}
//                   >
//                     <option value="">-Select-</option>
//                     {roles.map(role => (
//                       <option key={role._id} value={role._id}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//                 {errors.roleId && <p className="error">{errors.roleId}</p>}
//                 {formData.type === 'subdealer' && (
//                   <small className="text-muted">Role is automatically set to Subdealer</small>
//                 )}
//               </div>
              
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Email</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilEnvelopeClosed} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="email" 
//                     name="email" 
//                     value={formData.email} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.email && <p className="error">{errors.email}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Mobile number</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="tel" 
//                     name="mobile" 
//                     value={formData.mobile} 
//                     onChange={handleChange} 
//                   />
//                 </CInputGroup>
//                 {errors.mobile && <p className="error">{errors.mobile}</p>}
//               </div>

//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Discount</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilDollar} />
//                   </CInputGroupText>
//                   <CFormInput 
//                     type="number" 
//                     name="discount" 
//                     value={formData.discount} 
//                     onChange={handleChange} 
//                     min="0"
//                   />
//                 </CInputGroup>
//                 {errors.discount && <p className="error">{errors.discount}</p>}
//               </div>

//               {requiresVerticles && (
//                 <div className="input-box">
//                   <div className="details-container">
//                     <span className="details">Verticles</span>
//                     <span className="required">*</span>
//                   </div>
//                   <CInputGroup>
//                     <CInputGroupText className="input-icon">
//                       <CIcon icon={cilTag} />
//                     </CInputGroupText>
//                     <CFormSelect 
//                       name="vertical" 
//                       value="" 
//                       onChange={handleVerticalChange}
//                     >
//                       <option value="">-Select Verticle-</option>
//                       {verticles
//                         .filter(vertical => vertical.status === 'active')
//                         .map(vertical => (
//                           <option 
//                             key={vertical._id} 
//                             value={vertical._id}
//                             disabled={formData.verticles.includes(vertical._id)}
//                           >
//                             {vertical.name}
//                           </option>
//                         ))}
//                     </CFormSelect>
//                   </CInputGroup>
//                   {errors.verticles && <p className="error">{errors.verticles}</p>}
                  
//                   {/* Display selected verticles as badges */}
//                   <div className="mt-2">
//                     <div className="d-flex flex-wrap gap-2">
//                       {getSelectedVerticalNames().map((verticalName, index) => (
//                         <CBadge 
//                           key={formData.verticles[index]}
//                           color="primary"
//                           className="d-flex align-items-center"
//                           style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
//                         >
//                           {verticalName}
//                           <CCloseButton 
//                             className="ms-2"
//                             onClick={() => removeVertical(formData.verticles[index])}
//                             style={{ fontSize: '0.75rem' }}
//                           />
//                         </CBadge>
//                       ))}
//                     </div>
//                     <small className="text-muted">
//                       {formData.verticles.length} verticle(s) selected
//                     </small>
//                   </div>
//                 </div>
//               )}

//               {isManager && (
//                 <>
//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Total Deviation Amount</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="totalDeviationAmount" 
//                         value={formData.totalDeviationAmount} 
//                         onChange={handleChange} 
//                         min="0"
//                         step="0.01"
//                       />
//                     </CInputGroup>
//                     {errors.totalDeviationAmount && <p className="error">{errors.totalDeviationAmount}</p>}
//                   </div>

//                   <div className="input-box">
//                     <div className="details-container">
//                       <span className="details">Per Transaction Deviation Limit</span>
//                       <span className="required">*</span>
//                     </div>
//                     <CInputGroup>
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilDollar} />
//                       </CInputGroupText>
//                       <CFormInput 
//                         type="number" 
//                         name="perTransactionDeviationLimit" 
//                         value={formData.perTransactionDeviationLimit} 
//                         onChange={handleChange} 
//                         min="0"
//                         step="0.01"
//                       />
//                     </CInputGroup>
//                     {errors.perTransactionDeviationLimit && <p className="error">{errors.perTransactionDeviationLimit}</p>}
//                   </div>
//                 </>
//               )}
//             </div>

//             {showPermissions && (
//               <div className="permissions-container mt-3">
//                 <CRow className="mb-3 align-items-center">
//                   <CCol>
//                     <h6 className="mb-0">Permissions</h6>
//                   </CCol>
//                   <CCol className="text-end">
//                     <CButtonGroup>
//                       <CButton color="secondary" onClick={() => handleGlobalAction('none')} variant="outline">
//                         None (All)
//                       </CButton>
//                       <CButton color="secondary" onClick={() => handleGlobalAction('selectAll')} variant="outline">
//                         Select All (All)
//                       </CButton>
//                       <CButton color="secondary" onClick={() => handleGlobalAction('viewOnly')} variant="outline">
//                         View Only (All)
//                       </CButton>
//                     </CButtonGroup>
//                   </CCol>
//                 </CRow>

//                 <CRow className="mb-3 align-items-center">
//                   <CCol>
//                     <CInputGroup className="search-box">
//                       <CInputGroupText className="input-icon">
//                         <CIcon icon={cilSearch} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Search modules or submodules..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{ height: '35px' }}
//                       />
//                     </CInputGroup>
//                   </CCol>
//                 </CRow>

//                 {isLoadingPermissions ? (
//                   <div className="text-center py-4">
//                     <CSpinner color="primary" size="sm" /> Loading permissions...
//                   </div>
//                 ) : (
//                   <CAccordion activeItemKey={activeModule} onActiveItemChange={setActiveModule}>
//                     {getFilteredMainModules().map((mainModule) => {
//                       const availableActionsForModule = getAvailableActionsForMainModule(mainModule);

//                       return (
//                         <CAccordionItem key={mainModule} itemKey={mainModule}>
//                           <CAccordionHeader>
//                             <div className="d-flex justify-content-between w-100 me-3">
//                               <h6 className="mb-0">{formatLabel(mainModule)}</h6>
//                               <span className="badge bg-primary rounded-pill">{mainModules[mainModule].length} submodules</span>
//                             </div>
//                           </CAccordionHeader>
//                           <CAccordionBody>
//                             <div className="module-actions mb-2">
//                               <CButtonGroup size="sm">
//                                 <CButton color="secondary" onClick={() => handleModuleAction('none', mainModule)} variant="outline">
//                                   None
//                                 </CButton>
//                                 <CButton color="secondary" onClick={() => handleModuleAction('selectAll', mainModule)} variant="outline">
//                                   Select All
//                                 </CButton>
//                                 <CButton color="secondary" onClick={() => handleModuleAction('viewOnly', mainModule)} variant="outline">
//                                   View Only
//                                 </CButton>
//                               </CButtonGroup>
//                             </div>
//                             <div className="table-responsive">
//                               <CTable bordered responsive hover small className="permission-table">
//                                 <CTableHead color="light">
//                                   <CTableRow>
//                                     <CTableHeaderCell scope="col">Submodule</CTableHeaderCell>
//                                     {availableActionsForModule.map((action) => (
//                                       <CTableHeaderCell key={action} scope="col" className="text-center">
//                                         {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
//                                       </CTableHeaderCell>
//                                     ))}
//                                   </CTableRow>
//                                 </CTableHead>
//                                 <CTableBody>
//                                   {mainModules[mainModule]
//                                     .filter(
//                                       (submodule) =>
//                                         !searchTerm ||
//                                         submodule.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                                         mainModule.toLowerCase().includes(searchTerm.toLowerCase())
//                                     )
//                                     .map((submodule) => {
//                                       const submodulePermissions = getPermissionsForModule(submodule);
//                                       return (
//                                         <CTableRow key={submodule}>
//                                           <CTableHeaderCell className="table-header-fixed" scope="row">
//                                             {formatLabel(submodule)}
//                                           </CTableHeaderCell>
//                                           {availableActionsForModule.map((action) => {
//                                             const permission = submodulePermissions.find((p) => p.action === action);
//                                             return (
//                                               <CTableDataCell key={`${submodule}-${action}`} className="text-center">
//                                                 {permission ? (
//                                                   <CFormCheck
//                                                     type="checkbox"
//                                                     checked={isPermissionEnabled(permission._id)}
//                                                     onChange={() => togglePermission(permission._id)}
//                                                     aria-label={`${submodule}-${action}`}
//                                                   />
//                                                 ) : (
//                                                   <span>-</span>
//                                                 )}
//                                               </CTableDataCell>
//                                             );
//                                           })}
//                                         </CTableRow>
//                                       );
//                                     })}
//                                 </CTableBody>
//                               </CTable>
//                             </div>
//                           </CAccordionBody>
//                         </CAccordionItem>
//                       );
//                     })}
//                   </CAccordion>
//                 )}
//               </div>
//             )}

//             <div className="form-footer">
//               <button type="submit" className="cancel-button">
//                 Save
//               </button>
//               <button type="button" className="submit-button" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddUser;