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
  CAlert,
  CButtonGroup
} from '@coreui/react';
import { showError, axiosInstance } from 'src/utils/tableImports';

const AddSubdealerAuditModal = ({ show, onClose, onSaved, editingAudit }) => {
  const [auditType, setAuditType] = useState('weekly'); // 'daily', 'weekly', 'monthly'
  const [formData, setFormData] = useState({
    subdealer: '',
    day: '',
    remarks: '',
    frequency: 'everyday', // for daily: 'everyday', 'weekdays', 'weekends'
    dayOfMonth: 1, // for monthly: 1-31
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
      const editingType = editingAudit.auditType || 'weekly';
      setAuditType(editingType);
      
      setFormData({
        subdealer: editingAudit.subdealer || editingAudit.subdealerDetails?._id || '',
        day: editingAudit.day || '',
        remarks: editingAudit.remarks || '',
        frequency: editingAudit.frequency || 'everyday',
        dayOfMonth: editingAudit.dayOfMonth || 1
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

  const handleAuditTypeChange = (type) => {
    setAuditType(type);
    // Reset validation errors when changing type
    setFormErrors({});
    
    // Reset frequency to default when switching to daily
    if (type === 'daily') {
      setFormData(prev => ({
        ...prev,
        frequency: 'everyday'
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.subdealer.trim()) {
      errors.subdealer = 'Subdealer is required';
    }
    
    if (!formData.remarks.trim()) {
      errors.remarks = 'Remarks are required';
    }

    // Validate based on audit type
    switch(auditType) {
      case 'weekly':
        if (!formData.day.trim()) {
          errors.day = 'Day is required for weekly audits';
        }
        break;
      case 'monthly':
        if (!formData.dayOfMonth) {
          errors.dayOfMonth = 'Day of month is required';
        } else if (formData.dayOfMonth < 1 || formData.dayOfMonth > 31) {
          errors.dayOfMonth = 'Day must be between 1 and 31';
        }
        break;
      case 'daily':
        if (!formData.frequency) {
          errors.frequency = 'Frequency is required for daily audits';
        }
        break;
      default:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const preparePayload = () => {
    const basePayload = {
      subdealer: formData.subdealer,
      remarks: formData.remarks,
      auditType: auditType
    };

    switch(auditType) {
      case 'daily':
        return {
          ...basePayload,
          frequency: formData.frequency
        };
      case 'weekly':
        return {
          ...basePayload,
          day: formData.day
        };
      case 'monthly':
        return {
          ...basePayload,
          dayOfMonth: parseInt(formData.dayOfMonth, 10)
        };
      default:
        return basePayload;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = preparePayload();

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
    setAuditType('weekly');
    setFormData({
      subdealer: '',
      day: '',
      remarks: '',
      frequency: 'everyday',
      dayOfMonth: 1
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

  const getFrequencyOptions = () => {
    return [
      { value: 'everyday', label: 'Everyday' },
      { value: 'weekdays', label: 'Weekdays (Mon-Fri)' },
      { value: 'weekends', label: 'Weekends (Sat-Sun)' }
    ];
  };

  const getDayOfMonthOptions = () => {
    const days = [{ value: '', label: 'Select Day of Month' }];
    for (let i = 1; i <= 31; i++) {
      days.push({ value: i, label: i.toString() });
    }
    return days;
  };

  return (
    <CModal visible={show} onClose={handleClose} size="lg">
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
          
          {/* Audit Type Buttons */}
          <div className="mb-4">
            <CFormLabel className="d-block mb-2">
              Audit Type <span className="required">*</span>
            </CFormLabel>
            <CButtonGroup role="group" aria-label="Audit type selection" className="w-100">
              <CButton
                color={auditType === 'daily' ? 'primary' : 'secondary'}
                onClick={() => handleAuditTypeChange('daily')}
                disabled={submitting}
                className="flex-fill"
              >
                Daily
              </CButton>
              <CButton
                color={auditType === 'weekly' ? 'primary' : 'secondary'}
                onClick={() => handleAuditTypeChange('weekly')}
                disabled={submitting}
                className="flex-fill"
              >
                Weekly
              </CButton>
              <CButton
                color={auditType === 'monthly' ? 'primary' : 'secondary'}
                onClick={() => handleAuditTypeChange('monthly')}
                disabled={submitting}
                className="flex-fill"
              >
                Monthly
              </CButton>
            </CButtonGroup>
          </div>
          
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
          
          {/* Dynamic Fields based on Audit Type */}
          {auditType === 'daily' && (
            <div className="mb-3">
              <CFormLabel htmlFor="frequency">
                Frequency <span className="required">*</span>
              </CFormLabel>
              <CFormSelect
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                invalid={!!formErrors.frequency}
                disabled={submitting}
              >
                {getFrequencyOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
              {formErrors.frequency && (
                <div className="error-text">
                  {formErrors.frequency}
                </div>
              )}
            </div>
          )}
          
          {auditType === 'weekly' && (
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
          )}
          
          {auditType === 'monthly' && (
            <div className="mb-3">
              <CFormLabel htmlFor="dayOfMonth">
                Day of Month <span className="required">*</span>
              </CFormLabel>
              <CFormSelect
                id="dayOfMonth"
                name="dayOfMonth"
                value={formData.dayOfMonth}
                onChange={handleInputChange}
                invalid={!!formErrors.dayOfMonth}
                disabled={submitting}
              >
                {getDayOfMonthOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CFormSelect>
              {formErrors.dayOfMonth && (
                <div className="error-text">
                  {formErrors.dayOfMonth}
                </div>
              )}
            </div>
          )}
          
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
              placeholder={`Enter audit remarks for ${auditType} audit`}
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