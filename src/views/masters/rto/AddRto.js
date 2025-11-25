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
  CRow,
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const AddRto = ({ show, onClose, onRtoSaved, editingRto }) => {
  const [formData, setFormData] = useState({
    rto_code: '',
    rto_name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRto) {
      setFormData({
        rto_code: editingRto.rto_code || '',
        rto_name: editingRto.rto_name || ''
      });
    } else {
      resetForm();
    }
  }, [editingRto, show]);

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
    
    if (!formData.rto_code.trim()) {
      errors.rto_code = 'RTO Code is required';
    }
    
    if (!formData.rto_name.trim()) {
      errors.rto_name = 'RTO Name is required';
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
      if (editingRto) {
        await axiosInstance.put(`/rtos/${editingRto.id}`, formData);
        onRtoSaved('RTO updated successfully');
      } else {
        await axiosInstance.post('/rtos', formData);
        onRtoSaved('RTO added successfully');
      }
    } catch (error) {
      console.error('Error saving RTO:', error);
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
      rto_code: '',
      rto_name: ''
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingRto ? 'Edit RTO' : 'Add New RTO'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="rto_code">RTO Code <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="rto_code"
                  name="rto_code"
                  value={formData.rto_code}
                  onChange={handleInputChange}
                  invalid={!!formErrors.rto_code}
                />
                {formErrors.rto_code && (
                  <div className="error-text">
                    {formErrors.rto_code}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="rto_name">RTO Name <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="rto_name"
                  name="rto_name"
                  value={formData.rto_name}
                  onChange={handleInputChange}
                  invalid={!!formErrors.rto_name}
                />
                {formErrors.rto_name && (
                  <div className="error-text">
                    {formErrors.rto_name}
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
            {submitting ? <CSpinner size="sm" /> : (editingRto ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddRto;