import React, { useState, useEffect } from 'react';
import { 
  CBadge, 
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
  CFormLabel
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, useTableFilter } from '../../../utils/tableImports';
import '../../../css/invoice.css';
import '../../../css/table.css';
import AddInsurance from './AddInsurance';
import ViewInsuranceModal from './ViewInsurance';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilZoom, cilPencil } from '@coreui/icons';

function InsuranceReport() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPendings,
    setFilteredData: setFilteredPendings,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);
  const {
    data: laterData,
    setData: setLaterData,
    filteredData: filteredLater,
    setFilteredData: setFilteredLater,
    handleFilter: handleLaterFilter
  } = useTableFilter([]);
  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings/insurance-status/AWAITING`);
      setPendingData(response.data.data.docs);
      setFilteredPendings(response.data.data.docs);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCompleteData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance/status/COMPLETED`);
      setApprovedData(response.data.data);
      setFilteredApproved(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchLaterData = async () => {
    try {
      const response = await axiosInstance.get(`/insurance/status/LATER`);
      setLaterData(response.data.data);
      setFilteredLater(response.data.data);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompleteData();
    fetchLaterData();
  }, [refreshKey]);

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedInsurance(null);
    setShowModal(true);
  };

  const handleViewClick = async (item) => {
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setShowViewModal(true);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
    }
  };

  const handleUpdateClick = async (item) => {
    try {
      const response = await axiosInstance.get(`/insurance/${item.id}`);
      setSelectedInsurance(response.data.data);
      setSelectedBooking(response.data.data.booking);
      setShowModal(true);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedInsurance(null);
    setSelectedBooking(null);
    handleRefresh();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const renderPendingTable = () => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendings.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendings.map((booking, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                  <CTableDataCell>{booking.modelDetails?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                  <CTableDataCell>{booking.chassisNumber}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'danger' : 'success'} shape="rounded-pill">
                      {booking.insuranceStatus}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton 
                      size="sm" 
                      className="action-btn"
                      onClick={() => handleAddClick(booking)}
                    >
                      <CIcon icon={cilPlus} className="me-1" />
                      Add
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderCompletedTable = () => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Provider</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredApproved.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredApproved.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                  <CTableDataCell>{item.insuranceProviderDetails?.provider_name || ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'} shape="rounded-pill">
                      {item.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton 
                      size="sm" 
                      className="action-btn"
                      onClick={() => handleViewClick(item)}
                    >
                      <CIcon icon={cilZoom} className="me-1" />
                      View
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  const renderLaterTable = () => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Insurance Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredLater.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  No data available
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredLater.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.booking?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.model?.model_name || ''}</CTableDataCell>
                  <CTableDataCell>{item.insuranceDate ? new Date(item.insuranceDate).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.customerName || ''}</CTableDataCell>
                  <CTableDataCell>{item.booking?.chassisNumber || ''}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={item.status === 'LATER' ? 'warning' : 'success'} shape="rounded-pill">
                      {item.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton 
                      size="sm" 
                      className="action-btn"
                      onClick={() => handleUpdateClick(item)}
                    >
                      <CIcon icon={cilPencil} className="me-1" />
                      Update
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
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
      <div className='title'>Insurance Report</div>
      
      <CCard className='table-container mt-4'>
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => handleTabChange(0)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none'
                }}
              >
                Pending Insurance
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
                  color: 'black'
                }}
              >
                Complete Insurance
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
                  color: 'black'
                }}
              >
                Update Later
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('insurance'));
                  else handleLaterFilter(e.target.value, getDefaultSearchFields('insurance'));
                }}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderPendingTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderCompletedTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {renderLaterTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      <AddInsurance
        show={showModal}
        onClose={handleModalClose}
        bookingData={selectedBooking}
        insuranceData={selectedInsurance}
        onSuccess={handleRefresh}
      />
      <ViewInsuranceModal 
        show={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        insuranceData={selectedInsurance} 
      />
    </div>
  );
}

export default InsuranceReport;