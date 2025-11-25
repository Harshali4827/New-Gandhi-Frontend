import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CRow,
  CCol
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLocationPin, cilUser } from '@coreui/icons';
import { showError, axiosInstance } from '../../utils/tableImports';
import '../../css/form.css';

const AddBank = ({ show, onClose, onBankSaved, editingBank }) => {
  const [formData, setFormData] = useState({
    name: '',
    branch: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [branches, setBranches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingBank) {
      // Pre-fill form with existing data when editing
      setFormData({
        name: editingBank.name || '',
        branch: editingBank.branch || ''
      });
    } else {
      // Reset form when adding new
      resetForm();
    }
  }, [editingBank, show]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
        showError(error);
      }
    };

    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Account name is required';
    }
    
    if (!formData.branch) {
      errors.branch = 'Location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (editingBank) {
        await axiosInstance.put(`/banks/${editingBank.id}`, formData);
        setSuccessMessage('Bank account updated successfully');
      } else {
        await axiosInstance.post('/banks', formData);
        setSuccessMessage('Bank account added successfully');
      }
      
      // Clear success message after 2 seconds and close modal
      setTimeout(() => {
        setSuccessMessage('');
        onBankSaved();
      }, 2000);
    } catch (error) {
      console.error('Error saving bank account:', error);
      showError(error);
    
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      branch: ''
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingBank ? 'Edit Bank Account' : 'Add New Bank Account'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {successMessage && (
            <CAlert color="success" className="mb-3">
              {successMessage}
            </CAlert>
          )}
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="branch">Location <span className="required">*</span></CFormLabel>
                <CInputGroup>
                  <CFormSelect 
                    id="branch"
                    name="branch" 
                    value={formData.branch} 
                    onChange={handleInputChange}
                    invalid={!!formErrors.branch}
                  >
                    <option value="">-Select Location-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {formErrors.branch && (
                  <div className="error-text">
                    {formErrors.branch}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Account Name <span className="required">*</span></CFormLabel>
                <CInputGroup>
                  <CFormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    invalid={!!formErrors.name}
                  />
                </CInputGroup>
                {formErrors.name && (
                  <div className="error-text">
                    {formErrors.name}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className='submit-button'
            type="submit"
            disabled={submitting || !!successMessage}
          >
            {submitting ? <CSpinner size="sm" /> : (editingBank ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddBank;