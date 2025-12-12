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
    subdealer: '',
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
  const [error, setError] = useState(null);
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
      const rolePermissionIds = rolePermissions.map(p => p._id);
      
      const userPermissions = userData.permissions?.map(p => p.permission?._id || p.permission) || [];

      const allPermissionIds = [...new Set([...rolePermissionIds, ...userPermissions])];
      
      let userVerticles = [];

      if (Array.isArray(userData.verticles)) {
        userVerticles = [...userData.verticles];
      }

      if (userVerticles.length === 0 && Array.isArray(userData.verticlesDetails)) {
        if (userData.verticlesDetails.length > 0) {
          userVerticles = userData.verticlesDetails.map(v => v._id);
        }
      }
      
      console.log('Extracted verticles IDs:', userVerticles);
      console.log('Extracted permission IDs:', allPermissionIds);
      
      setFormData({
        name: userData.name,
        type: userData.type || 'employee',
        branch: userData.branchDetails?._id || '',
        subdealer: userData.subdealer || '',
        roleId: userData.roles[0]?._id || '',
        email: userData.email,
        mobile: userData.mobile,
        discount: userData.discount || '',
        permissions: allPermissionIds,
        totalDeviationAmount: userData.totalDeviationAmount || '',
        perTransactionDeviationLimit: userData.perTransactionDeviationLimit || '',
        verticles: userVerticles
      });

      if (userData.roles[0]?._id) {
        setShowPermissions(true);
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
         setError(message);
       }
  
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
  
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }    
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data?.subdealers || []);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
    }
  };

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      console.log('Fetched verticles from API:', verticlesData);
      setVerticles(verticlesData);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      
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

      const permissionIds = rolePermissions.map(permission => permission._id);
      
      console.log('Fetched role permissions:', rolePermissions);
      console.log('Extracted permission IDs:', permissionIds);
      
      setFormData(prev => ({
        ...prev,
        permissions: permissionIds
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
      console.log('Role selected:', value);
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
          subdealer: ''
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
    
    if (!permission) {
      console.log(`Permission not found for module: ${module}, action: ${action}`);
      return false;
    }
    
    const isEnabled = formData.permissions.includes(permission._id);
    return isEnabled;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (formData.type === 'employee' && !formData.branch) {
      newErrors.branch = 'Branch is required for employee';
    }
    if (formData.type === 'subdealer' && !formData.subdealer) {
      newErrors.subdealer = 'Subdealer is required';
    }
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!formData.discount) newErrors.discount = 'Discount is required';
    const selectedRole = roles.find(role => role._id === formData.roleId);
    if (selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name)) {
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
      roleId: formData.roleId,
      email: formData.email,
      mobile: formData.mobile,
      permissions: formData.permissions,
      verticles: formData.verticles,
      ...(formData.discount !== '' && { discount: Number(formData.discount) }),
      ...(formData.type === 'employee' && formData.branch && { branch: formData.branch }),
      ...(formData.type === 'subdealer' && formData.subdealer && { subdealer: formData.subdealer }),
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
  const isManager = selectedRole && ['MANAGER', 'GENERAL_MANAGER'].includes(selectedRole.name);
  const getSelectedVerticalNames = () => {
    return formData.verticles.map(verticalId => {
      const vertical = verticles.find(v => v._id === verticalId);
      return vertical ? vertical.name : verticalId;
    });
  };
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
      {error}
      </div>
    );
  }
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
              
                  {formData.type === 'employee' && (
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
                  )}

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
                      name="subdealer" 
                      value={formData.subdealer} 
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
                  {errors.subdealer && <p className="error">{errors.subdealer}</p>}
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

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Verticles</span>
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
