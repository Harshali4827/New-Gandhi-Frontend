import { CFormSwitch } from '@coreui/react';
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
import { hasPermission } from '../../../utils/permissionUtils';
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
import AddProvider from './AddProvider';
import { useAuth } from '../../../context/AuthContext';

const ProviderList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const { permissions} = useAuth();
  const hasEditPermission = hasPermission(permissions,'INSURANCE_PROVIDER_UPDATE');
  const hasDeletePermission = hasPermission(permissions,'INSURANCE_PROVIDER_DELETE');
  const hasCreatePermission = hasPermission(permissions,'INSURANCE_PROVIDER_CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/insurance-providers`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
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

  const handleToggleActive = async (providerId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      await axiosInstance.patch(`/insurance-providers/${providerId}/status`, {
        is_active: newStatus
      });

      setData((prevData) => prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider)));

      setFilteredData((prevData) =>
        prevData.map((provider) => (provider.id === providerId ? { ...provider, is_active: newStatus } : provider))
      );
      
      setSuccessMessage(`Insurance provider ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling provider status:', error);
      showError('Failed to update provider status');
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/insurance-providers/${id}`);
        setData(data.filter((branch) => branch.id !== id));
        fetchData();
        setSuccessMessage('Insurance provider deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('insurance_provider'));
  };

  const handleShowAddModal = () => {
    setEditingProvider(null);
    setShowModal(true);
  };

  const handleShowEditModal = (provider) => {
    setEditingProvider(provider);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProvider(null);
  };

  const handleProviderSaved = (message) => {
    fetchData();
    handleCloseModal();
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
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
      <div className='title'>Insurance Providers</div>
      
      {/* Success Alert */}
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
                <CIcon icon={cilPlus} className='icon'/> New Provider
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "4" : "3"} className="text-center">
                      <CBadge color="secondary">No insurance providers available</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((provider, index) => (
                    <CTableRow key={provider.id || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                       {provider.provider_name}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CFormSwitch
                            checked={provider.is_active}
                            onChange={() => handleToggleActive(provider.id, provider.is_active)}
                            className="ms-2"
                          />
                        </div>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, provider.id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${provider.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === provider.id} 
                            onClose={handleClose}
                          >
                            {hasEditPermission && (
                              <MenuItem 
                                onClick={() => handleShowEditModal(provider)}
                                style={{ color: 'black' }}
                              >
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit
                              </MenuItem>
                            )}
                            {hasDeletePermission && (
                              <MenuItem onClick={() => handleDelete(provider.id)}>
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

      <AddProvider
        show={showModal}
        onClose={handleCloseModal}
        onProviderSaved={handleProviderSaved}
        editingProvider={editingProvider}
      />
    </div>
  );
};

export default ProviderList;