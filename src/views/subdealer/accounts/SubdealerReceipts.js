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
  CButton,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields,useTableFilter } from 'src/utils/tableImports';
import SubdealerReceiptModal from './SubdealerReceiptModel';
import { hasPermission } from 'src/utils/permissionUtils';
import CIcon from '@coreui/icons-react';
import { cilPlus} from '@coreui/icons';
import { showError } from '../../../utils/sweetAlerts';

function SubdealerReceipts() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [completedSearchTerm, setCompletedSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const {
    data: pendingBookingsData,
    setData: setPendingBookingsData,
    filteredData: filteredPendingBookings,
    setFilteredData: setFilteredPendingBookings,
    handleFilter: handlePendingBookingsFilter
  } = useTableFilter([]);

  const {
    data: completedBookingsData,
    setData: setCompletedBookingsData,
    filteredData: filteredCompletedBookings,
    setFilteredData: setFilteredCompletedBookings,
    handleFilter: handleCompletedBookingsFilter
  } = useTableFilter([]);

  const {
    data: ledgerData,
    setData: setLedgerData,
    filteredData: filteredLedger,
    setFilteredData: setFilteredLedger,
    handleFilter: handleLedgerFilter
  } = useTableFilter([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/bookings`);
      const bookings = response.data.data.bookings.filter(
        (booking) => booking.bookingType === 'SUBDEALER' && booking.payment.type === 'FINANCE'
      );
      setAllBookings(bookings);

      const pendingBookings = bookings.filter((booking) => booking.balanceAmount !== 0);
      setPendingBookingsData(pendingBookings);
      setFilteredPendingBookings(pendingBookings);

      const completedBookings = bookings.filter((booking) => booking.balanceAmount === 0);
      setCompletedBookingsData(completedBookings);
      setFilteredCompletedBookings(completedBookings);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axiosInstance.get(`/ledger/summary/branch`);
      setLedgerData(response.data.data.byBranch);
      setFilteredLedger(response.data.data.byBranch);
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handlePendingSearch = (searchValue) => {
    setPendingSearchTerm(searchValue);
    handlePendingBookingsFilter(searchValue, getDefaultSearchFields('booking'));
  };

  const handleCompletedSearch = (searchValue) => {
    setCompletedSearchTerm(searchValue);
    handleCompletedBookingsFilter(searchValue, getDefaultSearchFields('booking'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPendingSearchTerm('');
    setCompletedSearchTerm('');
  };

  const handleResetPendingSearch = () => {
    setPendingSearchTerm('');
    handlePendingBookingsFilter('', getDefaultSearchFields('booking'));
  };

  const handleResetCompletedSearch = () => {
    setCompletedSearchTerm('');
    handleCompletedBookingsFilter('', getDefaultSearchFields('booking'));
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
      {error}
      </div>
    );
  }
  
  return (
    <div>
      <div className='title'>Subdealer Receipts</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <CNav variant="tabs" className="mb-0 border-bottom">
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
                Pending Payment
                <CBadge color="warning" className="ms-2">
                  {pendingBookingsData.length}
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
                Complete Payment
                <CBadge color="success" className="ms-2">
                  {completedBookingsData.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 0} className="p-0">
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={pendingSearchTerm}
                    onChange={(e) => handlePendingSearch(e.target.value)}
                  
                  />
                  {pendingSearchTerm && (
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      className="action-btn ms-2"
                      onClick={handleResetPendingSearch}
                    >
                      Reset
                    </CButton>
                  )}
                </div>
              </div>
              
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
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Received</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
                      {hasPermission('FINANCE_DISBURSEMENT', 'CREATE') && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredPendingBookings.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={hasPermission('FINANCE_DISBURSEMENT', 'CREATE') ? "10" : "9"} style={{ color: 'red', textAlign: 'center' }}>
                          {pendingSearchTerm ? 'No matching pending bookings found' : 'No pending bookings available'}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredPendingBookings.map((booking, index) => (
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
                          {hasPermission('FINANCE_DISBURSEMENT', 'CREATE') && (
                            <CTableDataCell>
                              <CButton 
                                size="sm" 
                                className="action-btn"
                                onClick={() => handleAddClick(booking)}
                              >
                                <CIcon icon={cilPlus} className='icon'/> Add
                              </CButton>
                            </CTableDataCell>
                          )}
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>
            
            <CTabPane visible={activeTab === 1} className="p-0">
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={completedSearchTerm}
                    onChange={(e) => handleCompletedSearch(e.target.value)}
                  
                  />
                  {completedSearchTerm && (
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      className="action-btn ms-2"
                      onClick={handleResetCompletedSearch}
                    >
                      Reset
                    </CButton>
                  )}
                </div>
              </div>
              
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
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Received</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredCompletedBookings.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                          {completedSearchTerm ? 'No matching completed payments found' : 'No completed payments available'}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredCompletedBookings.map((booking, index) => (
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
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      <SubdealerReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
    </div>
  );
}

export default SubdealerReceipts;