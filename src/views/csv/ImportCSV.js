import React, { useRef, useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import '../../css/importCsv.css';
import { showError, showFormSubmitError, showFormSubmitToast } from '../../utils/sweetAlerts';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormSelect, CFormLabel, CSpinner } from '@coreui/react';

const ImportCSV = ({ endpoint, onSuccess, buttonText = 'Import CSV', acceptedFiles = '.csv' }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [verticles, setVerticles] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedSubdealerId, setSelectedSubdealerId] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('');
  const [selectedVerticleId, setSelectedVerticleId] = useState('');
  const [exportTypeDialogOpen, setExportTypeDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [exportTarget, setExportTarget] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState({});

  useEffect(() => {
    fetchBranches();
    fetchSubdealers();
    fetchVerticles();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.error('Error fetching subdealers:', error);
    }
  };

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      console.log('Fetched verticles for import:', verticlesData);
      setVerticles(verticlesData);
    } catch (error) {
      console.error('Error fetching verticles', error);
    }
  };

  const validateImportForm = () => {
    const errors = {};
    
    if (!selectedModelType) {
      errors.modelType = 'Please select a model type.';
    } else if (!['EV', 'ICE', 'CSD'].includes(selectedModelType)) {
      errors.modelType = 'Please select a valid model type (EV, ICE, or CSD).';
    }
    
    if (exportTarget === 'branch' && !selectedBranchId) {
      errors.branch = 'Please select a branch.';
    }
    
    if (exportTarget === 'subdealer' && !selectedSubdealerId) {
      errors.subdealer = 'Please select a subdealer.';
    }
    
    // Verticle is required for import
    if (!selectedVerticleId) {
      errors.verticle = 'Please select a verticle.';
    }
    
    setImportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleButtonClick = () => {
    if (branches.length === 0 && subdealers.length === 0) {
      showError('Please ensure branches or subdealers exist before importing data.');
      return;
    }
    
    // Check if active verticles exist
    const activeVerticles = verticles.filter(v => v.status === 'active');
    if (activeVerticles.length === 0) {
      showError('No active verticles available. Please create an active verticle first.');
      return;
    }
    
    setExportTypeDialogOpen(true);
  };

  const handleExportTypeSelect = (type) => {
    setExportTarget(type);
    setExportTypeDialogOpen(false);
    setCsvDialogOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!(file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls'))) {
      showFormSubmitError({ response: { status: 400, data: { message: 'Please upload an Excel file (.xlsx or .xls).' } } });
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedModelType);
    formData.append('verticle_id', selectedVerticleId);

    // Only append branch_id or subdealer_id, not both
    if (exportTarget === 'branch') {
      formData.append('branch_id', selectedBranchId);
      // Ensure subdealer_id is not sent
      if (selectedSubdealerId) {
        formData.delete('subdealer_id');
      }
    } else if (exportTarget === 'subdealer') {
      formData.append('subdealer_id', selectedSubdealerId);
      // Ensure branch_id is not sent
      if (selectedBranchId) {
        formData.delete('branch_id');
      }
    }

    console.log('FormData being sent:', {
      type: selectedModelType,
      verticle_id: selectedVerticleId,
      branch_id: exportTarget === 'branch' ? selectedBranchId : undefined,
      subdealer_id: exportTarget === 'subdealer' ? selectedSubdealerId : undefined,
      filename: file.name
    });

    try {
      const response = await axiosInstance.post(endpoint, formData, {
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
      console.error('Error response:', error.response?.data);
      
      // More specific error handling
      if (error.response?.data?.error?.includes('Valid vehicle type')) {
        showFormSubmitError({
          response: {
            status: 400,
            data: { message: 'Invalid vehicle type. Please select EV, ICE, or CSD.' }
          }
        });
      } else if (error.response?.data?.error?.includes('verticle')) {
        showFormSubmitError({
          response: {
            status: 400,
            data: { message: 'Invalid verticle ID. Please select a valid active verticle.' }
          }
        });
      } else {
        showFormSubmitError(error);
      }
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // clearImportForm();
    }
  };

  const handleImportConfirm = () => {
    if (!validateImportForm()) return;

    setCsvDialogOpen(false);
    fileInputRef.current.click();
  };

  // const clearImportForm = () => {
  //   setSelectedBranchId('');
  //   setSelectedSubdealerId('');
  //   setSelectedModelType('');
  //   setSelectedVerticleId('');
  //   setExportTarget('');
  //   setImportErrors({});
  // };

  const handleCancelImport = () => {
    setCsvDialogOpen(false);
    // clearImportForm();
  };

  return (
    <div className="import-csv-container">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx,.xls" 
        style={{ display: 'none' }} 
      />
      <CButton
        size="sm" 
        className="action-btn me-1"
        onClick={handleButtonClick}
        disabled={isImporting || (branches.length === 0 && subdealers.length === 0)}
      >
        {isImporting ? (
          'Uploading...'
        ) : (
          <>
            <FontAwesomeIcon icon={faFileImport} className="import-icon" />
            {buttonText}
          </>
        )}
      </CButton>

      {/* Select Import Target Modal */}
      <CModal visible={exportTypeDialogOpen} onClose={() => setExportTypeDialogOpen(false)} alignment="center" size="sm">
        <CModalHeader className="p-3">
          <CModalTitle className="h5">Select Import Target</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-3 text-center">
          <div className="d-flex flex-column gap-2">
            <CButton
              color="primary"
              onClick={() => handleExportTypeSelect('branch')}
              size="sm"
              className="mb-1"
              disabled={branches.length === 0}
            >
              Branch
              {branches.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
            </CButton>
            <CButton 
              color="secondary" 
              onClick={() => handleExportTypeSelect('subdealer')} 
              size="sm" 
              disabled={subdealers.length === 0}
            >
              Subdealer
              {subdealers.length === 0 && <span className="ms-1 text-muted small">(None)</span>}
            </CButton>
          </div>
        </CModalBody>
        <CModalFooter className="p-2 justify-content-center">
          <CButton color="secondary" onClick={() => setExportTypeDialogOpen(false)} size="sm">
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Import CSV Modal */}
      <CModal visible={csvDialogOpen} onClose={handleCancelImport} alignment="center">
        <CModalHeader>
          <CModalTitle>Import Excel Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Vehicle Type <span className="text-danger">*</span></CFormLabel>
            <CFormSelect 
              value={selectedModelType} 
              onChange={(e) => {
                setSelectedModelType(e.target.value);
                setImportErrors(prev => ({ ...prev, modelType: '' }));
              }}
              className={importErrors.modelType ? 'is-invalid' : ''}
            >
              <option value="">-- Select Vehicle Type --</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
              <option value="CSD">CSD</option>
            </CFormSelect>
            {importErrors.modelType && <div className="invalid-feedback d-block">{importErrors.modelType}</div>}
            <small className="text-muted">Select EV, ICE, or CSD as per your data</small>
          </div>

          {/* Verticle selection - Now Required */}
          <div className="mb-3">
            <CFormLabel>Verticle <span className="text-danger">*</span></CFormLabel>
            <CFormSelect 
              value={selectedVerticleId} 
              onChange={(e) => {
                setSelectedVerticleId(e.target.value);
                setImportErrors(prev => ({ ...prev, verticle: '' }));
              }}
              className={importErrors.verticle ? 'is-invalid' : ''}
            >
              <option value="">-- Select Verticle --</option>
              {verticles
                .filter(vertical => vertical.status === 'active')
                .map((vertical) => (
                  <option key={vertical._id} value={vertical._id}>
                    {vertical.name}
                  </option>
                ))}
            </CFormSelect>
            {importErrors.verticle && <div className="invalid-feedback d-block">{importErrors.verticle}</div>}
            {verticles.filter(v => v.status === 'active').length === 0 && (
              <small className="text-danger">No active verticles available. Please create a verticle first.</small>
            )}
          </div>

          {exportTarget === 'branch' ? (
            <div className="mb-3">
              <CFormLabel>Branch <span className="text-danger">*</span></CFormLabel>
              <CFormSelect 
                value={selectedBranchId} 
                onChange={(e) => {
                  setSelectedBranchId(e.target.value);
                  setImportErrors(prev => ({ ...prev, branch: '' }));
                }}
                className={importErrors.branch ? 'is-invalid' : ''}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </CFormSelect>
              {importErrors.branch && <div className="invalid-feedback d-block">{importErrors.branch}</div>}
            </div>
          ) : (
            <div className="mb-3">
              <CFormLabel>Subdealer <span className="text-danger">*</span></CFormLabel>
              <CFormSelect 
                value={selectedSubdealerId} 
                onChange={(e) => {
                  setSelectedSubdealerId(e.target.value);
                  setImportErrors(prev => ({ ...prev, subdealer: '' }));
                }}
                className={importErrors.subdealer ? 'is-invalid' : ''}
              >
                <option value="">-- Select Subdealer --</option>
                {subdealers.map((subdealer) => (
                  <option key={subdealer._id} value={subdealer._id}>
                    {subdealer.name}
                  </option>
                ))}
              </CFormSelect>
              {importErrors.subdealer && <div className="invalid-feedback d-block">{importErrors.subdealer}</div>}
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancelImport} disabled={isImporting}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleImportConfirm}
            disabled={
              isImporting || 
              !selectedModelType || 
              !selectedVerticleId ||
              (exportTarget === 'branch' ? !selectedBranchId : !selectedSubdealerId)
            }
          >
            {isImporting ? (
              <>
                <CSpinner size="sm" />
                <span className="ms-2">Importing...</span>
              </>
            ) : (
              'Import'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ImportCSV;