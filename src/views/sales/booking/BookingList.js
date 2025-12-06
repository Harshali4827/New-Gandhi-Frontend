// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
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
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilPrint,cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import { hasPermission } from '../../../utils/permissionUtils';
// import { useNavigate } from 'react-router-dom';

// const BookingList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [shouldAutoSelectHPA, setShouldAutoSelectHPA] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords, PaginationOptions: PendingPagination } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords, PaginationOptions: ApprovedPagination } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords, PaginationOptions: AllocatedPagination } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords, PaginationOptions: PendingAllocatedPagination } = usePagination(filteredPendingAllocated);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
//   const userRole = localStorage.getItem('userRole');
//   const hasEditPermission = hasPermission('BOOKING', 'UPDATE');
//   const hasViewPermission = hasPermission('BOOKING', 'READ');
//   const hasDeletePermission = hasPermission('BOOKING', 'DELETE');
//   const hasChassisAllocation = hasPermission('BOOKING', 'CHASSIS_ALLOCATION');
//   const hasActionPermission = hasPermission('BOOKING', 'BOOKING_ACTIONS');
//   const hasFinancePermission = hasPermission('FINANCE_LETTER', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
//   const hasKYCPermission = hasPermission('KYC', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
//   const hasChassisApprovalPermission = hasPermission('BOOKING', 'CHASSIS_APPROVAL');
//   const showActionColumn =
//     hasEditPermission ||
//     hasDeletePermission ||
//     hasActionPermission ||
//     hasFinancePermission ||
//     hasKYCPermission ||
//     hasViewPermission ||
//     hasChassisAllocation ||
//     hasChassisApprovalPermission;

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);
//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');

//       setAllData(branchBookings);

//       const pendingBookings = branchBookings.filter(
//         (booking) => booking.status === 'PENDING_APPROVAL' || booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       // Fetch pending allocated data (ON_HOLD status)
//       const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   // Chassis Approval Functions
//   const handleApproveChassis = (bookingId) => {
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
//       fetchData();
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleViewBooking = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails.name,
//         address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails.name,
//         bookingId: booking._id
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     setSelectedBookingForChassis(bookingId);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;

//       if (isUpdateChassis && payload.reason) {
//         url += `?reason=${encodeURIComponent(payload.reason)}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);
//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(`Chassis number ${isUpdateChassis ? 'updated' : 'allocated'} successfully!`);
//       fetchData();
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
//       fetchData();
//       setDetailsModalOpen(false);
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || 'Failed to approve update');
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
//       fetchData();
//       setDetailsModalOpen(false);
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || 'Failed to reject update');
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         setAllData(allData.filter((booking) => booking._id !== id));
//         setPendingData(pendingData.filter((booking) => booking._id !== id));
//         setFilteredPending(filteredPending.filter((booking) => booking._id !== id));
//         setApprovedData(approvedData.filter((booking) => booking._id !== id));
//         setFilteredApproved(filteredApproved.filter((booking) => booking._id !== id));
//         setAllocatedData(allocatedData.filter((booking) => booking._id !== id));
//         setFilteredAllocated(filteredAllocated.filter((booking) => booking._id !== id));
//         setPendingAllocatedData(pendingAllocatedData.filter((booking) => booking._id !== id));
//         setFilteredPendingAllocated(filteredPendingAllocated.filter((booking) => booking._id !== id));

//         showSuccess('Booking deleted successfully');
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 1) handleApprovedFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 2) handlePendingAllocatedFilter('', getDefaultSearchFields('booking'));
//     else handleAllocatedFilter('', getDefaultSearchFields('booking'));
//   };

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//             {tabIndex != 2 &&   <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex != 2 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex != 2 &&  <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {/* <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell> */}
//               {tabIndex != 2 && tabIndex != 3 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 3 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex != 2 &&  <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex != 2 &&   <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 &&   <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               {showActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                   No booking available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                     {tabIndex != 2 &&  <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
//                   {tabIndex != 2 &&  <CTableDataCell>{booking.model.type}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name || ''}</CTableDataCell>
//                   {tabIndex != 2 &&   <CTableDataCell>{booking.customerDetails.mobile1 || ''}</CTableDataCell>}
//                   {/* <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell> */}
//                   {tabIndex != 2 && tabIndex != 3 && (
//                     <CTableDataCell>
//                       {booking.payment.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex != 2 && tabIndex != 3 && (
//                     <CTableDataCell>
//                       {booking.payment.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus.financeLetter.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus.financeLetter.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails.name,
//                                 address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus.financeLetter.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus.financeLetter.status.toLowerCase()}`}>
//                               {booking.documentStatus.financeLetter.status}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                    {tabIndex != 2 &&   <CTableDataCell>
//                     {booking.documentStatus.kyc.status === 'NOT_UPLOADED' ? (
//                       <Link
//                         to={`/upload-kyc/${booking.id}`}
//                         state={{
//                           bookingId: booking.id,
//                           customerName: booking.customerDetails.name,
//                           address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                         }}
//                       >
//                         <CButton size="sm" className="upload-kyc-btn icon-only">
//                           <CIcon icon={cilCloudUpload} />
//                         </CButton>
//                       </Link>
//                     ) : (
//                       <div className="d-flex align-items-center">
//                         <span className={`status-badge ${booking.documentStatus.kyc.status.toLowerCase()}`}>
//                           {booking.documentStatus.kyc.status}
//                         </span>
//                         {booking.documentStatus.kyc.status === 'REJECTED' && (
//                           <Link
//                             to={`/upload-kyc/${booking.id}`}
//                             state={{
//                               bookingId: booking.id,
//                               customerName: booking.customerDetails.name,
//                               address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                             }}
//                             className="ms-2"
//                           >
//                              <button className="upload-kyc-btn icon-only">
//                               <CIcon icon={cilCloudUpload} />
//                             </button>
//                           </Link>
//                         )}
//                       </div>
//                     )}
//                   </CTableDataCell>}
//                   <CTableDataCell>
//                     <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus.toLowerCase()}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                     <span className={`status-text ${booking.status}`}>
//                       {booking.claimDetails?.hasClaim ? (
//                         <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                       ) : (
//                         <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                       )}
//                     </span>
//                   </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                   {tabIndex != 2 &&      <CTableDataCell>
//                     {booking.formPath && (
//                       <>
//                         {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                           <span className="awaiting-approval-text">Awaiting for Approval</span>
//                         ) : (
//                           <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                             <CButton size="sm" className="upload-kyc-btn icon-only">
//                               <CIcon icon={cilPrint} />
//                             </CButton>
//                           </a>
//                         )}
//                       </>
//                     )}
//                   </CTableDataCell>}
     
//                   {tabIndex === 2 && <CTableDataCell>
//                    {booking.note}
//                   </CTableDataCell>}    

//                   {showActionColumn && (
//                     <CTableDataCell>
//                       <CButton
//                         size="sm"
//                         className='option-button btn-sm'
//                         onClick={(event) => handleClick(event, booking.id)}
//                       >
//                         <CIcon icon={cilSettings} />
//                         Options
//                       </CButton>
//                       <Menu 
//                         id={`action-menu-${booking.id}`} 
//                         anchorEl={anchorEl} 
//                         open={menuId === booking.id} 
//                         onClose={handleClose}
//                       >
//                         {(hasViewPermission || hasActionPermission) && (
//                           <>
//                             <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                             </MenuItem>
//                             {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                               <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasEditPermission && (
//                           <>
//                             {tabIndex != 2 && tabIndex != 3 && (
//                               <Link className="Link" to={`/booking-form/${booking.id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                           </>
//                         )}

//                         {hasDeletePermission && (
//                           <>
//                             {tabIndex === 0 && (
//                               <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilTrash} className="me-2" /> Delete
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {booking.payment.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                           </MenuItem>
//                         )}

//                         {hasKYCPermission && (
//                           <>
//                             {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                               <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasChassisAllocation && (
//                           <>
//                             {tabIndex === 1 &&
//                               booking.status === 'APPROVED' &&
//                               (booking.payment?.type === 'CASH' ||
//                                 (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                                 <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                                 </MenuItem>
//                               )}
//                             {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                               <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Update Chassis
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasChassisAllocation && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                           <>
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           </>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
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
//         Error loading data: {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Booking List</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasPermission('BOOKING', 'CREATE') && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//             {/* <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => {
//               }}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {searchTerm && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )} */}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Pending Approvals
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 1}
//                 onClick={() => handleTabChange(1)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Approved
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 2}
//                 onClick={() => handleTabChange(2)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Pending Allocated
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 3}
//                 onClick={() => handleTabChange(3)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Allocated
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderBookingTable(pendingRecords, 0)}
//               {/* <PendingPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderBookingTable(approvedRecords, 1)}
//               {/* <ApprovedPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 2}>
//               {renderBookingTable(pendingAllocatedRecords, 2)}
//               {/* <PendingAllocatedPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 3}>
//               {renderBookingTable(allocatedRecords, 3)}
//               {/* <AllocatedPagination /> */}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={fetchData} />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchData}
//         bookingId={financeBookingId}
//       />
//       <ChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default BookingList;




// import '../../../css/table.css';
// import '../../../css/form.css';
// import '../../../css/invoice.css';
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
//   showError,
//   axiosInstance,
//   showSuccess,
//   confirmDelete
// } from '../../../utils/tableImports';
// import CIcon from '@coreui/icons-react';
// import { cilCloudUpload, cilPrint,cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle } from '@coreui/icons';
// import config from '../../../config';
// import ViewBooking from './BookingDetails';
// import KYCView from './KYCView';
// import FinanceView from './FinanceView';
// import ChassisNumberModal from './ChassisModel';
// import { 
//   CNav, 
//   CNavItem, 
//   CNavLink, 
//   CTabContent, 
//   CTabPane,
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
//   CFormLabel,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormTextarea
// } from '@coreui/react';
// import PrintModal from './PrintFinance';
// import PendingUpdateDetailsModal from './ViewPendingUpdates';
// import { hasPermission } from '../../../utils/permissionUtils';
// import { useNavigate } from 'react-router-dom';

// const BookingList = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);
//   const [selectedUpdate, setSelectedUpdate] = useState(null);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [shouldAutoSelectHPA, setShouldAutoSelectHPA] = useState(false);
//   const [allData, setAllData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Chassis Approval Modal States
//   const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
//   const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
//   const [approvalAction, setApprovalAction] = useState('');
//   const [approvalNote, setApprovalNote] = useState('');
//   const [approvalLoading, setApprovalLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const {
//     data: pendingData,
//     setData: setPendingData,
//     filteredData: filteredPending,
//     setFilteredData: setFilteredPending,
//     handleFilter: handlePendingFilter
//   } = useTableFilter([]);
//   const {
//     data: approvedData,
//     setData: setApprovedData,
//     filteredData: filteredApproved,
//     setFilteredData: setFilteredApproved,
//     handleFilter: handleApprovedFilter
//   } = useTableFilter([]);
//   const {
//     data: allocatedData,
//     setData: setAllocatedData,
//     filteredData: filteredAllocated,
//     setFilteredData: setFilteredAllocated,
//     handleFilter: handleAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: pendingAllocatedData,
//     setData: setPendingAllocatedData,
//     filteredData: filteredPendingAllocated,
//     setFilteredData: setFilteredPendingAllocated,
//     handleFilter: handlePendingAllocatedFilter
//   } = useTableFilter([]);
//   const {
//     data: rejectedData,
//     setData: setRejectedData,
//     filteredData: filteredRejected,
//     setFilteredData: setFilteredRejected,
//     handleFilter: handleRejectedFilter
//   } = useTableFilter([]);

//   const { currentRecords: pendingRecords, PaginationOptions: PendingPagination } = usePagination(filteredPending);
//   const { currentRecords: approvedRecords, PaginationOptions: ApprovedPagination } = usePagination(filteredApproved);
//   const { currentRecords: allocatedRecords, PaginationOptions: AllocatedPagination } = usePagination(filteredAllocated);
//   const { currentRecords: pendingAllocatedRecords, PaginationOptions: PendingAllocatedPagination } = usePagination(filteredPendingAllocated);
//   const { currentRecords: rejectedRecords, PaginationOptions: RejectedPagination } = usePagination(filteredRejected);

//   const [viewModalVisible, setViewModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [kycModalVisible, setKycModalVisible] = useState(false);
//   const [kycBookingId, setKycBookingId] = useState(null);
//   const [kycData, setKycData] = useState(null);
//   const [financeModalVisible, setFinanceModalVisible] = useState(false);
//   const [financeBookingId, setFinanceBookingId] = useState(null);
//   const [financeData, setFinanceData] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
//   const [chassisLoading, setChassisLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState();
//   const [isUpdateChassis, setIsUpdateChassis] = useState(false);
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
//   const [loadingId, setLoadingId] = useState(null);
//   const userRole = localStorage.getItem('userRole');
//   const hasEditPermission = hasPermission('BOOKING', 'UPDATE');
//   const hasViewPermission = hasPermission('BOOKING', 'READ');
//   const hasDeletePermission = hasPermission('BOOKING', 'DELETE');
//   const hasChassisAllocation = hasPermission('BOOKING', 'CHASSIS_ALLOCATION');
//   const hasActionPermission = hasPermission('BOOKING', 'BOOKING_ACTIONS');
//   const hasFinancePermission = hasPermission('FINANCE_LETTER', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
//   const hasKYCPermission = hasPermission('KYC', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
//   const hasChassisApprovalPermission = hasPermission('BOOKING', 'CHASSIS_APPROVAL');
//   const showActionColumn =
//     hasEditPermission ||
//     hasDeletePermission ||
//     hasActionPermission ||
//     hasFinancePermission ||
//     hasKYCPermission ||
//     hasViewPermission ||
//     hasChassisAllocation ||
//     hasChassisApprovalPermission;

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(`/bookings`);
//       const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');

//       setAllData(branchBookings);

//       const pendingBookings = branchBookings.filter(
//         (booking) => booking.status === 'PENDING_APPROVAL' || booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'
//       );
//       setPendingData(pendingBookings);
//       setFilteredPending(pendingBookings);

//       const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
//       setApprovedData(approvedBookings);
//       setFilteredApproved(approvedBookings);

//       // Fetch pending allocated data (ON_HOLD status)
//       const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD');
//       setPendingAllocatedData(pendingAllocatedBookings);
//       setFilteredPendingAllocated(pendingAllocatedBookings);

//       const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
//       setAllocatedData(allocatedBookings);
//       setFilteredAllocated(allocatedBookings);
      
//       // Fetch rejected bookings
//       const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
//       setRejectedData(rejectedBookings);
//       setFilteredRejected(rejectedBookings);
      
//       setLoading(false);
//     } catch (error) {
//       console.log('Error fetching data', error);
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   const handleClick = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(id);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   // Chassis Approval Functions
//   const handleApproveChassis = (bookingId) => {
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('APPROVE');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleRejectChassis = (bookingId) => {
//     setSelectedBookingForApproval(bookingId);
//     setApprovalAction('REJECT');
//     setApprovalNote('');
//     setChassisApprovalModal(true);
//     handleClose();
//   };

//   const handleChassisApprovalSubmit = async () => {
//     if (!approvalNote.trim()) {
//       showError('Please enter approval note');
//       return;
//     }

//     try {
//       setApprovalLoading(true);
//       const payload = {
//         action: approvalAction,
//         approvalNote: approvalNote.trim()
//       };

//       await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
//       showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
//       setChassisApprovalModal(false);
//       setSelectedBookingForApproval(null);
//       setApprovalNote('');
//       fetchData();
//     } catch (error) {
//       console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
//       showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
//     } finally {
//       setApprovalLoading(false);
//     }
//   };

//   const handleViewBooking = async (id) => {
//     try {
//       const response = await axiosInstance.get(`/bookings/${id}`);
//       setSelectedBooking(response.data.data);
//       setViewModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching booking details', error);
//       showError('Failed to fetch booking details');
//     }
//   };

//   const handlePrint = (bookingId) => {
//     setSelectedBookingForPrint(bookingId);
//     setPrintModalVisible(true);
//     handleClose();
//   };

//   const handleViewKYC = async (bookingId) => {
//     try {
//       console.log('Fetching KYC for booking ID:', bookingId);
//       setKycBookingId(bookingId);
//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }
//       const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
//       console.log('KYC Response:', response.data);

//       const kycDataWithStatus = {
//         ...response.data.data,
//         status: booking.documentStatus?.kyc?.status || 'PENDING',
//         customerName: booking.customerDetails.name,
//         address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//       };

//       setKycData(kycDataWithStatus);
//       setKycModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error fetching KYC details', error);
//       showError('Failed to fetch KYC details');
//     }
//   };

//   const handleViewFinanceLetter = async (bookingId) => {
//     try {
//       setActionLoadingId(bookingId);
//       setFinanceBookingId(bookingId);

//       const booking = allData.find((b) => b._id === bookingId);
//       if (!booking) {
//         showError('Booking not found');
//         return;
//       }

//       const financeDataWithStatus = {
//         status: booking.documentStatus?.financeLetter?.status || 'PENDING',
//         customerName: booking.customerDetails.name,
//         bookingId: booking._id
//       };

//       setFinanceData(financeDataWithStatus);
//       setFinanceModalVisible(true);
//       handleClose();
//     } catch (error) {
//       console.log('Error viewing finance letter', error);
//       showError(error.response?.data?.message || 'Failed to view finance letter');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleUpdateChassis = (bookingId) => {
//     setSelectedBookingForChassis(bookingId);
//     setIsUpdateChassis(true);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleAllocateChassis = async (bookingId) => {
//     setSelectedBookingForChassis(bookingId);
//     setShowChassisModal(true);
//     handleClose();
//   };

//   const handleSaveChassisNumber = async (payload) => {
//     try {
//       setChassisLoading(true);

//       let url = `/bookings/${selectedBookingForChassis}/allocate`;

//       if (isUpdateChassis && payload.reason) {
//         url += `?reason=${encodeURIComponent(payload.reason)}`;
//       }

//       const formData = new FormData();
//       formData.append('chassisNumber', payload.chassisNumber);
//       formData.append('is_deviation', payload.is_deviation);
//       if (payload.note) {
//         formData.append('note', payload.note);
//       }
//       if (payload.claimDetails) {
//         formData.append('hasClaim', 'true');
//         formData.append('priceClaim', payload.claimDetails.price);
//         formData.append('description', payload.claimDetails.description);

//         payload.claimDetails.documents.forEach((file, index) => {
//           formData.append(`documents`, file);
//         });
//       } else {
//         formData.append('hasClaim', 'false');
//       }

//       const response = await axiosInstance.put(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       showSuccess(response.data.message);
//       fetchData();
//       setShowChassisModal(false);
//       setIsUpdateChassis(false);
//     } catch (error) {
//       console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
//       showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const handleViewAltrationRequest = (booking) => {
//     setSelectedUpdate(booking);
//     setDetailsModalOpen(true);
//     handleClose();
//   };

//   const handleApproveUpdate = async (id, payload) => {
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
//       showSuccess('Update approved successfully');
//       fetchData();
//       setDetailsModalOpen(false);
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || 'Failed to approve update');
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRejectUpdate = async (id, payload) => {
//     try {
//       setLoadingId(id);
//       await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
//       showSuccess('Update rejected successfully');
//       fetchData();
//       setDetailsModalOpen(false);
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || 'Failed to reject update');
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await confirmDelete();
//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/bookings/${id}`);
//         setAllData(allData.filter((booking) => booking._id !== id));
//         setPendingData(pendingData.filter((booking) => booking._id !== id));
//         setFilteredPending(filteredPending.filter((booking) => booking._id !== id));
//         setApprovedData(approvedData.filter((booking) => booking._id !== id));
//         setFilteredApproved(filteredApproved.filter((booking) => booking._id !== id));
//         setAllocatedData(allocatedData.filter((booking) => booking._id !== id));
//         setFilteredAllocated(filteredAllocated.filter((booking) => booking._id !== id));
//         setPendingAllocatedData(pendingAllocatedData.filter((booking) => booking._id !== id));
//         setFilteredPendingAllocated(filteredPendingAllocated.filter((booking) => booking._id !== id));
//         setRejectedData(rejectedData.filter((booking) => booking._id !== id));
//         setFilteredRejected(filteredRejected.filter((booking) => booking._id !== id));

//         showSuccess('Booking deleted successfully');
//       } catch (error) {
//         console.log(error);
//         showError(error.response?.data?.message || 'Failed to delete booking');
//       }
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setSearchTerm('');
//   };

//   const handleResetSearch = () => {
//     setSearchTerm('');
//     if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 1) handleApprovedFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 2) handlePendingAllocatedFilter('', getDefaultSearchFields('booking'));
//     else if (activeTab === 3) handleAllocatedFilter('', getDefaultSearchFields('booking'));
//     else handleRejectedFilter('', getDefaultSearchFields('booking'));
//   };

//   const renderBookingTable = (records, tabIndex) => {
//     return (
//       <div className="responsive-table-wrapper">
//         <CTable striped bordered hover className='responsive-table'>
//           <CTableHead>
//             <CTableRow>
//             {tabIndex != 2 && tabIndex != 4 &&   <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
//               {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Color</CTableHeaderCell>
//               <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
//               {tabIndex != 2 && tabIndex != 4 &&  <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
//               {/* <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell> */}
//               {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 4 &&  <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
//               <CTableHeaderCell scope="col">Status</CTableHeaderCell>
//               {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
//               {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
//               {tabIndex != 2 && tabIndex != 4 &&   <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
//               {tabIndex === 2 &&   <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
//               {showActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
//             </CTableRow>
//           </CTableHead>
//           <CTableBody>
//             {records.length === 0 ? (
//               <CTableRow>
//                 <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
//                   No booking available
//                 </CTableDataCell>
//               </CTableRow>
//             ) : (
//               records.map((booking, index) => (
//                 <CTableRow key={index}>
//                     {tabIndex != 2 && tabIndex != 4 &&  <CTableDataCell>{index + 1}</CTableDataCell>}
//                   <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
//                   {tabIndex != 2 && tabIndex != 4 &&  <CTableDataCell>{booking.model.type}</CTableDataCell>}
//                   <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
//                   <CTableDataCell>{booking.customerDetails.name || ''}</CTableDataCell>
//                   {tabIndex != 2 && tabIndex != 4 &&   <CTableDataCell>{booking.customerDetails.mobile1 || ''}</CTableDataCell>}
//                   {/* <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell> */}
//                   {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {booking.payment.type === 'FINANCE' && (
//                         <CButton 
//                           size="sm" 
//                           className="view-button"
//                           onClick={() => handlePrint(booking.id)}
//                         >
//                           Print
//                         </CButton>
//                       )}
//                     </CTableDataCell>
//                   )}
//                   {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                     <CTableDataCell>
//                       {booking.payment.type === 'FINANCE' && (
//                         <>
//                           {booking.documentStatus.financeLetter.status === 'NOT_UPLOADED' ||
//                           booking.documentStatus.financeLetter.status === 'REJECTED' ? (
//                             <Link
//                               to={`/upload-finance/${booking.id}`}
//                               state={{
//                                 bookingId: booking.id,
//                                 customerName: booking.customerDetails.name,
//                                 address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                               }}
//                             >
//                               <CButton size="sm" className="upload-kyc-btn icon-only">
//                                 <CIcon icon={cilCloudUpload} />
//                               </CButton>
//                             </Link>
//                           ) : null}
//                           {booking.documentStatus.financeLetter.status !== 'NOT_UPLOADED' && (
//                             <span className={`status-badge ${booking.documentStatus.financeLetter.status.toLowerCase()}`}>
//                               {booking.documentStatus.financeLetter.status}
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </CTableDataCell>
//                   )}
//                    {tabIndex != 2 && tabIndex != 4 &&   <CTableDataCell>
//                     {booking.documentStatus.kyc.status === 'NOT_UPLOADED' ? (
//                       <Link
//                         to={`/upload-kyc/${booking.id}`}
//                         state={{
//                           bookingId: booking.id,
//                           customerName: booking.customerDetails.name,
//                           address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                         }}
//                       >
//                         <CButton size="sm" className="upload-kyc-btn icon-only">
//                           <CIcon icon={cilCloudUpload} />
//                         </CButton>
//                       </Link>
//                     ) : (
//                       <div className="d-flex align-items-center">
//                         <span className={`status-badge ${booking.documentStatus.kyc.status.toLowerCase()}`}>
//                           {booking.documentStatus.kyc.status}
//                         </span>
//                         {booking.documentStatus.kyc.status === 'REJECTED' && (
//                           <Link
//                             to={`/upload-kyc/${booking.id}`}
//                             state={{
//                               bookingId: booking.id,
//                               customerName: booking.customerDetails.name,
//                               address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//                             }}
//                             className="ms-2"
//                           >
//                              <button className="upload-kyc-btn icon-only">
//                               <CIcon icon={cilCloudUpload} />
//                             </button>
//                           </Link>
//                         )}
//                       </div>
//                     )}
//                   </CTableDataCell>}
//                   <CTableDataCell>
//                     <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
//                   </CTableDataCell>
//                   {tabIndex === 0 && (
//                     <CTableDataCell>
//                       <span className={`status-badge ${booking.updateRequestStatus.toLowerCase()}`}>
//                         {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
//                       </span>
//                     </CTableDataCell>
//                   )}
//                   {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                   {tabIndex === 2 && (
//                     <CTableDataCell>
//                     <span className={`status-text ${booking.status}`}>
//                       {booking.claimDetails?.hasClaim ? (
//                         <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
//                       ) : (
//                         <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
//                       )}
//                     </span>
//                   </CTableDataCell>
//                   )}
//                   {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
//                   {tabIndex != 2 && tabIndex != 4 &&      <CTableDataCell>
//                     {booking.formPath && (
//                       <>
//                         {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
//                           <span className="awaiting-approval-text">Awaiting for Approval</span>
//                         ) : (
//                           <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
//                             <CButton size="sm" className="upload-kyc-btn icon-only">
//                               <CIcon icon={cilPrint} />
//                             </CButton>
//                           </a>
//                         )}
//                       </>
//                     )}
//                   </CTableDataCell>}
     
//                   {tabIndex === 2 && <CTableDataCell>
//                    {booking.note}
//                   </CTableDataCell>}    

//                   {showActionColumn && (
//                     <CTableDataCell>
//                       <CButton
//                         size="sm"
//                         className='option-button btn-sm'
//                         onClick={(event) => handleClick(event, booking.id)}
//                       >
//                         <CIcon icon={cilSettings} />
//                         Options
//                       </CButton>
//                       <Menu 
//                         id={`action-menu-${booking.id}`} 
//                         anchorEl={anchorEl} 
//                         open={menuId === booking.id} 
//                         onClose={handleClose}
//                       >
//                         {(hasViewPermission || hasActionPermission) && (
//                           <>
//                             <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
//                               <CIcon icon={cilZoomOut} className="me-2" /> View Booking
//                             </MenuItem>
//                             {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
//                               <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasEditPermission && (
//                           <>
//                             {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
//                               <Link className="Link" to={`/booking-form/${booking.id}`}>
//                                 <MenuItem style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Edit
//                                 </MenuItem>
//                               </Link>
//                             )}
//                           </>
//                         )}

//                         {hasDeletePermission && (
//                           <>
//                             {(tabIndex === 0 || tabIndex === 4) && (
//                               <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilTrash} className="me-2" /> Delete
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {booking.payment.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
//                           <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
//                             <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
//                           </MenuItem>
//                         )}

//                         {hasKYCPermission && (
//                           <>
//                             {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
//                               <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilZoomOut} className="me-2" /> View KYC
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasChassisAllocation && (
//                           <>
//                             {tabIndex === 1 &&
//                               booking.status === 'APPROVED' &&
//                               (booking.payment?.type === 'CASH' ||
//                                 (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
//                                 <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
//                                   <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
//                                 </MenuItem>
//                               )}
//                             {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
//                               <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
//                                 <CIcon icon={cilPencil} className="me-2" /> Update Chassis
//                               </MenuItem>
//                             )}
//                           </>
//                         )}

//                         {hasChassisAllocation && tabIndex === 2 && booking.status === 'ON_HOLD' && (
//                           <>
//                             <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
//                               <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
//                             </MenuItem>
//                             <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
//                               <CIcon icon={cilX} className="me-2" /> Reject Chassis
//                             </MenuItem>
//                           </>
//                         )}
//                       </Menu>
//                     </CTableDataCell>
//                   )}
//                 </CTableRow>
//               ))
//             )}
//           </CTableBody>
//         </CTable>
//       </div>
//     );
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
//         Error loading data: {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Booking List</div>
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasPermission('BOOKING', 'CREATE') && (
//               <Link to="/new-booking">
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> New Booking
//                 </CButton>
//               </Link>
//             )}
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CNav variant="tabs" className="mb-3 border-bottom">
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 0}
//                 onClick={() => handleTabChange(0)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
//                   color: 'black',
//                   borderBottom: 'none'
//                 }}
//               >
//                 Pending Approvals
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 1}
//                 onClick={() => handleTabChange(1)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Approved
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 2}
//                 onClick={() => handleTabChange(2)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Pending Allocated
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 3}
//                 onClick={() => handleTabChange(3)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Allocated
//               </CNavLink>
//             </CNavItem>
//             <CNavItem>
//               <CNavLink
//                 active={activeTab === 4}
//                 onClick={() => handleTabChange(4)}
//                 style={{ 
//                   cursor: 'pointer',
//                   borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
//                   borderBottom: 'none',
//                   color: 'black'
//                 }}
//               >
//                 Rejected
//               </CNavLink>
//             </CNavItem>
//           </CNav>

//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
//                   else handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
//                 }}
//               />
//             </div>
//           </div>

//           <CTabContent>
//             <CTabPane visible={activeTab === 0}>
//               {renderBookingTable(pendingRecords, 0)}
//               {/* <PendingPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 1}>
//               {renderBookingTable(approvedRecords, 1)}
//               {/* <ApprovedPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 2}>
//               {renderBookingTable(pendingAllocatedRecords, 2)}
//               {/* <PendingAllocatedPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 3}>
//               {renderBookingTable(allocatedRecords, 3)}
//               {/* <AllocatedPagination /> */}
//             </CTabPane>
//             <CTabPane visible={activeTab === 4}>
//               {renderBookingTable(rejectedRecords, 4)}
//               {/* <RejectedPagination /> */}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>

//       {/* Chassis Approval Modal */}
//       <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
//         <CModalHeader>
//           <CModalTitle>
//             {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <CFormLabel>
//               {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
//             </CFormLabel>
//             <CFormTextarea
//               value={approvalNote}
//               onChange={(e) => setApprovalNote(e.target.value)}
//               rows={3}
//             />
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
//             onClick={handleChassisApprovalSubmit}
//             disabled={approvalLoading}
//           >
//             {approvalLoading ? (
//               <CSpinner size="sm" />
//             ) : (
//               approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={fetchData} />
//       <KYCView
//         open={kycModalVisible}
//         onClose={() => {
//           setKycModalVisible(false);
//           setKycBookingId(null);
//         }}
//         kycData={kycData}
//         refreshData={fetchData}
//         bookingId={kycBookingId}
//       />
//       <FinanceView
//         open={financeModalVisible}
//         onClose={() => {
//           setFinanceModalVisible(false);
//           setFinanceBookingId(null);
//         }}
//         financeData={financeData}
//         refreshData={fetchData}
//         bookingId={financeBookingId}
//       />
//       <ChassisNumberModal
//         show={showChassisModal}
//         onClose={() => {
//           setShowChassisModal(false);
//           setIsUpdateChassis(false);
//         }}
//         onSave={handleSaveChassisNumber}
//         isLoading={chassisLoading}
//         booking={allData.find((b) => b._id === selectedBookingForChassis)}
//         isUpdate={isUpdateChassis}
//       />
//       <PrintModal
//         show={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           setSelectedBookingForPrint(null);
//         }}
//         bookingId={selectedBookingForPrint}
//       />
//       <PendingUpdateDetailsModal
//         open={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         updateData={selectedUpdate}
//         onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
//         onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
//       />
//     </div>
//   );
// };

// export default BookingList;





import '../../../css/table.css';
import '../../../css/form.css';
import '../../../css/invoice.css';
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
  showError,
  axiosInstance,
  showSuccess,
  confirmDelete
} from '../../../utils/tableImports';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload, cilPrint, cilPlus, cilSettings, cilPencil, cilTrash, cilZoomOut, cilCheck, cilX, cilCheckCircle, cilXCircle } from '@coreui/icons';
import config from '../../../config';
import ViewBooking from './BookingDetails';
import KYCView from './KYCView';
import FinanceView from './FinanceView';
import ChassisNumberModal from './ChassisModel';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea
} from '@coreui/react';
import PrintModal from './PrintFinance';
import PendingUpdateDetailsModal from './ViewPendingUpdates';
import { hasPermission } from '../../../utils/permissionUtils';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [shouldAutoSelectHPA, setShouldAutoSelectHPA] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Chassis Approval Modal States
  const [chassisApprovalModal, setChassisApprovalModal] = useState(false);
  const [selectedBookingForApproval, setSelectedBookingForApproval] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);
  
  // Cancellation states
  const [cancelledLoading, setCancelledLoading] = useState(false);
  
  // Cancellation Approval/Reject Modal States
  const [cancelApprovalModal, setCancelApprovalModal] = useState(false);
  const [selectedCancellationForApproval, setSelectedCancellationForApproval] = useState(null);
  const [cancelApprovalAction, setCancelApprovalAction] = useState(''); // 'APPROVE' or 'REJECT'
  const [editedReason, setEditedReason] = useState('');
  const [cancellationCharges, setCancellationCharges] = useState(0);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [cancelActionLoading, setCancelActionLoading] = useState(false);
  
  const navigate = useNavigate();

  const {
    data: pendingData,
    setData: setPendingData,
    filteredData: filteredPending,
    setFilteredData: setFilteredPending,
    handleFilter: handlePendingFilter
  } = useTableFilter([]);
  const {
    data: approvedData,
    setData: setApprovedData,
    filteredData: filteredApproved,
    setFilteredData: setFilteredApproved,
    handleFilter: handleApprovedFilter
  } = useTableFilter([]);
  const {
    data: allocatedData,
    setData: setAllocatedData,
    filteredData: filteredAllocated,
    setFilteredData: setFilteredAllocated,
    handleFilter: handleAllocatedFilter
  } = useTableFilter([]);
  const {
    data: pendingAllocatedData,
    setData: setPendingAllocatedData,
    filteredData: filteredPendingAllocated,
    setFilteredData: setFilteredPendingAllocated,
    handleFilter: handlePendingAllocatedFilter
  } = useTableFilter([]);
  const {
    data: rejectedData,
    setData: setRejectedData,
    filteredData: filteredRejected,
    setFilteredData: setFilteredRejected,
    handleFilter: handleRejectedFilter
  } = useTableFilter([]);
  
  // Cancellation filters
  const {
    data: cancelledPendingData,
    setData: setCancelledPendingData,
    filteredData: filteredCancelledPending,
    setFilteredData: setFilteredCancelledPending,
    handleFilter: handleCancelledPendingFilter
  } = useTableFilter([]);
  const {
    data: cancelledRejectedData,
    setData: setCancelledRejectedData,
    filteredData: filteredCancelledRejected,
    setFilteredData: setFilteredCancelledRejected,
    handleFilter: handleCancelledRejectedFilter
  } = useTableFilter([]);

  const { currentRecords: pendingRecords } = usePagination(filteredPending);
  const { currentRecords: approvedRecords } = usePagination(filteredApproved);
  const { currentRecords: allocatedRecords } = usePagination(filteredAllocated);
  const { currentRecords: pendingAllocatedRecords } = usePagination(filteredPendingAllocated);
  const { currentRecords: rejectedRecords } = usePagination(filteredRejected);
  const { currentRecords: cancelledPendingRecords } = usePagination(filteredCancelledPending);
  const { currentRecords: cancelledRejectedRecords } = usePagination(filteredCancelledRejected);

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  const [kycBookingId, setKycBookingId] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [financeModalVisible, setFinanceModalVisible] = useState(false);
  const [financeBookingId, setFinanceBookingId] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [showChassisModal, setShowChassisModal] = useState(false);
  const [selectedBookingForChassis, setSelectedBookingForChassis] = useState(null);
  const [chassisLoading, setChassisLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState();
  const [isUpdateChassis, setIsUpdateChassis] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const hasEditPermission = hasPermission('BOOKING', 'UPDATE');
  const hasViewPermission = hasPermission('BOOKING', 'READ');
  const hasDeletePermission = hasPermission('BOOKING', 'DELETE');
  const hasChassisAllocation = hasPermission('BOOKING', 'CHASSIS_ALLOCATION');
  const hasActionPermission = hasPermission('BOOKING', 'BOOKING_ACTIONS');
  const hasFinancePermission = hasPermission('FINANCE_LETTER', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
  const hasKYCPermission = hasPermission('KYC', 'READ', 'CREATE', 'VERIFY', 'DOWNLOAD');
  const hasChassisApprovalPermission = hasPermission('BOOKING', 'CHASSIS_APPROVAL');
  const showActionColumn =
    hasEditPermission ||
    hasDeletePermission ||
    hasActionPermission ||
    hasFinancePermission ||
    hasKYCPermission ||
    hasViewPermission ||
    hasChassisAllocation ||
    hasChassisApprovalPermission;

  useEffect(() => {
    fetchData();
    fetchCancellationData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings`);
      const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');

      setAllData(branchBookings);

      const pendingBookings = branchBookings.filter(
        (booking) => booking.status === 'PENDING_APPROVAL' || booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'
      );
      setPendingData(pendingBookings);
      setFilteredPending(pendingBookings);

      const approvedBookings = branchBookings.filter((booking) => booking.status === 'APPROVED');
      setApprovedData(approvedBookings);
      setFilteredApproved(approvedBookings);

      // Fetch pending allocated data (ON_HOLD status)
      const pendingAllocatedBookings = branchBookings.filter((booking) => booking.status === 'ON_HOLD');
      setPendingAllocatedData(pendingAllocatedBookings);
      setFilteredPendingAllocated(pendingAllocatedBookings);

      const allocatedBookings = branchBookings.filter((booking) => booking.status === 'ALLOCATED');
      setAllocatedData(allocatedBookings);
      setFilteredAllocated(allocatedBookings);
      
      // Fetch rejected bookings
      const rejectedBookings = branchBookings.filter((booking) => booking.status === 'REJECTED');
      setRejectedData(rejectedBookings);
      setFilteredRejected(rejectedBookings);
      
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchCancellationData = async () => {
    try {
      setCancelledLoading(true);
      
      // Fetch pending cancellations
      const pendingResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { status: 'PENDING' }
      });
      setCancelledPendingData(pendingResponse.data.data);
      setFilteredCancelledPending(pendingResponse.data.data);
      
      // Fetch rejected cancellations
      const rejectedResponse = await axiosInstance.get(`/cancelbooking/cancellations`, {
        params: { status: 'REJECTED' }
      });
      setCancelledRejectedData(rejectedResponse.data.data);
      setFilteredCancelledRejected(rejectedResponse.data.data);
      
      setCancelledLoading(false);
    } catch (error) {
      console.log('Error fetching cancellation data', error);
      setCancelledLoading(false);
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

  // Cancellation Approval Functions
  const handleApproveCancellation = (cancellation) => {
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('APPROVE');
    setEditedReason(cancellation.cancellationRequest?.reason || '');
    setCancellationCharges(cancellation.cancellationRequest?.cancellationCharges || 0);
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleRejectCancellation = (cancellation) => {
    setSelectedCancellationForApproval(cancellation);
    setCancelApprovalAction('REJECT');
    setRejectionReason('');
    setNotes('');
    setCancelApprovalModal(true);
  };

  const handleCancelActionSubmit = async () => {
    if (!selectedCancellationForApproval) return;

    try {
      setCancelActionLoading(true);
      
      if (cancelApprovalAction === 'APPROVE') {
        const payload = {
          reason: selectedCancellationForApproval.cancellationRequest?.reason || '',
          editedReason: editedReason,
          cancellationCharges: cancellationCharges,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/cancel`, payload);
        showSuccess('Cancellation approved successfully!');
      } else {
        const payload = {
          rejectionReason: rejectionReason,
          notes: notes
        };

        await axiosInstance.put(`/cancelbooking/cancellations/${selectedCancellationForApproval._id}/reject`, payload);
        showSuccess('Cancellation rejected successfully!');
      }

      setCancelApprovalModal(false);
      setSelectedCancellationForApproval(null);
      setEditedReason('');
      setCancellationCharges(0);
      setNotes('');
      setRejectionReason('');
      
      // Refresh ALL data after cancellation action
      await Promise.all([
        fetchData(), // Refresh booking data
        fetchCancellationData() // Refresh cancellation data
      ]);
      
    } catch (error) {
      console.error(`Error ${cancelApprovalAction === 'APPROVE' ? 'approving' : 'rejecting'} cancellation:`, error);
      showError(error.response?.data?.message || `Failed to ${cancelApprovalAction === 'APPROVE' ? 'approve' : 'reject'} cancellation`);
    } finally {
      setCancelActionLoading(false);
    }
  };

  // Chassis Approval Functions
  const handleApproveChassis = (bookingId) => {
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('APPROVE');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleRejectChassis = (bookingId) => {
    setSelectedBookingForApproval(bookingId);
    setApprovalAction('REJECT');
    setApprovalNote('');
    setChassisApprovalModal(true);
    handleClose();
  };

  const handleChassisApprovalSubmit = async () => {
    if (!approvalNote.trim()) {
      showError('Please enter approval note');
      return;
    }

    try {
      setApprovalLoading(true);
      const payload = {
        action: approvalAction,
        approvalNote: approvalNote.trim()
      };

      await axiosInstance.patch(`/bookings/${selectedBookingForApproval}/approve-chassis`, payload);
      
      showSuccess(`Chassis allocation ${approvalAction === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
      setChassisApprovalModal(false);
      setSelectedBookingForApproval(null);
      setApprovalNote('');
      
      // Refresh ALL data after chassis approval
      await fetchData();
      
    } catch (error) {
      console.error(`Error ${approvalAction === 'APPROVE' ? 'approving' : 'rejecting'} chassis:`, error);
      showError(error.response?.data?.message || `Failed to ${approvalAction === 'APPROVE' ? 'approve' : 'reject'} chassis allocation`);
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleViewBooking = async (id) => {
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      setSelectedBooking(response.data.data);
      setViewModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching booking details', error);
      showError('Failed to fetch booking details');
    }
  };

  const handlePrint = (bookingId) => {
    setSelectedBookingForPrint(bookingId);
    setPrintModalVisible(true);
    handleClose();
  };

  const handleViewKYC = async (bookingId) => {
    try {
      console.log('Fetching KYC for booking ID:', bookingId);
      setKycBookingId(bookingId);
      const booking = allData.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }
      const response = await axiosInstance.get(`/kyc/${bookingId}/documents`);
      console.log('KYC Response:', response.data);

      const kycDataWithStatus = {
        ...response.data.data,
        status: booking.documentStatus?.kyc?.status || 'PENDING',
        customerName: booking.customerDetails.name,
        address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
      };

      setKycData(kycDataWithStatus);
      setKycModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error fetching KYC details', error);
      showError('Failed to fetch KYC details');
    }
  };

  const handleViewFinanceLetter = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);
      setFinanceBookingId(bookingId);

      const booking = allData.find((b) => b._id === bookingId);
      if (!booking) {
        showError('Booking not found');
        return;
      }

      const financeDataWithStatus = {
        status: booking.documentStatus?.financeLetter?.status || 'PENDING',
        customerName: booking.customerDetails.name,
        bookingId: booking._id
      };

      setFinanceData(financeDataWithStatus);
      setFinanceModalVisible(true);
      handleClose();
    } catch (error) {
      console.log('Error viewing finance letter', error);
      showError(error.response?.data?.message || 'Failed to view finance letter');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAllocateChassis = (bookingId) => {
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(false); // Make sure this is false for allocation
    setShowChassisModal(true);
    handleClose();
  };

  const handleUpdateChassis = (bookingId) => {
    setSelectedBookingForChassis(bookingId);
    setIsUpdateChassis(true); // This is true for update
    setShowChassisModal(true);
    handleClose();
  };

  const handleSaveChassisNumber = async (payload) => {
    try {
      setChassisLoading(true);

      let url = `/bookings/${selectedBookingForChassis}/allocate`;

      if (isUpdateChassis && payload.reason) {
        url += `?reason=${encodeURIComponent(payload.reason)}`;
      }

      const formData = new FormData();
      formData.append('chassisNumber', payload.chassisNumber);
      formData.append('is_deviation', payload.is_deviation);
      if (payload.note) {
        formData.append('note', payload.note);
      }
      if (payload.claimDetails) {
        formData.append('hasClaim', 'true');
        formData.append('priceClaim', payload.claimDetails.price);
        formData.append('description', payload.claimDetails.description);

        payload.claimDetails.documents.forEach((file, index) => {
          formData.append(`documents`, file);
        });
      } else {
        formData.append('hasClaim', 'false');
      }

      const response = await axiosInstance.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess(response.data.message);
      
      // Refresh data after chassis allocation
      await fetchData();
      
      setShowChassisModal(false);
      setIsUpdateChassis(false);
      setSelectedBookingForChassis(null);
    } catch (error) {
      console.error(`Error ${isUpdateChassis ? 'updating' : 'allocating'} chassis number:`, error);
      showError(error.response?.data?.message || `Failed to ${isUpdateChassis ? 'update' : 'allocate'} chassis number`);
    } finally {
      setChassisLoading(false);
    }
  };

  const handleViewAltrationRequest = (booking) => {
    setSelectedUpdate(booking);
    setDetailsModalOpen(true);
    handleClose();
  };

  const handleApproveUpdate = async (id, payload) => {
    try {
      setLoadingId(id);
      await axiosInstance.post(`/bookings/${id}/approve-update`, payload);
      showSuccess('Update approved successfully');
      
      // Refresh data
      await fetchData();
      
      setDetailsModalOpen(false);
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || 'Failed to approve update');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectUpdate = async (id, payload) => {
    try {
      setLoadingId(id);
      await axiosInstance.post(`/bookings/${id}/reject-update`, payload);
      showSuccess('Update rejected successfully');
      
      // Refresh data
      await fetchData();
      
      setDetailsModalOpen(false);
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || 'Failed to reject update');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/bookings/${id}`);
        showSuccess('Booking deleted successfully');
        
        // Refresh all data instead of just filtering local state
        await fetchData();
        await fetchCancellationData();
        
      } catch (error) {
        console.log(error);
        showError(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    if (activeTab === 0) handlePendingFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 1) handleApprovedFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 2) handlePendingAllocatedFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 3) handleAllocatedFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 4) handleRejectedFilter('', getDefaultSearchFields('booking'));
    else if (activeTab === 5) handleCancelledPendingFilter('', ['customer.name', 'customer.phone']);
    else handleCancelledRejectedFilter('', ['customer.name', 'customer.phone']);
  };

  const renderBookingTable = (records, tabIndex) => {
    if (tabIndex === 5 || tabIndex === 6) {
      // Cancellation tables
      return (
        <div className="responsive-table-wrapper">
          <CTable striped bordered hover className='responsive-table'>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cancellation Reason</CTableHeaderCell>
                <CTableHeaderCell scope="col">Requested At</CTableHeaderCell>
                <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cancellation Charges</CTableHeaderCell>
                <CTableHeaderCell scope="col">Refund Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                {tabIndex === 6 && <CTableHeaderCell scope="col">Rejection Reason</CTableHeaderCell>}
                {tabIndex === 5 && (
                  <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                )}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {records.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={tabIndex === 6 ? 11 : 11} style={{ color: 'red', textAlign: 'center' }}>
                    No cancellation requests available
                  </CTableDataCell>
                </CTableRow>
              ) : (
                records.map((cancellation, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{cancellation.customer?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{cancellation.customer?.phone || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{cancellation.bookingDate ? new Date(cancellation.bookingDate).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{cancellation.cancellationRequest?.reason || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{cancellation.cancellationRequest?.requestedAt ? new Date(cancellation.cancellationRequest.requestedAt).toLocaleDateString('en-GB') : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{cancellation.cancellationRequest?.requestedByDetails?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>₹{cancellation.cancellationRequest?.cancellationCharges || 0}</CTableDataCell>
                    <CTableDataCell>₹{cancellation.financials?.refundAmount || 0}</CTableDataCell>
                    <CTableDataCell>
                      <span className={`status-badge ${cancellation.cancellationRequest?.status?.toLowerCase() || ''}`}>
                        {cancellation.cancellationRequest?.status || 'N/A'}
                      </span>
                    </CTableDataCell>
                    {tabIndex === 6 && (
                      <CTableDataCell>{cancellation.cancellationRequest?.rejectionReason || 'N/A'}</CTableDataCell>
                    )}
                    {tabIndex === 5 && (
                      <CTableDataCell>
                        <div className="d-flex">
                          <CButton
                            size="sm"
                            className="me-2"
                            color="success"
                            onClick={() => handleApproveCancellation(cancellation)}
                          >
                            <CIcon icon={cilCheck} /> Approve
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            onClick={() => handleRejectCancellation(cancellation)}
                          >
                            <CIcon icon={cilX} /> Reject
                          </CButton>
                        </div>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      );
    }

    // Original booking tables
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
              {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Type</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Color</CTableHeaderCell>
              <CTableHeaderCell scope="col">Fullname</CTableHeaderCell>
              {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Contact1</CTableHeaderCell>}
              {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Finance Letter</CTableHeaderCell>}
              {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload Finance</CTableHeaderCell>}
              {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Upload KYC</CTableHeaderCell>}
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {tabIndex === 0 && <CTableHeaderCell scope="col">Altration Request</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Is Claim</CTableHeaderCell>}
              {tabIndex === 3 && <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>}
              {tabIndex != 2 && tabIndex != 4 && <CTableHeaderCell scope="col">Print</CTableHeaderCell>}
              {tabIndex === 2 && <CTableHeaderCell scope="col">Note</CTableHeaderCell>}
              {showActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {records.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={tabIndex === 2 || tabIndex === 3 || tabIndex === 4 ? 16 : 15} style={{ color: 'red', textAlign: 'center' }}>
                  No booking available
                </CTableDataCell>
              </CTableRow>
            ) : (
              records.map((booking, index) => (
                <CTableRow key={index}>
                  {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{index + 1}</CTableDataCell>}
                  <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{booking.model.model_name || booking.model.name || ''}</CTableDataCell>
                  {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.model.type}</CTableDataCell>}
                  <CTableDataCell>{booking.color?.name || ''}</CTableDataCell>
                  <CTableDataCell>{booking.customerDetails.name || ''}</CTableDataCell>
                  {tabIndex != 2 && tabIndex != 4 && <CTableDataCell>{booking.customerDetails.mobile1 || ''}</CTableDataCell>}
                  {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
                    <CTableDataCell>
                      {booking.payment.type === 'FINANCE' && (
                        <CButton 
                          size="sm" 
                          className="view-button"
                          onClick={() => handlePrint(booking.id)}
                        >
                          Print
                        </CButton>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
                    <CTableDataCell>
                      {booking.payment.type === 'FINANCE' && (
                        <>
                          {booking.documentStatus.financeLetter.status === 'NOT_UPLOADED' ||
                          booking.documentStatus.financeLetter.status === 'REJECTED' ? (
                            <Link
                              to={`/upload-finance/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails.name,
                                address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                              }}
                            >
                              <CButton size="sm" className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </CButton>
                            </Link>
                          ) : null}
                          {booking.documentStatus.financeLetter.status !== 'NOT_UPLOADED' && (
                            <span className={`status-badge ${booking.documentStatus.financeLetter.status.toLowerCase()}`}>
                              {booking.documentStatus.financeLetter.status}
                            </span>
                          )}
                        </>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex != 2 && tabIndex != 4 && (
                    <CTableDataCell>
                      {booking.documentStatus.kyc.status === 'NOT_UPLOADED' ? (
                        <Link
                          to={`/upload-kyc/${booking.id}`}
                          state={{
                            bookingId: booking.id,
                            customerName: booking.customerDetails.name,
                            address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                          }}
                        >
                          <CButton size="sm" className="upload-kyc-btn icon-only">
                            <CIcon icon={cilCloudUpload} />
                          </CButton>
                        </Link>
                      ) : (
                        <div className="d-flex align-items-center">
                          <span className={`status-badge ${booking.documentStatus.kyc.status.toLowerCase()}`}>
                            {booking.documentStatus.kyc.status}
                          </span>
                          {booking.documentStatus.kyc.status === 'REJECTED' && (
                            <Link
                              to={`/upload-kyc/${booking.id}`}
                              state={{
                                bookingId: booking.id,
                                customerName: booking.customerDetails.name,
                                address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
                              }}
                              className="ms-2"
                            >
                              <button className="upload-kyc-btn icon-only">
                                <CIcon icon={cilCloudUpload} />
                              </button>
                            </Link>
                          )}
                        </div>
                      )}
                    </CTableDataCell>
                  )}
                  <CTableDataCell>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </CTableDataCell>
                  {tabIndex === 0 && (
                    <CTableDataCell>
                      <span className={`status-badge ${booking.updateRequestStatus.toLowerCase()}`}>
                        {booking.updateRequestStatus === 'NONE' ? '' : booking.updateRequestStatus || ''}
                      </span>
                    </CTableDataCell>
                  )}
                  {tabIndex === 2 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
                  {tabIndex === 2 && (
                    <CTableDataCell>
                      <span className={`status-text ${booking.status}`}>
                        {booking.claimDetails?.hasClaim ? (
                          <CIcon icon={cilCheckCircle} className="status-icon active-icon" />
                        ) : (
                          <CIcon icon={cilXCircle} className="status-icon inactive-icon" />
                        )}
                      </span>
                    </CTableDataCell>
                  )}
                  {tabIndex === 3 && <CTableDataCell>{booking.chassisNumber}</CTableDataCell>}
                  {tabIndex != 2 && tabIndex != 4 && (
                    <CTableDataCell>
                      {booking.formPath && (
                        <>
                          {userRole === 'SALES_EXECUTIVE' && booking.status === 'PENDING_APPROVAL (Discount_Exceeded)' ? (
                            <span className="awaiting-approval-text">Awaiting for Approval</span>
                          ) : (
                            <a href={`${config.baseURL}${booking.formPath}`} target="_blank" rel="noopener noreferrer">
                              <CButton size="sm" className="upload-kyc-btn icon-only">
                                <CIcon icon={cilPrint} />
                              </CButton>
                            </a>
                          )}
                        </>
                      )}
                    </CTableDataCell>
                  )}
                  {tabIndex === 2 && <CTableDataCell>{booking.note}</CTableDataCell>}
                  {showActionColumn && (
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        className='option-button btn-sm'
                        onClick={(event) => handleClick(event, booking.id)}
                      >
                        <CIcon icon={cilSettings} />
                        Options
                      </CButton>
                      <Menu 
  id={`action-menu-${booking.id}`} 
  anchorEl={anchorEl} 
  open={menuId === booking.id} 
  onClose={handleClose}
>
  {(hasViewPermission || hasActionPermission) && (
    <>
      <MenuItem onClick={() => handleViewBooking(booking.id)} style={{ color: 'black' }}>
        <CIcon icon={cilZoomOut} className="me-2" /> View Booking
      </MenuItem>
      {tabIndex === 0 && booking.updateRequestStatus == 'PENDING' && (
        <MenuItem onClick={() => handleViewAltrationRequest(booking)} style={{ color: 'black' }}>
          <CIcon icon={cilZoomOut} className="me-2" /> View Altration Req
        </MenuItem>
      )}
    </>
  )}

  {hasEditPermission && (
    <>
      {/* Add edit option to the menu - show for Rejected Discount tab (tabIndex === 4) */}
      {(tabIndex === 4) && (
        <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
          <MenuItem style={{ color: 'black' }}>
            <CIcon icon={cilPencil} className="me-2" /> Edit
          </MenuItem>
        </Link>
      )}
      {/* Keep existing edit logic for other tabs if needed */}
      {tabIndex != 2 && tabIndex != 3 && tabIndex != 4 && (
        <Link className="Link" to={`/booking-form/${booking.id}`} style={{ textDecoration: 'none' }}>
          <MenuItem style={{ color: 'black' }}>
            <CIcon icon={cilPencil} className="me-2" /> Edit
          </MenuItem>
        </Link>
      )}
    </>
  )}

  {hasDeletePermission && (
    <>
      {(tabIndex === 0 || tabIndex === 4) && (
        <MenuItem onClick={() => handleDelete(booking.id)} style={{ color: 'black' }}>
          <CIcon icon={cilTrash} className="me-2" /> Delete
        </MenuItem>
      )}
    </>
  )}

  {booking.payment.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status !== 'NOT_UPLOADED' && (
    <MenuItem onClick={() => handleViewFinanceLetter(booking._id)} style={{ color: 'black' }}>
      <CIcon icon={cilZoomOut} className="me-2" /> View Finance Letter
    </MenuItem>
  )}

  {hasKYCPermission && (
    <>
      {booking.documentStatus?.kyc?.status !== 'NOT_UPLOADED' && (
        <MenuItem onClick={() => handleViewKYC(booking.id)} style={{ color: 'black' }}>
          <CIcon icon={cilZoomOut} className="me-2" /> View KYC
        </MenuItem>
      )}
    </>
  )}

  {hasChassisAllocation && (
    <>
      {tabIndex === 1 &&
        booking.status === 'APPROVED' &&
        (booking.payment?.type === 'CASH' ||
          (booking.payment?.type === 'FINANCE' && booking.documentStatus?.financeLetter?.status == 'APPROVED')) && (
          <MenuItem onClick={() => handleAllocateChassis(booking.id)} style={{ color: 'black' }}>
            <CIcon icon={cilPencil} className="me-2" /> Allocate Chassis
          </MenuItem>
        )}
      {tabIndex === 3 && booking.status === 'ALLOCATED' && booking.chassisNumberChangeAllowed && (
        <MenuItem onClick={() => handleUpdateChassis(booking.id)} style={{ color: 'black' }}>
          <CIcon icon={cilPencil} className="me-2" /> Update Chassis
        </MenuItem>
      )}
    </>
  )}

  {hasChassisAllocation && tabIndex === 2 && booking.status === 'ON_HOLD' && (
    <>
      <MenuItem onClick={() => handleApproveChassis(booking.id)} style={{ color: 'green' }}>
        <CIcon icon={cilCheck} className="me-2" /> Approve Chassis
      </MenuItem>
      <MenuItem onClick={() => handleRejectChassis(booking.id)} style={{ color: 'red' }}>
        <CIcon icon={cilX} className="me-2" /> Reject Chassis
      </MenuItem>
    </>
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
    );
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
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Booking List</div>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasPermission('BOOKING', 'CREATE') && (
              <Link to="/new-booking">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> New Booking
                </CButton>
              </Link>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
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
                Pending Approvals
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
                Approved
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => handleTabChange(2)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Pending Allocated
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => handleTabChange(3)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Allocated
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 4}
                onClick={() => handleTabChange(4)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Rejected Discount
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 5}
                onClick={() => handleTabChange(5)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 5 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Cancelled Booking
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 6}
                onClick={() => handleTabChange(6)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 6 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Rejected Cancelled Booking
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeTab === 0) handlePendingFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 1) handleApprovedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 2) handlePendingAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 3) handleAllocatedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 4) handleRejectedFilter(e.target.value, getDefaultSearchFields('booking'));
                  else if (activeTab === 5) handleCancelledPendingFilter(e.target.value, ['customer.name', 'customer.phone']);
                  else handleCancelledRejectedFilter(e.target.value, ['customer.name', 'customer.phone']);
                }}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderBookingTable(pendingRecords, 0)}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderBookingTable(approvedRecords, 1)}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {renderBookingTable(pendingAllocatedRecords, 2)}
            </CTabPane>
            <CTabPane visible={activeTab === 3}>
              {renderBookingTable(allocatedRecords, 3)}
            </CTabPane>
            <CTabPane visible={activeTab === 4}>
              {renderBookingTable(rejectedRecords, 4)}
            </CTabPane>
            <CTabPane visible={activeTab === 5}>
              {cancelledLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                  <CSpinner color="primary" />
                </div>
              ) : (
                renderBookingTable(cancelledPendingRecords, 5)
              )}
            </CTabPane>
            <CTabPane visible={activeTab === 6}>
              {cancelledLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                  <CSpinner color="primary" />
                </div>
              ) : (
                renderBookingTable(cancelledRejectedRecords, 6)
              )}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      {/* Cancellation Approval Modal */}
      <CModal visible={cancelApprovalModal} onClose={() => setCancelApprovalModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {cancelApprovalAction === 'APPROVE' ? 'Approve Cancellation Request' : 'Reject Cancellation Request'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {cancelApprovalAction === 'APPROVE' ? (
            <>
              <div className="mb-3">
                <CFormLabel>Original Reason:</CFormLabel>
                <CFormInput
                  type="text"
                  value={selectedCancellationForApproval?.cancellationRequest?.reason || ''}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Edited Reason (Optional):</CFormLabel>
                <CFormTextarea
                  value={editedReason}
                  onChange={(e) => setEditedReason(e.target.value)}
                  rows={2}
                  placeholder="Enter edited reason if needed"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Cancellation Charges:</CFormLabel>
                <CFormInput
                  type="number"
                  value={cancellationCharges}
                  onChange={(e) => setCancellationCharges(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <CFormLabel>Rejection Reason:</CFormLabel>
                <CFormTextarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                  placeholder="Enter reason for rejection"
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Notes (Optional):</CFormLabel>
                <CFormTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter any additional notes"
                />
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            className={cancelApprovalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
            onClick={handleCancelActionSubmit}
            disabled={cancelActionLoading || (cancelApprovalAction === 'REJECT' && !rejectionReason.trim())}
          >
            {cancelActionLoading ? (
              <CSpinner size="sm" />
            ) : (
              cancelApprovalAction === 'APPROVE' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Chassis Approval Modal */}
      <CModal visible={chassisApprovalModal} onClose={() => setChassisApprovalModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {approvalAction === 'APPROVE' ? 'Approve Chassis Allocation' : 'Reject Chassis Allocation'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>
              {approvalAction === 'APPROVE' ? 'Approval Note:' : 'Rejection Note:'}
            </CFormLabel>
            <CFormTextarea
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              rows={3}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className={approvalAction === 'APPROVE' ? 'submit-button' : 'cancel-button'}
            onClick={handleChassisApprovalSubmit}
            disabled={approvalLoading}
          >
            {approvalLoading ? (
              <CSpinner size="sm" />
            ) : (
              approvalAction === 'APPROVE' ? 'Approve' : 'Reject'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      <ViewBooking open={viewModalVisible} onClose={() => setViewModalVisible(false)} booking={selectedBooking} refreshData={fetchData} />
      <KYCView
        open={kycModalVisible}
        onClose={() => {
          setKycModalVisible(false);
          setKycBookingId(null);
        }}
        kycData={kycData}
        refreshData={fetchData}
        bookingId={kycBookingId}
      />
      <FinanceView
        open={financeModalVisible}
        onClose={() => {
          setFinanceModalVisible(false);
          setFinanceBookingId(null);
        }}
        financeData={financeData}
        refreshData={fetchData}
        bookingId={financeBookingId}
      />
      <ChassisNumberModal
        show={showChassisModal}
        onClose={() => {
          setShowChassisModal(false);
          setIsUpdateChassis(false);
          setSelectedBookingForChassis(null);
        }}
        onSave={handleSaveChassisNumber}
        isLoading={chassisLoading}
        booking={allData.find((b) => b._id === selectedBookingForChassis)}
        isUpdate={isUpdateChassis}
      />
      <PrintModal
        show={printModalVisible}
        onClose={() => {
          setPrintModalVisible(false);
          setSelectedBookingForPrint(null);
        }}
        bookingId={selectedBookingForPrint}
      />
      <PendingUpdateDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        updateData={selectedUpdate}
        onApprove={(payload) => handleApproveUpdate(selectedUpdate._id, payload)}
        onReject={(payload) => handleRejectUpdate(selectedUpdate._id, payload)}
      />
    </div>
  );
};

export default BookingList;