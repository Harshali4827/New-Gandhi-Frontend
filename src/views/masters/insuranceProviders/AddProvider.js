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
  CButton,
  CSpinner,
  CInputGroup,
  CRow,
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const AddProvider = ({ show, onClose, onProviderSaved, editingProvider }) => {
  const [formData, setFormData] = useState({
    provider_name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingProvider) {
      setFormData({
        provider_name: editingProvider.provider_name || ''
      });
    } else {
      resetForm();
    }
  }, [editingProvider, show]);

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
    
    if (!formData.provider_name.trim()) {
      errors.provider_name = 'Provider name is required';
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
      if (editingProvider) {
        await axiosInstance.put(`/insurance-providers/${editingProvider.id}`, formData);
        onProviderSaved('Insurance provider updated successfully');
      } else {
        await axiosInstance.post('/insurance-providers', formData);
        onProviderSaved('Insurance provider added successfully');
      }
    } catch (error) {
      console.error('Error saving insurance provider:', error);
      showError(error);
    
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      provider_name: ''
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size='lg' visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingProvider ? 'Edit Insurance Provider' : 'Add New Insurance Provider'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
        <CRow className="mb-3">
        <CCol md={6}>
          <div className="mb-3">
            <CFormLabel htmlFor="provider_name">Provider Name <span className="required">*</span></CFormLabel>
            <CInputGroup>
              <CFormInput
                type="text"
                id="provider_name"
                name="provider_name"
                value={formData.provider_name}
                onChange={handleInputChange}
                invalid={!!formErrors.provider_name}
              />
            </CInputGroup>
            {formErrors.provider_name && (
              <div className="error-text">
                {formErrors.provider_name}
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
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : (editingProvider ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddProvider;