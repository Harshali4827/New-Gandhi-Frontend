import '../../../css/table.css';
import '../../../css/form.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  usePagination,
  axiosInstance,
  confirmDelete,
  showError,
  showSuccess
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilSearch, cilZoomOut } from '@coreui/icons';
import { hasPermission } from '../../../utils/permissionUtils';

const VerticalMasterList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState('all');

  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const handleFilter = (value, fields) => {
    const filtered = data.filter(item => {
      const searchFields = fields || ['name', 'createdByDetails.name', 'status'];
      return searchFields.some(field => {
        if (field.includes('.')) {
          const keys = field.split('.');
          let valueToCheck = item;
          for (const key of keys) {
            valueToCheck = valueToCheck ? valueToCheck[key] : '';
          }
          return String(valueToCheck || '').toLowerCase().includes(value.toLowerCase());
        }
        return String(item[field] || '').toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredData(filtered);
  };

  const hasEditPermission = hasPermission('VERTICAL_MASTER', 'UPDATE');
  const hasDeletePermission = hasPermission('VERTICAL_MASTER', 'DELETE');
  const hasCreatePermission = hasPermission('VERTICAL_MASTER', 'CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = '/verticle-masters';
      const params = {};

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await axiosInstance.get(url, { params });
      const verticals = response.data.data?.verticleMasters || response.data.data || [];

      setData(verticals);
      setFilteredData(verticals);
      setError(null);
    } catch (error) {
      console.error('Error fetching vertical masters', error);
      setError(error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSuccess = () => {
    fetchData();
  };

  const handleFilterClick = () => {
    setTempStatusFilter(statusFilter);
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    setStatusFilter(tempStatusFilter);
    setShowFilterModal(false);
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    setTempStatusFilter(statusFilter);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchTerm('');
    handleSearch('');
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('verticalMasters'));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/verticle-masters/${id}/status`, {
        status: newStatus
      });
      
      setData(prevData => 
        prevData.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      setFilteredData(prevData => 
        prevData.map(item => 
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      showSuccess(`Status updated to ${newStatus}`);
      handleClose();
    } catch (error) {
      console.log('Error updating status', error);
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/verticle-masters/${id}`);
        fetchData();
        showSuccess('Vertical master deleted successfully');
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const getFilterText = () => {
    if (statusFilter !== 'all') {
      return `(Filtered by Status: ${statusFilter})`;
    }
    return '';
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
        Error loading vertical masters: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Vertical Masters {getFilterText()}</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <Link to="/vertical-master/add-vertical-master">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Vertical
                </CButton>
              </Link>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleFilterClick}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>

            {(statusFilter !== 'all' || searchTerm) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={clearFilters}
              >
                <CIcon icon={cilZoomOut} className='icon' /> 
                Reset Search
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
                placeholder="Search by name or creator..."
              />
            </div>
          </div>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Created By</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? 6 : 5} className="text-center">
                      No vertical masters available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((vertical, index) => (
                    <CTableRow key={vertical._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{vertical.name}</CTableDataCell>
                      <CTableDataCell>{vertical.createdByDetails?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(vertical.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vertical.status === 'active' ? 'success' : 'secondary'}>
                          {vertical.status === 'active' ? (
                            <>
                              <CIcon icon={cilCheckCircle} className="me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilXCircle} className="me-1" />
                              Inactive
                            </>
                          )}
                        </CBadge>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, vertical._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${vertical._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === vertical._id} 
                            onClose={handleClose}
                          >
                            {hasEditPermission && (
                              <Link
                                className="Link"
                                to={`/vertical-master/update-vertical-master/${vertical._id}`}
                              >
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}

                            {hasEditPermission && (
                              vertical.status === 'active' ? (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(vertical._id, 'inactive')}
                                >
                                  <CIcon icon={cilXCircle} className="me-2" />
                                  Mark as Inactive
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(vertical._id, 'active')}
                                >
                                  <CIcon icon={cilCheckCircle} className="me-2" />
                                  Mark as Active
                                </MenuItem>
                              )
                            )}

                            {hasDeletePermission && (
                              <MenuItem onClick={() => handleDelete(vertical._id)}>
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
            <div className="mt-3">
              <PaginationOptions />
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal visible={showFilterModal} onClose={handleCancelFilter}>
        <CModalHeader>
          <CModalTitle>Filter Vertical Masters</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Select Status:</label>
            <CFormSelect
              value={tempStatusFilter}
              onChange={(e) => setTempStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default VerticalMasterList;