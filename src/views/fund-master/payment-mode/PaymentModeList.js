import { hasPermission } from '../../../utils/permissionUtils';
import '../../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  confirmDelete,
  showError,
  axiosInstance
} from '../../../utils/tableImports';
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
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSettings, cilTrash, cilPlus } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const PaymentModeList = ({ payments, onDelete, onEdit, onAddNew }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
  const [searchTerm, setSearchTerm] = useState('');
  const { permissions} = useAuth();
  useEffect(() => {
    const paymentData = Array.isArray(payments) ? payments : [];
    setData(paymentData);
    setFilteredData(paymentData);
  }, [payments]);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/banksubpaymentmodes/${id}`);
        onDelete();
      } catch (error) {
        console.log('Delete error:', error);
        showError(error.response?.data?.message || 'Failed to delete payment mode');
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('payment_mode'));
  };

  const hasCreatePermission = hasPermission(permissions,'BANK_SUB_PAYMENT_MODE_CREATE');
  const hasEditPermission = hasPermission(permissions,'BANK_SUB_PAYMENT_MODE_UPDATE');
  const hasDeletePermission = hasPermission(permissions,'BANK_SUB_PAYMENT_MODE_DELETE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  return (
    <CCard className='table-container mt-4'>
      <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
        <div>
          {hasCreatePermission && (
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={onAddNew}
            >
              <CIcon icon={cilPlus} className='icon'/> New
            </CButton>
          )}
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
              />
            </div>
          </div>
        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sr.no</CTableHeaderCell>
                <CTableHeaderCell>Payment Mode</CTableHeaderCell>
                {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!currentRecords?.length ? (
                <CTableRow>
                  <CTableDataCell colSpan={showActionColumn ? "3" : "2"} className="text-center">
                    <CBadge color="secondary">No payment modes available</CBadge>
                  </CTableDataCell>
                </CTableRow>
              ) : (
                currentRecords.map((payment, index) => (
                  <CTableRow key={payment.id || index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{payment.payment_mode}</CTableDataCell>
                    {showActionColumn && (
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, payment.id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu 
                          id={`action-menu-${payment.id}`} 
                          anchorEl={anchorEl} 
                          open={menuId === payment.id} 
                          onClose={handleClose}
                        >
                          {/* {hasEditPermission && (
                            <MenuItem 
                              onClick={() => {
                                onEdit(payment);
                                handleClose();
                              }}
                              style={{ color: 'black' }}
                            >
                              <CIcon icon={cilPencil} className="me-2" />
                              Edit
                            </MenuItem>
                          )} */}
                          {hasDeletePermission && (
                            <MenuItem onClick={() => handleDelete(payment.id)}>
                              <CIcon icon={cilTrash} className="me-2" />
                              Delete
                            </MenuItem>
                          )}
                        </Menu>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default PaymentModeList;