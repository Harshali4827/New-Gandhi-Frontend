import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CCol,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilFolder,
  cilLockLocked
} from '@coreui/icons';
import { Link } from 'react-router-dom';
import { CFormLabel } from '@coreui/react';
import {
  getDefaultSearchFields,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { hasPermission } from 'src/utils/permissionUtils.js';

const AllRoles = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const hasEditPermission = hasPermission('ROLE', 'UPDATE');
  const hasDeletePermission = hasPermission('ROLE', 'DELETE');
  const hasCreatePermission = hasPermission('ROLE', 'CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/roles`);
      const filteredRoles = response.data.data.filter((role) => role.name.toLowerCase() !== 'ad');
      setData(filteredRoles);
      setFilteredData(filteredRoles);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const searchFields = getDefaultSearchFields('roles');
    const filtered = data.filter(item =>
      searchFields.some(field => {
        const fieldValue = item[field]?.toString().toLowerCase() || '';
        return fieldValue.includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/roles/${id}`);
        setData(data.filter((role) => role.id !== id));
        setFilteredData(filteredData.filter((role) => role.id !== id));
        showSuccess('Role deleted successfully!');
        fetchData();
        handleClose();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const groupPermissionsByModule = (permissions) => {
    if (!permissions || !permissions.length) return {};

    return permissions.reduce((acc, permission) => {
      const module = permission.module || permission.resource;
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission.action);
      return acc;
    }, {});
  };

  const showRoleDetails = (role) => {
    setSelectedRole(role);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>All Roles</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <Link to='/roles/create-role'>
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Role
                </CButton>
              </Link>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Role Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Modules</CTableHeaderCell>
                  <CTableHeaderCell>Permissions</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((role, index) => {
                    const groupedPermissions = groupPermissionsByModule(role.permissions);
                    const modules = Object.keys(groupedPermissions);
                    const moduleCount = modules.length;
                    const permissionCount = role.permissions?.length || 0;

                    return (
                      <CTableRow key={role._id || role.id} className="table-row">
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{role.name}</CTableDataCell>
                        <CTableDataCell>
                          <div className="description-truncate">
                            {role.description || '-'}
                          </div>
                        </CTableDataCell>
                        
                        {/* Modules Cell - Clickable */}
                        <CTableDataCell>
                          <div 
                            className="modules-cell clickable-cell"
                            onClick={() => showRoleDetails(role)}
                          >
                            {moduleCount > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <CBadge color="primary" className="module-badge">
                                  <CIcon icon={cilFolder} className="me-1" />
                                  {moduleCount}
                                </CBadge>
                                <span className="modules-text">
                                  {moduleCount === 1 ? 'Module' : 'Modules'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted">No modules</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {/* Permissions Cell - Clickable */}
                        <CTableDataCell>
                          <div 
                            className="permissions-cell clickable-cell"
                            onClick={() => showRoleDetails(role)}
                          >
                            {permissionCount > 0 ? (
                              <div className="d-flex align-items-center gap-2">
                                <CBadge color="info" className="permission-badge">
                                  <CIcon icon={cilLockLocked} className="me-1" />
                                  {permissionCount}
                                </CBadge>
                                <span className="permissions-text">
                                  {permissionCount === 1 ? 'Permission' : 'Permissions'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted">No permissions</span>
                            )}
                          </div>
                        </CTableDataCell>
                        
                        {showActionColumn && (
                          <CTableDataCell>
                            <div className="d-flex gap-1">
                              {hasEditPermission && (
                                <Link to={`/roles/update-role/${role._id || role.id}`}>
                                  <CButton size="sm" color="primary" variant="outline">
                                    <CIcon icon={cilPencil} />
                                  </CButton>
                                </Link>
                              )}
                              {hasDeletePermission && (
                                <CButton 
                                  size="sm" 
                                  color="danger" 
                                  variant="outline"
                                  onClick={() => handleDelete(role._id || role.id)}
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              )}
                            </div>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    );
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "6" : "5"} className="text-center">
                      {searchTerm ? 'No matching roles found' : 'No roles available'}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Role Details Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>
            <CIcon icon={cilFolder} className="me-2" />
            Role Details: {selectedRole?.name}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRole && (
            <div>
              <div className="mb-4">
                <h6>Description</h6>
                <p className="p-2 bg-light rounded">{selectedRole.description || 'No description provided'}</p>
              </div>
              
              <div className="mb-4">
                <h6 className="mb-3">Modules & Permissions Summary</h6>
                <CRow>
                  <CCol md={6}>
                    <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                      <h2 className="text-primary">{Object.keys(groupPermissionsByModule(selectedRole.permissions)).length}</h2>
                      <p className="mb-0">Total Modules</p>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                      <h2 className="text-info">{selectedRole.permissions?.length || 0}</h2>
                      <p className="mb-0">Total Permissions</p>
                    </div>
                  </CCol>
                </CRow>
              </div>
              
              <div className="mb-3">
                <h6>Detailed Permissions</h6>
                {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                  <div className="permissions-details">
                    {Object.entries(groupPermissionsByModule(selectedRole.permissions)).map(([module, actions], idx) => (
                      <div key={idx} className="permission-module mb-3 p-3 border rounded">
                        <div className="d-flex align-items-center mb-2">
                          <CBadge color="primary" className="me-2 px-3 py-2">
                            <CIcon icon={cilFolder} className="me-2" />
                            {module}
                          </CBadge>
                          <span className="text-muted small">
                            ({actions.length} {actions.length === 1 ? 'permission' : 'permissions'})
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {actions.map((action, actionIdx) => (
                            <CBadge key={actionIdx} color="success" className="px-3 py-2">
                              <CIcon icon={cilLockLocked} className="me-1" />
                              {action}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-light text-center">
                    No permissions assigned to this role
                  </div>
                )}
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <style jsx>{`
        .description-truncate {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .module-badge, .permission-badge {
          font-size: 0.8rem;
          padding: 0.4rem 0.7rem;
          display: flex;
          align-items: center;
          min-width: 40px;
          justify-content: center;
        }
        
        .clickable-cell {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .clickable-cell:hover {
          background-color: rgba(0, 123, 255, 0.05);
          transform: translateY(-1px);
        }
        
        .modules-cell, .permissions-cell {
          height: 100%;
          display: flex;
          align-items: center;
        }
        
        .table-row td {
          vertical-align: middle;
          height: 60px;
        }
        
        .modules-text, .permissions-text {
          font-size: 0.9rem;
          color: #495057;
        }
        
        .permissions-details {
          max-height: 400px;
          overflow-y: auto;
          margin-top: 10px;
        }
        
        .permission-module {
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .permission-module:hover {
          background-color: #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default AllRoles;