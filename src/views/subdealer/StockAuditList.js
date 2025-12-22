import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CFormTextarea,
  CFormLabel,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCheckCircle,
  cilXCircle,
  cilImage,
  cilCalendar,
  cilLocationPin,
  cilViewColumn,
  cilReload
} from '@coreui/icons';
import {
  useTableFilter,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import {
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StockAuditList = () => {
  // Tab states
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  
  // Photo viewer modal states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAuditPhotos, setSelectedAuditPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState(null);
  const [reviewAction, setReviewAction] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Message states
  const [message, setMessage] = useState({ type: '', text: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Data for different tabs
  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPending,
    setFilteredData: setFilteredPending,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);

  const {
    data: verifiedData,
    setData: setVerifiedData,
    filteredData: filteredVerified,
    setFilteredData: setFilteredVerified,
    handleFilter: handleVerifiedFilter
  } = useTableFilter([]);

  const {
    data: rejectedData,
    setData: setRejectedData,
    filteredData: filteredRejected,
    setFilteredData: setFilteredRejected,
    handleFilter: handleRejectedFilter
  } = useTableFilter([]);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const response = await axiosInstance.get('/stock-audits');
      const stockAudits = response.data.data.stockAudits || [];
      
      // Filter data by status
      const pendingAudits = stockAudits.filter(audit => 
        audit.status === 'pending' || audit.status === 'draft' || audit.status === 'submitted'
      );
      const verifiedAudits = stockAudits.filter(audit => audit.status === 'verified');
      const rejectedAudits = stockAudits.filter(audit => audit.status === 'rejected');
      
      setPendingData(pendingAudits);
      setFilteredPending(pendingAudits);
      
      setVerifiedData(verifiedAudits);
      setFilteredVerified(verifiedAudits);
      
      setRejectedData(rejectedAudits);
      setFilteredRejected(rejectedAudits);
      
    } catch (error) {
      console.log('Error fetching stock audit data', error);
      const errorMsg = error.message || 'Failed to fetch stock audits';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    setMessage({ type: 'info', text: 'Refreshing data...' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const searchFields = ['subdealerDetails.name', 'subdealerDetails.location', 'address', 'userDetails.name'];
    
    switch(activeTab) {
      case 0: // Submitted tab
        handlePendingFilter(searchValue, searchFields);
        break;
      case 1: // Verified tab
        handleVerifiedFilter(searchValue, searchFields);
        break;
      case 2: // Rejected tab
        handleRejectedFilter(searchValue, searchFields);
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const openReviewModal = (auditId, action) => {
    setSelectedAuditId(auditId);
    setReviewAction(action);
    setVerificationNotes('');
    setRejectionReason('');
    setShowReviewModal(true);
    handleMenuClose();
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedAuditId(null);
    setReviewAction('');
    setVerificationNotes('');
    setRejectionReason('');
  };

  const handleSubmitReview = async () => {
    if (!selectedAuditId) return;

    try {
      setVerifyingId(selectedAuditId);
      setMessage({ type: 'info', text: `${reviewAction === 'approve' ? 'Approving' : 'Rejecting'} stock audit...` });
      
      const reviewData = {
        action: reviewAction,
        verificationNotes: verificationNotes
      };

      if (reviewAction === 'reject' && rejectionReason) {
        reviewData.rejectionReason = rejectionReason;
      }

      // Use PATCH instead of POST as shown in your code
      await axiosInstance.patch(`/stock-audits/${selectedAuditId}/review`, reviewData);
      
      // Show success message
      const successMsg = `Stock audit ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`;
      showSuccess(successMsg);
      setMessage({ type: 'success', text: successMsg });
      
      // Close modal
      closeReviewModal();
      
      // Refresh data to get updated status
      setTimeout(() => {
        refreshData();
      }, 500);
      
    } catch (error) {
      console.error('Error reviewing stock audit:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update stock audit status';
      showError(errorMsg);
      setMessage({ type: 'danger', text: errorMsg });
    } finally {
      setVerifyingId(null);
    }
  };

  // Photo viewer functions
  const openPhotoViewer = (audit) => {
    const photos = audit.vehiclesPhotos || [];
    if (photos.length > 0) {
      setSelectedAuditPhotos(photos);
      setCurrentPhotoIndex(0);
      setShowPhotoModal(true);
    }
  };

  const closePhotoViewer = () => {
    setShowPhotoModal(false);
    setSelectedAuditPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const goToNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === selectedAuditPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const goToPreviousPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev === 0 ? selectedAuditPhotos.length - 1 : prev - 1
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return <CBadge color="success">Verified</CBadge>;
      case 'pending':
      case 'draft':
      case 'submitted':
        return <CBadge color="warning">Pending</CBadge>;
      case 'rejected':
        return <CBadge color="danger">Rejected</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Check if imagePath is already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Use a direct base URL - replace with your actual API URL
    const baseUrl = 'https://gandhitvs.in/dealership/api/v1';
    
    // Construct the full URL
    return `${baseUrl}/${cleanPath}`;
  };

  // Render photo details
  const renderPhotoDetails = (photo) => {
    if (!photo) return null;
    
    return (
      <CListGroup flush className="mt-3">
        <CListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="fw-semibold">Address:</span>
          </div>
          <span className="text-end" style={{ maxWidth: '70%' }}>
            {photo.address || 'N/A'}
          </span>
        </CListGroupItem>
        
        <CListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="fw-semibold">Timestamp:</span>
          </div>
          <span>{formatDateTime(photo.timestamp)}</span>
        </CListGroupItem>
        
        <CListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="fw-semibold">Chassis No:</span>
          </div>
          <span>{photo.chassisNumber || 'N/A'}</span>
        </CListGroupItem>
        
        {photo.remarks && (
          <CListGroupItem className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              <span className="fw-semibold">Remarks:</span>
            </div>
            <span className="text-end" style={{ maxWidth: '70%' }}>
              {photo.remarks}
            </span>
          </CListGroupItem>
        )}
      </CListGroup>
    );
  };

  // Common table rendering function
  const renderTable = (data, showActions = false) => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Sr.no</CTableHeaderCell>
              <CTableHeaderCell>Audit Date</CTableHeaderCell>
              <CTableHeaderCell>Subdealer</CTableHeaderCell>
              <CTableHeaderCell>Location</CTableHeaderCell>
              <CTableHeaderCell>Total Vehicles</CTableHeaderCell>
              <CTableHeaderCell>Photos</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Conducted By</CTableHeaderCell>
              {showActions && <CTableHeaderCell>Actions</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.length > 0 ? (
              data.map((audit, index) => (
                <CTableRow key={audit._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <strong>{formatDate(audit.auditDate)}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-semibold">{audit.subdealerDetails?.name || 'N/A'}</div>
                    <div className="text-muted small">{audit.subdealerDetails?.type || ''}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="text-truncate" style={{ maxWidth: '200px' }} title={audit.address}>
                      {audit.address?.split(',')[0] || 'N/A'}
                    </div>
                    {audit.subdealerDetails?.location && (
                      <div className="text-muted small">{audit.subdealerDetails.location}</div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <span className="badge bg-primary rounded-pill px-3 py-1">
                      {audit.totalVehicles || 0}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex">
                      {audit.vehiclesPhotos?.length > 0 ? (
                        <CButton 
                          size="sm" 
                          color="primary" 
                          variant="outline"
                          onClick={() => openPhotoViewer(audit)}
                          className="d-flex align-items-center"
                        >
                          <CIcon icon={cilImage} className="me-1" />
                          View Photos ({audit.vehiclesPhotos.length})
                        </CButton>
                      ) : (
                        <span className="text-muted small">No photos</span>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {getStatusBadge(audit.status)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="small">
                      <div>{audit.userDetails?.name || 'N/A'}</div>
                    </div>
                  </CTableDataCell>
                  {showActions && (
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuClick(event, audit._id)}
                          disabled={verifyingId === audit._id}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuId === audit._id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem 
                            onClick={() => openReviewModal(audit._id, 'approve')}
                            disabled={verifyingId === audit._id}
                          >
                            <CIcon icon={cilCheckCircle} className="me-2 text-success" />
                            {verifyingId === audit._id ? 'Approving...' : 'Approve'}
                          </MenuItem>
                          <MenuItem 
                            onClick={() => openReviewModal(audit._id, 'reject')}
                            disabled={verifyingId === audit._id}
                          >
                            <CIcon icon={cilXCircle} className="me-2 text-danger" />
                            {verifyingId === audit._id ? 'Rejecting...' : 'Reject'}
                          </MenuItem>
                        </Menu>
                      </div>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell 
                  colSpan={showActions ? "10" : "9"} 
                  className="text-center py-4"
                >
                  No stock audits found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (loading && !refreshTrigger) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Stock Audit List</div>
    
      {/* Message Alert */}
      {message.text && (
        <CAlert 
          color={message.type} 
          className="mb-3"
          dismissible
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <CIcon icon={cilViewColumn} className='me-2' />
            <h5 className='mb-0'>Stock Audits</h5>
          </div>
          <div className='d-flex align-items-center'>
            <CButton 
              color="light" 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              className="me-2"
              disabled={loading && refreshTrigger > 0}
            >
              <CIcon icon={cilReload} className={loading && refreshTrigger > 0 ? 'spin' : ''} />
            </CButton>
            <CFormLabel className='me-2 mb-0'>Search:</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Search..."
              className="square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          {error && !loading && (
            <CAlert color="danger" className="mb-3">
              Error loading stock audits: {error}
              <CButton 
                color="link" 
                size="sm" 
                onClick={refreshData}
                className="p-0 ms-2"
              >
                Try Again
              </CButton>
            </CAlert>
          )}
          
          {/* Tabs Navigation */}
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => handleTabChange(0)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none',
                  fontWeight: activeTab === 0 ? '600' : 'normal'
                }}
              >
                SUBMITTED ({filteredPending.length})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => handleTabChange(1)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black',
                  fontWeight: activeTab === 1 ? '600' : 'normal'
                }}
              >
                APPROVED ({filteredVerified.length})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => handleTabChange(2)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black',
                  fontWeight: activeTab === 2 ? '600' : 'normal'
                }}
              >
                REJECTED ({filteredRejected.length})
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* Loading indicator for refresh */}
          {loading && refreshTrigger > 0 && (
            <div className="text-center mb-3">
              <CSpinner size="sm" color="primary" className="me-2" />
              <small>Refreshing data...</small>
            </div>
          )}

          {/* Tab Content */}
          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderTable(filteredPending, true)}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderTable(filteredVerified, false)}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {renderTable(filteredRejected, false)}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Photo Viewer Modal */}
      <CModal 
        visible={showPhotoModal} 
        onClose={closePhotoViewer}
        size="xl"
        backdrop="static"
        className="photo-viewer-modal"
      >
        <CModalHeader>
          <CModalTitle>
            Stock Audit Photos ({currentPhotoIndex + 1} of {selectedAuditPhotos.length})
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedAuditPhotos[currentPhotoIndex] && (
            <>
              <CRow>
                <CCol lg="8">
                  <div className="photo-container text-center mb-4">
                    <img
                      src={getImageUrl(selectedAuditPhotos[currentPhotoIndex].imageUrl)}
                      alt={`Photo ${currentPhotoIndex + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '600px',
                        minHeight: '400px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      className="img-fluid shadow"
                    />
                  </div>
                  
                  <div className="photo-navigation d-flex justify-content-center mb-4">
                    <CButton 
                      color="secondary" 
                      variant="outline" 
                      onClick={goToPreviousPhoto}
                      className="me-3 px-4"
                    >
                      Previous
                    </CButton>
                    <CButton 
                      color="secondary" 
                      variant="outline" 
                      onClick={goToNextPhoto}
                      className="px-4"
                    >
                      Next
                    </CButton>
                  </div>
                </CCol>
                
                <CCol lg="4">
                  <div className="photo-details-card">
                    <h6 className="mb-3">Photo Details</h6>
                    {renderPhotoDetails(selectedAuditPhotos[currentPhotoIndex])}
                  </div>
                </CCol>
              </CRow>
              
              {/* Thumbnails */}
              <div className="photo-thumbnails mt-4">
                <h6 className="mb-2">All Photos</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedAuditPhotos.map((photo, index) => (
                    <CButton
                      key={photo._id}
                      color={index === currentPhotoIndex ? "primary" : "light"}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPhotoIndex(index)}
                      className="p-1"
                    >
                      <img
                        src={getImageUrl(photo.imageUrl)}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </CButton>
                  ))}
                </div>
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closePhotoViewer}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Review Modal */}
      <CModal 
        visible={showReviewModal} 
        onClose={closeReviewModal}
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            {reviewAction === 'approve' ? 'Approve' : 'Reject'} Stock Audit
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">
              Verification Notes
              <span className="text-muted"> (Optional)</span>
            </label>
            <CFormTextarea
              placeholder="Enter verification notes..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          {reviewAction === 'reject' && (
            <div className="mb-3">
              <label className="form-label">
                Rejection Reason
                <span className="text-danger"> *</span>
              </label>
              <CFormTextarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeReviewModal} disabled={verifyingId === selectedAuditId}>
            Cancel
          </CButton>
          <CButton 
            color={reviewAction === 'approve' ? 'success' : 'danger'} 
            onClick={handleSubmitReview}
            disabled={
              verifyingId === selectedAuditId || 
              (reviewAction === 'reject' && !rejectionReason.trim())
            }
          >
            {verifyingId === selectedAuditId ? (
              <>
                <CSpinner size="sm" className="me-2" />
                {reviewAction === 'approve' ? 'Approving...' : 'Rejecting...'}
              </>
            ) : (
              reviewAction === 'approve' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockAuditList;