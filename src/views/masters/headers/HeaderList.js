import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import '../../../css/table.css';
import '../../../css/importCsv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDefaultSearchFields, useTableFilter } from '../../../utils/tableFilters';
import { usePagination } from '../../../utils/pagination.js';
import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showError, showSuccess } from '../../../utils/sweetAlerts';
import { hasPermission } from '../../../utils/permissionUtils';

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
  CFormSelect,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilFilter, 
  cilPlus
} from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext.js';

const HeadersList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [exportTypeDialogOpen, setExportTypeDialogOpen] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState('');
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedSubdealerId, setSelectedSubdealerId] = useState('');
  const [exportTarget, setExportTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});
  const [verticles, setVerticles] = useState([]);
  const [selectedVerticleId, setSelectedVerticleId] = useState('');
  const [exportErrors, setExportErrors] = useState({});
  const { permissions} = useAuth();
  const hasEditPermission = hasPermission(permissions,'HEADER_UPDATE');
  const hasDeletePermission = hasPermission(permissions,'HEADER_DELETE');
  const hasCreatePermission = hasPermission(permissions,'HEADER_CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchData();
    fetchBranches();
    fetchSubdealers();
    fetchVerticles();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/headers?sort=priority`);
      setData(response.data.data.headers);
      setFilteredData(response.data.data.headers);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
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
      setSubdealers(response.data.data.subdealers || []);
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

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/headers/${id}`);
        setData(data.filter((header) => header.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleExportClick = () => {
    setExportTypeDialogOpen(true);
  };

  const handleExportTypeSelect = (type) => {
    setExportTarget(type);
    setExportTypeDialogOpen(false);
    setCsvDialogOpen(true);
  };

  const validateExportForm = () => {
    const errors = {};
    
    if (!selectedModelType) {
      errors.modelType = 'Please select a model type.';
    }
    
    if (exportTarget === 'branch' && !selectedBranchId) {
      errors.branch = 'Please select a branch.';
    }
    
    if (exportTarget === 'subdealer' && !selectedSubdealerId) {
      errors.subdealer = 'Please select a subdealer.';
    }

    if (!selectedVerticleId) {
      errors.verticle = 'Please select a verticle.';
    }
    
    setExportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExportCSV = async () => {
    if (!validateExportForm()) return;

    let endpoint = '';
    const params = new URLSearchParams({
      filled: 'true',
      type: selectedModelType
    });

    if (exportTarget === 'branch') {
      params.append('branch_id', selectedBranchId);
    } else if (exportTarget === 'subdealer') {
      params.append('subdealer_id', selectedSubdealerId);
    }
    params.append('verticle_id', selectedVerticleId);

    endpoint = `/csv/export-template?${params.toString()}`;

    try {
      const response = await axiosInstance.get(endpoint, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = `exported_data_${selectedModelType}_${exportTarget}`;
      if (selectedVerticleId) {
        const selectedVerticle = verticles.find(v => v._id === selectedVerticleId);
        if (selectedVerticle) {
          filename += `_${selectedVerticle.name.replace(/\s+/g, '_')}`;
        }
      }
      filename += '.xlsx';
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setCsvDialogOpen(false);
      setSelectedModelType('');
      setSelectedBranchId('');
      setSelectedSubdealerId('');
      setSelectedVerticleId('');
      setExportTarget('');
      setExportErrors({});
      showSuccess('Excel exported successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      showError('Failed to export Excel.');
      setCsvDialogOpen(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;
      
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('headers'));
  };

  const clearExportForm = () => {
    setSelectedModelType('');
    setSelectedBranchId('');
    setSelectedSubdealerId('');
    setSelectedVerticleId('');
    setExportErrors({});
    setCsvDialogOpen(false);
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
      <div className='title'>Headers List</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <Link to="/headers/add-header">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Header
                </CButton>
              </Link>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleExportClick}
            >
              <FontAwesomeIcon icon={faFileExcel} className='me-1' />
              Export Excel
            </CButton>
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Category key</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Priority number</CTableHeaderCell>
                  <CTableHeaderCell>Page number</CTableHeaderCell>
                  <CTableHeaderCell>HSN code</CTableHeaderCell>
                  <CTableHeaderCell>GST rate</CTableHeaderCell>
                  <CTableHeaderCell>Is Mandatory?</CTableHeaderCell>
                  <CTableHeaderCell>Is Discount?</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "11" : "10"} className="text-center">
                      No headers available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((header, index) => (
                    <CTableRow key={header._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{header.header_key}</CTableDataCell>
                      <CTableDataCell>{header.category_key}</CTableDataCell>
                      <CTableDataCell>{header.type}</CTableDataCell>
                      <CTableDataCell>{header.priority}</CTableDataCell>
                      <CTableDataCell>{header.metadata?.page_no || ''}</CTableDataCell>
                      <CTableDataCell>{header.metadata?.hsn_code || ''}</CTableDataCell>
                      <CTableDataCell>{header.metadata?.gst_rate || ''}</CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge bg-${header.is_mandatory ? 'success' : 'secondary'}`}>
                          {header.is_mandatory ? 'Yes' : 'No'}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge bg-${header.is_discount ? 'success' : 'secondary'}`}>
                          {header.is_discount ? 'Yes' : 'No'}
                        </span>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <div className="dropdown-container" ref={el => dropdownRefs.current[header._id] = el}>
                            <CButton 
                              size="sm"
                              className='option-button btn-sm'
                              onClick={() => toggleDropdown(header._id)}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            {dropdownOpen[header._id] && (
                              <div className="dropdown-menu show">
                                {hasEditPermission && (
                                  <Link className="dropdown-item" to={`/headers/update-header/${header._id}`}>
                                    <CIcon icon={cilPencil} className="me-2" /> Edit
                                  </Link>
                                )}
                                {hasDeletePermission && (
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => handleDelete(header._id)}
                                  >
                                    <CIcon icon={cilTrash} className="me-2" /> Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Select Export Target Modal - Updated Design */}
      <CModal 
        visible={exportTypeDialogOpen} 
        onClose={() => setExportTypeDialogOpen(false)} 
        alignment="center" 
        size="sm"
      >
        <CModalHeader className="p-3">
          <CModalTitle className="h5">Select Export Target</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-3 text-center">
          <div className="d-flex flex-column gap-2">
            <CButton
              color="primary"
              onClick={() => handleExportTypeSelect('branch')}
              size="sm"
              className="mb-1"
              disabled={branches.length === 0}
            >
              Branch
              {branches.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
            </CButton>
            <CButton 
              color="secondary" 
              onClick={() => handleExportTypeSelect('subdealer')} 
              size="sm" 
              disabled={subdealers.length === 0}
            >
              Subdealer
              {subdealers.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
            </CButton>
          </div>
        </CModalBody>
        <CModalFooter className="p-2 justify-content-center">
          <CButton color="secondary" onClick={() => setExportTypeDialogOpen(false)} size="sm">
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* CSV Export Modal */}
      <CModal visible={csvDialogOpen} onClose={clearExportForm}>
        <CModalHeader>
          <CModalTitle>Export Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Model Type: <span className="text-danger">*</span></label>
            <CFormSelect
              value={selectedModelType}
              onChange={(e) => {
                setSelectedModelType(e.target.value);
                setExportErrors(prev => ({ ...prev, modelType: '' }));
              }}
              className={exportErrors.modelType ? 'is-invalid' : ''}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
           
            </CFormSelect>
            {exportErrors.modelType && <div className="invalid-feedback d-block">{exportErrors.modelType}</div>}
          </div>

          {exportTarget === 'branch' ? (
            <div className="mb-3">
              <label className="form-label">Branch: <span className="text-danger">*</span></label>
              <CFormSelect
                value={selectedBranchId}
                onChange={(e) => {
                  setSelectedBranchId(e.target.value);
                  setExportErrors(prev => ({ ...prev, branch: '' }));
                }}
                className={exportErrors.branch ? 'is-invalid' : ''}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
              {exportErrors.branch && <div className="invalid-feedback d-block">{exportErrors.branch}</div>}
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Subdealer: <span className="text-danger">*</span></label>
              <CFormSelect
                value={selectedSubdealerId}
                onChange={(e) => {
                  setSelectedSubdealerId(e.target.value);
                  setExportErrors(prev => ({ ...prev, subdealer: '' }));
                }}
                className={exportErrors.subdealer ? 'is-invalid' : ''}
              >
                <option value="">-- Select Subdealer --</option>
                {subdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>
                    {subdealer.name}
                  </option>
                ))}
              </CFormSelect>
              {exportErrors.subdealer && <div className="invalid-feedback d-block">{exportErrors.subdealer}</div>}
            </div>
          )}

          {/* Verticles dropdown - Now Required */}
          <div className="mb-3">
            <label className="form-label">Verticle: <span className="text-danger">*</span></label>
            <CFormSelect
              value={selectedVerticleId}
              onChange={(e) => {
                setSelectedVerticleId(e.target.value);
                setExportErrors(prev => ({ ...prev, verticle: '' }));
              }}
              className={exportErrors.verticle ? 'is-invalid' : ''}
            >
              <option value="">-- Select Verticle --</option>
              {verticles
                .filter(vertical => vertical.status === 'active')
                .map((vertical) => (
                  <option key={vertical._id} value={vertical._id}>
                    {vertical.name}
                  </option>
                ))}
            </CFormSelect>
            {exportErrors.verticle && <div className="invalid-feedback d-block">{exportErrors.verticle}</div>}
            {verticles.filter(v => v.status === 'active').length === 0 && (
              <small className="text-danger">No active verticles available. Please create a verticle first.</small>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={clearExportForm}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleExportCSV}
            disabled={verticles.filter(v => v.status === 'active').length === 0}
          >
            Export
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default HeadersList;