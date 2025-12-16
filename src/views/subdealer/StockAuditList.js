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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilSettings, 
  cilCheckCircle,
  cilXCircle,
  cilCloudDownload,
  cilImage
} from '@coreui/icons';
import {
  useTableFilter,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports.js';
import { hasPermission } from 'src/utils/permissionUtils.js';
import { ViewColumnSharp } from '@mui/icons-material';
import {
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../../context/AuthContext';

const StockAuditList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);
  const { permissions} = useAuth();
  const hasVerifyPermission = hasPermission(permissions,'STOCK_AUDIT_UPDATE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/stock-audits/subdealers/all');
      setData(response.data.data.audits);
      setFilteredData(response.data.data.audits);
    } catch (error) {
      console.log('Error fetching stock audit data', error);
      setError(error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    handleFilter(searchValue, ['auditNumber', 'subdealer.name', 'vehicle.chassisNumber']);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleVerifyAudit = async (auditId, status) => {
    try {
      setVerifyingId(auditId);
      await axiosInstance.post(`/stock-audits/${auditId}/verify`, {
        status: status
      });
      
      // Update local state
      setData(prevData => prevData.map(audit => 
        audit._id === auditId 
          ? { 
              ...audit, 
              auditStatus: status,
              verifiedBy: status === 'verified' ? { name: 'Current User' } : null,
              verificationDetails: status === 'verified' ? { verifiedAt: new Date().toISOString() } : null
            } 
          : audit
      ));
      
      setFilteredData(prevData => prevData.map(audit => 
        audit._id === auditId 
          ? { 
              ...audit, 
              auditStatus: status,
              verifiedBy: status === 'verified' ? { name: 'Current User' } : null,
              verificationDetails: status === 'verified' ? { verifiedAt: new Date().toISOString() } : null
            } 
          : audit
      ));
      
      showSuccess(`Stock audit ${status === 'verified' ? 'approved' : 'rejected'} successfully!`);
      handleMenuClose();
    } catch (error) {
      console.error('Error verifying stock audit:', error);
      showError('Failed to update stock audit status');
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return <CBadge color="success">Verified</CBadge>;
      case 'pending':
        return <CBadge color="warning">Pending</CBadge>;
      case 'rejected':
        return <CBadge color="danger">Rejected</CBadge>;
      default:
        return <CBadge color="secondary">{status}</CBadge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const openImageInNewTab = (imagePath) => {
    if (imagePath) {
      const fullImageUrl = `http://192.168.1.38:3002${imagePath}`;
      window.open(fullImageUrl, '_blank');
    }
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
        Error loading stock audits: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Stock Audit List</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <ViewColumnSharp className='me-2' />
            <h5 className='mb-0'>Stock Audits</h5>
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div className="summary-stats">
              {data.length > 0 && (
                <div className="d-flex gap-3">
                  <div className="stat-item">
                    <span className="stat-label">Total Audits:</span>
                    <span className="stat-value ms-2 fw-bold">{data.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pending:</span>
                    <span className="stat-value ms-2 fw-bold text-warning">
                      {data.filter(a => a.auditStatus === 'pending').length}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Verified:</span>
                    <span className="stat-value ms-2 fw-bold text-success">
                      {data.filter(a => a.auditStatus === 'verified').length}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className='d-flex'>
              <CFormInput
                type="text"
                placeholder="Search by audit number, subdealer, or chassis..."
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Audit Number</CTableHeaderCell>
                  <CTableHeaderCell>Subdealer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Audit Photo</CTableHeaderCell>
                  <CTableHeaderCell>Audit Status</CTableHeaderCell>
                  <CTableHeaderCell>Audit Date</CTableHeaderCell>
                  {hasVerifyPermission && <CTableHeaderCell>Actions</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((audit, index) => (
                    <CTableRow key={audit._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{audit.auditNumber}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.subdealer?.name || 'N/A'}
                        {audit.subdealer?.location && (
                          <div className="text-muted small">{audit.subdealer.location}</div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.vehicle?.chassisNumber || audit.chassisNumber || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {audit.uploadedDocument?.auditPhoto ? (
                          <CButton 
                            size="sm" 
                            color="info" 
                            variant="outline"
                            onClick={() => openImageInNewTab(audit.uploadedDocument.auditPhoto)}
                          >
                            <CIcon icon={cilImage} className="me-1" />
                            View Photo
                          </CButton>
                        ) : (
                          <span className="text-muted">No Photo</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {getStatusBadge(audit.auditStatus)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(audit.auditDate)}
                      </CTableDataCell>
                      {hasVerifyPermission && (
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            {audit.auditStatus === 'pending' ? (
                              <>
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
                                    onClick={() => handleVerifyAudit(audit._id, 'verified')}
                                    disabled={verifyingId === audit._id}
                                  >
                                    <CIcon icon={cilCheckCircle} className="me-2 text-success" />
                                    {verifyingId === audit._id ? 'Approving...' : 'Approve'}
                                  </MenuItem>
                                  <MenuItem 
                                    onClick={() => handleVerifyAudit(audit._id, 'rejected')}
                                    disabled={verifyingId === audit._id}
                                  >
                                    <CIcon icon={cilXCircle} className="me-2 text-danger" />
                                    {verifyingId === audit._id ? 'Rejecting...' : 'Reject'}
                                  </MenuItem>
                                </Menu>
                              </>
                            ) : (
                              <span className="text-muted small">
                                Verified on {formatDate(audit.verificationDetails?.verifiedAt)}
                              </span>
                            )}
                          </div>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={hasVerifyPermission ? "8" : "7"} className="text-center py-4">
                      {searchTerm ? 'No matching stock audits found' : 'No stock audits available'}
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StockAuditList;