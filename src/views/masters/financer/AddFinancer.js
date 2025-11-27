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
  CCol,
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const AddFinancer = ({ show, onClose, onFinancerSaved, editingFinancer }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingFinancer) {
      setFormData({
        name: editingFinancer.name || ''
      });
    } else {
      resetForm();
    }
  }, [editingFinancer, show]);

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
      errors.name = 'Financer name is required';
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
      if (editingFinancer) {
        await axiosInstance.put(`/financers/providers/${editingFinancer.id}`, formData);
        onFinancerSaved('Financer updated successfully');
      } else {
        await axiosInstance.post('/financers/providers', formData);
        onFinancerSaved('Financer added successfully');
      }
    } catch (error) {
      console.error('Error saving financer:', error);
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
      name: ''
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
        <CModalTitle>{editingFinancer ? 'Edit Financer' : 'Add New Financer'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
        <CRow className="mb-3">
        <CCol md={6}>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Financer Name <span className="required">*</span></CFormLabel>
            <CInputGroup>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter financer name"
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
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : (editingFinancer ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddFinancer;