import React, { useState, useEffect } from 'react';
import '../../../css/invoice.css';
import '../../../css/table.css';
import '../../../css/form.css';
import { 
  CBadge, 
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
  CTableDataCell
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess} from 'src/utils/tableImports';
import { confirmVerify } from 'src/utils/sweetAlerts';
import { hasPermission } from 'src/utils/permissionUtils';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle} from '@coreui/icons';

function PaymentVerification() {
  const [activeTab, setActiveTab] = useState(0);
  const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
  const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchPendingPayments();
    fetchVerifiedPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/payments/pending`);
      setPendingPaymentsData(response.data.data.pendingPayments || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setPendingPaymentsData([]);
    }
  };

  const fetchVerifiedPayments = async () => {
    try {
      const response = await axiosInstance.get(`/subdealersonaccount/on-account/receipts/approved`);
      setVerifiedPaymentsData(response.data.data.approvedPayments || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setVerifiedPaymentsData([]);
    }
  };

  const filterData = (data, searchTerm) => {
    if (!searchTerm || !data) return data || [];

    const searchFields = getDefaultSearchFields('receipts');
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;

        if (typeof value === 'boolean') {
          return (value ? 'yes' : 'no').includes(term);
        }
        if (field === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-GB').includes(term);
        }
        if (typeof value === 'number') {
          return String(value).includes(term);
        }
        return String(value).toLowerCase().includes(term);
      })
    );
  };

  const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchValue);
  const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchValue);

  const handleVerifyPayment = async (entry) => {
    try {
      const result = await confirmVerify({
        title: 'Confirm Payment Verification',
        text: `Are you sure you want to verify the payment of ₹${entry.amount || 0}?`,
        confirmButtonText: 'Yes, verify it!'
      });
      if (result.isConfirmed) {
        await axiosInstance.patch(`/subdealersonaccount/payments/${entry._id}/approve`, {
          remark: ''
        });
        await showSuccess('Payment verified successfully!');
        fetchPendingPayments();
        fetchVerifiedPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchValue('');
  };

  const handleResetSearch = () => {
    setSearchValue('');
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
      <div className='title'>Payment Verification</div>
    
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
                Payment Verification
                <CBadge color="danger" className="ms-2">
                  {pendingPaymentsData.length}
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
                Verified List
                <CBadge color="success" className="ms-2">
                  {verifiedPaymentsData.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
               
              />
              {searchValue && (
                <CButton 
                  size="sm" 
                  color="secondary" 
                  className="action-btn ms-2"
                  onClick={handleResetSearch}
                >
                  Reset
                </CButton>
              )}
            </div>
          </div>
          
          <CTabContent>
            <CTabPane visible={activeTab === 0} className="p-0">
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                      <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredPendingLedgerEntries.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="9" style={{ color: 'red', textAlign: 'center' }}>
                          {searchValue ? 'No matching pending payments found' : 'No pending payments available'}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredPendingLedgerEntries.map((entry, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.subdealer?.location || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                          <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
                              {entry.approvalStatus === 'Pending' ? 'PENDING' : 'COMPLETE'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton 
                              size="sm" 
                              className="action-btn"
                              onClick={() => handleVerifyPayment(entry)}
                              disabled={entry.approvalStatus !== 'Pending'}
                            >
                              <CIcon icon={cilCheckCircle} className='icon'/> Verify
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>
            
            <CTabPane visible={activeTab === 1} className="p-0">
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Subdealer Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">REF Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Bank</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredVerifiedLedgerEntries.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="7" style={{ color: 'red', textAlign: 'center' }}>
                          {searchValue ? 'No matching verified payments found' : 'No verified payments available'}
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredVerifiedLedgerEntries.map((entry, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{entry.subdealer?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.refNumber || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.bank?.name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>₹{entry.amount || '0'}</CTableDataCell>
                          <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                          <CTableDataCell>{entry.approvedBy?.name || 'N/A'}</CTableDataCell>
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
    </div>
  );
}

export default PaymentVerification;