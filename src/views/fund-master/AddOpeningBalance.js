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
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../utils/tableImports';
import '../../css/form.css';

const AddOpeningBalance = ({ show, onClose, onBalanceSaved, editingBranch }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBranch = !!storedUser.branch?._id;
  
  const [formData, setFormData] = useState({
    branch: hasBranch ? storedUser.branch?._id : '',
    amount: ''
  });
  const [branches, setBranches] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBranch) {
      setFormData({
        branch: editingBranch.id || editingBranch._id || '',
        amount: editingBranch.opening_balance?.toString() || ''
      });
    } else {
      resetForm();
    }
  }, [editingBranch, show]);

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
    
    if (!formData.branch) {
      errors.branch = 'Branch is required';
    }
    
    if (!formData.amount || isNaN(formData.amount)) {
      errors.amount = 'Valid amount is required';
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
        amount: parseFloat(formData.amount),
        note: editingBranch ? 'Updated opening balance' : 'Initial opening balance'
      };

      if (editingBranch) {
        await axiosInstance.patch(`/branches/${formData.branch}/opening-balance`, payload);
        onBalanceSaved('Opening balance updated successfully');
      } else {
        await axiosInstance.post(`/branches/${formData.branch}/opening-balance`, payload);
        onBalanceSaved('Opening balance added successfully');
      }
    } catch (error) {
      console.error('Error saving opening balance:', error);
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
      branch: hasBranch ? storedUser.branch?._id : '',
      amount: ''
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
        <CModalTitle>{editingBranch ? 'Update Opening Balance' : 'Add Opening Balance'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="branch">Branch <span className="required">*</span></CFormLabel>
                <CFormSelect 
                  id="branch"
                  name="branch" 
                  value={formData.branch} 
                  onChange={handleInputChange}
                  invalid={!!formErrors.branch}
                  disabled={submitting || hasBranch}
                >
                  <option value="">-Select-</option>
                  {branches.map((branch) => (
                    <option key={branch.id || branch._id} value={branch.id || branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.branch && (
                  <div className="error-text">
                    {formErrors.branch}
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="amount">Opening Balance Amount <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  invalid={!!formErrors.amount}
                  step="0.01"
                  min="0"
                />
                {formErrors.amount && (
                  <div className="error-text">
                    {formErrors.amount}
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
            {submitting ? <CSpinner size="sm" /> : (editingBranch ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddOpeningBalance;