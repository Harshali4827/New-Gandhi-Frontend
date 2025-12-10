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
  CBadge,
  CAlert,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle
} from '@coreui/icons';
import {
  Menu,
  MenuItem,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import AddSubdealerAuditModal from './AddSubdealerAuditModal';

const SubdealerAuditList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [subdealers, setSubdealers] = useState([]);

  useEffect(() => {
    fetchData();
    fetchSubdealers();
  }, []);

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.log('Error fetching subdealers', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/subdealer-audits');
      setData(response.data.data.subdealerAudits || []);
      setFilteredData(response.data.data.subdealerAudits || []);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    handleFilter(searchValue, [
      'subdealerDetails.name',
      'day',
      'timeSlot',
      'remarks',
      'createdByDetails.name'
    ]);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleToggleStatus = async (auditId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axiosInstance.patch(`/subdealer-audits/${auditId}/status`, {
        status: newStatus
      });
      
      setData(prevData => prevData.map(audit => 
        audit._id === auditId ? { ...audit, status: newStatus } : audit
      ));
      setFilteredData(prevData => prevData.map(audit => 
        audit._id === auditId ? { ...audit, status: newStatus } : audit
      ));
      
      showSuccess('Audit status updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Error toggling audit status:', error);
      showError('Failed to update audit status');
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/subdealer-audits/${id}`);
        
        setData(prevData => prevData.filter(audit => audit._id !== id));
        setFilteredData(prevData => prevData.filter(audit => audit._id !== id));
        
        showSuccess('Audit deleted successfully!');
        setSuccessMessage('Audit deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleClose();
      } catch (error) {
        console.log('Delete error:', error);
        showError(error);
      }
    }
  };

  const handleShowAddModal = () => {
    setEditingAudit(null);
    setShowModal(true);
  };

  const handleShowEditModal = (audit) => {
    setEditingAudit(audit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAudit(null);
  };

  const handleSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
        Error loading subdealer audits: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Subdealer Audit Schedule</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleShowAddModal}
            >
              <CIcon icon={cilPlus} className='icon'/> New Audit Schedule
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search by subdealer, day, remarks..."
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Subdealer</CTableHeaderCell>
                  <CTableHeaderCell>Day</CTableHeaderCell>
                  <CTableHeaderCell>Time Slot</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((audit, index) => (
                    <CTableRow key={audit._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        {audit.subdealerDetails?.name || 'N/A'}
                        <div className="text-muted small">
                          {audit.subdealerDetails?.location || ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info" className="text-capitalize">
                          {audit.dayFormatted || audit.day}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">
                          {audit.timeSlot || 'N/A'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.remarks || '-'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.createdByDetails?.name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(audit.createdAt)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={audit.status === 'active' ? 'success' : 'secondary'}>
                          {audit.status === 'active' ? (
                            <>
                              <CIcon icon={cilCheckCircle} className="me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilXCircle} className="me-1" />
                              Inactive
                            </>
                          )}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, audit._id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu 
                          id={`action-menu-${audit._id}`} 
                          anchorEl={anchorEl} 
                          open={menuId === audit._id} 
                          onClose={handleClose}
                        >
                          <MenuItem 
                            onClick={() => handleShowEditModal(audit)}
                            style={{ color: 'black' }}
                          >
                            <CIcon icon={cilPencil} className="me-2" />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleToggleStatus(audit._id, audit.status)}>
                            <CIcon icon={audit.status === 'active' ? cilXCircle : cilCheckCircle} className="me-2" /> 
                            {audit.status === 'active' ? 'Deactivate' : 'Activate'}
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(audit._id)}>
                            <CIcon icon={cilTrash} className="me-2" />
                            Delete
                          </MenuItem>
                        </Menu>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      No audit schedules available
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      <AddSubdealerAuditModal
        show={showModal}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        editingAudit={editingAudit}
        subdealers={subdealers}
      />
    </div>
  );
};

export default SubdealerAuditList;