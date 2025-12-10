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
  CFormTextarea,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CAlert
} from '@coreui/react';
import { showError, axiosInstance } from 'src/utils/tableImports';

const AddSubdealerAuditModal = ({ show, onClose, onSaved, editingAudit }) => {
  const [formData, setFormData] = useState({
    subdealer: '',
    day: '',
    remarks: ''
  });
  
  const [subdealers, setSubdealers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingSubdealers, setLoadingSubdealers] = useState(false);

  useEffect(() => {
    if (show) {
      fetchSubdealers();
    }
    
    if (editingAudit) {
      setFormData({
        subdealer: editingAudit.subdealer || editingAudit.subdealerDetails?._id || '',
        day: editingAudit.day || '',
        remarks: editingAudit.remarks || ''
      });
    } else {
      resetForm();
    }
  }, [editingAudit, show]);

  const fetchSubdealers = async () => {
    try {
      setLoadingSubdealers(true);
      const response = await axiosInstance.get('/subdealers');
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      console.log('Error fetching subdealers', error);
    } finally {
      setLoadingSubdealers(false);
    }
  };

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
    
    if (!formData.subdealer.trim()) {
      errors.subdealer = 'Subdealer is required';
    }
    
    if (!formData.day.trim()) {
      errors.day = 'Day is required';
    }
    
    if (!formData.remarks.trim()) {
      errors.remarks = 'Remarks are required';
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
        subdealer: formData.subdealer,
        day: formData.day,
        remarks: formData.remarks
      };

      if (editingAudit) {
        await axiosInstance.put(`/subdealer-audits/${editingAudit._id}`, payload);
        onSaved('Audit schedule updated successfully');
      } else {
        await axiosInstance.post('/subdealer-audits', payload);
        onSaved('Audit schedule created successfully');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving audit schedule:', error);
      
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        showError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subdealer: '',
      day: '',
      remarks: ''
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getDayOptions = () => {
    return [
      { value: '', label: 'Select Day' },
      { value: 'sunday', label: 'Sunday' },
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' }
    ];
  };

  return (
    <CModal visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingAudit ? 'Edit Audit Schedule' : 'Add New Audit Schedule'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {formErrors.general && (
            <CAlert color="danger" className="mb-3">
              {formErrors.general}
            </CAlert>
          )}
          
          <div className="mb-3">
            <CFormLabel htmlFor="subdealer">
              Subdealer <span className="required">*</span>
            </CFormLabel>
            <CFormSelect
              id="subdealer"
              name="subdealer"
              value={formData.subdealer}
              onChange={handleInputChange}
              invalid={!!formErrors.subdealer}
              disabled={loadingSubdealers || submitting}
            >
              <option value="">Select Subdealer</option>
              {subdealers
                .filter(subdealer => subdealer.status === 'active')
                .map(subdealer => (
                  <option key={subdealer._id || subdealer.id} value={subdealer._id || subdealer.id}>
                    {subdealer.name} - {subdealer.location || 'N/A'}
                  </option>
                ))}
            </CFormSelect>
            {loadingSubdealers && (
              <div className="text-muted small mt-1">
                <CSpinner size="sm" /> Loading subdealers...
              </div>
            )}
            {formErrors.subdealer && (
              <div className="error-text">
                {formErrors.subdealer}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <CFormLabel htmlFor="day">
              Day <span className="required">*</span>
            </CFormLabel>
            <CFormSelect
              id="day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              invalid={!!formErrors.day}
              disabled={submitting}
            >
              {getDayOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CFormSelect>
            {formErrors.day && (
              <div className="error-text">
                {formErrors.day}
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <CFormLabel htmlFor="remarks">
              Remarks <span className="required">*</span>
            </CFormLabel>
            <CFormTextarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              invalid={!!formErrors.remarks}
              disabled={submitting}
              rows={3}
              placeholder="Enter audit remarks (e.g., Weekly stock audit)"
            />
            {formErrors.remarks && (
              <div className="error-text">
                {formErrors.remarks}
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            type="submit"
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : (editingAudit ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddSubdealerAuditModal;