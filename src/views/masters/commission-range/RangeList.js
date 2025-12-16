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
  CSpinner,
  CBadge,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash } from '@coreui/icons';
import BrokerRange from './BrokerRange';
import { useAuth } from '../../../context/AuthContext';

const RangeList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRange, setEditingRange] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData || []);
  const { permissions} = useAuth();
  const hasEditPermission = hasPermission(permissions,'BROKER_UPDATE');
  const hasDeletePermission = hasPermission(permissions,'BROKER_DELETE');
  const hasCreatePermission = hasPermission(permissions,'BROKER_CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/commission-ranges');
      setData(response.data.data || []);
      setFilteredData(response.data.data || []);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

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
        await axiosInstance.delete(`/commission-ranges/${id}`);
        setData(data.filter((range) => (range._id || range.id) !== id));
        fetchData();
        setSuccessMessage('Commission range deleted successfully');
        setTimeout(() => setSuccessMessage(''), 1500);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('range'));
  };

  const handleShowAddModal = () => {
    setEditingRange(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRange(null);
  };

  const handleRangeSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 1500);
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
      <div className='title'>Broker Commission Range</div>
      
      {successMessage && (
        <CAlert color="success" className="mb-3">
          {successMessage}
        </CAlert>
      )}
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleShowAddModal}
              >
                <CIcon icon={cilPlus} className='icon'/> New Range
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
                  <CTableHeaderCell>Min Amount</CTableHeaderCell>
                  <CTableHeaderCell>Max Amount</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!currentRecords?.length ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
                      <CBadge color="secondary">No commission ranges available</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((range, index) => (
                    <CTableRow key={range._id || range.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        ₹{range.minAmount}
                      </CTableDataCell>
                      <CTableDataCell>
                      ₹{range.maxAmount}
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, range._id || range.id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${range._id || range.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === (range._id || range.id)} 
                            onClose={handleClose}
                          >
                            {/* {hasEditPermission && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(range)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit
                              </MenuItem>
                            )} */}
                            {hasDeletePermission && (
                              <MenuItem onClick={() => handleDelete(range._id || range.id)}>
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

      <BrokerRange
        show={showModal}
        onClose={handleCloseModal}
        onRangeSaved={handleRangeSaved}
        editingRange={editingRange}
      />
    </div>
  );
};

export default RangeList;