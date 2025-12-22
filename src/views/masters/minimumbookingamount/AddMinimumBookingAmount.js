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
  CRow,
  CCol,
  CAlert
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const AddMinimumBookingAmount = ({ show, onClose, onSaved, editingItem }) => {
  const [formData, setFormData] = useState({
    type: '',
    model_id: '',
    min_amount: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelType, setModelType] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || '',
        model_id: editingItem.model_id?._id || '',
        min_amount: editingItem.min_amount || ''
      });
      setModelType(editingItem.type || '');
      if (editingItem.type) {
        fetchModelsByType(editingItem.type);
      }
    } else {
      resetForm();
    }
  }, [editingItem, show]);

  useEffect(() => {
    if (formData.type && formData.type !== modelType) {
      setModelType(formData.type);
      fetchModelsByType(formData.type);
      setFormData(prev => ({
        ...prev,
        model_id: ''
      }));
    }
  }, [formData.type]);

  const fetchModelsByType = async (type) => {
    if (!type) {
      setModels([]);
      return;
    }

    try {
      setLoadingModels(true);
      const response = await axiosInstance.get('/models/all/status', {
        params: { type }
      });
      const modelsData = response.data.data?.models || response.data.data || [];
      setModels(modelsData);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setLoadingModels(false);
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
    
    if (!formData.type.trim()) {
      errors.type = 'Type is required';
    }
    
    if (!formData.model_id.trim()) {
      errors.model_id = 'Model is required';
    }
    
    if (!formData.min_amount) {
      errors.min_amount = 'Minimum booking amount percentage is required';
    } else if (isNaN(formData.min_amount) || parseFloat(formData.min_amount) <= 0) {
      errors.min_amount = 'Please enter a valid positive percentage';
    } else if (parseFloat(formData.min_amount) > 100) {
      errors.min_amount = 'Percentage cannot exceed 100%';
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
        type: formData.type,
        model_id: formData.model_id,
        min_amount: parseFloat(formData.min_amount)
      };

      if (editingItem) {
        await axiosInstance.put(`/booking-min-amount/${editingItem._id}`, payload);
        onSaved('Minimum booking amount percentage updated successfully');
      } else {
        await axiosInstance.post('/booking-min-amount', payload);
        onSaved('Minimum booking amount percentage added successfully');
      }
    } catch (error) {
      console.error('Error saving minimum booking amount:', error);
      showError(error);
      
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setFormErrors({ general: error.response.data.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      model_id: '',
      min_amount: ''
    });
    setFormErrors({});
    setModels([]);
    setModelType('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getTypeOptions = () => {
    return [
      { value: '', label: 'Select Type' },
      { value: 'ICE', label: 'ICE' },
      { value: 'EV', label: 'EV' },
    
    ];
  };

  return (
    <CModal size="lg" visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingItem ? 'Edit Minimum Booking Amount' : 'Add New Minimum Booking Amount'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {formErrors.general && (
            <CAlert color="danger" className="mb-3">
              {formErrors.general}
            </CAlert>
          )}
          
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="type">Type <span className="required">*</span></CFormLabel>
                <CFormSelect
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  invalid={!!formErrors.type}
                  disabled={loadingModels || submitting}
                >
                  {getTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.type && (
                  <div className="error-text">
                    {formErrors.type}
                  </div>
                )}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="model_id">Model <span className="required">*</span></CFormLabel>
                <CFormSelect
                  id="model_id"
                  name="model_id"
                  value={formData.model_id}
                  onChange={handleInputChange}
                  invalid={!!formErrors.model_id}
                  disabled={!formData.type || loadingModels || submitting}
                >
                  <option value="">Select Model</option>
                  {models.map(model => (
                    <option key={model._id || model.id} value={model._id || model.id}>
                      {model.model_name}
                    </option>
                  ))}
                </CFormSelect>
                {loadingModels && (
                  <div className="text-muted small mt-1">
                    <CSpinner size="sm" /> Loading models...
                  </div>
                )}
                {formErrors.model_id && (
                  <div className="error-text">
                    {formErrors.model_id}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel htmlFor="min_amount">
                  Minimum Booking Amount (%) <span className="required">*</span>
                </CFormLabel>
                <div className="input-group">
                  <CFormInput
                    type="number"
                    id="min_amount"
                    name="min_amount"
                    value={formData.min_amount}
                    onChange={handleInputChange}
                    invalid={!!formErrors.min_amount}
                    disabled={submitting}
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter minimum booking amount percentage"
                  />
                  <span className="input-group-text">%</span>
                </div>
                <div className="form-text">
                  Enter the percentage of total amount (0.01 to 100)
                </div>
                {formErrors.min_amount && (
                  <div className="error-text">
                    {formErrors.min_amount}
                  </div>
                )}
              </div>
            </CCol>
          </CRow>
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
            disabled={submitting || loadingModels}
          >
            {submitting ? <CSpinner size="sm" /> : (editingItem ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddMinimumBookingAmount;