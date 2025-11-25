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

const BrokerRange = ({ show, onClose, onRangeSaved, editingRange }) => {
  const [formData, setFormData] = useState({
    minAmount: '',
    maxAmount: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingRange) {
      setFormData({
        minAmount: editingRange.minAmount?.toString() || '',
        maxAmount: editingRange.maxAmount?.toString() || ''
      });
    } else {
      resetForm();
    }
  }, [editingRange, show]);

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
    
    if (!formData.minAmount.trim()) {
      errors.minAmount = 'Minimum amount is required';
    }
    
    if (!formData.maxAmount.trim()) {
      errors.maxAmount = 'Maximum amount is required';
    }

    // Validate that max amount is greater than min amount
    if (formData.minAmount && formData.maxAmount) {
      const min = parseFloat(formData.minAmount);
      const max = parseFloat(formData.maxAmount);
      if (min >= max) {
        errors.maxAmount = 'Maximum amount must be greater than minimum amount';
      }
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
      const payload = {
        minAmount: parseFloat(formData.minAmount),
        maxAmount: parseFloat(formData.maxAmount)
      };

      if (editingRange) {
        await axiosInstance.put(`/commission-ranges/${editingRange._id || editingRange.id}`, payload);
        onRangeSaved('Commission range updated successfully');
      } else {
        await axiosInstance.post('/commission-ranges', payload);
        onRangeSaved('Commission range added successfully');
      }
    } catch (error) {
      console.error('Error saving commission range:', error);
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
      minAmount: '',
      maxAmount: ''
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
        <CModalTitle>{editingRange ? 'Edit Commission Range' : 'Add New Commission Range'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="minAmount">Minimum Amount <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  invalid={!!formErrors.minAmount}
                  step="0.01"
                  min="0"
                />
                {formErrors.minAmount && (
                  <div className="error-text">
                    {formErrors.minAmount}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="maxAmount">Maximum Amount <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  value={formData.maxAmount}
                  onChange={handleInputChange}
                  invalid={!!formErrors.maxAmount}
                  step="0.01"
                  min="0"
                />
                {formErrors.maxAmount && (
                  <div className="error-text">
                    {formErrors.maxAmount}
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
            {submitting ? <CSpinner size="sm" /> : (editingRange ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default BrokerRange;