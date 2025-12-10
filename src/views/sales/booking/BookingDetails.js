// import React, { useState } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CRow,
//   CCol,
//   CBadge,
//   CButton
// } from '@coreui/react';
// import {
//   FaCar,
//   FaUserTie,
//   FaMoneyBillWave,
//   FaCalendarAlt,
//   FaExchangeAlt,
//   FaFileAlt,
//   FaFileInvoiceDollar,
//   FaBuilding
// } from 'react-icons/fa';
// import '../../../css/bookingView.css';
// import '../../../css/form.css';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import config from '../../../config';
// import Swal from 'sweetalert2';
// import { showError, showSuccess } from '../../../utils/sweetAlerts';
// import axiosInstance from '../../../axiosInstance';
// import { cilCloudUpload } from '@coreui/icons';
// import CIcon from '@coreui/icons-react';
// import ApprovalFormModal from './ApprovalFormModal';
// import ChassisNumberModal from './ChassisModel';
// import { hasPermission } from '../../../utils/permissionUtils';

// const ViewBooking = ({ open, onClose, booking, refreshData }) => {
//   const [actionLoading, setActionLoading] = useState(false);
//   const [kycActionLoading, setKycActionLoading] = useState(false);
//   const [showApprovalModal, setShowApprovalModal] = useState(false);
//   const [currentAction, setCurrentAction] = useState(null);
//   const [showChassisModal, setShowChassisModal] = useState(false);
//   const [chassisLoading, setChassisLoading] = useState(false);
  
//   const userRole = localStorage.getItem('userRole');
//   const hasActionPermission = hasPermission('BOOKING', 'BOOKING_ACTIONS');

//   const handleActionClick = (action) => {
//     setCurrentAction(action);
//     setShowApprovalModal(true);
//   };

//   const handleKycStatusUpdate = async (status) => {
//     try {
//       setKycActionLoading(true);
//       const { value: verificationNote } = await Swal.fire({
//         title: `Enter verification note for KYC ${status}`,
//         input: 'text',
//         inputLabel: 'Verification Note',
//         inputPlaceholder: `${status} by admin`,
//         showCancelButton: true,
//         confirmButtonText: 'Submit',
//         cancelButtonText: 'Cancel',
//         inputValidator: (value) => {
//           if (!value) return 'Verification note is required!';
//         }
//       });

//       if (verificationNote) {
//         const kycId = booking.documentStatus?.kyc?.id;
//         if (!kycId) throw new Error('KYC ID not found');

//         await axiosInstance.post(`/kyc/${kycId}/verify`, {
//           status,
//           verificationNote
//         });

//         showSuccess(`KYC ${status.toLowerCase()} successfully!`);
//         refreshData();
//         onClose();
//       }
//     } catch (error) {
//       console.log(error);
//       showError(error.response?.data?.message || `Failed to update KYC status`);
//     } finally {
//       setKycActionLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (approvalNote) => {
//     try {
//       setActionLoading(true);
//       setShowApprovalModal(false);
  
//       const requestBody = {};
//       if (approvalNote && approvalNote.trim()) {
//         if (currentAction === 'reject') {
//           requestBody.rejectionNote = approvalNote.trim();
//         } else {
//           requestBody.approvalNote = approvalNote.trim();
//         }
//       }
  
//       let response;
//       if (currentAction === 'approve') {
//         response = await axiosInstance.put(`/bookings/${booking.id}/approve`, requestBody);
//       } else if (currentAction === 'reject') {
//         response = await axiosInstance.post(`/bookings/${booking.id}/reject`, requestBody);
//       } else {
//         response = await axiosInstance.post(`/bookings/${booking.id}/${currentAction}`, requestBody);
//       }
  
//       // Use API response message if available, otherwise fallback to static message
//       const successMessage = response?.data?.message || `Booking ${currentAction}d successfully!`;
      
//       // Show success message with red icon for rejections
//       if (currentAction === 'reject') {
//         Swal.fire({
//           title: 'Success!',
//           text: successMessage,
//           icon: 'success',
//           confirmButtonColor: '#d33',
//           iconColor: '#d33'
//         });
//       } else {
//         showSuccess(successMessage);
//       }
      
//       refreshData();
//       onClose();
//     } catch (error) {
//       console.log('Error updating status:', error);
//       showError(error.response?.data?.message || `Failed to ${currentAction} booking`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleChassisAllocation = async (chassisNumber) => {
//     try {
//       setChassisLoading(true);
//       setShowChassisModal(false);

//       await axiosInstance.put(`/bookings/${booking.id}/chassis-number`, {
//         chassisNumber: chassisNumber.trim()
//       });

//       showSuccess('Chassis number allocated successfully!');
//       refreshData();
//     } catch (error) {
//       console.error('Error allocating chassis number:', error);
//       showError(error.response?.data?.message || 'Failed to allocate chassis number');
//     } finally {
//       setChassisLoading(false);
//     }
//   };

//   const renderStatusBadge = () => {
//     const statusStyles = {
//       DRAFT: { backgroundColor: '#f3f4f6', color: '#1f2937' },
//       PENDING_APPROVAL: { backgroundColor: '#dbeafe', color: '#1e40af' },
//       'PENDING_APPROVAL (Discount_Exceeded)': { backgroundColor: '#dbeafe', color: '#1e40af' },
//       APPROVED: { backgroundColor: '#dcfce7', color: '#166534' },
//       REJECTED: { backgroundColor: '#fee2e2', color: '#991b1b' },
//       COMPLETED: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
//       CANCELLED: { backgroundColor: '#fef9c3', color: '#854d0e' },
//       ON_HOLD: { backgroundColor: '#fff7ed', color: '#9a3412' },
//       ALLOCATED: { backgroundColor: '#f0f9ff', color: '#0c4a6e' },
//       default: { backgroundColor: '#e5e7eb', color: '#374151' }
//     };

//     const style = statusStyles[booking?.status] || statusStyles.default;

//     return (
//       <CBadge style={style} className="status-badge">
//         {booking?.status?.replace(/_/g, ' ')}
//       </CBadge>
//     );
//   };

//   const renderDocumentStatus = (status, type) => {
//     if (!status || status === 'NOT_UPLOADED' || status === 'REJECTED' || status === 'NOT_SUBMITTED') {
//       return (
//         <div className="d-flex align-items-center">
//           <CBadge color="secondary" className="me-2">
//             {status || 'Not Uploaded'}
//           </CBadge>
//           <Link
//             to={`/upload-${type}/${booking.id}`}
//             state={{
//               bookingId: booking.id,
//               customerName: booking.customerDetails.name,
//               address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
//             }}
//           >
//             <CButton color="primary" size="sm" className="upload-kyc-btn icon-only">
//               <CIcon icon={cilCloudUpload} className="me-1" />
//             </CButton>
//           </Link>
//         </div>
//       );
//     }
//     if (status === 'PENDING') {
//       return <CBadge color="warning">PENDING</CBadge>;
//     }

//     if (status === 'APPROVED') {
//       return <CBadge color="success">APPROVED</CBadge>;
//     }
//     return <CBadge color="secondary">{status}</CBadge>;
//   };

//   const shouldShowAwaitingApproval = () => {
//     return userRole === 'SALES_EXECUTIVE' && booking?.status === 'PENDING_APPROVAL (Discount_Exceeded)';
//   };

//   const shouldShowApproveRejectButtons = () => {
//     return hasActionPermission && 
//            (booking?.status === 'PENDING_APPROVAL' || booking?.status === 'PENDING_APPROVAL (Discount_Exceeded)');
//   };

//   if (!booking) {
//     return (
//       <CModal visible={open} onClose={onClose} size="xl">
//         <CModalHeader>
//           <CModalTitle>Loading Booking Details...</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="text-center py-4">Loading booking information...</div>
//         </CModalBody>
//         <CModalFooter>
//           <button className="btn btn-secondary" onClick={onClose}>
//             Close
//           </button>
//         </CModalFooter>
//       </CModal>
//     );
//   }

//   const renderPriceComponents = () => {
//     return booking.priceComponents.map((component, index) => (
//       <div key={index} className="detail-row">
//         <span className="detail-label">{component.header.header_key || ''}:</span>
//         <span className="detail-value">
//           ₹{Math.round(component.discountedValue)}
//           {component.originalValue !== component.discountedValue && (
//             <span className="text-muted" style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
//               ₹{Math.round(component.originalValue)}
//             </span>
//           )}
//         </span>
//       </div>
//     ));
//   };

//   const renderAccessories = () => {
//     if (!booking.accessories || booking.accessories.length === 0) {
//       return <span>None</span>;
//     }

//     return (
//       <div className="accessories-list">
//         {booking.accessories.map((item, index) => (
//           <div key={index} className="accessory-item">
//             {item.accessory ? (
//               <>
//                 <span className="accessory-name">{item.accessory.name}</span>
//                 <span className="accessory-price">₹{item.price}</span>
//               </>
//             ) : (
//               <span className="accessory-name">Custom Item: ₹{item.price}</span>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderClaimDocuments = () => {
//     if (!booking.claimDetails?.hasClaim) {
//       return null;
//     }

//     return (
//       <CCard className="booking-section">
//         <CCardHeader>
//           <h5>Claim Details</h5>
//         </CCardHeader>
//         <CCardBody>
//           <div className="detail-row">
//             <span className="detail-label">Claim Amount:</span>
//             <span className="detail-value">₹{booking.claimDetails.priceClaim}</span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Description:</span>
//             <span className="detail-value">{booking.claimDetails.description}</span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Documents:</span>
//             <div className="documents-grid">
//               {booking.claimDetails.documents.map((doc, index) => (
//                 <div key={index} className="document-item">
//                   <img src={`${config.baseURL}/uploads/${doc.path}`} target="_blank" rel="noopener noreferrer" className="document-link" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CCardBody>
//       </CCard>
//     );
//   };

//   return (
//     <>
//       {open && <div className="modal-overlay" onClick={onClose} />}
//       <CModal visible={open} onClose={onClose} size="xl">
//         <CModalHeader>
//           <CModalTitle>Booking- {booking.bookingNumber}</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {booking && (
//             <div className="booking-details-container">
//               <CCard className="booking-header-section">
//                 <CCardBody>
//                   <CRow>
//                     <CCol md={8}>
//                       <h3 className="booking-title">
//                         {booking.model.model_name} ({booking.model.type})
//                       </h3>
//                       <div className="booking-meta">
//                         <div className="meta-item">
//                           <FaCalendarAlt className="meta-icon" />
//                           <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
//                         </div>
//                         <div className="meta-item">
//                           <FaBuilding className="meta-icon" />
//                           <span>{booking?.branch?.name || ''}</span>
//                         </div>
//                         <div className="meta-item">
//                           <span className="status-display">Status: {renderStatusBadge()}</span>
//                         </div>
//                       </div>
//                     </CCol>
//                     <CCol md={4} className="text-end">
//                       <div className="booking-amount">
//                         <div className="amount-label">Total Amount</div>
//                         <div className="amount-value">₹{booking.totalAmount}</div>
//                         {booking.discountedAmount !== booking.totalAmount && (
//                           <div className="discounted-amount">After Discount: ₹{booking.discountedAmount}</div>
//                         )}
//                       </div>
//                     </CCol>
//                   </CRow>
//                 </CCardBody>
//               </CCard>

//               <div className="booking-details-grid">
//                 <div className="details-column">
//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaCar /> Vehicle Information
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">Model:</span>
//                         <span className="detail-value">{booking.model.model_name}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Type:</span>
//                         <span className="detail-value">{booking.model.type}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Color:</span>
//                         <span className="detail-value">{booking.color?.name || ''}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Customer Type:</span>
//                         <span className="detail-value">{booking.customerType}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">RTO:</span>
//                         <span className="detail-value">{booking.rto}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">RTO Amount:</span>
//                         <span className="detail-value">₹{booking.rtoAmount}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">HPA:</span>
//                         <span className="detail-value">
//                           {booking.hpa ? 'Yes' : 'No'}
//                         </span>
//                       </div>
//                     </CCardBody>
//                   </CCard>

//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaUserTie /> Customer Information
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">Name:</span>
//                         <span className="detail-value">
//                           {booking.customerDetails.salutation} {booking.customerDetails.name}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Address:</span>
//                         <span className="detail-value">
//                           {booking.customerDetails.address}, {booking.customerDetails.taluka},{booking.customerDetails.district},{' '}
//                           {booking.customerDetails.pincode}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Contact:</span>
//                         <span className="detail-value">
//                           {booking.customerDetails.mobile1}
//                           {booking.customerDetails.mobile2 && ` / ${booking.customerDetails.mobile2}`}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">PAN:</span>
//                         <span className="detail-value">{booking.customerDetails.panNo || 'N/A'}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Aadhar:</span>
//                         <span className="detail-value">{booking.customerDetails.aadharNumber || 'N/A'}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">DOB:</span>
//                         <span className="detail-value">
//                           {booking.customerDetails.dob ? new Date(booking.customerDetails.dob).toLocaleDateString() : 'N/A'}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Occupation:</span>
//                         <span className="detail-value">{booking.customerDetails.occupation || 'N/A'}</span>
//                       </div>
//                     </CCardBody>
//                   </CCard>
//                 </div>

//                 <div className="details-column">
//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaMoneyBillWave /> Financial Details
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">Payment Type:</span>
//                         <span className="detail-value">{booking.payment.type}</span>
//                       </div>

//                       {booking.payment.type === 'FINANCE' && (
//                         <>
//                           <div className="detail-row">
//                             <span className="detail-label">Financer:</span>
//                             <span className="detail-value">{booking.payment?.financer?.name || ''}</span>
//                           </div>
//                           <div className="detail-row">
//                             <span className="detail-label">GC Amount:</span>
//                             <span className="detail-value">₹{booking.payment.gcAmount || '0'}</span>
//                           </div>
//                           <div className="detail-row">
//                             <span className="detail-label">Scheme:</span>
//                             <span className="detail-value">{booking.payment.scheme}</span>
//                           </div>
//                           <div className="detail-row">
//                             <span className="detail-label">EMI Plan:</span>
//                             <span className="detail-value">{booking.payment.emiPlan}</span>
//                           </div>
//                         </>
//                       )}

//                       <div className="detail-row">
//                         <span className="detail-label">Accessories Total:</span>
//                         <span className="detail-value">₹{booking.accessoriesTotal}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">RTO Amount:</span>
//                         <span className="detail-value">₹{booking.rtoAmount}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Total Amount:</span>
//                         <span className="detail-value">₹{booking.totalAmount}</span>
//                       </div>
//                       {booking.discountedAmount !== booking.totalAmount && (
//                         <div className="detail-row">
//                           <span className="detail-label">Discounted Amount:</span>
//                           <span className="detail-value">₹{booking.discountedAmount}</span>
//                         </div>
//                       )}
//                     </CCardBody>
//                   </CCard>

//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaFileInvoiceDollar /> Price Components
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>{renderPriceComponents()}</CCardBody>
//                   </CCard>
//                 </div>
//                 <div className="details-column">
//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaFileAlt /> Document Status
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">KYC:</span>
//                         <span className="detail-value">{renderDocumentStatus(booking.kycStatus, 'kyc')}</span>
//                       </div>
//                       {booking.payment.type === 'FINANCE' && (
//                         <div className="detail-row">
//                           <span className="detail-label">Finance Letter:</span>
//                           <span className="detail-value">{renderDocumentStatus(booking.financeLetterStatus, 'finance')}</span>
//                         </div>
//                       )}
//                       <div className="detail-row">
//                         <span className="detail-label">Booking Form:</span>
//                         <span className="detail-value">
//                           {booking.formGenerated ? (
//                             <>
//                               {shouldShowAwaitingApproval() ? (
//                                 <span className="awaiting-approval-text">Awaiting for Approval</span>
//                               ) : (
//                                 <a
//                                   href={`${config.baseURL}${booking.formPath}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="form-link"
//                                 >
//                                   VIEW
//                                 </a>
//                               )}
//                             </>
//                           ) : (
//                             <span>Not Generated</span>
//                           )}
//                         </span>
//                       </div>
//                     </CCardBody>
//                   </CCard>

//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaUserTie /> Sales Information
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">Sales Executive:</span>
//                         <span className="detail-value">{booking.salesExecutive ? booking.salesExecutive.name : 'N/A'}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Created By:</span>
//                         <span className="detail-value">{booking.createdBy.name}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Created At:</span>
//                         <span className="detail-value">{new Date(booking.createdAt).toLocaleString()}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Last Updated:</span>
//                         <span className="detail-value">{new Date(booking.updatedAt).toLocaleString()}</span>
//                       </div>
//                     </CCardBody>
//                   </CCard>

//                   <CCard className="booking-section">
//                     <CCardHeader>
//                       <h5>
//                         <FaExchangeAlt /> Exchange Information
//                       </h5>
//                     </CCardHeader>
//                     <CCardBody>
//                       <div className="detail-row">
//                         <span className="detail-label">Exchange:</span>
//                         <span className="detail-value">{booking.exchange ? 'Yes' : 'No'}</span>
//                       </div>

//                       {booking.exchange && (
//                         <>
//                           <div className="detail-row">
//                             <span className="detail-label">Vehicle Number:</span>
//                             <span className="detail-value">{booking.exchangeDetails.vehicleNumber}</span>
//                           </div>
//                           <div className="detail-row">
//                             <span className="detail-label">Chassis Number:</span>
//                             <span className="detail-value">{booking.exchangeDetails.chassisNumber}</span>
//                           </div>
//                           <div className="detail-row">
//                             <span className="detail-label">Price:</span>
//                             <span className="detail-value">₹{booking.exchangeDetails.price}</span>
//                           </div>
//                           {booking.exchangeDetails.broker && (
//                             <div className="detail-row">
//                               <span className="detail-label">Broker:</span>
//                               <span className="detail-value">{booking.exchangeDetails.broker.name}</span>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </CCardBody>
//                   </CCard>
//                 </div>
//               </div>
//               <CCard className="booking-section">
//                 <CCardHeader>
//                   <h5>
//                     <FaCar /> Accessories
//                   </h5>
//                 </CCardHeader>
//                 <CCardBody>{renderAccessories()}</CCardBody>
//               </CCard>
//               {renderClaimDocuments()}
//             </div>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <div className="d-flex justify-content-between w-100">
//             <div>
//               {shouldShowApproveRejectButtons() && (
//                 <>
//                   <button className="btn btn-success me-2" onClick={() => handleActionClick('approve')} disabled={actionLoading}>
//                     {actionLoading ? 'Approving...' : 'Approve'}
//                   </button>
//                   <button className="btn btn-danger me-2" onClick={() => handleActionClick('reject')} disabled={actionLoading}>
//                     {actionLoading ? 'Rejecting...' : 'Reject'}
//                   </button>
//                 </>
//               )}

//               {booking?.documentStatus?.kyc?.status === 'PENDING' && (
//                 <>
//                   <button className="btn btn-success me-2" onClick={() => handleKycStatusUpdate('APPROVED')} disabled={kycActionLoading}>
//                     {kycActionLoading ? 'Verifying KYC...' : 'Verify KYC'}
//                   </button>
//                   <button className="btn btn-danger me-2" onClick={() => handleKycStatusUpdate('REJECTED')} disabled={kycActionLoading}>
//                     {kycActionLoading ? 'Rejecting KYC...' : 'Reject KYC'}
//                   </button>
//                 </>
//               )}
//             </div>
//             <div>
//               <Link to={`/booking-form/${booking.id}`} style={{textDecoration:'none'}} className="submit-button me-1">
//                 Edit
//               </Link>
//               <button className="btn btn-secondary" onClick={onClose}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </CModalFooter>
//       </CModal>
//       <ApprovalFormModal
//         show={showApprovalModal}
//         onClose={() => setShowApprovalModal(false)}
//         onApprove={handleStatusUpdate}
//         actionType={currentAction}
//         isLoading={actionLoading}
//       />
//       <ChassisNumberModal
//         show={showChassisModal}
//         onClose={() => setShowChassisModal(false)}
//         onSave={handleChassisAllocation}
//         isLoading={chassisLoading}
//       />
//     </>
//   );
// };

// ViewBooking.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   booking: PropTypes.shape({
//     id: PropTypes.string,
//     bookingNumber: PropTypes.string,
//     model: PropTypes.shape({
//       model_name: PropTypes.string,
//       type: PropTypes.string
//     }),
//     color: PropTypes.shape({
//       name: PropTypes.string
//     }),
//     branch: PropTypes.shape({
//       name: PropTypes.string
//     }),
//     customerType: PropTypes.string,
//     rto: PropTypes.string,
//     rtoAmount: PropTypes.number,
//     hpa: PropTypes.bool,
//     hypothecationCharges: PropTypes.number,
//     exchange: PropTypes.bool,
//     exchangeDetails: PropTypes.shape({
//       vehicleNumber: PropTypes.string,
//       chassisNumber: PropTypes.string,
//       price: PropTypes.number,
//       broker: PropTypes.shape({
//         name: PropTypes.string
//       })
//     }),
//     payment: PropTypes.shape({
//       type: PropTypes.string,
//       financer: PropTypes.shape({
//         name: PropTypes.string
//       }),
//       scheme: PropTypes.string,
//       emiPlan: PropTypes.string
//     }),
//     accessories: PropTypes.arrayOf(
//       PropTypes.shape({
//         accessory: PropTypes.shape({
//           name: PropTypes.string
//         }),
//         price: PropTypes.number
//       })
//     ),
//     priceComponents: PropTypes.arrayOf(
//       PropTypes.shape({
//         header: PropTypes.shape({
//           header_key: PropTypes.string
//         }),
//         originalValue: PropTypes.number,
//         discountedValue: PropTypes.number
//       })
//     ),
//     discounts: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number,
//         type: PropTypes.string
//       })
//     ),
//     accessoriesTotal: PropTypes.number,
//     totalAmount: PropTypes.number,
//     discountedAmount: PropTypes.number,
//     status: PropTypes.string,
//     createdAt: PropTypes.string,
//     updatedAt: PropTypes.string,
//     createdBy: PropTypes.shape({
//       name: PropTypes.string
//     }),
//     salesExecutive: PropTypes.shape({
//       name: PropTypes.string
//     }),
//     formPath: PropTypes.string,
//     formGenerated: PropTypes.bool,
//     documentStatus: PropTypes.shape({
//       kyc: PropTypes.shape({
//         status: PropTypes.string
//       }),
//       financeLetter: PropTypes.shape({
//         status: PropTypes.string
//       })
//     }),
//     customerDetails: PropTypes.shape({
//       salutation: PropTypes.string,
//       name: PropTypes.string,
//       panNo: PropTypes.string,
//       dob: PropTypes.string,
//       occupation: PropTypes.string,
//       address: PropTypes.string,
//       taluka: PropTypes.string,
//       district: PropTypes.string,
//       pincode: PropTypes.string,
//       mobile1: PropTypes.string,
//       mobile2: PropTypes.string,
//       aadharNumber: PropTypes.string
//     })
//   }),
//   refreshData: PropTypes.func
// };

// export default ViewBooking;





import React, { useState } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CBadge,
  CButton
} from '@coreui/react';
import {
  FaCar,
  FaUserTie,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExchangeAlt,
  FaFileAlt,
  FaFileInvoiceDollar,
  FaBuilding,
  FaStickyNote,
  FaTag
} from 'react-icons/fa';
import '../../../css/bookingView.css';
import '../../../css/form.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import config from '../../../config';
import Swal from 'sweetalert2';
import { showError, showSuccess } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import { cilCloudUpload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ApprovalFormModal from './ApprovalFormModal';
import ChassisNumberModal from './ChassisModel';
import { hasPermission } from '../../../utils/permissionUtils';

const ViewBooking = ({ open, onClose, booking, refreshData }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [showChassisModal, setShowChassisModal] = useState(false);
  const [chassisLoading, setChassisLoading] = useState(false);
  
  const userRole = localStorage.getItem('userRole');
  const hasActionPermission = hasPermission('BOOKING', 'BOOKING_ACTIONS');

  const handleActionClick = (action) => {
    setCurrentAction(action);
    setShowApprovalModal(true);
  };

  const handleCancelBooking = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Cancel Booking',
        html: `
          <input id="swal-reason" class="swal2-input" placeholder="Reason for cancellation" required>
          <input id="swal-charges" class="swal2-input" placeholder="Cancellation charges (optional)" type="number" min="0">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cancel Booking',
        cancelButtonText: 'Go Back',
        confirmButtonColor: '#d33',
        preConfirm: () => {
          const reason = document.getElementById('swal-reason').value.trim();
          const charges = document.getElementById('swal-charges').value;
          
          if (!reason) {
            Swal.showValidationMessage('Please enter a reason for cancellation');
            return false;
          }
          
          return {
            reason,
            cancellationCharges: charges ? parseInt(charges) : 0
          };
        }
      });

      if (formValues) {
        setCancelLoading(true);
        
        await axiosInstance.post(`/bookings/${booking.id}/cancel`, {
          reason: formValues.reason,
          cancellationCharges: formValues.cancellationCharges
        });

        showSuccess('Booking cancelled successfully!');
        refreshData();
        onClose();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showError(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleKycStatusUpdate = async (status) => {
    try {
      setKycActionLoading(true);
      const { value: verificationNote } = await Swal.fire({
        title: `Enter verification note for KYC ${status}`,
        input: 'text',
        inputLabel: 'Verification Note',
        inputPlaceholder: `${status} by admin`,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) return 'Verification note is required!';
        }
      });

      if (verificationNote) {
        const kycId = booking.documentStatus?.kyc?.id;
        if (!kycId) throw new Error('KYC ID not found');

        await axiosInstance.post(`/kyc/${kycId}/verify`, {
          status,
          verificationNote
        });

        showSuccess(`KYC ${status.toLowerCase()} successfully!`);
        refreshData();
        onClose();
      }
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || `Failed to update KYC status`);
    } finally {
      setKycActionLoading(false);
    }
  };

  const handleStatusUpdate = async (approvalNote) => {
    try {
      setActionLoading(true);
      setShowApprovalModal(false);
  
      const requestBody = {};
      if (approvalNote && approvalNote.trim()) {
        if (currentAction === 'reject') {
          requestBody.rejectionNote = approvalNote.trim();
        } else {
          requestBody.approvalNote = approvalNote.trim();
        }
      }
  
      let response;
      if (currentAction === 'approve') {
        response = await axiosInstance.put(`/bookings/${booking.id}/approve`, requestBody);
      } else if (currentAction === 'reject') {
        response = await axiosInstance.post(`/bookings/${booking.id}/reject`, requestBody);
      } else {
        response = await axiosInstance.post(`/bookings/${booking.id}/${currentAction}`, requestBody);
      }
  
      const successMessage = response?.data?.message || `Booking ${currentAction}d successfully!`;
      
      if (currentAction === 'reject') {
        Swal.fire({
          title: 'Success!',
          text: successMessage,
          icon: 'success',
          confirmButtonColor: '#d33',
          iconColor: '#d33'
        });
      } else {
        showSuccess(successMessage);
      }
      
      refreshData();
      onClose();
    } catch (error) {
      console.log('Error updating status:', error);
      showError(error.response?.data?.message || `Failed to ${currentAction} booking`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChassisAllocation = async (chassisNumber) => {
    try {
      setChassisLoading(true);
      setShowChassisModal(false);

      await axiosInstance.put(`/bookings/${booking.id}/chassis-number`, {
        chassisNumber: chassisNumber.trim()
      });

      showSuccess('Chassis number allocated successfully!');
      refreshData();
    } catch (error) {
      console.error('Error allocating chassis number:', error);
      showError(error.response?.data?.message || 'Failed to allocate chassis number');
    } finally {
      setChassisLoading(false);
    }
  };

  const renderStatusBadge = () => {
    const statusStyles = {
      DRAFT: { backgroundColor: '#f3f4f6', color: '#1f2937' },
      PENDING_APPROVAL: { backgroundColor: '#dbeafe', color: '#1e40af' },
      'PENDING_APPROVAL (Discount_Exceeded)': { backgroundColor: '#dbeafe', color: '#1e40af' },
      APPROVED: { backgroundColor: '#dcfce7', color: '#166534' },
      REJECTED: { backgroundColor: '#fee2e2', color: '#991b1b' },
      COMPLETED: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
      CANCELLED: { backgroundColor: '#fef9c3', color: '#854d0e' },
      ON_HOLD: { backgroundColor: '#fff7ed', color: '#9a3412' },
      ALLOCATED: { backgroundColor: '#f0f9ff', color: '#0c4a6e' },
      default: { backgroundColor: '#e5e7eb', color: '#374151' }
    };

    const style = statusStyles[booking?.status] || statusStyles.default;

    return (
      <CBadge style={style} className="status-badge">
        {booking?.status?.replace(/_/g, ' ')}
      </CBadge>
    );
  };

  const renderDocumentStatus = (status, type) => {
    if (!status || status === 'NOT_UPLOADED' || status === 'REJECTED' || status === 'NOT_SUBMITTED') {
      return (
        <div className="d-flex align-items-center">
          <CBadge color="secondary" className="me-2">
            {status || 'Not Uploaded'}
          </CBadge>
          <Link
            to={`/upload-${type}/${booking.id}`}
            state={{
              bookingId: booking.id,
              customerName: booking.customerDetails.name,
              address: `${booking.customerDetails.address}, ${booking.customerDetails.taluka}, ${booking.customerDetails.district}, ${booking.customerDetails.pincode}`
            }}
          >
            <CButton color="primary" size="sm" className="upload-kyc-btn icon-only">
              <CIcon icon={cilCloudUpload} className="me-1" />
            </CButton>
          </Link>
        </div>
      );
    }
    if (status === 'PENDING') {
      return <CBadge color="warning">PENDING</CBadge>;
    }

    if (status === 'APPROVED') {
      return <CBadge color="success">APPROVED</CBadge>;
    }
    return <CBadge color="secondary">{status}</CBadge>;
  };

  const shouldShowAwaitingApproval = () => {
    return userRole === 'SALES_EXECUTIVE' && booking?.status === 'PENDING_APPROVAL (Discount_Exceeded)';
  };

  const shouldShowApproveRejectButtons = () => {
    return hasActionPermission && 
           (booking?.status === 'PENDING_APPROVAL' || booking?.status === 'PENDING_APPROVAL (Discount_Exceeded)');
  };

  const shouldShowCancelButton = () => {
    return hasActionPermission && 
           booking?.status !== 'CANCELLED' && 
           booking?.status !== 'COMPLETED' && 
           booking?.status !== 'REJECTED';
  };

  // Function to render verticles with names from verticlesSummary.list
  const renderVerticles = () => {
    // First check if we have verticlesSummary with names
    if (booking.verticlesSummary?.list && booking.verticlesSummary.list.length > 0) {
      return (
        <div className="verticles-container">
          {booking.verticlesSummary.list.map((verticle, index) => (
            <CBadge key={index} color="info" className="me-2 mb-1">
              {verticle.name}
            </CBadge>
          ))}
        </div>
      );
    }
    
    // Fallback to original verticles array if verticlesSummary doesn't exist
    if (!booking.verticles || booking.verticles.length === 0) {
      return <span className="detail-value">No verticles assigned</span>;
    }

    // Handle case where verticles might contain objects or strings
    return (
      <div className="verticles-container">
        {booking.verticles.map((verticle, index) => {
          const verticleName = verticle.name || verticle;
          return (
            <CBadge key={index} color="info" className="me-2 mb-1">
              {verticleName}
            </CBadge>
          );
        })}
      </div>
    );
  };

  if (!booking) {
    return (
      <CModal visible={open} onClose={onClose} size="xl">
        <CModalHeader>
          <CModalTitle>Loading Booking Details...</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center py-4">Loading booking information...</div>
        </CModalBody>
        <CModalFooter>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </CModalFooter>
      </CModal>
    );
  }

  const renderPriceComponents = () => {
    return booking.priceComponents.map((component, index) => (
      <div key={index} className="detail-row">
        <span className="detail-label">{component.header.header_key || ''}:</span>
        <span className="detail-value">
          ₹{Math.round(component.discountedValue)}
          {component.originalValue !== component.discountedValue && (
            <span className="text-muted" style={{ textDecoration: 'line-through', marginLeft: '8px' }}>
              ₹{Math.round(component.originalValue)}
            </span>
          )}
        </span>
      </div>
    ));
  };

  const renderAccessories = () => {
    if (!booking.accessories || booking.accessories.length === 0) {
      return <span>None</span>;
    }

    return (
      <div className="accessories-list">
        {booking.accessories.map((item, index) => (
          <div key={index} className="accessory-item">
            {item.accessory ? (
              <>
                <span className="accessory-name">{item.accessory.name}</span>
                <span className="accessory-price">₹{item.price}</span>
              </>
            ) : (
              <span className="accessory-name">Custom Item: ₹{item.price}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderClaimDocuments = () => {
    if (!booking.claimDetails?.hasClaim) {
      return null;
    }

    return (
      <CCard className="booking-section">
        <CCardHeader>
          <h5>Claim Details</h5>
        </CCardHeader>
        <CCardBody>
          <div className="detail-row">
            <span className="detail-label">Claim Amount:</span>
            <span className="detail-value">₹{booking.claimDetails.priceClaim}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{booking.claimDetails.description}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Documents:</span>
            <div className="documents-grid">
              {booking.claimDetails.documents.map((doc, index) => (
                <div key={index} className="document-item">
                  <img src={`${config.baseURL}/uploads/${doc.path}`} target="_blank" rel="noopener noreferrer" className="document-link" />
                </div>
              ))}
            </div>
          </div>
        </CCardBody>
      </CCard>
    );
  };

  return (
    <>
      {open && <div className="modal-overlay" onClick={onClose} />}
      <CModal visible={open} onClose={onClose} size="xl">
        <CModalHeader>
          <CModalTitle>Booking- {booking.bookingNumber}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {booking && (
            <div className="booking-details-container">
              <CCard className="booking-header-section">
                <CCardBody>
                  <CRow>
                    <CCol md={8}>
                      <h3 className="booking-title">
                        {booking.model.model_name} ({booking.model.type})
                      </h3>
                      <div className="booking-meta">
                        <div className="meta-item">
                          <FaCalendarAlt className="meta-icon" />
                          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item">
                          <FaBuilding className="meta-icon" />
                          <span>{booking?.branch?.name || ''}</span>
                        </div>
                        <div className="meta-item">
                          <span className="status-display">Status: {renderStatusBadge()}</span>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={4} className="text-end">
                      <div className="booking-amount">
                        <div className="amount-label">Total Amount</div>
                        <div className="amount-value">₹{booking.totalAmount}</div>
                        {booking.discountedAmount !== booking.totalAmount && (
                          <div className="discounted-amount">After Discount: ₹{booking.discountedAmount}</div>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              {/* Verticles Section */}
              {((booking.verticlesSummary?.list && booking.verticlesSummary.list.length > 0) || 
                (booking.verticles && booking.verticles.length > 0)) && (
                <CCard className="booking-section mb-3">
                  <CCardHeader>
                    <h5>
                      <FaTag /> Verticles
                    </h5>
                  </CCardHeader>
                  <CCardBody>
                    <div className="detail-row">
                      <span className="detail-label">Verticles:</span>
                      {renderVerticles()}
                    </div>
                  </CCardBody>
                </CCard>
              )}

              <div className="booking-details-grid">
                <div className="details-column">
                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaCar /> Vehicle Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">Model:</span>
                        <span className="detail-value">{booking.model.model_name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{booking.model.type}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Color:</span>
                        <span className="detail-value">{booking.color?.name || ''}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Customer Type:</span>
                        <span className="detail-value">{booking.customerType}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">RTO:</span>
                        <span className="detail-value">{booking.rto}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">RTO Amount:</span>
                        <span className="detail-value">₹{booking.rtoAmount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">HPA:</span>
                        <span className="detail-value">
                          {booking.hpa ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaUserTie /> Customer Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">
                          {booking.customerDetails.salutation} {booking.customerDetails.name}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">
                          {booking.customerDetails.address}, {booking.customerDetails.taluka},{booking.customerDetails.district},{' '}
                          {booking.customerDetails.pincode}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">
                          {booking.customerDetails.mobile1}
                          {booking.customerDetails.mobile2 && ` / ${booking.customerDetails.mobile2}`}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">PAN:</span>
                        <span className="detail-value">{booking.customerDetails.panNo || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Aadhar:</span>
                        <span className="detail-value">{booking.customerDetails.aadharNumber || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">DOB:</span>
                        <span className="detail-value">
                          {booking.customerDetails.dob ? new Date(booking.customerDetails.dob).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Occupation:</span>
                        <span className="detail-value">{booking.customerDetails.occupation || 'N/A'}</span>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>

                <div className="details-column">
                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaMoneyBillWave /> Financial Details
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">Payment Type:</span>
                        <span className="detail-value">{booking.payment.type}</span>
                      </div>

                      {booking.payment.type === 'FINANCE' && (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Financer:</span>
                            <span className="detail-value">{booking.payment?.financer?.name || ''}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">GC Amount:</span>
                            <span className="detail-value">₹{booking.payment.gcAmount || '0'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Scheme:</span>
                            <span className="detail-value">{booking.payment.scheme}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">EMI Plan:</span>
                            <span className="detail-value">{booking.payment.emiPlan}</span>
                          </div>
                        </>
                      )}

                      <div className="detail-row">
                        <span className="detail-label">Accessories Total:</span>
                        <span className="detail-value">₹{booking.accessoriesTotal}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">RTO Amount:</span>
                        <span className="detail-value">₹{booking.rtoAmount}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Total Amount:</span>
                        <span className="detail-value">₹{booking.totalAmount}</span>
                      </div>
                      {booking.discountedAmount !== booking.totalAmount && (
                        <div className="detail-row">
                          <span className="detail-label">Discounted Amount:</span>
                          <span className="detail-value">₹{booking.discountedAmount}</span>
                        </div>
                      )}
                    </CCardBody>
                  </CCard>

                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaFileInvoiceDollar /> Price Components
                      </h5>
                    </CCardHeader>
                    <CCardBody>{renderPriceComponents()}</CCardBody>
                  </CCard>
                </div>
                <div className="details-column">
                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaFileAlt /> Document Status
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">KYC:</span>
                        <span className="detail-value">{renderDocumentStatus(booking.kycStatus, 'kyc')}</span>
                      </div>
                      {booking.payment.type === 'FINANCE' && (
                        <div className="detail-row">
                          <span className="detail-label">Finance Letter:</span>
                          <span className="detail-value">{renderDocumentStatus(booking.financeLetterStatus, 'finance')}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Booking Form:</span>
                        <span className="detail-value">
                          {booking.formGenerated ? (
                            <>
                              {shouldShowAwaitingApproval() ? (
                                <span className="awaiting-approval-text">Awaiting for Approval</span>
                              ) : (
                                <a
                                  href={`${config.baseURL}${booking.formPath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="form-link"
                                >
                                  VIEW
                                </a>
                              )}
                            </>
                          ) : (
                            <span>Not Generated</span>
                          )}
                        </span>
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaUserTie /> Sales Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">Sales Executive:</span>
                        <span className="detail-value">{booking.salesExecutive ? booking.salesExecutive.name : 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Created By:</span>
                        <span className="detail-value">{booking.createdBy.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Created At:</span>
                        <span className="detail-value">{new Date(booking.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Updated:</span>
                        <span className="detail-value">{new Date(booking.updatedAt).toLocaleString()}</span>
                      </div>
                    </CCardBody>
                  </CCard>

                  <CCard className="booking-section">
                    <CCardHeader>
                      <h5>
                        <FaExchangeAlt /> Exchange Information
                      </h5>
                    </CCardHeader>
                    <CCardBody>
                      <div className="detail-row">
                        <span className="detail-label">Exchange:</span>
                        <span className="detail-value">{booking.exchange ? 'Yes' : 'No'}</span>
                      </div>

                      {booking.exchange && (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Vehicle Number:</span>
                            <span className="detail-value">{booking.exchangeDetails.vehicleNumber}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Chassis Number:</span>
                            <span className="detail-value">{booking.exchangeDetails.chassisNumber}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Price:</span>
                            <span className="detail-value">₹{booking.exchangeDetails.price}</span>
                          </div>
                          {booking.exchangeDetails.broker && (
                            <div className="detail-row">
                              <span className="detail-label">Broker:</span>
                              <span className="detail-value">{booking.exchangeDetails.broker.name}</span>
                            </div>
                          )}
                        </>
                      )}
                    </CCardBody>
                  </CCard>
                </div>
              </div>
              
              <CCard className="booking-section">
                <CCardHeader>
                  <h5>
                    <FaCar /> Accessories
                  </h5>
                </CCardHeader>
                <CCardBody>{renderAccessories()}</CCardBody>
              </CCard>

              {booking.note && (
                <CCard className="booking-section">
                  <CCardHeader>
                    <h5>
                      <FaStickyNote /> Note
                    </h5>
                  </CCardHeader>
                  <CCardBody>
                    <div className="detail-row">
                      <span className="detail-label">Note:</span>
                      <span className="detail-value">{booking.note}</span>
                    </div>
                  </CCardBody>
                </CCard>
              )}

              {renderClaimDocuments()}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <div className="d-flex justify-content-between w-100">
            <div>
              {shouldShowApproveRejectButtons() && (
                <>
                  <button className="btn btn-success me-2" onClick={() => handleActionClick('approve')} disabled={actionLoading}>
                    {actionLoading ? 'Approving...' : 'Approve Discount'}
                  </button>
                  <button className="btn btn-danger me-2" onClick={() => handleActionClick('reject')} disabled={actionLoading}>
                    {actionLoading ? 'Rejecting...' : 'Reject Discount'}
                  </button>
                </>
              )}

              {booking?.documentStatus?.kyc?.status === 'PENDING' && (
                <>
                  <button className="btn btn-success me-2" onClick={() => handleKycStatusUpdate('APPROVED')} disabled={kycActionLoading}>
                    {kycActionLoading ? 'Verifying KYC...' : 'Verify KYC'}
                  </button>
                  <button className="btn btn-danger me-2" onClick={() => handleKycStatusUpdate('REJECTED')} disabled={kycActionLoading}>
                    {kycActionLoading ? 'Rejecting KYC...' : 'Reject KYC'}
                  </button>
                </>
              )}

              {shouldShowCancelButton() && (
                <button 
                  className="btn btn-warning me-2" 
                  onClick={handleCancelBooking} 
                  disabled={cancelLoading}
                >
                  {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
            <div>
              <Link to={`/booking-form/${booking.id}`} style={{textDecoration:'none'}} className="submit-button me-1">
                Edit
              </Link>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </CModalFooter>
      </CModal>
      <ApprovalFormModal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleStatusUpdate}
        actionType={currentAction}
        isLoading={actionLoading}
      />
      <ChassisNumberModal
        show={showChassisModal}
        onClose={() => setShowChassisModal(false)}
        onSave={handleChassisAllocation}
        isLoading={chassisLoading}
      />
    </>
  );
};

ViewBooking.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booking: PropTypes.shape({
    id: PropTypes.string,
    bookingNumber: PropTypes.string,
    model: PropTypes.shape({
      model_name: PropTypes.string,
      type: PropTypes.string
    }),
    color: PropTypes.shape({
      name: PropTypes.string
    }),
    branch: PropTypes.shape({
      name: PropTypes.string
    }),
    note: PropTypes.string,
    customerType: PropTypes.string,
    rto: PropTypes.string,
    rtoAmount: PropTypes.number,
    hpa: PropTypes.bool,
    hypothecationCharges: PropTypes.number,
    exchange: PropTypes.bool,
    exchangeDetails: PropTypes.shape({
      vehicleNumber: PropTypes.string,
      chassisNumber: PropTypes.string,
      price: PropTypes.number,
      broker: PropTypes.shape({
        name: PropTypes.string
      })
    }),
    payment: PropTypes.shape({
      type: PropTypes.string,
      financer: PropTypes.shape({
        name: PropTypes.string
      }),
      scheme: PropTypes.string,
      emiPlan: PropTypes.string
    }),
    accessories: PropTypes.arrayOf(
      PropTypes.shape({
        accessory: PropTypes.shape({
          name: PropTypes.string
        }),
        price: PropTypes.number
      })
    ),
    priceComponents: PropTypes.arrayOf(
      PropTypes.shape({
        header: PropTypes.shape({
          header_key: PropTypes.string
        }),
        originalValue: PropTypes.number,
        discountedValue: PropTypes.number
      })
    ),
    discounts: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        type: PropTypes.string
      })
    ),
    accessoriesTotal: PropTypes.number,
    totalAmount: PropTypes.number,
    discountedAmount: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    createdBy: PropTypes.shape({
      name: PropTypes.string
    }),
    salesExecutive: PropTypes.shape({
      name: PropTypes.string
    }),
    formPath: PropTypes.string,
    formGenerated: PropTypes.bool,
    documentStatus: PropTypes.shape({
      kyc: PropTypes.shape({
        status: PropTypes.string
      }),
      financeLetter: PropTypes.shape({
        status: PropTypes.string
      })
    }),
    customerDetails: PropTypes.shape({
      salutation: PropTypes.string,
      name: PropTypes.string,
      panNo: PropTypes.string,
      dob: PropTypes.string,
      occupation: PropTypes.string,
      address: PropTypes.string,
      taluka: PropTypes.string,
      district: PropTypes.string,
      pincode: PropTypes.string,
      mobile1: PropTypes.string,
      mobile2: PropTypes.string,
      aadharNumber: PropTypes.string
    }),
    verticles: PropTypes.array,
    verticlesSummary: PropTypes.shape({
      list: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          status: PropTypes.string
        })
      )
    })
  }),
  refreshData: PropTypes.func
};

export default ViewBooking;