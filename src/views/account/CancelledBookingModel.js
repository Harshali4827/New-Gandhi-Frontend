import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CBackdrop,
  CAlert
} from '@coreui/react';
import '../../css/receipt.css';
import axiosInstance from '../../axiosInstance';

const CancelledBookingModel = ({ show, onClose, bookingData, onSuccess }) => {
  const [formData, setFormData] = useState({
    bookingId: bookingData?._id || '',
    modeOfPayment: '',
    amount: '',
    remark: '',
    cashLocation: '',
    bank: '',
    subPaymentMode: '',
    transactionReference: '',
    refundReason: ''
  });

  const [cashLocations, setCashLocations] = useState([]);
  const [bankLocations, setBankLocations] = useState([]);
  const [paymentSubModes, setPaymentSubModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Calculate maximum refundable amount
  const calculateMaxRefund = () => {
    if (!bookingData?.financials) return 0;
    
    const totalReceived = bookingData.financials.received || 0;
    const cancellationCharges = bookingData.financials.cancellationCharges || 0;
    
    // Refund amount = Total received - cancellation charges
    return Math.max(0, totalReceived - cancellationCharges);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const maxRefund = calculateMaxRefund();
  const refundAmount = parseFloat(formData.amount) || 0;
  
  // Removed this validation:
  // if (refundAmount > maxRefund) {
  //   setError(`Amount cannot exceed maximum refundable amount: ₹${maxRefund.toLocaleString('en-IN')}`);
  //   return;
  // }
  
  if (refundAmount <= 0) {
    setError('Refund amount must be greater than 0');
    return;
  }
  
  if (!formData.modeOfPayment) {
    setError('Please select mode of payment');
    return;
  }
  
  setIsLoading(true);
  setError(null);
  setSuccess(null);

  try {
    let paymentData = {
      bookingId: formData.bookingId,
      paymentMode: formData.modeOfPayment,
      amount: refundAmount,
      remark: formData.remark,
      transactionReference: formData.transactionReference,
      refundReason: formData.refundReason,
      type: 'CANCELLATION_REFUND'
    };

    // Add payment specific fields
    switch (formData.modeOfPayment) {
      case 'Cash':
        if (!formData.cashLocation) {
          setError('Please select cash location');
          setIsLoading(false);
          return;
        }
        paymentData.cashLocation = formData.cashLocation;
        break;
      case 'Bank':
        if (!formData.bank) {
          setError('Please select bank location');
          setIsLoading(false);
          return;
        }
        if (!formData.subPaymentMode) {
          setError('Please select payment sub mode');
          setIsLoading(false);
          return;
        }
        paymentData.bank = formData.bank;
        paymentData.subPaymentMode = formData.subPaymentMode;
        break;
      default:
        break;
    }

    const response = await axiosInstance.post('/ledger/process/refund', paymentData);

    setSuccess('Refund processed successfully!');
    console.log('Refund response:', response.data);

    // Reset form
    setFormData({
      bookingId: bookingData?._id || '',
      modeOfPayment: '',
      amount: '',
      remark: '',
      cashLocation: '',
      bank: '',
      subPaymentMode: '',
      transactionReference: '',
      refundReason: ''
    });
    
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess(); // Refresh parent data
    }, 2000);
    
  } catch (err) {
    console.error('Refund processing error:', err);
    setError(err.response?.data?.error || err.response?.data?.message || 'Failed to process refund. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  const renderPaymentSpecificFields = () => {
    switch (formData.modeOfPayment) {
      case 'Cash':
        return (
          <CCol md={6}>
            <label className="form-label">Cash Location</label>
            <CFormSelect 
              name="cashLocation" 
              value={formData.cashLocation} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            >
              <option value="">Select Cash Location</option>
              {cashLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        );
      case 'Bank':
        return (
          <>
            <CCol md={6}>
              <label className="form-label">Payment Sub Mode</label>
              <CFormSelect 
                name="subPaymentMode" 
                value={formData.subPaymentMode} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
              >
                <option value="">Select Payment Sub Mode</option>
                {paymentSubModes.map((subMode) => (
                  <option key={subMode.id} value={subMode.id}>
                    {subMode.payment_mode}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <label className="form-label">Bank Location</label>
              <CFormSelect 
                name="bank" 
                value={formData.bank} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
              >
                <option value="">Select Bank Location</option>
                {bankLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchCashLocations = async () => {
      try {
        const response = await axiosInstance.get('/cash-locations');
        setCashLocations(response.data.data.cashLocations);
      } catch (error) {
        console.error('Error fetching cash locations:', error);
      }
    };

    const fetchBankLocations = async () => {
      try {
        const response = await axiosInstance.get('/banks');
        setBankLocations(response.data.data.banks);
      } catch (error) {
        console.error('Error fetching bank locations:', error);
      }
    };

    const fetchPaymentSubModes = async () => {
      try {
        const response = await axiosInstance.get('/banksubpaymentmodes');
        setPaymentSubModes(response.data.data || []);
      } catch (error) {
        console.error('Error fetching payment sub-modes:', error);
        setPaymentSubModes([]);
      }
    };

    if (show) {
      fetchCashLocations();
      fetchBankLocations();
      fetchPaymentSubModes();

      const maxRefund = calculateMaxRefund();
      
      setFormData({
        bookingId: bookingData?._id || '',
        modeOfPayment: '',
        amount: maxRefund > 0 ? maxRefund.toString() : '',
        remark: '',
        cashLocation: '',
        bank: '',
        subPaymentMode: '',
        transactionReference: '',
        refundReason: bookingData?.cancellationRequest?.reason || ''
      });
      setError(null);
      setSuccess(null);
    }
  }, [show, bookingData]);

  const maxRefund = calculateMaxRefund();

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal 
        visible={show} 
        onClose={onClose} 
        size="lg" 
        alignment="center"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Cancellation Refund</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput 
                type="text" 
                value={bookingData?.customer?.name || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Booking Number</label>
              <CFormInput 
                type="text" 
                value={bookingData?.bookingNumber || ''} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Total Received</label>
              <CFormInput 
                type="text" 
                value={`₹${bookingData?.financials?.received?.toLocaleString('en-IN') || '0'}`} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Cancellation Charges</label>
              <CFormInput 
                type="text" 
                value={`₹${bookingData?.financials?.cancellationCharges?.toLocaleString('en-IN') || '0'}`} 
                readOnly 
                className="bg-light" 
              />
            </CCol>
          </CRow>
          
          <CRow className="mb-3">
            <CCol md={12}>
              <label className="form-label text-primary">
                Maximum Refundable Amount: ₹{maxRefund.toLocaleString('en-IN')}
              </label>
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Amount (₹)</label>
                <CFormInput
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  max={maxRefund}
                  step="0.01"
                  disabled={isLoading}
                  placeholder="Enter refund amount"
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Mode of Payment</label>
                <CFormSelect 
                  name="modeOfPayment" 
                  value={formData.modeOfPayment} 
                  onChange={handleChange} 
                  disabled={isLoading}
                >
                  <option value="">--Select--</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              {renderPaymentSpecificFields()}
            </CRow>
            
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Refund Reason</label>
                <CFormInput 
                  type="text" 
                  name="refundReason" 
                  value={formData.refundReason} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Enter refund reason"
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Reference Number</label>
                <CFormInput 
                  type="text" 
                  name="transactionReference" 
                  value={formData.transactionReference} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Enter transaction reference"
                />
              </CCol>
            </CRow>
            
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Remark</label>
                <CFormInput 
                  type="text" 
                  name="remark" 
                  value={formData.remark} 
                  onChange={handleChange} 
                  disabled={isLoading}
                  placeholder="Enter any remarks..." 
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="primary" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Save Payment'}
          </CButton>
          <CButton 
            color="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CancelledBookingModel;