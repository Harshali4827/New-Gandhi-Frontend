import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CFormTextarea
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
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);

  useEffect(() => {
    if (visible && vehicleId) {
      fetchEligibleCustomers();
    } else {
      resetModal();
    }
  }, [visible, vehicleId]);

  const fetchEligibleCustomers = async () => {
    if (!vehicleId) {
      setError('Vehicle ID is required');
      return;
    }

    try {
      setCustomerLoading(true);
      setError('');
      setCustomers([]);
      setSelectedCustomer('');
      setSelectedCustomerDetails(null);

      console.log(`Fetching eligible customers for vehicle: ${vehicleId}`);
      
      const response = await axiosInstance.get(`/vehicles/${vehicleId}/eligible-customers`);
      
      if (response.data.status === 'success' && response.data.data.eligibleCustomers.length > 0) {
        const eligibleCustomers = response.data.data.eligibleCustomers;
        
        const formattedCustomers = eligibleCustomers.map((customer, index) => {

          const source = customer.source || 'BOOKING';

          let displayText = '';
          if (source === 'WAITING_LIST_WITH_BOOKING') {
            displayText = `${customer.bookingNumber} - ${customer.customerName} (Waiting List)`;
          } else if (source === 'WAITING_LIST_DIRECT') {
            displayText = `${customer.customerName} (Waiting List - Direct)`;
          } else {
            displayText = `${customer.bookingNumber} - ${customer.customerName}`;
          }

          displayText += ` - ${customer.eligibilityReason || 'Eligible'}`;
          
          return {
            id: customer.bookingId || customer.waitingListId || index,
            bookingId: customer.bookingId,
            bookingNumber: customer.bookingNumber,
            customerName: customer.customerName,
            customerId: customer.customerId,
            mobile: customer.customerMobile || '',
            source: source,
            waitingListId: customer.waitingListId,
            eligibilityReason: customer.eligibilityReason,
            paymentType: customer.paymentType,
            receivedAmount: customer.receivedAmount,
            discountedAmount: customer.discountedAmount,
            receivedPercentage: customer.receivedPercentage,
            priorityScore: customer.priorityScore,
            displayText: displayText,
            fullDetails: customer
          };
        });
        
        setCustomers(formattedCustomers);
        console.log(`Found ${formattedCustomers.length} eligible customers`);
      } else {
        setCustomers([]);
        setError('No eligible customers found for this vehicle. Ensure customers meet minimum payment requirements.');
      }
    } catch (error) {
      console.error('Error fetching eligible customers:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to fetch eligible customers. Please try again.';
      setError(errorMessage);
      showError(error);
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomerDetails(customer.fullDetails);
    } else {
      setSelectedCustomerDetails(null);
    }
  };

  // AllocateVehicleModal.js - Update the handleAllocate function
const handleAllocate = async () => {
  if (!selectedCustomer) {
    showError('Please select a customer');
    return;
  }

  if (!allocationNotes.trim()) {
    showError('Please enter allocation notes');
    return;
  }

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
  if (!selectedCustomerData) {
    showError('Invalid customer selection');
    return;
  }

  setLoading(true);
  try {
    const payload = {
      waitingListId: selectedCustomerData.waitingListId,
      allocationNotes: allocationNotes
    };

    // Add bookingId if available
    if (selectedCustomerData.bookingId) {
      payload.bookingId = selectedCustomerData.bookingId;
    }

    // Add customerName if available
    if (selectedCustomerData.customerName) {
      payload.customerName = selectedCustomerData.customerName;
    }

    console.log('Allocating frozen vehicle with payload:', payload);

    const response = await axiosInstance.post(
      `/vehicles/${vehicleId}/allocate-frozen-to-customer`,
      payload
    );

    if (response.data.status === 'success') {
      showSuccess(`Frozen vehicle successfully allocated to ${response.data.data.vehicle.customerName}!`);
      onSuccess();
      resetModal();
    } else {
      showError(response.data.message || 'Allocation failed');
    }
  } catch (error) {
    console.error('Error allocating frozen vehicle:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Failed to allocate frozen vehicle';
    showError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const resetModal = () => {
    setSelectedCustomer('');
    setAllocationNotes('');
    setError('');
    setCustomers([]);
    setSelectedCustomerDetails(null);
    setCustomerLoading(false);
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Allocate Frozen Vehicle</CModalTitle>
      </CModalHeader>
      <CModalBody>

        <div className="mb-3">
          <label className="form-label">
            Select Customer <span className="required">*</span>
          </label>
          
          {customerLoading ? (
            <div className="text-center p-3">
              <CSpinner size="sm" className="me-2" />
              Loading eligible customers...
            </div>
          ) : error ? (
            <CAlert color="warning">{error}</CAlert>
          ) : customers.length === 0 ? (
            <CAlert color="info">
              No eligible customers found. Customers must:
              <ul className="mb-0 mt-2">
                <li>Have a booking/waiting list entry for this exact model and color</li>
                <li>Be at the same location (branch/subdealer)</li>
                <li>Meet minimum payment requirements (10% for cash, 20% downpayment for finance)</li>
              </ul>
            </CAlert>
          ) : (
            <div>
              <CFormSelect
                value={selectedCustomer}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.displayText}
                  </option>
                ))}
              </CFormSelect>
              <small className="text-muted">
                {customers.length} eligible customer(s) found. Sorted by priority score.
              </small>
            </div>
          )}
        </div>

        {/* Selected Customer Details */}
        {selectedCustomerDetails && (
          <div className="mb-3 p-3 bg-light rounded">
            <h6>Selected Customer Details</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Customer Name:</strong> {selectedCustomerDetails.customerName}</p>
                <p><strong>Customer ID:</strong> {selectedCustomerDetails.customerId || 'N/A'}</p>
                <p><strong>Booking No:</strong> {selectedCustomerDetails.bookingNumber || 'N/A'}</p>
                <p><strong>Payment Type:</strong> {selectedCustomerDetails.paymentType}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Total Amount:</strong> ₹{selectedCustomerDetails.totalAmount?.toLocaleString()}</p>
                <p><strong>Received:</strong> ₹{selectedCustomerDetails.receivedAmount?.toLocaleString()} ({selectedCustomerDetails.receivedPercentage?.toFixed(2)}%)</p>
              
              </div>
            </div>
          </div>
        )}
<div className="mb-3">
  <label className="form-label">
    Allocation Notes <span className="required">*</span>
  </label>
  <CFormTextarea
    value={allocationNotes}
    onChange={(e) => setAllocationNotes(e.target.value)}
    rows={3}
    required
  />
</div>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={onClose}
          disabled={loading || customerLoading}
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