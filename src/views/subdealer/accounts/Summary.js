import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import '../../../css/table.css';
import '../../../css/form.css';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCol,
  CRow,
  CButton
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, SearchOutlinedIcon, useTableFilter } from 'src/utils/tableImports';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

function Summary() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: bookingsData,
    setData: setBookingsData,
    filteredData: filteredBookings,
    setFilteredData: setFilteredBookings,
    handleFilter: handleBookingsFilter
  } = useTableFilter([]);

  const {
    data: subdealerData,
    setData: setSubdealerData,
    filteredData: filteredSubdealer,
    setFilteredData: setFilteredSubdealer,
    handleFilter: handleSubdealerFilter
  } = useTableFilter([]);

  const [completePayments, setCompletePayments] = useState([]);
  const [filteredCompletePayments, setFilteredCompletePayments] = useState([]);

  const [pendingPayments, setPendingPayments] = useState([]);
  const [filteredPendingPayments, setFilteredPendingPayments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      const subdealerBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'SUBDEALER');

      setBookingsData(subdealerBookings);
      setFilteredBookings(subdealerBookings);

      const complete = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0);
      setCompletePayments(complete);
      setFilteredCompletePayments(complete);

      const pending = subdealerBookings.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0);
      setPendingPayments(pending);
      setFilteredPendingPayments(pending);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchSubdealerData();
  }, []);

  const fetchSubdealerData = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers/financials/all`);
      setSubdealerData(response.data.data.subdealers);
      setFilteredSubdealer(response.data.data.subdealers);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    // Reset filters when changing tabs
    if (tab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
    else if (tab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
    else if (tab === 2) handleCompleteSearch('');
    else if (tab === 3) handlePendingSearch('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    if (activeTab === 0) handleBookingsFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 1) handleSubdealerFilter('', getDefaultSearchFields('subdealer'));
    else if (activeTab === 2) handleCompleteSearch('');
    else if (activeTab === 3) handlePendingSearch('');
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (activeTab === 0) {
      handleBookingsFilter(searchValue, getDefaultSearchFields('booking'));
    } else if (activeTab === 1) {
      handleSubdealerFilter(searchValue, getDefaultSearchFields('subdealer'));
    } else if (activeTab === 2) {
      handleCompleteSearch(searchValue);
    } else if (activeTab === 3) {
      handlePendingSearch(searchValue);
    }
  };

  const handleCompleteSearch = (searchValue) => {
    const filtered = completePayments.filter(booking => 
      getDefaultSearchFields('booking').some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
        return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredCompletePayments(filtered);
  };

  const handlePendingSearch = (searchValue) => {
    const filtered = pendingPayments.filter(booking => 
      getDefaultSearchFields('booking').some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], booking);
        return String(value || '').toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredPendingPayments(filtered);
  };

  const getTotalSummary = () => {
    const totalBookings = bookingsData.length;
    const totalComplete = completePayments.length;
    const totalPending = pendingPayments.length;
    const totalSubdealers = subdealerData.length;

    return { totalBookings, totalComplete, totalPending, totalSubdealers };
  };

  const summary = getTotalSummary();

  // Helper function to render tables based on active tab
  const renderTable = () => {
    switch (activeTab) {
      case 0: // Customer Tab
        return (
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredBookings.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {searchTerm ? 'No matching bookings found' : 'No bookings available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={booking.balanceAmount === 0 ? 'success' : 'warning'}>
                          ₹{booking.balanceAmount || '0'}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      case 1: // Sub Dealer Tab
        return (
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Received</CTableHeaderCell>
                  <CTableHeaderCell>Total Balance</CTableHeaderCell>
                  <CTableHeaderCell>OnAccount Balance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredSubdealer.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      {searchTerm ? 'No matching subdealers found' : 'No subdealers available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredSubdealer.map((subdealer, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{subdealer.name}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{subdealer.financials?.bookingSummary?.totalBookings || '0'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalBookingAmount || '0'}</CTableDataCell>
                      <CTableDataCell>₹{subdealer.financials?.bookingSummary?.totalReceivedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">₹{subdealer.financials?.bookingSummary?.totalBalanceAmount || '0'}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">₹{subdealer.financials?.onAccountSummary?.totalBalance || '0'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      case 2: // Complete Payment Tab
        return (
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCompletePayments.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredCompletePayments.map((booking, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="success">₹{booking.balanceAmount || '0'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      case 3: // Pending List Tab
        return (
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Chassis Number</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>Received</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredPendingPayments.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredPendingPayments.map((booking, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ''}</CTableDataCell>
                      <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{booking.chassisNumber || 'N/A'}</CTableDataCell>
                      <CTableDataCell>₹{booking.discountedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>₹{booking.receivedAmount || '0'}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">₹{booking.balanceAmount || '0'}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className='title'>Summary Dashboard</div>
      
      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol md={3}>
          <CCard className="text-center bg-primary text-white">
            <CCardBody>
              <h4>{summary.totalBookings}</h4>
              <p>Total Bookings</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-success text-white">
            <CCardBody>
              <h4>{summary.totalComplete}</h4>
              <p>Complete Payments</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-warning text-white">
            <CCardBody>
              <h4>{summary.totalPending}</h4>
              <p>Pending Payments</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="text-center bg-info text-white">
            <CCardBody>
              <h4>{summary.totalSubdealers}</h4>
              <p>Total Subdealers</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {searchTerm && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                Reset Search
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
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
                  borderBottom: 'none'
                }}
              >
                Customer
                <CBadge color="primary" className="ms-2">
                  {bookingsData.length}
                </CBadge>
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
                Sub Dealer
                <CBadge color="info" className="ms-2">
                  {subdealerData.length}
                </CBadge>
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
                Complete Payment
                <CBadge color="success" className="ms-2">
                  {completePayments.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => handleTabChange(3)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Pending List
                <CBadge color="warning" className="ms-2">
                  {pendingPayments.length}
                </CBadge>
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
                onChange={(e) => handleSearch(e.target.value)}
                // placeholder="Search..."
              />
            </div>
          </div>

          {/* Tabs Content */}
          <CTabContent>
            <CTabPane visible={activeTab === 0} className="p-3">
              {renderTable()}
            </CTabPane>

            <CTabPane visible={activeTab === 1} className="p-3">
              {renderTable()}
            </CTabPane>

            <CTabPane visible={activeTab === 2} className="p-3">
              {renderTable()}
            </CTabPane>

            <CTabPane visible={activeTab === 3} className="p-3">
              {renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Summary;