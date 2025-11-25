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

//   const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

//   useEffect(() => {
//     if (show && booking) {
//       fetchAvailableChassisNumbers();
//     }
//   }, [show, booking]);

//   const fetchAvailableChassisNumbers = async () => {
//     try {
//       setLoadingChassisNumbers(true);
//       const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
//       const availableData = response.data.data.chassisNumbers || [];

//       // Store the full data
//       setAvailableChassisData(availableData);

//       // Extract just the chassis number strings from the objects
//       const chassisNumberStrings = availableData.map((item) => item.chassisNumber);
//       setAvailableChassisNumbers(chassisNumberStrings);

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

//     const payload = {
//       chassisNumber: chassisNumber.trim(),
//       ...(isUpdate && { reason }),
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
//                       {chassis.chassisNumber} ({chassis.age}) {chassis.chassisNumber === booking?.chassisNumber && '(Current)'}
//                     </option>
//                   ))}
//                 </CFormSelect>
//               ) : (
//                 <div className="text-danger">No chassis numbers available for this model and color combination</div>
//               )}
//             </div>

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
import { showError } from '../../../utils/sweetAlerts';

const ChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
  const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
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
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const [isDeviation, setIsDeviation] = useState(booking?.is_deviation === 'YES' ? 'YES' : 'NO');

  const isCashPayment = booking?.payment?.type?.toLowerCase() === 'cash';

  useEffect(() => {
    if (show && booking) {
      fetchAvailableChassisNumbers();
      // Reset states when modal opens
      setNote('');
      setShowNoteInput(false);
    }
  }, [show, booking]);

  const fetchAvailableChassisNumbers = async () => {
    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers`);
      let availableData = response.data.data.chassisNumbers || [];

      // The API returns data in FIFO order (oldest first), so we don't need to sort
      // Just use the data as it comes from API
      
      // Store the full data
      setAvailableChassisData(availableData);

      // Extract just the chassis number strings from the objects
      const chassisNumberStrings = availableData.map((item) => item.chassisNumber);
      setAvailableChassisNumbers(chassisNumberStrings);

      if (isUpdate && booking.chassisNumber && !chassisNumberStrings.includes(booking.chassisNumber)) {
        setAvailableChassisNumbers([booking.chassisNumber, ...chassisNumberStrings]);
        // Also add current chassis to the beginning of the data array for display
        setAvailableChassisData((prev) => [
          { 
            chassisNumber: booking.chassisNumber, 
            age: 'Current', 
            ageInDays: -1, 
            addedDate: 'Current' 
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      showError(error);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  const handleChassisNumberChange = (e) => {
    const selectedChassis = e.target.value;
    setChassisNumber(selectedChassis);

    // Check if selected chassis is NOT the first one in the list (not FIFO)
    if (availableChassisData.length > 0 && selectedChassis) {
      const firstChassis = availableChassisData[0].chassisNumber;
      const isNotFIFO = selectedChassis !== firstChassis;
      
      setShowNoteInput(isNotFIFO);
      
      // Clear note if switching back to FIFO selection
      if (!isNotFIFO) {
        setNote('');
      }
    } else {
      setShowNoteInput(false);
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

    // Check if note is required but not provided
    if (showNoteInput && !note.trim()) {
      showError('Please enter a note explaining why you selected a non-FIFO chassis number');
      return;
    }

    if (isUpdate && !reason.trim()) {
      showError('Please enter a reason for updating');
      return;
    }

    const payload = {
      chassisNumber: chassisNumber.trim(),
      ...(isUpdate && { reason }),
      ...(showNoteInput && { note: note.trim() }), // Include note only when non-FIFO selection
      ...(hasClaim && {
        claimDetails: {
          price: claimDetails.price,
          description: claimDetails.description,
          documents: claimDetails.documents
        }
      }),
      ...(isCashPayment && { is_deviation: isDeviation })
    };

    onSave(payload);
  };

  // Get the first (FIFO) chassis number for comparison - this is the OLDEST one
  const firstChassisNumber = availableChassisData.length > 0 ? availableChassisData[0].chassisNumber : '';
  const firstChassisAge = availableChassisData.length > 0 ? availableChassisData[0].age : '';

  return (
    <CModal visible={show} onClose={onClose} alignment="center" size={hasClaim !== null ? 'lg' : undefined}>
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
              <CFormLabel htmlFor="chassisNumber">
                Chassis Number 
                {firstChassisNumber && (
                  <small className="text-muted ms-2">
                    (Oldest available: {firstChassisNumber} - {firstChassisAge})
                  </small>
                )}
              </CFormLabel>
              {loadingChassisNumbers ? (
                <div className="text-center">
                  <CSpinner size="sm" />
                  <span className="ms-2">Loading chassis numbers...</span>
                </div>
              ) : availableChassisNumbers.length > 0 ? (
                <>
                  <CFormSelect 
                    value={chassisNumber} 
                    onChange={handleChassisNumberChange} 
                    required
                  >
                    <option value="">Select a chassis number</option>
                    {availableChassisData.map((chassis, index) => (
                      <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
                        {chassis.chassisNumber} - {chassis.age}
                        {index === 0 && ' 🏷️ FIFO First (Oldest)'}
                        {chassis.chassisNumber === booking?.chassisNumber && ' (Current)'}
                      </option>
                    ))}
                  </CFormSelect>
                  {firstChassisNumber && chassisNumber === firstChassisNumber && (
                    <small className="text-success mt-1 d-block">
                      ✓ You have selected the FIFO (First-In-First-Out) chassis number - Oldest available
                    </small>
                  )}
                  {showNoteInput && (
                    <small className="text-warning mt-1 d-block">
                      ⚠️ You have selected a chassis number that is not the oldest available. Please provide a note below.
                    </small>
                  )}
                </>
              ) : (
                <div className="text-danger">No chassis numbers available for this model and color combination</div>
              )}
            </div>

            {showNoteInput && (
              <div className="mb-3">
                <CFormLabel htmlFor="note">
                  Note for Non-FIFO Selection *
                </CFormLabel>
                <CFormTextarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Please provide a note explaining why you selected a chassis number that is not the oldest available (non-FIFO)"
                  rows={3}
                  required
                />
                <small className="text-muted">
                  This note is required when selecting a chassis number other than the oldest available one
                </small>
              </div>
            )}

            {isUpdate && (
              <div className="mb-3">
                <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
                <CFormTextarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} />
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
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSubmit}
            disabled={
              isLoading || 
              (!chassisNumber) ||
              (showNoteInput && !note.trim()) ||
              (isUpdate && !reason.trim()) ||
              (loadingChassisNumbers || availableChassisNumbers.length === 0)
            }
          >
            {isLoading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  );
};

export default ChassisNumberModal;