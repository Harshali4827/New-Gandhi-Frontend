import React, { useRef, useState, useEffect } from 'react';
import '../../css/importCsv.css';
import { showError, showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect } from '@coreui/react';

const ImportInwardCSV = ({ endpoint, onSuccess, buttonText = 'Import CSV', acceptedFiles = '.csv' }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [typeError, setTypeError] = useState('');
  
  // Track if form was validated
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleButtonClick = () => {
    if (branches.length === 0) {
      showError('Please ensure branches exist before importing data.');
      return;
    }
    setShowModal(true);
  };

  const validateForm = () => {
    let isValid = true;
    setBranchError('');
    setTypeError('');

    if (!selectedBranchId) {
      setBranchError('Please select a branch');
      isValid = false;
    }

    if (!selectedType) {
      setTypeError('Please select a type (EV / ICE)');
      isValid = false;
    }

    return isValid;
  };

  const handleModalConfirm = () => {
    if (validateForm()) {
      setIsValidated(true);
      setShowModal(false);
      // Use setTimeout to ensure modal is closed before opening file dialog
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 100);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    // Only reset on explicit cancel, not on modal close
    setBranchError('');
    setTypeError('');
  };

  // Handle modal backdrop click - don't reset form
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Re-validate if needed
    if (!isValidated) {
      if (!validateForm()) {
        // Show modal again if validation fails
        setShowModal(true);
        return;
      }
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    // Build URL with parameters
    const params = new URLSearchParams();
    params.append('type', selectedType);
    params.append('branch_id', selectedBranchId);
    
    const url = `${endpoint}?${params.toString()}`;

    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await showFormSubmitToast(response.data.message || 'File imported successfully!');

      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form only after successful import
      resetForm();
    } catch (error) {
      console.error('Error uploading file:', error);

      if (error.response) {
        console.error('Server response:', error.response.data);
        if (error.response.data.error === 'Type is required and must be EV or ICE') {
          // Re-open modal with error
          setShowModal(true);
          setTypeError('Please select a valid vehicle type (EV or ICE)');
        }
      }

      showFormSubmitError(error);
    } finally {
      setIsLoading(false);
      setIsValidated(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetForm = () => {
    setSelectedBranchId('');
    setSelectedType('');
    setBranchError('');
    setTypeError('');
    setIsValidated(false);
  };

  return (
    <div className="import-csv-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={acceptedFiles} 
        style={{ display: 'none' }} 
      />
      
      <CButton 
        className="action-btn me-1" 
        onClick={handleButtonClick} 
        disabled={isLoading || branches.length === 0}
      >
        {isLoading ? 'Uploading...' : buttonText}
      </CButton>

      {/* Modal - don't reset on backdrop click */}
      <CModal visible={showModal} onClose={handleModalClose}>
        <CModalHeader>
          <CModalTitle>Import Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Branch:</label>
            <CFormSelect
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setBranchError('');
              }}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
            {branchError && <div className="text-danger small mt-1">{branchError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Vehicle Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setTypeError('');
              }}
            >
              <option value="">-- Select Vehicle Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
            {typeError && <div className="text-danger small mt-1">{typeError}</div>}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalCancel}>
            Cancel
          </CButton>
          <CButton className='submit-button' onClick={handleModalConfirm}>
            Continue
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ImportInwardCSV;





// import React, { useRef, useState, useEffect } from 'react';
// import '../../css/importCsv.css';
// import { showError, showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
// import axiosInstance from '../../axiosInstance';
// import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect } from '@coreui/react';

// const ImportInwardCSV = ({ endpoint, onSuccess, buttonText = 'Import CSV', acceptedFiles = '.csv' }) => {
//   const fileInputRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranchId, setSelectedBranchId] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [branchError, setBranchError] = useState('');
//   const [typeError, setTypeError] = useState('');
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const response = await axiosInstance.get('/branches');
//         setBranches(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching branches:', error);
//       }
//     };

//     fetchBranches();
//   }, []);

//   const handleButtonClick = () => {
//     if (branches.length === 0) {
//       showError('Please ensure branches exist before importing data.');
//       return;
//     }
    
//     // Reset previous selections
//     setSelectedBranchId('');
//     setSelectedType('');
//     setBranchError('');
//     setTypeError('');
//     setFile(null);
    
//     // Open modal first
//     setShowModal(true);
//   };

//   const validateForm = () => {
//     let isValid = true;

//     if (!selectedBranchId) {
//       setBranchError('Please select a branch');
//       isValid = false;
//     } else {
//       setBranchError('');
//     }

//     if (!selectedType) {
//       setTypeError('Please select a type (EV / ICE)');
//       isValid = false;
//     } else {
//       setTypeError('');
//     }

//     if (!file) {
//       showError('Please select a CSV file');
//       isValid = false;
//     }

//     return isValid;
//   };

//   const handleSelectFile = () => {
//     // Close modal temporarily to select file
//     setShowModal(false);
    
//     // Wait a bit for modal to close, then trigger file input
//     setTimeout(() => {
//       fileInputRef.current?.click();
//     }, 300);
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) {
//       // If no file selected, reopen modal
//       setShowModal(true);
//       return;
//     }
    
//     // Store the file and reopen modal
//     setFile(selectedFile);
//     setShowModal(true);
//   };

//   const handleModalConfirm = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     await uploadFile();
//   };

//   const uploadFile = async () => {
//     if (!file || !selectedBranchId || !selectedType) {
//       showError('Please select all required fields');
//       return;
//     }

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const url = endpoint.includes('?') 
//         ? `${endpoint}&type=${selectedType}&branch_id=${selectedBranchId}`
//         : `${endpoint}?type=${selectedType}&branch_id=${selectedBranchId}`;

//       const response = await axiosInstance.post(url, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       await showFormSubmitToast(response.data.message || 'File imported successfully!');

//       if (onSuccess) {
//         onSuccess();
//       }
      
//       // Reset everything after success
//       resetForm();
//       setShowModal(false);
      
//     } catch (error) {
//       console.error('Error uploading file:', error);

//       if (error.response) {
//         console.error('Server response:', error.response.data);
//         if (error.response.data.error && error.response.data.error.includes('Type is required')) {
//           setTypeError('Please select a valid vehicle type (EV or ICE)');
//         }
//       }

//       showFormSubmitError(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedBranchId('');
//     setSelectedType('');
//     setBranchError('');
//     setTypeError('');
//     setFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleModalCancel = () => {
//     resetForm();
//     setShowModal(false);
//   };

//   return (
//     <div className="import-csv-container">
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         onChange={handleFileChange} 
//         accept={acceptedFiles} 
//         style={{ display: 'none' }}
//       />
      
//       <CButton 
//         className="action-btn me-1" 
//         onClick={handleButtonClick} 
//         disabled={isLoading || branches.length === 0}
//       >
//         {isLoading ? 'Uploading...' : buttonText}
//       </CButton>

//       <CModal 
//         visible={showModal} 
//         onClose={handleModalCancel}
//         backdrop={true}
//       >
//         <CModalHeader closeButton>
//           <CModalTitle>Import CSV</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <div className="mb-3">
//             <label className="form-label">Branch:</label>
//             <CFormSelect
//               value={selectedBranchId}
//               onChange={(e) => {
//                 setSelectedBranchId(e.target.value);
//                 setBranchError('');
//               }}
//               className={branchError ? 'is-invalid' : ''}
//               disabled={isLoading}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((branch) => (
//                 <option key={branch._id} value={branch._id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </CFormSelect>
//             {branchError && <div className="text-danger small mt-1">{branchError}</div>}
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Vehicle Type:</label>
//             <CFormSelect
//               value={selectedType}
//               onChange={(e) => {
//                 setSelectedType(e.target.value);
//                 setTypeError('');
//               }}
//               className={typeError ? 'is-invalid' : ''}
//               disabled={isLoading}
//             >
//               <option value="">-- Select Vehicle Type --</option>
//               <option value="EV">EV</option>
//               <option value="ICE">ICE</option>
//             </CFormSelect>
//             {typeError && <div className="text-danger small mt-1">{typeError}</div>}
//           </div>
          
//           <div className="mb-3">
//             <label className="form-label">CSV File:</label>
//             <div className="d-flex align-items-center">
//               {file ? (
//                 <div className="alert alert-success py-2 mb-0 flex-grow-1">
//                   <strong>Selected:</strong> {file.name}
//                 </div>
//               ) : (
//                 <div className="alert alert-warning py-2 mb-0 flex-grow-1">
//                   No file selected
//                 </div>
//               )}
//               <CButton 
//                 color="primary" 
//                 className="ms-2" 
//                 onClick={handleSelectFile}
//                 disabled={isLoading}
//               >
//                 {file ? 'Change File' : 'Select File'}
//               </CButton>
//             </div>
//           </div>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={handleModalCancel} disabled={isLoading}>
//             Cancel
//           </CButton>
//           <CButton 
//             className='submit-button' 
//             onClick={handleModalConfirm}
//             disabled={isLoading || !file || !selectedBranchId || !selectedType}
//           >
//             {isLoading ? 'Uploading...' : 'Upload'}
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   );
// };

// export default ImportInwardCSV;