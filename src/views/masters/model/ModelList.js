// import ImportCSV from '../../../views/csv/ImportCSV';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   confirmDelete,
//   showError,
//   showSuccess
// } from '../../../utils/tableImports';
// import { useParams } from 'react-router-dom';
// import { hasPermission } from '../../../utils/permissionUtils';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormInput, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilFilter, cilSearch, cilZoomOut } from '@coreui/icons';

// const ModelList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [headers, setHeaders] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [selectedSubdealer, setSelectedSubdealer] = useState(null);
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [showBranchFilterModal, setShowBranchFilterModal] = useState(false);
//   const [tempSelectedBranch, setTempSelectedBranch] = useState(selectedBranch);
//   const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(selectedSubdealer);
//   const [branchFilterError, setBranchFilterError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { branchId } = useParams();
//   const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

//   const hasEditPermission = hasPermission('MODEL', 'UPDATE');
//   const hasDeletePermission = hasPermission('MODEL', 'DELETE');
//   const hasCreatePermission = hasPermission('MODEL', 'CREATE');
//   const showActionColumn = hasEditPermission || hasDeletePermission;

//   useEffect(() => {
//     fetchData();
//     fetchHeaders();
//     fetchBranches();
//     fetchSubdealers();
//   }, []);

//   const fetchData = async (branchId = null, subdealerId = null) => {
//     try {
//       setLoading(true);
//       let url = '/models/all/status';
//       const params = {};

//       if (branchId) {
//         params.branch_id = branchId;
//         setIsFiltered(true);
//       } else if (subdealerId) {
//         params.subdealer_id = subdealerId;
//         setIsFiltered(true);
//       } else {
//         setIsFiltered(false);
//       }

//       const response = await axiosInstance.get(url, { params });
//       let models = response.data.data?.models || response.data.data || [];

//       models = models.map((model) => ({
//         ...model,
//         _id: model._id || model.id,
//         prices: model.prices || []
//       }));

//       setData(models);
//       setFilteredData(models);
//     } catch (error) {
//       console.error('Error fetching data', error);
//       setError(error.message);
//       showError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHeaders = async () => {
//     try {
//       const response = await axiosInstance.get('/headers');
//       setHeaders(response.data.data.headers);
//     } catch (error) {
//       console.log('Error fetching headers', error);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.log('Error fetching branches', error);
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       console.log('Error fetching subdealers', error);
//     }
//   };

//   const handleImportSuccess = () => {
//     if (selectedSubdealer) {
//       fetchData(null, selectedSubdealer);
//     } else {
//       fetchData(selectedBranch);
//     }
//   };

//   const getBranchNameById = (branchId) => {
//     const branch = branches.find((b) => b._id === branchId);
//     return branch ? branch.name : '';
//   };

//   const getSubdealerNameById = (subdealerId) => {
//     const subdealer = subdealers.find((s) => s._id === subdealerId);
//     return subdealer ? subdealer.name : '';
//   };

//   const handleBranchFilter = () => {
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedSubdealer(selectedSubdealer);
//     setShowBranchFilterModal(true);
//   };

//   const handleApplyBranchFilter = () => {
//     setSelectedBranch(tempSelectedBranch);
//     setSelectedSubdealer(tempSelectedSubdealer);

//     if (tempSelectedSubdealer) {
//       fetchData(null, tempSelectedSubdealer);
//     } else {
//       fetchData(tempSelectedBranch);
//     }

//     setShowBranchFilterModal(false);
//   };

//   const handleCancelBranchFilter = () => {
//     setShowBranchFilterModal(false);
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedSubdealer(selectedSubdealer);
//     setBranchFilterError('');
//   };

//   const clearFilters = () => {
//     setSelectedBranch(null);
//     setSelectedSubdealer(null);
//     fetchData();
//   };

//   const getPriceForHeader = (model, headerId) => {
//     if (!model.prices || !Array.isArray(model.prices)) return '-';

//     const header = headers.find((h) => h._id === headerId);
//     if (!header) return '-';
//     const priceObj = model.prices.find((price) => price.header_key === header.header_key || price.header_id === headerId);

//     return priceObj ? priceObj.value : '-';
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('models'));
//   };

//   const handleStatusUpdate = async (modelId, newStatus) => {
//     try {
//       await axiosInstance.put(`/models/${modelId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));
//       setFilteredData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));

//       showSuccess(`Status updated to ${newStatus}`);
//       handleClose();
//     } catch (error) {
//       console.log('Error updating status', error);
//       showError(error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/models/${id}`);
//         setData(data.filter((model) => (model._id || model.id) !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const getFilterText = () => {
//     if (selectedBranch) {
//       return `(Filtered by Branch: ${getBranchNameById(selectedBranch)})`;
//     } else if (selectedSubdealer) {
//       return `(Filtered by Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
//     }
//     return '';
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Error loading models: {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Models {getFilterText()}</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/model/add-model">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Model
//                 </CButton>
//               </Link>
//             )}
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleBranchFilter}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>

//             {(selectedBranch || selectedSubdealer) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={clearFilters}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> 
//                Reset Search
//               </CButton>
//             )}

//             <ImportCSV endpoint="/csv/import" onSuccess={handleImportSuccess} buttonText="Import Excel" />
//           </div>
//         </CCardHeader>             
//         <CCardBody>
//         <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Model name</CTableHeaderCell>
//                   <CTableHeaderCell>Discount</CTableHeaderCell>
//                   {headers.map((header) => (
//                     <CTableHeaderCell key={header._id}>{header.header_key} Price</CTableHeaderCell>
//                   ))}
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={headers.length + 4} className="text-center">
//                       No models available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((model, index) => (
//                     <CTableRow key={model._id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{model.model_name}</CTableDataCell>
//                       <CTableDataCell>{model.model_discount}</CTableDataCell>
//                       {headers.map((header) => (
//                         <CTableDataCell key={`${model._id}-${header._id}`}>
//                           {getPriceForHeader(model, header._id)}
//                         </CTableDataCell>
//                       ))}
//                       <CTableDataCell>
//                         <CBadge color={model.status === 'active' ? 'success' : 'secondary'}>
//                           {model.status === 'active' ? (
//                             <>
//                               <CIcon icon={cilCheckCircle} className="me-1" />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <CIcon icon={cilXCircle} className="me-1" />
//                               Inactive
//                             </>
//                           )}
//                         </CBadge>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, model._id)}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${model._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === model._id} 
//                             onClose={handleClose}
//                           >
//                             {hasEditPermission && (
//                               <Link
//                                 className="Link"
//                                 to={`/model/update-model/${model._id}?branch_id=${
//                                   selectedBranch || (model.prices && model.prices[0]?.branch_id) || ''
//                                 }`}
//                               >
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />
//                                   Edit
//                                 </MenuItem>
//                               </Link>
//                             )}

//                             {hasEditPermission && (
//                               model.status === 'active' ? (
//                                 <MenuItem
//                                   onClick={() => handleStatusUpdate(model._id, 'inactive')}
//                                 >
//                                   <CIcon icon={cilXCircle} className="me-2" />
//                                   Mark as Inactive
//                                 </MenuItem>
//                               ) : (
//                                 <MenuItem
//                                   onClick={() => handleStatusUpdate(model._id, 'active')}
//                                 >
//                                   <CIcon icon={cilCheckCircle} className="me-2" />
//                                   Mark as Active
//                                 </MenuItem>
//                               )
//                             )}

//                             {hasDeletePermission && (
//                               <MenuItem onClick={() => handleDelete(model._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//       {/* Filter Modal */}
//       <CModal visible={showBranchFilterModal} onClose={handleCancelBranchFilter}>
//         <CModalHeader>
//           <CModalTitle>Filter Models</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Select Branch:</label>
//             <CFormSelect
//               value={tempSelectedBranch || ''}
//               onChange={(e) => {
//                 setTempSelectedBranch(e.target.value || null);
//                 if (e.target.value) setTempSelectedSubdealer(null);
//               }}
//             >
//               <option value="">-- All Branches --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Select Subdealer:</label>
//             <CFormSelect
//               value={tempSelectedSubdealer || ''}
//               onChange={(e) => {
//                 setTempSelectedSubdealer(e.target.value || null);
//                 if (e.target.value) setTempSelectedBranch(null);
//               }}
//             >
//               <option value="">-- All Subdealers --</option>
//               {subdealers.map((subdealer) => (
//                 <option key={subdealer._id} value={subdealer._id}>
//                   {subdealer.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           {branchFilterError && <div className="alert alert-danger">{branchFilterError}</div>}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCancelBranchFilter}>
//             Cancel
//           </CButton>
//           <CButton className='submit-button' onClick={handleApplyBranchFilter}>
//             Apply Filter
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default ModelList;





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
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilSearch, cilZoomOut, cilTag } from '@coreui/icons';

const ModelList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [allVerticles, setAllVerticles] = useState([]); // All verticles from API
  const [userVerticles, setUserVerticles] = useState([]); // Verticles from user profile
  const [userVerticleIds, setUserVerticleIds] = useState([]); // Just the IDs for filtering
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubdealer, setSelectedSubdealer] = useState(null);
  const [selectedType, setSelectedType] = useState('EV'); // Set first type as default
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

  const hasEditPermission = hasPermission('MODEL', 'UPDATE');
  const hasDeletePermission = hasPermission('MODEL', 'DELETE');
  const hasCreatePermission = hasPermission('MODEL', 'CREATE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  // Define available types in order
  const availableTypes = ['EV', 'ICE', 'CSD'];

  // Function to get verticle name by ID
  const getVerticleNameById = (verticleId) => {
    if (!verticleId) return '-';
    // Check in userVerticles first, then in allVerticles
    const verticle = userVerticles.find(v => v._id === verticleId) || 
                     allVerticles.find(v => v._id === verticleId);
    return verticle ? verticle.name : verticleId;
  };

  // Extract unique headers from the filtered data
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
    // Fetch user profile to get assigned verticles
    fetchUserProfile();
    
    // Set first type as default
    setSelectedType(availableTypes[0]);
    setTempSelectedType(availableTypes[0]);
    
    // Fetch other data
    fetchBranches();
    fetchSubdealers();
  }, []);

  // Fetch data when userVerticleIds are loaded
  useEffect(() => {
    if (userVerticleIds.length > 0) {
      // Fetch initial data with default type
      fetchData(null, null, availableTypes[0], null);
    }
  }, [userVerticleIds]);

  // Update verticle names when userVerticles data is loaded or changes
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

  // Filter data based on user's verticles whenever data changes
  useEffect(() => {
    if (userVerticleIds.length > 0 && data.length > 0) {
      const filteredModels = data.filter(model => 
        model.verticle_id && userVerticleIds.includes(model.verticle_id)
      );
      setFilteredData(filteredModels);
    }
  }, [data, userVerticleIds]);

  // Fetch user profile to get assigned verticles
  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const verticleIds = response.data.data?.verticles || [];
      setUserVerticleIds(verticleIds);
      
      // Now fetch all verticles and filter only those assigned to user
      await fetchAllVerticles(verticleIds);
    } catch (error) {
      console.log('Error fetching user profile', error);
    }
  };

  // Fetch all verticles and filter based on user's verticles
  const fetchAllVerticles = async (userVerticleIds) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      
      // Filter verticles to only show those assigned to the user
      const filteredVerticles = verticlesData.filter(verticle => 
        userVerticleIds.includes(verticle._id)
      );
      setUserVerticles(filteredVerticles);
    } catch (error) {
      console.log('Error fetching verticles', error);
    }
  };

  const fetchData = async (branchId = null, subdealerId = null, type = null, verticleId = null) => {
    try {
      setLoading(true);
      let url = '/models/all/status';
      const params = {};

      // Use selectedType as default if no type is provided
      const finalType = type || selectedType || availableTypes[0];
      
      // Always include type in params
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

      // If no filters are applied except type
      if (!branchId && !subdealerId && !verticleId) {
        setIsFiltered(false);
      } else {
        setIsFiltered(true);
      }

      const response = await axiosInstance.get(url, { params });
      let models = response.data.data?.models || response.data.data || [];

      // Filter models based on user's assigned verticles
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
      
      // Update selectedType state if it's different
      if (type && type !== selectedType) {
        setSelectedType(type);
      }
    } catch (error) {
      console.error('Error fetching data', error);
      setError(error.message);
      showError(error.message);
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
    setSelectedType(availableTypes[0]); // Reset to first type
    setSelectedVerticle(null);
    fetchData(null, null, availableTypes[0], null); // Fetch with first type
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
    
    // Always show the type filter
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

  // Helper function to check if a model should be shown based on user's verticles
  const shouldShowModel = (model) => {
    if (!model.verticle_id) return false;
    return userVerticleIds.includes(model.verticle_id);
  };

  // Filter currentRecords based on user's verticles
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
        Error loading models: {error}
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
              <CIcon icon={cilSearch} className='icon' /> Search
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
      {/* Filter Modal */}
      <CModal visible={showBranchFilterModal} onClose={handleCancelBranchFilter}>
        <CModalHeader>
          <CModalTitle>Filter Models</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
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
          </div>

          <div className="mb-3">
            <label className="form-label">Select Verticle:</label>
            <CFormSelect
              value={tempSelectedVerticle || ''}
              onChange={(e) => setTempSelectedVerticle(e.target.value || null)}
            >
              <option value="">-- All Verticles --</option>
              {userVerticles
                .filter(vertical => vertical.status === 'active')
                .map((vertical) => (
                  <option key={vertical._id} value={vertical._id}>
                    {vertical.name}
                  </option>
                ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
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
          </div>

          <div className="mb-3">
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
          </div>

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







// import ImportCSV from '../../../views/csv/ImportCSV';
// import '../../../css/table.css';
// import '../../../css/form.css';
// import {
//   React,
//   useState,
//   useEffect,
//   Link,
//   Menu,
//   MenuItem,
//   getDefaultSearchFields,
//   useTableFilter,
//   usePagination,
//   axiosInstance,
//   confirmDelete,
//   showError,
//   showSuccess
// } from '../../../utils/tableImports';
// import { useParams } from 'react-router-dom';
// import { hasPermission } from '../../../utils/permissionUtils';
// import { 
//   CButton, 
//   CCard, 
//   CCardBody, 
//   CCardHeader, 
//   CFormInput, 
//   CFormLabel, 
//   CTable, 
//   CTableBody, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CTableDataCell,
//   CSpinner,
//   CBadge,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CForm
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilPlus, cilSettings, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilSearch, cilZoomOut, cilCloudUpload, cilInfo, cilWarning } from '@coreui/icons';

// const ModelList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [headers, setHeaders] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [subdealers, setSubdealers] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [selectedSubdealer, setSelectedSubdealer] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [showBranchFilterModal, setShowBranchFilterModal] = useState(false);
//   const [tempSelectedBranch, setTempSelectedBranch] = useState(selectedBranch);
//   const [tempSelectedSubdealer, setTempSelectedSubdealer] = useState(selectedSubdealer);
//   const [tempSelectedType, setTempSelectedType] = useState(selectedType);
//   const [branchFilterError, setBranchFilterError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showImportModal, setShowImportModal] = useState(false);
//   const [importFile, setImportFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [importWarnings, setImportWarnings] = useState([]);
//   const [importSuccessMessage, setImportSuccessMessage] = useState('');
//   const [importSummary, setImportSummary] = useState(null);
//   const { branchId } = useParams();
//   const { data: modelData, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);

//   const { currentRecords, PaginationOptions } = usePagination(Array.isArray(filteredData) ? filteredData : []);

//   const hasEditPermission = hasPermission('MODEL', 'UPDATE');
//   const hasDeletePermission = hasPermission('MODEL', 'DELETE');
//   const hasCreatePermission = hasPermission('MODEL', 'CREATE');
//   const showActionColumn = hasEditPermission || hasDeletePermission;

//   // Extract unique headers from the filtered data
//   const getFilteredHeaders = () => {
//     if (!filteredData || filteredData.length === 0) return [];
    
//     const allHeaders = [];
//     filteredData.forEach(model => {
//       if (model.prices && Array.isArray(model.prices)) {
//         model.prices.forEach(price => {
//           if (price.header_id && price.header_key && 
//               !allHeaders.find(h => h._id === price.header_id)) {
//             allHeaders.push({
//               _id: price.header_id,
//               header_key: price.header_key,
//               category_key: price.category_key
//             });
//           }
//         });
//       }
//     });
    
//     return allHeaders;
//   };

//   const filteredHeaders = getFilteredHeaders();

//   useEffect(() => {
//     fetchData();
//     fetchBranches();
//     fetchSubdealers();
//   }, []);

//   const fetchData = async (branchId = null, subdealerId = null, type = null) => {
//     try {
//       setLoading(true);
//       let url = '/models/all/status';
//       const params = {};

//       if (branchId) {
//         params.branch_id = branchId;
//         setIsFiltered(true);
//       } else if (subdealerId) {
//         params.subdealer_id = subdealerId;
//         setIsFiltered(true);
//       } else {
//         setIsFiltered(false);
//       }

//       if (type) {
//         params.type = type;
//         setIsFiltered(true);
//       }

//       const response = await axiosInstance.get(url, { params });
//       let models = response.data.data?.models || response.data.data || [];

//       models = models.map((model) => ({
//         ...model,
//         _id: model._id || model.id,
//         prices: model.prices || []
//       }));

//       setData(models);
//       setFilteredData(models);
//     } catch (error) {
//       console.error('Error fetching data', error);
//       setError(error.message);
//       showError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.log('Error fetching branches', error);
//     }
//   };

//   const fetchSubdealers = async () => {
//     try {
//       const response = await axiosInstance.get('/subdealers');
//       setSubdealers(response.data.data.subdealers || []);
//     } catch (error) {
//       console.log('Error fetching subdealers', error);
//     }
//   };

//   const handleImportSuccess = () => {
//     if (selectedSubdealer) {
//       fetchData(null, selectedSubdealer, selectedType);
//     } else {
//       fetchData(selectedBranch, null, selectedType);
//     }
//   };

//   const getBranchNameById = (branchId) => {
//     const branch = branches.find((b) => b._id === branchId);
//     return branch ? branch.name : '';
//   };

//   const getSubdealerNameById = (subdealerId) => {
//     const subdealer = subdealers.find((s) => s._id === subdealerId);
//     return subdealer ? subdealer.name : '';
//   };

//   const handleBranchFilter = () => {
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedSubdealer(selectedSubdealer);
//     setTempSelectedType(selectedType);
//     setShowBranchFilterModal(true);
//   };

//   const handleApplyBranchFilter = () => {
//     setSelectedBranch(tempSelectedBranch);
//     setSelectedSubdealer(tempSelectedSubdealer);
//     setSelectedType(tempSelectedType);

//     if (tempSelectedSubdealer) {
//       fetchData(null, tempSelectedSubdealer, tempSelectedType);
//     } else {
//       fetchData(tempSelectedBranch, null, tempSelectedType);
//     }

//     setShowBranchFilterModal(false);
//   };

//   const handleCancelBranchFilter = () => {
//     setShowBranchFilterModal(false);
//     setTempSelectedBranch(selectedBranch);
//     setTempSelectedSubdealer(selectedSubdealer);
//     setTempSelectedType(selectedType);
//     setBranchFilterError('');
//   };

//   const clearFilters = () => {
//     setSelectedBranch(null);
//     setSelectedSubdealer(null);
//     setSelectedType(null);
//     fetchData();
//   };

//   const getPriceForHeader = (model, headerId) => {
//     if (!model.prices || !Array.isArray(model.prices)) return '-';

//     const priceObj = model.prices.find((price) => price.header_id === headerId);
//     return priceObj ? priceObj.value : '-';
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     handleFilter(value, getDefaultSearchFields('models'));
//   };

//   const handleStatusUpdate = async (modelId, newStatus) => {
//     try {
//       await axiosInstance.put(`/models/${modelId}/status`, {
//         status: newStatus
//       });
//       setData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));
//       setFilteredData((prevData) => prevData.map((model) => (model._id === modelId ? { ...model, status: newStatus } : model)));

//       showSuccess(`Status updated to ${newStatus}`);
//       handleClose();
//     } catch (error) {
//       console.log('Error updating status', error);
//       showError(error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/models/${id}`);
//         setData(modelData.filter((model) => (model._id || model.id) !== id));
//         fetchData();
//         showSuccess();
//       } catch (error) {
//         console.log(error);
//         showError(error);
//       }
//     }
//   };

//   const getFilterText = () => {
//     let filterText = '';
    
//     if (selectedBranch) {
//       filterText += `(Filtered by Branch: ${getBranchNameById(selectedBranch)})`;
//     } else if (selectedSubdealer) {
//       filterText += `(Filtered by Subdealer: ${getSubdealerNameById(selectedSubdealer)})`;
//     }
    
//     if (selectedType) {
//       if (filterText) filterText += ' ';
//       filterText += `(Type: ${selectedType})`;
//     }
    
//     return filterText;
//   };

//   // Function to read CSV content and filter out new models
//   const filterCSVContent = (csvContent) => {
//     // Get existing model names for comparison
//     const existingModelNames = modelData.map(model => 
//       model.model_name?.toLowerCase().trim()
//     ).filter(name => name);
    
//     const lines = csvContent.split('\n');
    
//     if (lines.length < 2) {
//       throw new Error('CSV file is empty or has no data');
//     }
    
//     // Find model_name column index
//     const headers = lines[0].split(',').map(h => h.trim());
//     let modelNameIndex = -1;
    
//     // Try different possible column names
//     const possibleColumnNames = ['model_name', 'model name', 'Model Name', 'Model_Name'];
//     for (const colName of possibleColumnNames) {
//       const index = headers.findIndex(header => header.toLowerCase() === colName.toLowerCase());
//       if (index !== -1) {
//         modelNameIndex = index;
//         break;
//       }
//     }
    
//     if (modelNameIndex === -1) {
//       throw new Error('CSV file must contain "model_name" column');
//     }
    
//     // Filter out rows with new models
//     const filteredLines = [lines[0]]; // Keep header
//     const skippedModels = [];
    
//     for (let i = 1; i < lines.length; i++) {
//       if (lines[i].trim() === '') continue;
      
//       const columns = lines[i].split(',');
//       const modelName = columns[modelNameIndex]?.trim();
      
//       if (modelName) {
//         const normalizedModelName = modelName.toLowerCase().trim();
        
//         if (existingModelNames.includes(normalizedModelName)) {
//           filteredLines.push(lines[i]);
//         } else {
//           skippedModels.push(modelName);
//         }
//       } else {
//         // If no model name, skip this row
//         skippedModels.push('(empty model name)');
//       }
//     }
    
//     return {
//       filteredCSV: filteredLines.join('\n'),
//       skippedModels,
//       totalRows: lines.length - 1,
//       processedRows: filteredLines.length - 1
//     };
//   };

//   // Function to handle file selection
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file extension
//       const validExtensions = ['.csv', '.xlsx', '.xls'];
//       const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
//       if (!validExtensions.includes(fileExtension)) {
//         showError('Invalid file type. Please upload CSV or Excel files only.');
//         return;
//       }
      
//       setImportFile(file);
//       setImportWarnings([]);
//       setImportSuccessMessage('');
//       setImportSummary(null);
//     }
//   };

//   // Function to handle import
//   const handleImportSubmit = async () => {
//     if (!importFile) {
//       showError('Please select a file to import');
//       return;
//     }

//     setImportLoading(true);
//     setImportWarnings([]);
//     setImportSuccessMessage('');
//     setImportSummary(null);

//     try {
//       let filteredCSV = '';
//       let skippedModels = [];
//       let totalRows = 0;
//       let processedRows = 0;
      
//       // Read and filter the file
//       const reader = new FileReader();
      
//       const fileProcessingPromise = new Promise((resolve, reject) => {
//         reader.onload = (e) => {
//           try {
//             const csvContent = e.target.result;
//             const result = filterCSVContent(csvContent);
            
//             filteredCSV = result.filteredCSV;
//             skippedModels = result.skippedModels;
//             totalRows = result.totalRows;
//             processedRows = result.processedRows;
            
//             // Show warnings for skipped models
//             if (skippedModels.length > 0) {
//               const warnings = [];
//               skippedModels.slice(0, 5).forEach(model => {
//                 warnings.push(`Model "${model}" was skipped (New models must be created through "New Model" button)`);
//               });
//               if (skippedModels.length > 5) {
//                 warnings.push(`... and ${skippedModels.length - 5} more models were skipped`);
//               }
//               setImportWarnings(warnings);
//             }
            
//             // Set summary
//             setImportSummary({
//               total: totalRows,
//               processed: processedRows,
//               skipped: skippedModels.length,
//               newModels: skippedModels
//             });

//             resolve();
//           } catch (error) {
//             reject(error);
//           }
//         };
        
//         reader.onerror = () => {
//           reject(new Error('Failed to read file'));
//         };
        
//         reader.readAsText(importFile);
//       });
      
//       await fileProcessingPromise;
      
//       // If no models to process after filtering
//       if (processedRows === 0) {
//         showError('No existing models found in the file to update.');
//         setImportLoading(false);
//         return;
//       }

//       // Create a new file with filtered content
//       const filteredFile = new File([filteredCSV], importFile.name, { type: 'text/csv' });

//       // Process the import with filtered file
//       const formData = new FormData();
//       formData.append('file', filteredFile);
      
//       // Add filter parameters if any
//       if (selectedBranch) {
//         formData.append('branch_id', selectedBranch);
//       } else if (selectedSubdealer) {
//         formData.append('subdealer_id', selectedSubdealer);
//       }
      
//       if (selectedType) {
//         formData.append('type', selectedType);
//       }
      
//       const response = await axiosInstance.post('/csv/import', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       if (response.data.status === 'success' || response.data.success === true) {
//         const successMsg = response.data.message || 'Import successful!';
//         const importedCount = response.data.imported || processedRows;
        
//         setImportSuccessMessage(`${successMsg} (${importedCount} models updated)`);
        
//         // Update summary with backend response
//         setImportSummary(prev => ({
//           ...prev,
//           backendImported: importedCount,
//           backendMessage: successMsg,
//           status: 'success'
//         }));
        
//         showSuccess(successMsg);
        
//         // Refresh data after successful import
//         handleImportSuccess();
        
//       } else {
//         // Handle other backend errors
//         const errorMsg = response.data.message || response.data.error || 'Import failed';
//         showError(errorMsg);
//         setImportWarnings([errorMsg]);
//       }
//     } catch (error) {
//       console.error('Import error:', error);
//       const errorMessage = error.response?.data?.message || 
//                          error.response?.data?.error || 
//                          error.message || 
//                          'Import failed';
      
//       showError(errorMessage);
//       setImportWarnings([errorMessage]);
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   // Function to open import modal
//   const handleImportClick = () => {
//     setShowImportModal(true);
//     setImportFile(null);
//     setImportWarnings([]);
//     setImportSuccessMessage('');
//     setImportSummary(null);
//   };

//   // Function to close import modal
//   const handleCloseImportModal = () => {
//     setShowImportModal(false);
//     setImportFile(null);
//     setImportWarnings([]);
//     setImportSuccessMessage('');
//     setImportSummary(null);
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Error loading models: {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Models {getFilterText()}</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <Link to="/model/add-model">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Model
//                 </CButton>
//               </Link>
//             )}
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleBranchFilter}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>

//             {(selectedBranch || selectedSubdealer || selectedType) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={clearFilters}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> 
//                 Reset Search
//               </CButton>
//             )}

//             {/* Replace ImportCSV with our custom button */}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={handleImportClick}
//             >
//               <CIcon icon={cilCloudUpload} className='icon' /> Import Excel
//             </CButton>
//           </div>
//         </CCardHeader>             
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Model name</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Discount</CTableHeaderCell>
//                   {filteredHeaders.map((header) => (
//                     <CTableHeaderCell key={header._id}>{header.header_key}</CTableHeaderCell>
//                   ))}
//                   <CTableHeaderCell>Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentRecords.length === 0 ? (
//                   <CTableRow>
//                     <CTableDataCell colSpan={filteredHeaders.length + 5} className="text-center">
//                       No models available
//                     </CTableDataCell>
//                   </CTableRow>
//                 ) : (
//                   currentRecords.map((model, index) => (
//                     <CTableRow key={model._id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{model.model_name}</CTableDataCell>
//                       <CTableDataCell>{model.type}</CTableDataCell>
//                       <CTableDataCell>{model.model_discount}</CTableDataCell>
//                       {filteredHeaders.map((header) => (
//                         <CTableDataCell key={`${model._id}-${header._id}`}>
//                           {getPriceForHeader(model, header._id)}
//                         </CTableDataCell>
//                       ))}
//                       <CTableDataCell>
//                         <CBadge color={model.status === 'active' ? 'success' : 'secondary'}>
//                           {model.status === 'active' ? (
//                             <>
//                               <CIcon icon={cilCheckCircle} className="me-1" />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <CIcon icon={cilXCircle} className="me-1" />
//                               Inactive
//                             </>
//                           )}
//                         </CBadge>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className='option-button btn-sm'
//                             onClick={(event) => handleClick(event, model._id)}
//                           >
//                             <CIcon icon={cilSettings} />
//                             Options
//                           </CButton>
//                           <Menu 
//                             id={`action-menu-${model._id}`} 
//                             anchorEl={anchorEl} 
//                             open={menuId === model._id} 
//                             onClose={handleClose}
//                           >
//                             {hasEditPermission && (
//                               <Link
//                                 className="Link"
//                                 to={`/model/update-model/${model._id}?branch_id=${
//                                   selectedBranch || (model.prices && model.prices[0]?.branch_id) || ''
//                                 }`}
//                               >
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" />
//                                   Edit
//                                 </MenuItem>
//                               </Link>
//                             )}

//                             {hasEditPermission && (
//                               model.status === 'active' ? (
//                                 <MenuItem
//                                   onClick={() => handleStatusUpdate(model._id, 'inactive')}
//                                 >
//                                   <CIcon icon={cilXCircle} className="me-2" />
//                                   Mark as Inactive
//                                 </MenuItem>
//                               ) : (
//                                 <MenuItem
//                                   onClick={() => handleStatusUpdate(model._id, 'active')}
//                                 >
//                                   <CIcon icon={cilCheckCircle} className="me-2" />
//                                   Mark as Active
//                                 </MenuItem>
//                               )
//                             )}

//                             {hasDeletePermission && (
//                               <MenuItem onClick={() => handleDelete(model._id)}>
//                                 <CIcon icon={cilTrash} className="me-2" />
//                                 Delete
//                               </MenuItem>
//                             )}
//                           </Menu>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>

//       {/* Filter Modal */}
//       <CModal visible={showBranchFilterModal} onClose={handleCancelBranchFilter}>
//         <CModalHeader>
//           <CModalTitle>Filter Models</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Select Type:</label>
//             <CFormSelect
//               value={tempSelectedType || ''}
//               onChange={(e) => setTempSelectedType(e.target.value || null)}
//             >
//               <option value="">-- All Types --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//               <option value="CSD">CSD</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Select Branch:</label>
//             <CFormSelect
//               value={tempSelectedBranch || ''}
//               onChange={(e) => {
//                 setTempSelectedBranch(e.target.value || null);
//                 if (e.target.value) setTempSelectedSubdealer(null);
//               }}
//             >
//               <option value="">-- All Branches --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Select Subdealer:</label>
//             <CFormSelect
//               value={tempSelectedSubdealer || ''}
//               onChange={(e) => {
//                 setTempSelectedSubdealer(e.target.value || null);
//                 if (e.target.value) setTempSelectedBranch(null);
//               }}
//             >
//               <option value="">-- All Subdealers --</option>
//               {subdealers.map((subdealer) => (
//                 <option key={subdealer._id} value={subdealer._id}>
//                   {subdealer.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           {branchFilterError && <div className="alert alert-danger">{branchFilterError}</div>}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleCancelBranchFilter}>
//             Cancel
//           </CButton>
//           <CButton className='submit-button' onClick={handleApplyBranchFilter}>
//             Apply Filter
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       {/* Import Modal */}
//       <CModal visible={showImportModal} onClose={handleCloseImportModal} size="lg">
//         <CModalHeader>
//           <CModalTitle>Import Excel/CSV</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="alert alert-info mb-3">
//             <CIcon icon={cilInfo} className="me-2" />
//             <strong>Import Behavior:</strong>
//             <ul className="mb-0 mt-2">
//               <li>Existing models will be updated with new values</li>
//               <li>New models in the file will be <strong>automatically filtered out</strong></li>
//               <li>To add new models, use the "New Model" button above</li>
//               <li>Only CSV files are supported for automatic filtering</li>
//             </ul>
//           </div>

//           {importSuccessMessage && (
//             <div className="alert alert-success mb-3">
//               <CIcon icon={cilCheckCircle} className="me-2" />
//               <strong>Success!</strong> {importSuccessMessage}
//             </div>
//           )}

//           <div className="mb-3">
//             <CFormLabel>Select CSV File:</CFormLabel>
//             <CFormInput
//               type="file"
//               accept=".csv"
//               onChange={handleFileSelect}
//               disabled={importLoading}
//             />
//             <small className="text-muted">
//               Note: Only CSV files are supported for automatic new model filtering
//             </small>
//           </div>

//           {importFile && (
//             <div className="alert alert-light mb-3 border">
//               <strong>Selected file:</strong> {importFile.name}
//               <br />
//               <small>Size: {(importFile.size / 1024).toFixed(2)} KB</small>
//               <br />
//               <small className="text-info">
//                 File will be automatically filtered to remove new models
//               </small>
//             </div>
//           )}

//           {/* Import Summary */}
//           {importSummary && (
//             <div className="mb-3">
//               <h6>Import Summary:</h6>
//               <div className="row">
//                 <div className="col-md-3">
//                   <div className="alert alert-secondary">
//                     <strong>Total Rows:</strong> {importSummary.total}
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="alert alert-success">
//                     <strong>Processed:</strong> {importSummary.processed}
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="alert alert-warning">
//                     <strong>Skipped:</strong> {importSummary.skipped}
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="alert alert-info">
//                     <strong>Imported:</strong> {importSummary.backendImported || importSummary.processed || 0}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Warnings for skipped models */}
//           {importWarnings.length > 0 && (
//             <div className="mt-3">
//               <h6 className="text-warning">
//                 <CIcon icon={cilWarning} className="me-1" />
//                 Note:
//               </h6>
//               <div className="alert alert-warning" style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                 <ul className="mb-0">
//                   {importWarnings.map((warning, index) => (
//                     <li key={index}>{warning}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )}

//           {/* Current Models Info */}
//           <div className="mt-4">
//             <details>
//               <summary className="text-primary" style={{ cursor: 'pointer' }}>
//                 <strong>Currently Available Models ({modelData.length})</strong>
//               </summary>
//               <div className="mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
//                 <table className="table table-sm table-bordered">
//                   <thead>
//                     <tr>
//                       <th>Model Name</th>
//                       <th>Type</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {modelData.slice(0, 10).map((model, index) => (
//                       <tr key={model._id}>
//                         <td>{model.model_name}</td>
//                         <td>{model.type}</td>
//                         <td>
//                           <span className={`badge bg-${model.status === 'active' ? 'success' : 'secondary'}`}>
//                             {model.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                     {modelData.length > 10 && (
//                       <tr>
//                         <td colSpan="3" className="text-center">
//                           ... and {modelData.length - 10} more models
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </details>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={handleCloseImportModal}
//             disabled={importLoading}
//           >
//             Cancel
//           </CButton>
//           <CButton 
//             color="primary" 
//             onClick={handleImportSubmit}
//             disabled={!importFile || importLoading}
//           >
//             {importLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-2" />
//                 Filtering & Importing...
//               </>
//             ) : (
//               'Import File'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default ModelList;