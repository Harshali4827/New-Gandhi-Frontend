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

    if (!selectedBranchId) {
      setBranchError('Please select a branch');
      isValid = false;
    } else {
      setBranchError('');
    }

    if (!selectedType) {
      setTypeError('Please select a type (EV / ICE)');
      isValid = false;
    } else {
      setTypeError('');
    }

    return isValid;
  };

  const handleModalConfirm = () => {
    if (validateForm()) {
      setShowModal(false);
      fileInputRef.current.click();
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedBranchId('');
    setSelectedType('');
    setBranchError('');
    setTypeError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateForm()) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const url = `${endpoint}?type=${selectedType}&branch_id=${selectedBranchId}`;

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
    } catch (error) {
      console.error('Error uploading file:', error);

      if (error.response) {
        console.error('Server response:', error.response.data);
        if (error.response.data.error === 'Type is required and must be EV or ICE') {
          setShowModal(true);
          setTypeError('Please select a valid vehicle type (EV or ICE)');
        }
      }

      showFormSubmitError(error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

      <CModal visible={showModal} onClose={handleModalCancel}>
        <CModalHeader>
          <CModalTitle>Import Excel</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
            {branchError && <div className="text-danger small mt-1">{branchError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Vehicle Type:</label>
            <CFormSelect
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
            Close
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