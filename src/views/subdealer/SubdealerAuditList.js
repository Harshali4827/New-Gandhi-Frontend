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
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilSettings, 
  cilPencil, 
  cilTrash,
  cilCheckCircle,
  cilXCircle,
  cilSearch,
  cilZoomOut
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
  
  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [selectedAuditType, setSelectedAuditType] = useState('daily');
  const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(null);
  const [tempSelectedAuditType, setTempSelectedAuditType] = useState('daily');
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSubdealers();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedSubdealer, selectedAuditType, data]);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/subdealer-audits');
      const audits = response.data.data.subdealerAudits || [];
      setData(audits);
      setFilteredData(audits);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = data;

    // Filter by audit type
    if (selectedAuditType !== 'all') {
      filtered = filtered.filter(audit => audit.auditType === selectedAuditType);
    }

    // Filter by subdealer
    if (selectedSubdealer) {
      filtered = filtered.filter(audit => 
        audit.subdealer === selectedSubdealer || 
        audit.subdealerDetails?._id === selectedSubdealer
      );
    }

    setFilteredData(filtered);
    
    // Check if any filter is active
    const hasActiveFilter = selectedAuditType !== 'daily' || selectedSubdealer !== null;
    setIsFiltered(hasActiveFilter);
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    let dataToFilter = data;
    
    // Apply current filters first
    if (selectedAuditType !== 'all') {
      dataToFilter = dataToFilter.filter(audit => audit.auditType === selectedAuditType);
    }
    
    if (selectedSubdealer) {
      dataToFilter = dataToFilter.filter(audit => 
        audit.subdealer === selectedSubdealer || 
        audit.subdealerDetails?._id === selectedSubdealer
      );
    }
    
    handleFilter(searchValue, [
      'subdealerDetails.name',
      'day',
      'timeSlot',
      'remarks',
      'createdByDetails.name',
      'scheduleDescription'
    ], dataToFilter);
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

  // Filter modal handlers
  const handleFilterClick = () => {
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedAuditType(selectedAuditType);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setSelectedSubdealer(tempSelectedSubdealer);
    setSelectedAuditType(tempSelectedAuditType);
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedAuditType(selectedAuditType);
  };

  const clearFilters = () => {
    setSelectedSubdealer(null);
    setSelectedAuditType('daily');
    setIsFiltered(false);
  };

  const getSubdealerNameById = (subdealerId) => {
    const subdealer = subdealers.find(s => s._id === subdealerId);
    return subdealer ? `${subdealer.name} - ${subdealer.location || 'N/A'}` : '';
  };

  const getFilterText = () => {
    let filterText = '';
    
    if (selectedAuditType !== 'daily') {
      filterText += `(Type: ${selectedAuditType})`;
    }
    
    if (selectedSubdealer) {
      if (filterText) filterText += ' ';
      filterText += `(Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
    }
    
    return filterText;
  };

  const getAuditTypeBadge = (type) => {
    const typeColors = {
      daily: 'primary',
      weekly: 'info',
      monthly: 'success'
    };
    
    const typeLabels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    };
    
    return (
      <CBadge color={typeColors[type] || 'secondary'}>
        {typeLabels[type] || type}
      </CBadge>
    );
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
      <div className='title'>Subdealer Audit Schedule {getFilterText()}</div>
      
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
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleFilterClick}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>

            {isFiltered && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={clearFilters}
              >
                <CIcon icon={cilZoomOut} className='icon' /> 
                Reset Filter
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="text-muted">
               
              </span>
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
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
                  <CTableHeaderCell>Audit Type</CTableHeaderCell>
                  <CTableHeaderCell>Subdealer</CTableHeaderCell>
                  <CTableHeaderCell>Schedule</CTableHeaderCell>
                  <CTableHeaderCell>Next Audit Date</CTableHeaderCell>
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
                        {getAuditTypeBadge(audit.auditType)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.subdealerDetails?.name || 'N/A'}
                        <div className="text-muted small">
                          {audit.subdealerDetails?.location || ''}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="mb-1">
                          {audit.scheduleDescription || 
                            (audit.auditType === 'daily' ? `Daily (${audit.frequency})` : 
                             audit.auditType === 'weekly' ? `Weekly on ${audit.dayFormatted || audit.day}` :
                             audit.auditType === 'monthly' ? `Monthly on day ${audit.dayOfMonth}` : '')}
                        </div>
                        {audit.frequency && audit.auditType !== 'daily' && (
                          <div className="text-muted small">
                            Frequency: {audit.frequency}
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex flex-column">
                          <span>
                            {audit.nextAuditDate ? 
                              new Date(audit.nextAuditDate).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : 'N/A'
                            }
                          </span>
                          {audit.auditStatus === 'due-tomorrow' && (
                            <CBadge color="warning" className="mt-1">
                              Due Tomorrow
                            </CBadge>
                          )}
                          {audit.daysUntil !== undefined && audit.daysUntil > 0 && (
                            <span className="text-muted small">
                              in {audit.daysUntil} day{audit.daysUntil !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
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
                    <CTableDataCell colSpan="10" className="text-center">
                      {data.length === 0 
                        ? 'No audit schedules available. Click "New Audit Schedule" to create one.'
                        : `No audit schedules found for the selected filters. Try changing the filter or search term.`
                      }
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal size='lg' visible={showFilterModal} onClose={handleCancelFilter}>
        <CModalHeader>
          <CModalTitle>Filter Audit Schedules</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Select Audit Type:</label>
              <CFormSelect
                value={tempSelectedAuditType || 'daily'}
                onChange={(e) => setTempSelectedAuditType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Subdealer:</label>
              <CFormSelect
                value={tempSelectedSubdealer || ''}
                onChange={(e) => setTempSelectedSubdealer(e.target.value || null)}
              >
                <option value="">All Subdealers</option>
                {subdealers
                  .filter(subdealer => subdealer.status === 'active')
                  .map(subdealer => (
                    <option key={subdealer._id} value={subdealer._id}>
                      {subdealer.name} - {subdealer.location || 'N/A'}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>

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