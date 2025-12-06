// components/templates/TemplateList.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  CFormLabel,
  CFormSelect,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilPlus,
  cilEye
} from '@coreui/icons';
import '../../../css/table.css';
import '../../../css/importCsv.css';
import { getDefaultSearchFields, useTableFilter } from '../../../utils/tableFilters';
import { usePagination } from '../../../utils/pagination.js';
import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showError, showSuccess } from '../../../utils/sweetAlerts';
import { hasPermission } from '../../../utils/permissionUtils';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dropdownRefs = useRef({});

  const hasEditPermission = hasPermission('TEMPLATE', 'UPDATE');
  const hasDeletePermission = hasPermission('TEMPLATE', 'DELETE');
  const hasCreatePermission = hasPermission('TEMPLATE', 'CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/templates');
      setData(response.data.data.templates);
      setFilteredData(response.data.data.templates);
      setTemplates(response.data.data.templates);
    } catch (error) {
      console.log('Error fetching templates', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/templates/${id}`);
        setData(data.filter((template) => template._id !== id));
        fetchTemplates();
        showSuccess('Template deleted successfully!');
      } catch (error) {
        console.log(error);
        showError(error);
      }
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
    handleFilter(value, ['template_name', 'subject']);
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
        Error loading templates: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Templates List</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <Link to="/templates/create">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Template
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
                placeholder="Search by template name or subject..."
              />
            </div>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Template Name</CTableHeaderCell>
                  <CTableHeaderCell>Subject</CTableHeaderCell>
                  <CTableHeaderCell>Headers</CTableHeaderCell>
                  <CTableHeaderCell>Variables</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created Date</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "9" : "8"} className="text-center">
                      No templates available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((template, index) => (
                    <CTableRow key={template._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{template.template_name}</CTableDataCell>
                      <CTableDataCell>{template.subject}</CTableDataCell>
                      <CTableDataCell>
                        {template.header_ids?.length || 0} headers
                      </CTableDataCell>
                      <CTableDataCell>
                        {template.template_variables?.length || 0} variables
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={template.is_active ? 'success' : 'secondary'}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </CBadge>
                        {template.is_default && (
                          <CBadge color="info" className="ms-1">Default</CBadge>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{template.created_by?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(template.created_at).toLocaleDateString()}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <div className="dropdown-container" ref={el => dropdownRefs.current[template._id] = el}>
                            <CButton 
                              size="sm"
                              className='option-button btn-sm'
                              onClick={() => toggleDropdown(template._id)}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            {dropdownOpen[template._id] && (
                              <div className="dropdown-menu show">
                                <Link className="dropdown-item" to={`/templates/preview/${template._id}`}>
                                  <CIcon icon={cilEye} className="me-2" /> Preview
                                </Link>
                                {hasEditPermission && (
                                  <Link className="dropdown-item" to={`/templates/edit/${template._id}`}>
                                    <CIcon icon={cilPencil} className="me-2" /> Edit
                                  </Link>
                                )}
                                {hasDeletePermission && (
                                  <button 
                                    className="dropdown-item"
                                    onClick={() => handleDelete(template._id)}
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
          <PaginationOptions />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TemplateList;