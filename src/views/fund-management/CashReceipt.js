import '../../css/table.css';
import {
  React,
  useEffect,
  useState,
  useTableFilter,
  usePagination,
  axiosInstance,
  getDefaultSearchFields
} from '../../utils/tableImports';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormInput, 
  CFormLabel, 
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const CashReceipt = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/vouchers`);
      setData(response.data.transactions);
      setFilteredData(response.data.transactions);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = async (id) => {
    try {
      const response = await axiosInstance.get(`/vouchers/receipt/${id}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `receipt_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const getVoucherSpecificType = (item) => {
    switch (item.voucherCategory) {
      case 'ContraVoucher':
        return item.contraType || '';
      case 'CashVoucher':
        return item.expenseType || '';
      case 'WorkshopReceipt':
        return item.reciptType || '';
      default:
        return '';
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('vouchers'));
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
        Error loading cash receipts: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Cash Receipt</div>
    
      <CCard className='table-container mt-4'>
        
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
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Voucher ID</CTableHeaderCell>
                  <CTableHeaderCell>Recipient Name</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Voucher Type</CTableHeaderCell>
                  <CTableHeaderCell>Voucher Category</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Debit</CTableHeaderCell>
                  <CTableHeaderCell>Credit</CTableHeaderCell>
                  <CTableHeaderCell>Payment Mode</CTableHeaderCell>
                  <CTableHeaderCell>Bank Location</CTableHeaderCell>
                  <CTableHeaderCell>Cash Location</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="13" className="text-center">
                      No cash receipt available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((item, index) => (
                    <CTableRow key={item.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.receiptNo}</CTableDataCell>
                      <CTableDataCell>{item.accountHead}</CTableDataCell>
                      <CTableDataCell>
                        {item.date ? new Date(item.date).toLocaleDateString('en-GB') : ''}
                      </CTableDataCell>
                      <CTableDataCell>{item.type}</CTableDataCell>
                      <CTableDataCell>{item.voucherCategory}</CTableDataCell>
                      <CTableDataCell>{getVoucherSpecificType(item)}</CTableDataCell>
                      <CTableDataCell>{item.debit || ''}</CTableDataCell>
                      <CTableDataCell>{item.credit || ''}</CTableDataCell>
                      <CTableDataCell>{item.paymentMode || ''}</CTableDataCell>
                      <CTableDataCell>{item.bankLocation || ''}</CTableDataCell>
                      <CTableDataCell>{item.cashLocation || ''}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => handleViewPdf(item.id)}
                        >
                          View PDF
                        </CButton>
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

export default CashReceipt;