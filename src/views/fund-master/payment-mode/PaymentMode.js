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
  CAlert,
  CRow,
  CCol
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import PaymentModeList from './PaymentModeList';
import '../../../css/form.css';

function PaymentMode() {
  const [formData, setFormData] = useState({ payment_mode: '' });
  const [formErrors, setFormErrors] = useState({});
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get('/banksubpaymentmodes');
      setPayments(response.data.data || []);
    } catch (error) {
      const message = showError(error);
        if (message) {
          setError(message);
        }
      setPayments([]);
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
    
    if (!formData.payment_mode.trim()) {
      errors.payment_mode = 'Payment mode is required';
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
      if (editingPayment) {
        await axiosInstance.put(`/banksubpaymentmodes/${editingPayment.id}`, formData);
        setSuccessMessage('Payment mode updated successfully');
      } else {
        await axiosInstance.post('/banksubpaymentmodes', formData);
        setSuccessMessage('Payment mode added successfully');
      }
      
      setTimeout(() => {
        setSuccessMessage('');
        resetForm();
        fetchPayments();
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error saving payment mode:', error);
      showError(error);
    
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ payment_mode: '' });
    setFormErrors({});
    setEditingPayment(null);
  };

  const handleShowAddModal = () => {
    setEditingPayment(null);
    setShowModal(true);
  };

  const handleShowEditModal = (payment) => {
    setEditingPayment(payment);
    setFormData({ payment_mode: payment.payment_mode || '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div>
      <div className='title'>Payment Mode Master</div>

      <PaymentModeList 
        payments={payments} 
        onDelete={fetchPayments}
        onEdit={handleShowEditModal}
        onAddNew={handleShowAddModal}
      />
      <CModal size="lg" visible={showModal} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>{editingPayment ? 'Edit Payment Mode' : 'Add New Payment Mode'}</CModalTitle>
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
                  <CFormLabel htmlFor="payment_mode">Payment Mode <span className="required">*</span></CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      id="payment_mode"
                      name="payment_mode"
                      value={formData.payment_mode}
                      onChange={handleInputChange}
                      invalid={!!formErrors.payment_mode}
                    />
                  </CInputGroup>
                  {formErrors.payment_mode && (
                    <div className="error-text">
                      {formErrors.payment_mode}
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
              {submitting ? <CSpinner size="sm" /> : (editingPayment ? 'Update' : 'Submit')}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  );
}

export default PaymentMode;