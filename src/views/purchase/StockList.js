// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CFormInput,
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { 
//   cilSearch, 
//   cilPlus, 
//   cilSettings, 
//   cilPencil, 
//   cilTrash, 
//   cilZoomOut,
// } from '@coreui/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react';
// import axiosInstance from 'src/axiosInstance';
// import { confirmDelete, showSuccess, showError } from 'src/utils/sweetAlerts';
// import QRCode from 'react-qr-code';
// import ImportInwardCSV from '../csv/ImportInwardCSV';

// const StockList = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     type: '', 
//     branch: '',
//     search: '' 
//   });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [branches, setBranches] = useState([]);
//   const [selectedType, setSelectedType] = useState('');
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();
  
//   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
//   const branchId = storedUser.branch?._id;
//   const userRole = localStorage.getItem('userRole');

//   // Temporary permissions for development
//   const hasEditPermission = true;
//   const hasDeletePermission = true;
//   const hasCreatePermission = true;
//   const showActionColumn = true;

//   const fetchVehicles = async (searchParams = {}) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (searchParams.type) params.append('type', searchParams.type);
//       if (searchParams.branch) params.append('location', searchParams.branch);
//       if (userRole !== 'SUPERADMIN' && !searchParams.branch) {
//         params.append('location', branchId);
//       }

//       const url = params.toString() ? `/vehicles?${params.toString()}` : '/vehicles';
//       const response = await axiosInstance.get(url);

//       if (response.data.status === 'success') {
//         const nonSoldVehicles = response.data.data.vehicles.filter(
//           (vehicle) => vehicle.status?.toLowerCase() !== 'sold'
//         );
        
//         setVehicles(nonSoldVehicles);
//       }
//     } catch (err) {
//       setError(err.message);
//       showError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBranches = async () => {
//     try {
//       const response = await axiosInstance.get('/branches');
//       setBranches(response.data.data || []);
//     } catch (error) {
//       console.log('Error fetching branches:', error);
//     }
//   };

//   useEffect(() => {
//     fetchVehicles();
//     fetchBranches();
//   }, []);

//   const handleImportSuccess = () => {
//     fetchData();
//   };

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchVehicles(searchData);
//   };
//   const handleResetSearch = () => {
//     setActiveSearch({ type: '', branch: ''});
//     setSearchTerm('');
//     setSelectedType('');
//     setSelectedBranchId('');
//     setIsFilterApplied(false);
//     fetchVehicles({});
//   };

//   const applyFilter = () => {
//     if (selectedType && selectedBranchId) {
//       const filterData = {
//         type: selectedType,
//         branch: selectedBranchId,
//       };
//       setActiveSearch(filterData);
//       setIsFilterApplied(true);
//       setFilterModalVisible(false);
//       fetchVehicles(filterData);
//     } else {
//       showError('Please select both type and branch to apply filter');
//     }
//   };

//   const handleDeleteVehicle = async (vehicleId) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/vehicles/${vehicleId}`);
//         setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
//         showSuccess('Vehicle deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting vehicle:', error);
//         showError('Failed to delete vehicle');
//       }
//     }
//   };

//   const handleEditVehicle = (vehicleId) => {
//     navigate(`/update-inward/${vehicleId}`);
//   };

//   const handleExportExcel = async () => {
//     if (!selectedType) {
//       showError('Please select a type.');
//       return;
//     }
//     if (!selectedBranchId) {
//       showError('Please select a branch.');
//       return;
//     }
//     try {
//       const response = await axiosInstance.get(
//         `/vehicles/export-excel?&type=${selectedType}&branch_id=${selectedBranchId}`,
//         {
//           responseType: 'blob'
//         }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `exported_data_${selectedType}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       setExportModalVisible(false);
//       setSelectedType('');
//       setSelectedBranchId('');
//       showSuccess('Excel exported successfully!');
//     } catch (error) {
//       console.error('Excel export failed:', error);
//       showError('Failed to export Excel.');
//     }
//   };

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;
      
//       Object.keys(dropdownRefs.current).forEach(key => {
//         if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
//           newDropdownState[key] = false;
//           shouldUpdate = true;
//         }
//       });
      
//       if (shouldUpdate) {
//         setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

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
//         Error loading vehicles: {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Inwarded Stock</div>
    
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasCreatePermission && (
//               <>
//               <Link to='/inward-stock'>
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Stock
//                 </CButton>
//               </Link>
//               </>
//             )}
            
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setFilterModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {(activeSearch.type || activeSearch.branch) && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' />
//                 Reset Search
//               </CButton>
//             )}
//             {hasCreatePermission && (
//               <CButton 
//                 size="sm" 
//                 className="action-btn me-1"
//                 onClick={() => setExportModalVisible(true)}
//               >
//                 Export Excel
//               </CButton>
//             )}
//              {hasCreatePermission && (
//               <>
//                 <ImportInwardCSV endpoint="/vehicles/import-excel" onSuccess={handleImportSuccess} buttonText="Import Excel" />
//               </>
//             )}
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
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   handleSearch({search: e.target.value });
//                 }}
//               />
//             </div>
//           </div>
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Sr.no</CTableHeaderCell>
//                   <CTableHeaderCell>Unload Location</CTableHeaderCell>
//                   <CTableHeaderCell>Inward Date</CTableHeaderCell>
//                   <CTableHeaderCell>Type</CTableHeaderCell>
//                   <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
//                   <CTableHeaderCell>Color</CTableHeaderCell>
//                   <CTableHeaderCell>Battery No</CTableHeaderCell>
//                   <CTableHeaderCell>Key No</CTableHeaderCell>
//                   <CTableHeaderCell>Chassis No</CTableHeaderCell>
//                   <CTableHeaderCell>Engine No</CTableHeaderCell>
//                   <CTableHeaderCell>Motor No</CTableHeaderCell>
//                   <CTableHeaderCell>Charger No</CTableHeaderCell>
//                   <CTableHeaderCell>QR Code</CTableHeaderCell>
//                   <CTableHeaderCell>Current Status</CTableHeaderCell>
//                   {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {vehicles.length > 0 ? (
//                   vehicles.map((vehicle, index) => (
//                     <CTableRow key={vehicle._id}>
//                       <CTableDataCell>{index + 1}</CTableDataCell>
//                       <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
//                       <CTableDataCell>{new Date(vehicle.createdAt).toLocaleDateString()}</CTableDataCell>
//                       <CTableDataCell>{vehicle.type}</CTableDataCell>
//                       <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
//                       <CTableDataCell>{vehicle.color?.name || vehicle.color?.id || ''}</CTableDataCell>
//                       <CTableDataCell>{vehicle.batteryNumber}</CTableDataCell>
//                       <CTableDataCell>{vehicle.keyNumber}</CTableDataCell>
//                       <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
//                       <CTableDataCell>{vehicle.engineNumber}</CTableDataCell>
//                       <CTableDataCell>{vehicle.motorNumber}</CTableDataCell>
//                       <CTableDataCell>{vehicle.chargerNumber}</CTableDataCell>
//                       <CTableDataCell>
//                         {vehicle.qrCode ? (
//                           <QRCode value={vehicle.qrCode} size={50} bgColor="#FFFFFF" fgColor="#000000" level="H" />
//                         ) : (
//                           'N/A'
//                         )}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         <span className={`badge bg-${vehicle.status?.toLowerCase() === 'available' ? 'success' : 'warning'}`}>
//                           {vehicle.status}
//                         </span>
//                       </CTableDataCell>
//                       {showActionColumn && (
//                         <CTableDataCell>
//                           <div className="dropdown-container" ref={el => dropdownRefs.current[vehicle._id] = el}>
//                             <CButton 
//                               size="sm"
//                               className='option-button btn-sm'
//                               onClick={() => toggleDropdown(vehicle._id)}
//                             >
//                               <CIcon icon={cilSettings} />
//                               Options
//                             </CButton>
//                             {dropdownOpen[vehicle._id] && (
//                               <div className="dropdown-menu show">
//                                 {hasEditPermission && (
//                                   <button 
//                                     className="dropdown-item"
//                                     onClick={() => handleEditVehicle(vehicle._id)}
//                                   >
//                                     <CIcon icon={cilPencil} className="me-2" /> Edit
//                                   </button>
//                                 )}
//                                 {hasDeletePermission && (
//                                   <button 
//                                     className="dropdown-item"
//                                     onClick={() => handleDeleteVehicle(vehicle._id)}
//                                   >
//                                     <CIcon icon={cilTrash} className="me-2" /> Delete
//                                   </button>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                       )}
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan={showActionColumn ? "15" : "14"} className="text-center">
//                       No inward details available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//       <CModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
//         <CModalHeader>
//           <CModalTitle>Filter Vehicles</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Type:</label>
//             <CFormSelect
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//             >
//               <option value="">-- Select Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Branch:</label>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => setSelectedBranchId(e.target.value)}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setFilterModalVisible(false)}>
//             Close
//           </CButton>
//           <CButton className='submit-button' onClick={applyFilter}>
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)}>
//         <CModalHeader>
//           <CModalTitle>Export Excel</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Model Type:</label>
//             <CFormSelect
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//             >
//               <option value="">-- Select Model Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Branch:</label>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => setSelectedBranchId(e.target.value)}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
//           Close
//           </CButton>
//           <CButton className='submit-button' onClick={handleExportExcel}>
//             Export
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default StockList;


import '../../css/table.css';
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
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../utils/tableImports';
import QRCode from 'react-qr-code';
import '../../css/importCsv.css';
import '../../css/form.css';
import ImportInwardCSV from '../../views/csv/ImportInwardCSV';
import { hasPermission } from '../../utils/permissionUtils';
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
import { cilPlus, cilSearch, cilSettings, cilPencil, cilTrash, cilCloudDownload, cilZoomOut } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const StockList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterBranchId, setFilterBranchId] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const hasEditPermission = hasPermission('VEHICLE_INWARD', 'UPDATE');
  const hasDeletePermission = hasPermission('VEHICLE_INWARD', 'DELETE');
  const hasCreatePermission = hasPermission('VEHICLE_INWARD', 'CREATE');
  const hasReadPermission = hasPermission('VEHICLE_INWARD', 'READ');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const branchId = storedUser.branch?._id;
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchBranches();
  }, []);

  const fetchData = async (type = '', branchId = '') => {
    try {
      setLoading(true);
      let url = '/vehicles';
      if (type && branchId) {
        url += `?type=${type}&location=${branchId}`;
      }

      const response = await axiosInstance.get(url);
      const nonSoldVehicles = response.data.data.vehicles.filter(
        (vehicle) => vehicle.status !== 'sold' && vehicle.status !== 'Sold' && vehicle.status !== 'SOLD'
      );

      setData(nonSoldVehicles);
      setFilteredData(nonSoldVehicles);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
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
        await axiosInstance.delete(`/vehicles/${id}`);
        setData(data.filter((vehicle) => vehicle.id !== id));
        fetchData();
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const handleImportSuccess = () => {
    fetchData();
  };

  const applyFilter = () => {
    if (filterType && filterBranchId) {
      fetchData(filterType, filterBranchId);
      setIsFilterApplied(true);
      setFilterModalOpen(false);
    } else {
      showError('Please select both type and branch to apply filter');
    }
  };

  const clearFilter = () => {
    setFilterType('');
    setFilterBranchId('');
    setIsFilterApplied(false);
    fetchData();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, getDefaultSearchFields('inward'));
  };

  const addNewStock = () => {
    navigate('/inward-stock');
  };

  const handleExportExcel = async () => {
    if (!selectedType) {
      showError('Please select a type.');
      return;
    }
    if (!selectedBranchId) {
      showError('Please select a branch.');
      return;
    }

    setExportLoading(true);
    try {
      const response = await axiosInstance.get(
        `/vehicles/export-excel?&type=${selectedType}&branch_id=${selectedBranchId}`,
        {
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data_${selectedType}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setCsvDialogOpen(false);
      setSelectedType('');
      setSelectedBranchId('');
      showSuccess('Excel exported successfully!');
    } catch (error) {
      console.error('Excel export failed:', error);
      showError('Failed to export Excel.');
    } finally {
      setExportLoading(false);
    }
  };

  const resetExportModal = () => {
    setSelectedType('');
    setSelectedBranchId('');
    setCsvDialogOpen(false);
  };

  const resetFilterModal = () => {
    setFilterType('');
    setFilterBranchId('');
    setFilterModalOpen(false);
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
        Error loading stock: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Inwarded Stock</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasCreatePermission && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={addNewStock}
              >
                <CIcon icon={cilPlus} className='icon' /> New Stock
              </CButton>
            )}
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {isFilterApplied && (
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={clearFilter}
            >
              <CIcon icon={cilZoomOut} className='icon' /> Reset Search
            </CButton>
            )}
            {(hasCreatePermission || hasReadPermission) && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={() => setCsvDialogOpen(true)}
              >
                <CIcon icon={cilCloudDownload} className='icon' /> Export Excel
              </CButton>
            )}

            {hasCreatePermission && (
              <ImportInwardCSV 
                endpoint="/vehicles/import-excel" 
                onSuccess={handleImportSuccess} 
                buttonText="Import Excel" 
              />
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
                  <CTableHeaderCell>Unload Location</CTableHeaderCell>
                  <CTableHeaderCell>Inward Date</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Battery No</CTableHeaderCell>
                  <CTableHeaderCell>Key No</CTableHeaderCell>
                  <CTableHeaderCell>Chassis No</CTableHeaderCell>
                  <CTableHeaderCell>Engine No</CTableHeaderCell>
                  <CTableHeaderCell>Motor No</CTableHeaderCell>
                  <CTableHeaderCell>Charger No</CTableHeaderCell>
                  <CTableHeaderCell>QR Code</CTableHeaderCell>
                  <CTableHeaderCell>Current Status</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={showActionColumn ? "15" : "14"} className="text-center">
                      No inward details available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((vehicle, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                      <CTableDataCell>{new Date(vehicle.createdAt).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{vehicle.type}</CTableDataCell>
                      <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                      <CTableDataCell>{vehicle.color?.name || vehicle.color?.id}</CTableDataCell>
                      <CTableDataCell>{vehicle.batteryNumber}</CTableDataCell>
                      <CTableDataCell>{vehicle.keyNumber}</CTableDataCell>
                      <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                      <CTableDataCell>{vehicle.engineNumber}</CTableDataCell>
                      <CTableDataCell>{vehicle.motorNumber}</CTableDataCell>
                      <CTableDataCell>{vehicle.chargerNumber}</CTableDataCell>
                      {/* <CTableDataCell>
                        {vehicle.qrCode ? (
                          <QRCode 
                            value={vehicle.qrCode} 
                            size={50} 
                            bgColor="#FFFFFF" 
                            fgColor="#000000" 
                            level="H" 
                          />
                        ) : (
                          'N/A'
                        )}
                      </CTableDataCell> */}
                      <CTableDataCell>
  {vehicle.qrCode && (
    <a
      href={`${config.baseURL || ''}${vehicle.qrCode}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'inline-block' }}
    >
      <img
        src={`${config.baseURL || ''}${vehicle.qrCode}`}
        alt="QR Code"
        style={{
          maxWidth: '100px',
          maxHeight: '50px',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
      />
    </a>
  )}
</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={vehicle.status.toLowerCase() === 'available' ? 'success' : 'warning'}>
                          {vehicle.status}
                        </CBadge>
                      </CTableDataCell>
                      {showActionColumn && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className='option-button btn-sm'
                            onClick={(event) => handleClick(event, vehicle.id)}
                          >
                            <CIcon icon={cilSettings} />
                            Options
                          </CButton>
                          <Menu 
                            id={`action-menu-${vehicle.id}`} 
                            anchorEl={anchorEl} 
                            open={menuId === vehicle.id} 
                            onClose={handleClose}
                          >
                            {hasEditPermission && (
                              <Link className="Link" to={`/update-inward/${vehicle.id}`}>
                                <MenuItem style={{ color: 'black' }}>
                                  <CIcon icon={cilPencil} className="me-2" />Edit
                                </MenuItem>
                              </Link>
                            )}
                            {hasDeletePermission && (
                              <MenuItem onClick={() => handleDelete(vehicle.id)}>
                                <CIcon icon={cilTrash} className="me-2" />Delete
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
      <CModal visible={filterModalOpen} onClose={resetFilterModal}>
        <CModalHeader>
          <CModalTitle>Filter Vehicles</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Type:</label>
            <CFormSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={filterBranchId}
              onChange={(e) => setFilterBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={applyFilter}>
            Search
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={csvDialogOpen} onClose={resetExportModal}>
        <CModalHeader>
          <CModalTitle>Export Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Model Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- Select Model Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className='submit-button' 
            onClick={handleExportExcel}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default StockList;