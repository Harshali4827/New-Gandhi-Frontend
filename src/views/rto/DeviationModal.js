import React, { useState, useEffect } from 'react';
import '../../css/form.css';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CAlert,
  CSpinner,
  CRow,
  CCol
} from '@coreui/react';
import { axiosInstance, showError } from '../../utils/tableImports';

function DeviationModal({ 
  show, 
  onClose, 
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [deviationData, setDeviationData] = useState({
    selectedBookingId: '',
    deviationAmount: '',
    deviationType: '',
    reason: '',
    note: '',
  });

  const deviationTypes = [
    { value: 'FINANCE', label: 'Finance' },
    { value: 'DOWNPAYMENT', label: 'Down Payment' },
  ];

  useEffect(() => {
    if (show) {
      setDeviationData({
        selectedBookingId: '',
        deviationAmount: '',
        deviationType: '',
        reason: '',
        note: '',
      });
      setError(null);
      setSuccess(false);
      setBookings([]); 
    }
  }, [show]);

  useEffect(() => {
    if (deviationData.deviationType && show) {
      fetchBookings(deviationData.deviationType);
    } else {
      setBookings([]); 
      setDeviationData(prev => ({ ...prev, selectedBookingId: '' }));
    }
  }, [deviationData.deviationType, show]);

  const fetchBookings = async (deviationType) => {
    try {
      setLoadingBookings(true);
      setBookings([]);
      setDeviationData(prev => ({ ...prev, selectedBookingId: '' })); 
      let apiUrl = '/bookings?status=ALLOCATED';
      

      if (deviationType === 'FINANCE') {
        apiUrl += '&paymentType=finance';
      } else if (deviationType === 'DOWNPAYMENT') {
        apiUrl += '&paymentType=cash';
      }

      console.log('Fetching bookings with URL:', apiUrl);
      
      const response = await axiosInstance.get(apiUrl);
      console.log('Bookings response:', response.data);
      
      // Check response structure and extract bookings
      if (response.data && response.data.data && response.data.data.bookings) {
        setBookings(response.data.data.bookings);
      } else if (response.data && response.data.bookings) {
        setBookings(response.data.bookings);
      } else if (Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setBookings([]);
      }
    } catch (error) {
      const message = showError(error);
      setError(`Failed to load bookings: ${message}`);
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'deviationType') {
      setDeviationData(prev => ({
        ...prev,
        [name]: value,
        selectedBookingId: '' 
      }));
    } else {
      setDeviationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deviationData.selectedBookingId) {
      setError('Please select a booking');
      return;
    }

    if (!deviationData.deviationAmount || !deviationData.deviationType || !deviationData.reason) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(deviationData.deviationAmount) || parseFloat(deviationData.deviationAmount) <= 0) {
      setError('Please enter a valid deviation amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        deviationAmount: parseFloat(deviationData.deviationAmount),
        deviationType: deviationData.deviationType,
        reason: deviationData.reason,
        note: deviationData.note || ''
      };

      console.log('Submitting deviation for booking:', deviationData.selectedBookingId);
      console.log('Payload:', payload);

      const response = await axiosInstance.post(
        `/freeze/apply-gm-deviation/${deviationData.selectedBookingId}`,
        payload
      );

      console.log('Deviation applied successfully:', response.data);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (error) {
      const message = showError(error);
      setError(message || 'Failed to apply deviation. Please try again.');
      console.error('Error applying deviation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal 
      visible={show} 
      onClose={onClose}
      size="lg"
      backdrop="static"
    >
      <CModalHeader onClose={onClose}>
        <CModalTitle>Add Deviation</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {success && (
          <CAlert color="success" className="mb-3">
            Deviation applied successfully!
          </CAlert>
        )}

        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="deviationType">
                Deviation Type <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="deviationType"
                name="deviationType"
                value={deviationData.deviationType}
                onChange={handleInputChange}
                disabled={loading}
                required
              >
                <option value="">Select deviation type</option>
                {deviationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            
            <CCol md={6}>
              <CFormLabel htmlFor="selectedBookingId">
                Select Booking <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                id="selectedBookingId"
                name="selectedBookingId"
                value={deviationData.selectedBookingId}
                onChange={handleInputChange}
                disabled={loading || loadingBookings || !deviationData.deviationType}
                required
              >
                <option value="">
                  {!deviationData.deviationType 
                    ? "Select deviation type first" 
                    : loadingBookings 
                    ? "Loading bookings..." 
                    : "Choose a booking..."
                  }
                </option>
                {bookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.bookingNumber} - {booking.customerDetails?.name || 'N/A'}
                    {/* -{booking.chassisNumber} */}
                  </option>
                ))}
              </CFormSelect>
              {deviationData.deviationType && bookings.length === 0 && !loadingBookings && (
                <div className="text-warning mt-1">
                  No bookings available for this deviation type
                </div>
              )}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="deviationAmount">
                Deviation Amount <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="deviationAmount"
                name="deviationAmount"
                type="number"
                min="0"
                step="0.01"
                value={deviationData.deviationAmount}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="note">
                Note
              </CFormLabel>
              <CFormInput
                id="note"
                name="note"
                type="text"
                value={deviationData.note}
                onChange={handleInputChange}
                disabled={loading}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel htmlFor="reason">
                Reason <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                id="reason"
                name="reason"
                value={deviationData.reason}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </CButton>
        <CButton 
          className='submit-button'
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Applying...
            </>
          ) : (
            'Apply Deviation'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default DeviationModal;