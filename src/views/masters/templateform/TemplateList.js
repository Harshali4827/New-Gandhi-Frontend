// components/templates/TemplateList.jsx
import React, { useEffect, useState } from 'react';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilPlus
} from '@coreui/icons';
import { cilMagnifyingGlass } from '@coreui/icons';

// Import Material-UI components for the menu
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import '../../../css/table.css';
import '../../../css/importCsv.css';
import { useTableFilter } from '../../../utils/tableFilters';
import axiosInstance from '../../../axiosInstance';
import { confirmDelete, showError, showSuccess } from '../../../utils/sweetAlerts';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

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

  // Menu handlers
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

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
            <Link to="/templateForm/template-list/create">
              <CButton size="sm" className="action-btn me-1">
                <CIcon icon={cilPlus} className='icon'/> New Template
              </CButton>
            </Link>
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
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      No templates available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((template, index) => (
                    <CTableRow key={template._id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{template.template_name}</CTableDataCell>
                      <CTableDataCell className="text-truncate" style={{ maxWidth: '200px' }} title={template.subject}>
                        {template.subject}
                      </CTableDataCell>
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
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, template._id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu 
                          id={`action-menu-${template._id}`} 
                          anchorEl={anchorEl} 
                          open={menuId === template._id} 
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            <Link 
                              className="Link" 
                              to={`/templateform/template-list/preview/${template._id}`}
                              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                            >
                              <CIcon icon={cilMagnifyingGlass} className="me-2" /> Preview
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <Link 
                              className="Link" 
                              to={`/templateform/template-list/edit/${template._id}`}
                              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Edit
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={() => {
                            handleDelete(template._id);
                            handleClose();
                          }}>
                            <CIcon icon={cilTrash} className="me-2" /> Delete
                          </MenuItem>
                        </Menu>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TemplateList;