import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormTextarea,
  CButton,
  CSpinner,
  CAlert
} from '@coreui/react';
import { showError, showSuccess, axiosInstance } from '../../utils/tableImports';

const AllocateVehicleModal = ({ 
  vehicleId,
  visible,
  onClose,
  onSuccess,
  vehicleDetails
}) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [allocationNotes, setAllocationNotes] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && vehicleDetails) {
      fetchAvailableCustomers();
    }
  }, [visible, vehicleDetails]);

  const fetchAvailableCustomers = async () => {
    if (!vehicleDetails) return;

    try {
      setCustomerLoading(true);
      setError('');

      let colorId = '';
      if (vehicleDetails.colorId) {
        if (typeof vehicleDetails.colorId === 'object' && vehicleDetails.colorId._id) {
          colorId = vehicleDetails.colorId._id;
        } else if (typeof vehicleDetails.colorId === 'string') {
          colorId = vehicleDetails.colorId;
        }
      }
      const params = new URLSearchParams({
        model: vehicleDetails.modelId || '',
        color: colorId || '',
        branch: vehicleDetails.locationId || ''
      });

      console.log('Fetching customers with params:', params.toString());

      const response = await axiosInstance.get(`/bookings/payment-final?${params}`);
      
      if (response.data.success && response.data.data.length > 0) {
        const formattedCustomers = response.data.data.map(booking => ({
          id: booking.bookingId,
          bookingNumber: booking.bookingNumber,
          customerName: booking.customer?.name || 'N/A',
          mobile1: booking.customer?.mobile1 || '',
          customerId: booking.customer?.id || '',
          fullText: `${booking.bookingNumber} - ${booking.customer?.name || 'N/A'}`
        }));
        
        setCustomers(formattedCustomers);
      } else {
        setCustomers([]);
        setError('No customers found for this vehicle configuration.');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers. Please try again.');
      showError(error);
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!selectedCustomer) {
      showError('Please select a customer');
      return;
    }

    if (!allocationNotes.trim()) {
      showError('Please enter allocation notes');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/vehicles/allocate', {
        vehicleId,
        bookingId: selectedCustomer,
        notes: allocationNotes,
        allocationDate: new Date().toISOString()
      });

      if (response.data.success) {
        showSuccess('Vehicle allocated successfully!');
        onSuccess();
        resetModal();
      }
    } catch (error) {
      console.error('Error allocating vehicle:', error);
      showError(error.response?.data?.message || 'Failed to allocate vehicle');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setSelectedCustomer('');
    setAllocationNotes('');
    setError('');
    setCustomers([]);
    onClose();
  };

  return (
    <CModal visible={visible} onClose={resetModal} size="lg">
      <CModalHeader>
        <CModalTitle>Allocate Vehicle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <label className="form-label">
            Select Customer <span className="required">*</span>
          </label>
          
          {customerLoading ? (
            <div className="text-center">
              <CSpinner size="sm" className="me-2" />
              Loading customers...
            </div>
          ) : error ? (
            <CAlert color="warning">{error}</CAlert>
          ) : customers.length === 0 ? (
            <CAlert color="info">No customers found for allocation</CAlert>
          ) : (
            <CFormSelect
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullText}
                </option>
              ))}
            </CFormSelect>
          )}
        </div>

        {selectedCustomer && (
          <div className="mb-3 p-3 bg-light rounded">
            <h6>Selected Customer Details</h6>
            {(() => {
              const customer = customers.find(c => c.id === selectedCustomer);
              return customer ? (
                <>
                  <p><strong>Booking No:</strong> {customer.bookingNumber}</p>
                  <p><strong>Customer ID:</strong> {customer.customerId}</p>
                  <p><strong>Mobile:</strong> {customer.mobile1}</p>
                </>
              ) : null;
            })()}
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={resetModal}
          disabled={loading}
        >
          Cancel
        </CButton>
        <CButton 
          className="submit-button"
          onClick={handleAllocate}
        >
          {loading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Allocating...
            </>
          ) : (
            'Allocate Vehicle'
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AllocateVehicleModal;