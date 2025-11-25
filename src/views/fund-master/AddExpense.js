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
import { showError, axiosInstance } from '../../utils/tableImports';
import '../../css/form.css';

const AddExpense = ({ show, onClose, onExpenseSaved, editingExpense }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        name: editingExpense.name || ''
      });
    } else {
      resetForm();
    }
  }, [editingExpense, show]);

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
      errors.name = 'Expense name is required';
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
      if (editingExpense) {
        await axiosInstance.put(`/expense-accounts/${editingExpense.id}`, formData);
        onExpenseSaved('Expense updated successfully');
      } else {
        await axiosInstance.post('/expense-accounts', formData);
        onExpenseSaved('Expense added successfully');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
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
        <CModalTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CRow className="mb-3">
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Expense Name <span className="required">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  invalid={!!formErrors.name}
                />
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
            {submitting ? <CSpinner size="sm" /> : (editingExpense ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddExpense;