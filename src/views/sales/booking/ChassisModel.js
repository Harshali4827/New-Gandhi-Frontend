// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CFormSelect,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck
// } from '@coreui/react';
// import axiosInstance from '../../../axiosInstance';
// import { showError } from '../../../utils/sweetAlerts';

// const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
//   const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]); 
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');

//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

//   useEffect(() => {
//     if (show && booking) {
//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking]);
//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       const oldestChassis = getOldestChassis();

//       setShowNonFifoNote(selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays);
//       if (selectedChassis && selectedChassis.ageInDays === oldestChassis?.ageInDays) {
//         setNonFifoReason('');
//       }
//     }
//   }, [chassisNumber, availableChassisData]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       const sortedData = [...availableData].sort((a, b) => b.ageInDays - a.ageInDays);
    
//       setAvailableChassisData(sortedData);

//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       if (isUpdate && booking.chassisNumber && !chassisNumberStrings.includes(booking.chassisNumber)) {
//         setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
 
//         setAvailableChassisData((prev) => [
//           { chassisNumber: booking.chassisNumber, age: 'Current', ageInDays: 0, addedDate: 'Current' },
//           ...prev
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//       showError(error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   const getOldestChassis = () => {
//     if (availableChassisData.length === 0) return null;
//     return availableChassisData[0];
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       showError('You can upload a maximum of 6 documents');
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!chassisNumber.trim()) {
//       showError('Please enter a chassis number');
//       return;
//     }
//     if (isUpdate && !reason.trim()) {
//       showError('Please enter a reason for updating');
//       return;
//     }
//     if (showNonFifoNote && !nonFifoReason.trim()) {
//       showError('Please enter a reason for selecting non-FIFO chassis number');
//       return;
//     }

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(isUpdate && { reason }),
//       ...(showNonFifoNote && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...(isCashPayment && { is_deviation: isDeviation })
//     };

//     onSave(payload);
//   };

//   const getChassisDisplayText = (chassis) => {
//     const oldestChassis = getOldestChassis();
//     const isOldest = oldestChassis && chassis.chassisNumber === oldestChassis.chassisNumber;
    
//     let displayText = `${chassis.chassisNumber} (${chassis.ageInDays}day)`;
    
//     if (chassis.chassisNumber === booking?.chassisNumber) {
//       displayText += ' (Current)';
//     } else if (isOldest) {
//       displayText += '';
//     }
    
//     return displayText;
//   };

//   return (
//     <CModal visible={show} onClose={onClose} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
//             </div>

//             {isCashPayment && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
//                   <option value="">Select a chassis number</option>
//                   {availableChassisData.map((chassis) => (
//                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
//                       {getChassisDisplayText(chassis)}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               ) : (
//                 <div className="text-danger">No chassis numbers available for this model and color combination</div>
//               )}
//             </div>

//             {showNonFifoNote && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="nonFifoReason">Reason for Non-FIFO Selection *</CFormLabel>
//                 <CFormTextarea 
//                   id="nonFifoReason" 
//                   value={nonFifoReason} 
//                   onChange={(e) => setNonFifoReason(e.target.value)} 
//                   required 
//                   rows={3}
//                   placeholder="Please explain why you are not selecting the oldest chassis number"
//                 />
//               </div>
//             )}

//             {isUpdate && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
//                 <CFormTextarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             color="primary"
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;





// import React, { useState, useEffect } from 'react';
// import {
//   CModal,
//   CModalHeader,
//   CModalBody,
//   CModalFooter,
//   CFormLabel,
//   CButton,
//   CFormSelect,
//   CSpinner,
//   CFormInput,
//   CFormTextarea,
//   CFormCheck
// } from '@coreui/react';
// import axiosInstance from '../../../axiosInstance';
// import '../../../css/form.css';
// import { showError } from '../../../utils/sweetAlerts';

// const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
//   const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
//   const [reason, setReason] = useState('');
//   const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
//   const [availableChassisData, setAvailableChassisData] = useState([]); 
//   const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
//   const [hasClaim, setHasClaim] = useState(null);
//   const [claimDetails, setClaimDetails] = useState({
//     price: '',
//     description: '',
//     documents: []
//   });
//   const [documentPreviews, setDocumentPreviews] = useState([]);
//   const [isDeviation, setIsDeviation] = useState(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
//   const [showNonFifoNote, setShowNonFifoNote] = useState(false);
//   const [nonFifoReason, setNonFifoReason] = useState('');

//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

//   useEffect(() => {
//     if (show && booking) {
//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking]);

//   // Reset non-FIFO note when chassis number changes
//   useEffect(() => {
//     if (chassisNumber && availableChassisData.length > 0) {
//       const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//       const oldestChassis = getOldestChassis();
      
//       console.log('Selected Chassis:', selectedChassis);
//       console.log('Oldest Chassis:', oldestChassis);
//       console.log('Should show note:', selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays);
      
//       // Show note if selected chassis is not the oldest one
//       const shouldShowNote =
//       selectedChassis &&
//       oldestChassis &&
//       selectedChassis.chassisNumber !== oldestChassis.chassisNumber;
    
//     setShowNonFifoNote(shouldShowNote);
    
//       setShowNonFifoNote(shouldShowNote);
      
//       // Reset reason when switching back to FIFO chassis
//       if (selectedChassis && selectedChassis.ageInDays === oldestChassis?.ageInDays) {
//         setNonFifoReason('');
//       }
//     }
//   }, [chassisNumber, availableChassisData]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       console.log('API Response:', availableData);

//       // Sort by ageInDays (descending) - oldest first (FIFO)
//       const sortedData = [...availableData].sort((a, b) => b.ageInDays - a.ageInDays);
      
//       // Store the full data
//       setAvailableChassisData(sortedData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

//       // Auto-select the oldest chassis (FIFO) if not in update mode
//       if (!isUpdate && sortedData.length > 0) {
//         setChassisNumber(sortedData[0].chassisNumber);
//       }

//       if (isUpdate && booking.chassisNumber && !chassisNumberStrings.includes(booking.chassisNumber)) {
//         setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
//         // Also add current chassis to the data array for display
//         setAvailableChassisData((prev) => [
//           { chassisNumber: booking.chassisNumber, age: 'Current', ageInDays: 0, addedDate: 'Current' },
//           ...prev
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching chassis numbers:', error);
//       showError(error);
//     } finally {
//       setLoadingChassisNumbers(false);
//     }
//   };

//   // Get the oldest chassis (FIFO - first in first out)
//   const getOldestChassis = () => {
//     if (availableChassisData.length === 0) return null;
    
//     // Since we sorted by ageInDays descending, the first one is the oldest
//     return availableChassisData[0];
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + claimDetails.documents.length > 6) {
//       showError('You can upload a maximum of 6 documents');
//       return;
//     }

//     const newDocuments = [...claimDetails.documents, ...files];
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     const imageFiles = files.filter((file) => file.type.startsWith('image/'));
//     imageFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeDocument = (index) => {
//     const newDocuments = [...claimDetails.documents];
//     newDocuments.splice(index, 1);
//     setClaimDetails({ ...claimDetails, documents: newDocuments });

//     if (documentPreviews[index]) {
//       const newPreviews = [...documentPreviews];
//       newPreviews.splice(index, 1);
//       setDocumentPreviews(newPreviews);
//     }
//   };

//   const handleSubmit = () => {
//     if (!chassisNumber.trim()) {
//       showError('Please enter a chassis number');
//       return;
//     }
//     if (isUpdate && !reason.trim()) {
//       showError('Please enter a reason for updating');
//       return;
//     }
//     if (showNonFifoNote && !nonFifoReason.trim()) {
//       showError('Please enter a reason for selecting newer chassis while older chassis are available');
//       return;
//     }

//     const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
//     const oldestChassis = getOldestChassis();
//     const isNonFifoSelection = selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays;

//     console.log('Submit - showNonFifoNote:', showNonFifoNote);
//     console.log('Submit - isNonFifoSelection:', isNonFifoSelection);
//     console.log('Submit - nonFifoReason:', nonFifoReason);

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(isUpdate && { reason }),
//       ...((showNonFifoNote || isNonFifoSelection) && nonFifoReason.trim() && { note: nonFifoReason.trim() }),
//       ...(hasClaim && {
//         claimDetails: {
//           price: claimDetails.price,
//           description: claimDetails.description,
//           documents: claimDetails.documents
//         }
//       }),
//       ...(isCashPayment && { is_deviation: isDeviation })
//     };

//     console.log('Final Payload:', payload);

//     onSave(payload);
//   };

//   const getChassisDisplayText = (chassis) => {
//     const oldestChassis = getOldestChassis();
//     const isOldest = oldestChassis && chassis.chassisNumber === oldestChassis.chassisNumber;
    
//     let displayText = `${chassis.chassisNumber} (${chassis.age})`;
    
//     if (chassis.chassisNumber === booking?.chassisNumber) {
//       displayText += ' (Current)';
//     } else if (isOldest) {
//       displayText += '';
//     }
    
//     return displayText;
//   };

//   return (
//     <CModal visible={show} onClose={onClose} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
//       <CModalHeader>
//         <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
//       </CModalHeader>
//       <CModalBody>
//         {hasClaim === null ? (
//           <div className="text-center">
//             <h5>Is there any claim?</h5>
//             <div className="d-flex justify-content-center mt-3">
//               <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
//                 Yes
//               </CButton>
//               <CButton color="secondary" onClick={() => setHasClaim(false)}>
//                 No
//               </CButton>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
//             </div>
//             <div className="mb-3">
//               <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
//             </div>

//             {isCashPayment && (
//               <div
//                 className="mb-3"
//                 style={{
//                   border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
//                   transition: 'all 0.3s ease'
//                 }}
//               >
//                 <CFormCheck
//                   id="isDeviation"
//                   label="Is Deviation?"
//                   checked={isDeviation === 'YES'}
//                   onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
//                   style={{
//                     fontWeight: '600',
//                     fontSize: '1.1rem',
//                     color: isDeviation === 'YES' ? '#28a745' : '#d93025',
//                     accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
//                   }}
//                 />
//               </div>
//             )}

//             <div className="mb-3">
//               <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
//               {loadingChassisNumbers ? (
//                 <div className="text-center">
//                   <CSpinner size="sm" />
//                   <span className="ms-2">Loading chassis numbers...</span>
//                 </div>
//               ) : availableChassisNumbers.length > 0 ? (
//                 <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
//                   <option value="">Select a chassis number</option>
//                   {availableChassisData.map((chassis) => (
//                     <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
//                       {getChassisDisplayText(chassis)}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               ) : (
//                 <div className="text-danger">No chassis numbers available for this model and color combination</div>
//               )}
//             </div>

//             {/* Non-FIFO Selection Note */}
//             {showNonFifoNote && (
//               <div className="mb-3">
              
//                 <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
//                 <CFormTextarea 
//                   id="nonFifoReason" 
//                   value={nonFifoReason} 
//                   onChange={(e) => setNonFifoReason(e.target.value)} 
//                   required 
//                   rows={3}
//                 />
//               </div>
//             )}

//             {isUpdate && (
//               <div className="mb-3">
//                 <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
//                 <CFormTextarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
//               </div>
//             )}

//             {hasClaim && (
//               <div className="mt-4 border-top pt-3">
//                 <h5>Claim Details</h5>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
//                   <CFormInput
//                     type="number"
//                     id="claimPrice"
//                     value={claimDetails.price}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
//                     placeholder="Enter claim amount"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
//                   <CFormTextarea
//                     id="claimDescription"
//                     value={claimDetails.description}
//                     onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
//                     placeholder="Enter claim description"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <CFormLabel>Documents (Max 6)</CFormLabel>
//                   <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
//                   <small className="text-muted">You can upload images, PDFs, or Word documents</small>

//                   {documentPreviews.length > 0 && (
//                     <div className="mt-2">
//                       <h6>Uploaded Documents:</h6>
//                       <div className="d-flex flex-wrap gap-2">
//                         {documentPreviews.map((doc, index) => (
//                           <div key={index} className="position-relative" style={{ width: '100px' }}>
//                             <img
//                               src={doc.url}
//                               alt={doc.name}
//                               className="img-thumbnail"
//                               style={{ width: '100%', height: '100px', objectFit: 'cover' }}
//                             />
//                             <button
//                               className="position-absolute top-0 end-0 btn btn-sm btn-danger"
//                               onClick={() => removeDocument(index)}
//                               style={{ transform: 'translate(50%, -50%)' }}
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
//                     <div className="mt-2">
//                       <h6>Other Files:</h6>
//                       <ul>
//                         {claimDetails.documents
//                           .filter((d) => !d.type.startsWith('image/'))
//                           .map((doc, index) => (
//                             <li key={index} className="d-flex align-items-center">
//                               {doc.name}
//                               <button
//                                 className="btn btn-sm btn-danger ms-2"
//                                 onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
//                               >
//                                 ×
//                               </button>
//                             </li>
//                           ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </CModalBody>
//       {hasClaim !== null && (
//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton
//             className='submit-button'
//             onClick={handleSubmit}
//             disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
//           >
//             {isLoading ? 'Saving...' : 'Save'}
//           </CButton>
//         </CModalFooter>
//       )}
//     </CModal>
//   );
// };

// export default ChassisNumberModal;



import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CButton,
  CFormSelect,
  CSpinner,
  CFormInput,
  CFormTextarea,
  CFormCheck
} from '@coreui/react';
import axiosInstance from '../../../axiosInstance';
import '../../../css/form.css';
import { showError } from '../../../utils/sweetAlerts';

const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [reason, setReason] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [availableChassisData, setAvailableChassisData] = useState([]); 
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [hasClaim, setHasClaim] = useState(null);
  const [claimDetails, setClaimDetails] = useState({
    price: '',
    description: '',
    documents: []
  });
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [isDeviation, setIsDeviation] = useState('NO');
  const [showNonFifoNote, setShowNonFifoNote] = useState(false);
  const [nonFifoReason, setNonFifoReason] = useState('');
  const [showReasonField, setShowReasonField] = useState(false);

  const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

  // Reset all form fields when modal opens/closes
  useEffect(() => {
    if (show) {
      // Reset all state when modal opens
      setChassisNumber(booking?.chassisNumber || '');
      setReason('');
      setHasClaim(null);
      setClaimDetails({
        price: '',
        description: '',
        documents: []
      });
      setDocumentPreviews([]);
      setIsDeviation(booking?.is_deviation === 'YES' ? 'YES' : 'NO');
      setShowNonFifoNote(false);
      setNonFifoReason('');
      setShowReasonField(false);
      
      if (booking) {
        fetchAvailableChassisNumbers();
      }
    }
  }, [show, booking]);

  // Reset non-FIFO note when chassis number changes
  useEffect(() => {
    if (chassisNumber && availableChassisData.length > 0) {
      const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      
      console.log('Selected Chassis:', selectedChassis);
      console.log('Booking ID:', booking?._id);
      console.log('Selected allocatedBooking:', selectedChassis?.allocatedBooking);
      
      if (selectedChassis) {
        // Check if this is current chassis (allocatedBooking matches bookingId)
        const isCurrentChassis = selectedChassis.allocatedBooking === booking?._id;
        
        // LOGIC: If status is booked → NEVER show note field or reason field
        if (selectedChassis.status === 'booked') {
          console.log('Booked chassis - no note or reason field');
          setShowNonFifoNote(false);
          setShowReasonField(false);
          return;
        }
        
        // LOGIC: If status is in_stock
        if (selectedChassis.status === 'in_stock') {
          // Check if there's any current chassis in the ENTIRE list
          const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
          
          console.log('Has current chassis in entire list?', hasCurrentChassisInList);
          
          if (hasCurrentChassisInList) {
            // When there is current chassis in the list
            if (isCurrentChassis) {
              // Current chassis: show note field only
              console.log('Current chassis selected - show note field only');
              setShowNonFifoNote(true);
              setShowReasonField(false);
            } else {
              // All other chassis AFTER current: show BOTH note AND reason fields
              console.log('Non-current chassis selected (current exists) - show BOTH fields');
              setShowNonFifoNote(true);
              setShowReasonField(true);
            }
          } else {
            // When there is NO current chassis in the list
            console.log('No current chassis in list');
            
            // Get all in_stock chassis
            const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
            
            if (inStockChassis.length > 0) {
              // Sort in_stock chassis by ageInDays (descending) - oldest first
              const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
              
              // Get the oldest in_stock chassis (first one after sorting)
              const oldestInStockChassis = sortedInStock[0];
              
              console.log('Oldest in_stock chassis:', oldestInStockChassis.chassisNumber);
              
              // Show note field for all in_stock chassis
              setShowNonFifoNote(true);
              
              // Show reason field only if NOT the oldest in_stock chassis
              const shouldShowReason = selectedChassis.chassisNumber !== oldestInStockChassis.chassisNumber;
              console.log('Should show reason field?', shouldShowReason);
              
              setShowReasonField(shouldShowReason);
              
              // Reset reason if switching to oldest chassis without reason field
              if (!shouldShowReason) {
                setNonFifoReason('');
              }
            }
          }
        } else {
          // For other statuses (allocated, etc.)
          setShowNonFifoNote(false);
          setShowReasonField(false);
        }
      }
    } else {
      setShowNonFifoNote(false);
      setShowReasonField(false);
    }
  }, [chassisNumber, availableChassisData, booking]);

  const fetchAvailableChassisNumbers = async () => {
    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
      const availableData = response.data.data.chassisNumbers || [];

      console.log('API Response:', availableData);

      // Sort by ageInDays (descending) - oldest first (FIFO)
      const sortedData = [...availableData].sort((a, b) => b.ageInDays - a.ageInDays);
      
      // Store the full data
      setAvailableChassisData(sortedData);

      // Extract just the chassis number strings from the objects
      const chassisNumberStrings = sortedData.map((item) => item.chassisNumber);
      setAvailableChassisNumbers(chassisNumberStrings);

      // Auto-select the oldest chassis (FIFO) if not in update mode
      if (!isUpdate && sortedData.length > 0) {
        setChassisNumber(sortedData[0].chassisNumber);
      }

      if (isUpdate && booking.chassisNumber && !chassisNumberStrings.includes(booking.chassisNumber)) {
        setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
        // Also add current chassis to the data array for display
        const currentChassisData = {
          chassisNumber: booking.chassisNumber, 
          age: 'Current', 
          ageInDays: 0, 
          addedDate: 'Current',
          status: 'allocated',
          isBookedOrBlocked: false,
          eligibilityMessage: 'Current Allocation',
          allocatedBooking: booking._id // Set allocatedBooking to match booking ID
        };
        
        setAvailableChassisData((prev) => [currentChassisData, ...prev]);
      }
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      showError(error);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + claimDetails.documents.length > 6) {
      showError('You can upload a maximum of 6 documents');
      return;
    }

    const newDocuments = [...claimDetails.documents, ...files];
    setClaimDetails({ ...claimDetails, documents: newDocuments });

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    const newDocuments = [...claimDetails.documents];
    newDocuments.splice(index, 1);
    setClaimDetails({ ...claimDetails, documents: newDocuments });

    if (documentPreviews[index]) {
      const newPreviews = [...documentPreviews];
      newPreviews.splice(index, 1);
      setDocumentPreviews(newPreviews);
    }
  };

  const handleSubmit = () => {
    if (!chassisNumber.trim()) {
      showError('Please select a chassis number');
      return;
    }
    
    // Get selected chassis
    const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    
    // Check if it's current chassis (allocatedBooking matches bookingId)
    const isCurrentChassis = selectedChassis?.allocatedBooking === booking?._id;
    
    // Check if there's any current chassis in the ENTIRE list
    const hasCurrentChassisInList = availableChassisData.some(chassis => chassis.allocatedBooking === booking?._id);
    
    // Validate note field (always required when shown)
    if (showNonFifoNote && !nonFifoReason.trim()) {
      showError('Please enter a reason in the note field');
      return;
    }
    
    // Validate reason param field (when shown)
    if (showReasonField && !reason.trim()) {
      showError('Please enter a reason for selecting this chassis');
      return;
    }
    
    // In update mode, always require update reason
    if (isUpdate && !reason.trim()) {
      showError('Please enter a reason for updating');
      return;
    }
    
    // Additional validation based on scenario
    if (selectedChassis && selectedChassis.status === 'in_stock') {
      // Scenario 1: When there is current chassis in list
      if (hasCurrentChassisInList) {
        if (isCurrentChassis) {
          // Current chassis: requires note only
          if (!nonFifoReason.trim()) {
            showError('Please enter a note for the current chassis');
            return;
          }
        } else {
          // Non-current chassis (after current): requires both note AND reason
          if (!nonFifoReason.trim()) {
            showError('Please enter a note for selecting this chassis');
            return;
          }
          if (!reason.trim()) {
            showError('Please enter a reason for selecting this chassis');
            return;
          }
        }
      } else {
        // Scenario 2: No current chassis in list
        // Get all in_stock chassis
        const inStockChassis = availableChassisData.filter(chassis => chassis.status === 'in_stock');
        
        if (inStockChassis.length > 0) {
          // Sort to find the oldest
          const sortedInStock = [...inStockChassis].sort((a, b) => b.ageInDays - a.ageInDays);
          const oldestInStockChassis = sortedInStock[0];
          
          // Oldest chassis: requires note only
          if (selectedChassis.chassisNumber === oldestInStockChassis.chassisNumber) {
            if (!nonFifoReason.trim()) {
              showError('Please enter a note for selecting this chassis');
              return;
            }
          } else {
            // Non-oldest chassis: requires both note AND reason
            if (!nonFifoReason.trim()) {
              showError('Please enter a note for selecting this chassis');
              return;
            }
            if (!reason.trim()) {
              showError('Please enter a reason for selecting this chassis');
              return;
            }
          }
        }
      }
    }

    // Build payload - reason will be passed as query parameter
    const payload = {
      chassisNumber: chassisNumber.trim(),
      ...(reason.trim() && { reason: reason.trim() }), // Always include if not empty
      ...(nonFifoReason.trim() && { note: nonFifoReason.trim() }),
      ...(hasClaim && {
        claimDetails: {
          price: claimDetails.price,
          description: claimDetails.description,
          documents: claimDetails.documents
        }
      }),
      ...(isCashPayment && { is_deviation: isDeviation })
    };

    console.log('Final Payload:', payload);

    onSave(payload);
  };

  const getChassisDisplayText = (chassis) => {
    // Check if this is current chassis (allocatedBooking matches bookingId)
    const isCurrentChassis = chassis.allocatedBooking === booking?._id;
    
    if (isCurrentChassis) {
      return `${chassis.chassisNumber} (Current)`;
    }
    
    let displayText = chassis.chassisNumber;
    let ageText = '';
    
    // Add age information if available
    if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
      const days = chassis.ageInDays;
      ageText = ` (${days} day${days !== 1 ? 's' : ''})`;
    }
    
    // Add eligibility message if chassis is booked or blocked
    if (chassis.isBookedOrBlocked && chassis.eligibilityMessage) {
      displayText = `${chassis.chassisNumber} - ${chassis.eligibilityMessage}${ageText}`;
    } else {
      // For available chassis, just show chassis number with age
      displayText = `${chassis.chassisNumber}${ageText}`;
    }
    
    return displayText;
  };

  const handleCloseModal = () => {
    // Reset form state
    setHasClaim(null);
    setShowNonFifoNote(false);
    setShowReasonField(false);
    setNonFifoReason('');
    setClaimDetails({
      price: '',
      description: '',
      documents: []
    });
    setDocumentPreviews([]);
    onClose();
  };

  return (
    <CModal visible={show} onClose={handleCloseModal} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
      <CModalHeader>
        <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
      </CModalHeader>
      <CModalBody>
        {hasClaim === null ? (
          <div className="text-center">
            <h5>Is there any claim?</h5>
            <div className="d-flex justify-content-center mt-3">
              <CButton color="primary" className="me-3" onClick={() => setHasClaim(true)}>
                Yes
              </CButton>
              <CButton color="secondary" onClick={() => setHasClaim(false)}>
                No
              </CButton>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
            </div>
            <div className="mb-3">
              <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
            </div>

            {isCashPayment && (
              <div
                className="mb-3"
                style={{
                  border: isDeviation === 'YES' ? '2px solid #28a745' : '2px solid #ff4d4f',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isDeviation === 'YES' ? '#e9f7ef' : '#fff8f8',
                  transition: 'all 0.3s ease'
                }}
              >
                <CFormCheck
                  id="isDeviation"
                  label="Is Deviation?"
                  checked={isDeviation === 'YES'}
                  onChange={(e) => setIsDeviation(e.target.checked ? 'YES' : 'NO')}
                  style={{
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    color: isDeviation === 'YES' ? '#28a745' : '#d93025',
                    accentColor: isDeviation === 'YES' ? '#28a745' : '#d93025'
                  }}
                />
              </div>
            )}

            <div className="mb-3">
              <CFormLabel htmlFor="chassisNumber">Chassis Number</CFormLabel>
              {loadingChassisNumbers ? (
                <div className="text-center">
                  <CSpinner size="sm" />
                  <span className="ms-2">Loading chassis numbers...</span>
                </div>
              ) : availableChassisNumbers.length > 0 ? (
                <CFormSelect value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} required>
                  <option value="">Select a chassis number</option>
                  {availableChassisData.map((chassis) => (
                    <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
                      {getChassisDisplayText(chassis)}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                <div className="text-danger">No chassis numbers available for this model and color combination</div>
              )}
            </div>

            {/* Non-FIFO Selection Note */}
            {showNonFifoNote && (
              <div className="mb-3">
                <CFormLabel htmlFor="nonFifoReason">Note<span className='required'>*</span></CFormLabel>
                <CFormTextarea 
                  id="nonFifoReason" 
                  value={nonFifoReason} 
                  onChange={(e) => setNonFifoReason(e.target.value)} 
                  required 
                  rows={3}
                />
              </div>
            )}

            {/* Reason Field (param) - Show only for certain conditions */}
            {showReasonField && (
              <div className="mb-3">
                <CFormLabel htmlFor="reason">Reason<span className='required'>*</span></CFormLabel>
                <CFormTextarea 
                  id="reason" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  required 
                  rows={3}
                />
              </div>
            )}

            {/* Update Reason Field (only for update mode and not shown above) */}
            {isUpdate && !showReasonField && (
              <div className="mb-3">
                <CFormLabel htmlFor="updateReason">Reason for Update<span className='required'>*</span></CFormLabel>
                <CFormTextarea id="updateReason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
              </div>
            )}

            {hasClaim && (
              <div className="mt-4 border-top pt-3">
                <h5>Claim Details</h5>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimPrice">Price (₹)</CFormLabel>
                  <CFormInput
                    type="number"
                    id="claimPrice"
                    value={claimDetails.price}
                    onChange={(e) => setClaimDetails({ ...claimDetails, price: e.target.value })}
                    placeholder="Enter claim amount"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="claimDescription">Description</CFormLabel>
                  <CFormTextarea
                    id="claimDescription"
                    value={claimDetails.description}
                    onChange={(e) => setClaimDetails({ ...claimDetails, description: e.target.value })}
                    placeholder="Enter claim description"
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel>Documents (Max 6)</CFormLabel>
                  <input type="file" className="form-control" onChange={handleDocumentUpload} multiple accept="image/*,.pdf,.doc,.docx" />
                  <small className="text-muted">You can upload images, PDFs, or Word documents</small>

                  {documentPreviews.length > 0 && (
                    <div className="mt-2">
                      <h6>Uploaded Documents:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {documentPreviews.map((doc, index) => (
                          <div key={index} className="position-relative" style={{ width: '100px' }}>
                            <img
                              src={doc.url}
                              alt={doc.name}
                              className="img-thumbnail"
                              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                            />
                            <button
                              className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                              onClick={() => removeDocument(index)}
                              style={{ transform: 'translate(50%, -50%)' }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {claimDetails.documents.filter((d) => !d.type.startsWith('image/')).length > 0 && (
                    <div className="mt-2">
                      <h6>Other Files:</h6>
                      <ul>
                        {claimDetails.documents
                          .filter((d) => !d.type.startsWith('image/'))
                          .map((doc, index) => (
                            <li key={index} className="d-flex align-items-center">
                              {doc.name}
                              <button
                                className="btn btn-sm btn-danger ms-2"
                                onClick={() => removeDocument(claimDetails.documents.findIndex((d) => d.name === doc.name))}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CModalBody>
      {hasClaim !== null && (
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal} disabled={isLoading}>
            Cancel
          </CButton>
          <CButton
            className='submit-button'
            onClick={handleSubmit}
            disabled={isLoading || (!isUpdate && (loadingChassisNumbers || availableChassisNumbers.length === 0))}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  );
};

export default ChassisNumberModal;




