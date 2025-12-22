import ImportCSV from '../../../views/csv/ImportCSV';
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
import { useParams } from 'react-router-dom';
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilSearch, cilZoomOut, cilTag } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const ModelList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [allVerticles, setAllVerticles] = useState([]); 
  const [userVerticles, setUserVerticles] = useState([]);
  const [userVerticleIds, setUserVerticleIds] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [selectedType, setSelectedType] = useState('EV');
  const [selectedVerticle, setSelectedVerticle] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showBranchFilterModal, setShowBranchFilterModal] = useState(false);
  const [tempSelectedBranch, setTempSelectedBranch] = useState(selectedBranch);
  const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(selectedSubdealer);
  const [tempSelectedType, setTempSelectedType] = useState(selectedType);
  const [tempSelectedVerticle, setTempSelectedVerticle] = useState(selectedVerticle);
  const [branchFilterError, setBranchFilterError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { branchId } = useParams();
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

  const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

  const { permissions} = useAuth();
  const hasEditPermission = hasPermission(permissions,'MODEL_UPDATE');
  const hasDeletePermission = hasPermission(permissions,'MODEL_DELETE');
  const hasCreatePermission = hasPermission(permissions,'MODEL_CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  const availableTypes = ['EV', 'ICE'];

  const getVerticleNameById = (verticleId) => {
    if (!verticleId) return '-';
    const verticle = userVerticles.find(v => v._id === verticleId) || 
                     allVerticles.find(v => v._id === verticleId);
    return verticle ? verticle.name : verticleId;
  };

  const getFilteredHeaders = () => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const allHeaders = [];
    filteredData.forEach(model => {
      if (model.prices && Array.isArray(model.prices)) {
        model.prices.forEach(price => {
          if (price.header_id && price.header_key && 
              !allHeaders.find(h => h._id === price.header_id)) {
            allHeaders.push({
              _id: price.header_id,
              header_key: price.header_key,
              category_key: price.category_key
            });
          }
        });
      }
    });
    
    return allHeaders;
  };

  const filteredHeaders = getFilteredHeaders();

  useEffect(() => {
    fetchUserProfile();
    setSelectedType(availableTypes[0]);
    setTempSelectedType(availableTypes[0]);
    fetchBranches();
    fetchSubdealers();
  }, []);

  useEffect(() => {
    if (userVerticleIds.length > 0) {
      fetchData(null, null, availableTypes[0], null);
    }
  }, [userVerticleIds]);

  useEffect(() => {
    if (userVerticles.length > 0 && data.length > 0) {
      const updatedData = data.map(model => ({
        ...model,
        verticle_name: model.verticleDetails?.name || getVerticleNameById(model.verticle_id)
      }));
      setData(updatedData);
      setFilteredData(updatedData);
    }
  }, [userVerticles]);

  useEffect(() => {
    if (userVerticleIds.length > 0 && data.length > 0) {
      const filteredModels = data.filter(model => 
        model.verticle_id && userVerticleIds.includes(model.verticle_id)
      );
      setFilteredData(filteredModels);
    }
  }, [data, userVerticleIds]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const verticlesData = response.data.data?.verticles || [];
      
      const verticleIds = verticlesData.map(verticle => verticle._id);
      setUserVerticleIds(verticleIds);
      
      const activeVerticles = verticlesData.filter(verticle => 
        verticle.status === 'active'
      );
      setUserVerticles(activeVerticles);
      setAllVerticles(activeVerticles);
    } catch (error) {
      console.log('Error fetching user profile', error);
    }
  };

  const fetchData = async (branchId = null, subdealerId = null, type = null, verticleId = null) => {
    try {
      setLoading(true);
      let url = '/models/all/status';
      const params = {};
      const finalType = type || selectedType || availableTypes[0];
      
      params.type = finalType;

      if (branchId) {
        params.branch_id = branchId;
        setIsFiltered(true);
      } else if (subdealerId) {
        params.subdealer_id = subdealerId;
        setIsFiltered(true);
      }

      if (verticleId) {
        params.verticle_id = verticleId;
        setIsFiltered(true);
      }
      if (!branchId && !subdealerId && !verticleId) {
        setIsFiltered(false);
      } else {
        setIsFiltered(true);
      }

      const response = await axiosInstance.get(url, { params });
      let models = response.data.data?.models || response.data.data || [];

      if (userVerticleIds.length > 0) {
        models = models.filter(model => 
          model.verticle_id && userVerticleIds.includes(model.verticle_id)
        );
      }

      models = models.map((model) => ({
        ...model,
        _id: model._id || model.id,
        prices: model.prices || [],
        verticle_name: model.verticleDetails?.name || getVerticleNameById(model.verticle_id)
      }));

      setData(models);
      setFilteredData(models);
      if (type && type !== selectedType) {
        setSelectedType(type);
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.log('Error fetching branches', error);
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.log('Error fetching subdealers', error);
    }
  };

  const handleImportSuccess = () => {
    if (selectedSubdealer) {
      fetchData(null, selectedSubdealer, selectedType, selectedVerticle);
    } else {
      fetchData(selectedBranch, null, selectedType, selectedVerticle);
    }
  };

  const getBranchNameById = (branchId) => {
    const branch = branches.find((b) => b._id === branchId);
    return branch ? branch.name : '';
  };

  const getSubdealerNameById = (subdealerId) => {
    const subdealer = subdealers.find((s) => s._id === subdealerId);
    return subdealer ? subdealer.name : '';
  };

  const handleBranchFilter = () => {
    setTempSelectedBranch(selectedBranch);
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedType(selectedType);
    setTempSelectedVerticle(selectedVerticle);
    setShowBranchFilterModal(true);
  };

  const handleApplyBranchFilter = () => {
    setSelectedBranch(tempSelectedBranch);
    setSelectedSubdealer(tempSelectedSubdealer);
    setSelectedType(tempSelectedType);
    setSelectedVerticle(tempSelectedVerticle);

    if (tempSelectedSubdealer) {
      fetchData(null, tempSelectedSubdealer, tempSelectedType, tempSelectedVerticle);
    } else {
      fetchData(tempSelectedBranch, null, tempSelectedType, tempSelectedVerticle);
    }

    setShowBranchFilterModal(false);
  };

  const handleCancelBranchFilter = () => {
    setShowBranchFilterModal(false);
    setTempSelectedBranch(selectedBranch);
    setTempSelectedSubdealer(selectedSubdealer);
    setTempSelectedType(selectedType);
    setTempSelectedVerticle(selectedVerticle);
    setBranchFilterError('');
  };

  const clearFilters = () => {
    setSelectedBranch(null);
    setSelectedSubdealer(null);
    setSelectedType(availableTypes[0]);
    setSelectedVerticle(null);
    fetchData(null, null, availableTypes[0], null);
  };

  const getPriceForHeader = (model, headerId) => {
    if (!model.prices || !Array.isArray(model.prices)) return '-';

    const priceObj = model.prices.find((price) => price.header_id === headerId);
    return priceObj ? priceObj.value : '-';
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
    handleFilter(value, getDefaultSearchFields('models'));
  };

  const handleStatusUpdate = async (modelId, newStatus) => {
    try {
      await axiosInstance.put(`/models/${modelId}/status`, {
        status: newStatus
      });
      setData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));
      setFilteredData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));

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
        await axiosInstance.delete(`/models/${id}`);
        setData(data.filter((model) => (model._id || model.id) !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const getFilterText = () => {
    let filterText = '';
    
    filterText += `(Type: ${selectedType})`;
    
    if (selectedBranch) {
      filterText += ` (Branch: ${getBranchNameById(selectedBranch)})`;
    } else if (selectedSubdealer) {
      filterText += ` (Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
    }
    
    if (selectedVerticle) {
      filterText += ` (Verticle: ${getVerticleNameById(selectedVerticle)})`;
    }
    
    return filterText;
  };

  const shouldShowModel = (model) => {
    if (!model.verticle_id) return false;
    return userVerticleIds.includes(model.verticle_id);
  };

  const filteredCurrentRecords = currentRecords.filter(shouldShowModel);

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
      <div className='title'>Models {getFilterText()}</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <Link to="/model/add-model">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Model
                </CButton>
              </Link>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={handleBranchFilter}
            >
              <CIcon icon={cilSearch} className='icon' /> Filter
            </CButton>

            {(selectedBranch || selectedSubdealer || selectedVerticle || (selectedType && selectedType !== availableTypes[0])) && (
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

            <ImportCSV endpoint="/csv/import" onSuccess={handleImportSuccess} buttonText="Import Excel" />
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
                  <CTableHeaderCell>Model name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Verticle</CTableHeaderCell>
                  <CTableHeaderCell>Discount</CTableHeaderCell>
                  {filteredHeaders.map((header) => (
                    <CTableHeaderCell key={header._id}>{header.header_key}</CTableHeaderCell>
                  ))}
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCurrentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={filteredHeaders.length + 6} className="text-center">
                      {userVerticles.length === 0 ? 
                        "No verticles assigned to your account. Please contact administrator." : 
                        `No models available for ${selectedType} in your assigned verticles`}
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredCurrentRecords.map((model, index) => (
                    <CTableRow key={model._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{model.model_name}</CTableDataCell>
                      <CTableDataCell>{model.type}</CTableDataCell>
                      <CTableDataCell>
                        {model.verticle_name || getVerticleNameById(model.verticle_id) || '-'}
                      </CTableDataCell>
                      <CTableDataCell>{model.model_discount}</CTableDataCell>
                      {filteredHeaders.map((header) => (
                        <CTableDataCell key={`${model._id}-${header._id}`}>
                          {getPriceForHeader(model, header._id)}
                        </CTableDataCell>
                      ))}
                      <CTableDataCell>
                        <CBadge color={model.status === 'active' ? 'success' : 'secondary'}>
                          {model.status === 'active' ? (
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
                            onClick={(event) => handleClick(event, model._id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${model._id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === model._id} 
                            onClose={handleClose}
                          >
                            {hasEditPermission && (
                              <Link
                                className="Link"
                                to={`/model/update-model/${model._id}?branch_id=${
                                  selectedBranch || (model.prices && model.prices[0]?.branch_id) || ''
                                }`}
                              >
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />
                                  Edit
                                </MenuItem>
                              </Link>
                            )}

                            {hasEditPermission && (
                              model.status === 'active' ? (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(model._id, 'inactive')}
                                >
                                  <CIcon icon={cilXCircle} className="me-2" />
                                  Mark as Inactive
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() => handleStatusUpdate(model._id, 'active')}
                                >
                                  <CIcon icon={cilCheckCircle} className="me-2" />
                                  Mark as Active
                                </MenuItem>
                              )
                            )}

                            {hasDeletePermission && (
                              <MenuItem onClick={() => handleDelete(model._id)}>
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
      <CModal size='lg' visible={showBranchFilterModal} onClose={handleCancelBranchFilter}>
        <CModalHeader>
          <CModalTitle>Filter Models</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Select Type:</label>
              <CFormSelect
                value={tempSelectedType || ''}
                onChange={(e) => setTempSelectedType(e.target.value || null)}
              >
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Verticle:</label>
              <CFormSelect
                value={tempSelectedVerticle || ''}
                onChange={(e) => setTempSelectedVerticle(e.target.value || null)}
              >
                <option value="">-- All Verticles --</option>
                {userVerticles.length > 0 ? (
                  userVerticles
                    .filter(vertical => vertical.status === 'active')
                    .map((vertical) => (
                      <option key={vertical._id} value={vertical._id}>
                        {vertical.name}
                      </option>
                    ))
                ) : (
                  <option value="" disabled>
                    No verticles available
                  </option>
                )}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Select Branch:</label>
              <CFormSelect
                value={tempSelectedBranch || ''}
                onChange={(e) => {
                  setTempSelectedBranch(e.target.value || null);
                  if (e.target.value) setTempSelectedSubdealer(null);
                }}
              >
                <option value="">-- All Branches --</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Select Subdealer:</label>
              <CFormSelect
                value={tempSelectedSubdealer || ''}
                onChange={(e) => {
                  setTempSelectedSubdealer(e.target.value || null);
                  if (e.target.value) setTempSelectedBranch(null);
                }}
              >
                <option value="">-- All Subdealers --</option>
                {subdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>
                    {subdealer.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
          {branchFilterError && <div className="alert alert-danger">{branchFilterError}</div>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelBranchFilter}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleApplyBranchFilter}>
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ModelList;
