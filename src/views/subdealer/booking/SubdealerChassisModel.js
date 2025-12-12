
import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CButton,
  CFormSelect,
  CSpinner,
  CFormInput,
  CFormTextarea,
  CForm
} from '@coreui/react';
import axiosInstance from 'src/axiosInstance.js';
import { showError } from 'src/utils/sweetAlerts';

const SubDealerChassisNumberModal = ({ show, onClose, onSave, isLoading, booking, isUpdate = false }) => {
  const [chassisNumber, setChassisNumber] = useState(booking?.chassisNumber || '');
  const [reason, setReason] = useState('');
  const [availableChassisNumbers, setAvailableChassisNumbers] = useState([]);
  const [availableChassisData, setAvailableChassisData] = useState([]);
  const [loadingChassisNumbers, setLoadingChassisNumbers] = useState(false);
  const [previousChassis, setPreviousChassis] = useState('');
  const [showNonFifoNote, setShowNonFifoNote] = useState(false);
  const [nonFifoReason, setNonFifoReason] = useState('');

  useEffect(() => {
    if (show && booking) {
      if (isUpdate) {
        setPreviousChassis(booking.chassisNumber || '');
      }
      fetchAvailableChassisNumbers();
    }
  }, [show, booking, isUpdate]);

  useEffect(() => {
    if (chassisNumber && availableChassisData.length > 0) {
      const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
      const oldestChassis = getOldestChassis();
      
      // Show note if selected chassis is not the oldest one (non-FIFO selection)
      const shouldShowNote = 
        selectedChassis && 
        oldestChassis && 
        selectedChassis.chassisNumber !== oldestChassis.chassisNumber;
      
      setShowNonFifoNote(shouldShowNote);
      
      // Reset reason when switching back to FIFO chassis
      if (selectedChassis && selectedChassis.ageInDays === oldestChassis?.ageInDays) {
        setNonFifoReason('');
      }
    }
  }, [chassisNumber, availableChassisData]);

  const fetchAvailableChassisNumbers = async () => {
    try {
      setLoadingChassisNumbers(true);
      const response = await axiosInstance.get(`/vehicles/model/${booking.model._id}/${booking.color._id}/chassis-numbers?subdealerId=${booking.subdealer}`);
      
      // Store the full chassis data objects
      const chassisData = response.data.data.chassisNumbers || [];
      
      // Sort by ageInDays (descending) - oldest first for FIFO
      const sortedData = [...chassisData].sort((a, b) => b.ageInDays - a.ageInDays);
      setAvailableChassisData(sortedData);
      
      // Extract chassis numbers from the objects
      const chassisNumbers = sortedData.map(item => item.chassisNumber);
      
      // Include the previous chassis number in available options if it's an update
      if (isUpdate && booking.chassisNumber && !chassisNumbers.includes(booking.chassisNumber)) {
        chassisNumbers.unshift(booking.chassisNumber);
        // Also add to data array
        sortedData.unshift({
          chassisNumber: booking.chassisNumber,
          age: 'Previously allocated',
          ageInDays: 0,
          addedDate: 'N/A'
        });
      }
      
      setAvailableChassisNumbers(chassisNumbers);

      if (!isUpdate && sortedData.length > 0) {
        setChassisNumber(sortedData[0].chassisNumber);
      }
    } catch (error) {
      console.error('Error fetching chassis numbers:', error);
      showError(error);
    } finally {
      setLoadingChassisNumbers(false);
    }
  };

  // Get the oldest chassis (FIFO - first in first out)
  const getOldestChassis = () => {
    if (availableChassisData.length === 0) return null;
    
    // Since we sorted by ageInDays descending, the first one is the oldest
    return availableChassisData[0];
  };

  const handleSubmit = () => {
    if (!chassisNumber.trim()) {
      showError('Please enter a chassis number');
      return;
    }
    if (isUpdate && !reason.trim()) {
      showError('Please enter a reason for updating');
      return;
    }
    if (showNonFifoNote && !nonFifoReason.trim()) {
      showError('Please enter a reason for selecting newer chassis while older chassis are available');
      return;
    }

    const selectedChassis = availableChassisData.find(chassis => chassis.chassisNumber === chassisNumber);
    const oldestChassis = getOldestChassis();
    const isNonFifoSelection = selectedChassis && oldestChassis && selectedChassis.ageInDays !== oldestChassis.ageInDays;

    const payload = {
      chassisNumber: chassisNumber.trim(),
      ...(isUpdate && { reason }),
      ...((showNonFifoNote || isNonFifoSelection) && nonFifoReason.trim() && { note: nonFifoReason.trim() })
    };

    onSave(payload);
  };

  // Helper function to format display text for chassis numbers
  const getChassisDisplayText = (chassis) => {
    const oldestChassis = getOldestChassis();
    const isOldest = oldestChassis && chassis.chassisNumber === oldestChassis.chassisNumber;
    const isPrevious = chassis.chassisNumber === previousChassis;
    
    let displayText = chassis.chassisNumber;
    
    // Show age/days information
    if (chassis.ageInDays !== undefined && chassis.ageInDays >= 0) {
      const days = chassis.ageInDays;
      if (days === 0) {
        displayText += ` (${chassis.age})`;
      } else {
        displayText += ` (${days} day${days !== 1 ? 's' : ''})`;
      }
    }
    
    // Add indicators
    if (isPrevious) {
      displayText += ' - Previous Allocation';
    } else if (isOldest) {
      displayText += ' - Oldest (FIFO)';
    }
    
    return displayText;
  };

  return (
    <CModal visible={show} onClose={onClose} alignment="center">
      <CModalHeader>
        <h5 className="modal-title">{isUpdate ? 'Update' : 'Allocate'} Chassis Number</h5>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel>Model: {booking?.model?.model_name}</CFormLabel>
          </div>
          <div className="mb-3">
            <CFormLabel>Color: {booking?.color?.name}</CFormLabel>
          </div>

          {isUpdate && previousChassis && (
            <div className="mb-3">
              <CFormLabel>Previously Allocated Chassis:</CFormLabel>
              <div className="form-control bg-light">{previousChassis}</div>
            </div>
          )}

          <div className="mb-3">
            <CFormLabel htmlFor="chassisNumber">{isUpdate ? 'New Chassis Number' : 'Chassis Number'}</CFormLabel>
            {loadingChassisNumbers ? (
              <div className="text-center">
                <CSpinner size="sm" />
                <span className="ms-2">Loading chassis numbers...</span>
              </div>
            ) : availableChassisNumbers.length > 0 ? (
              <>
                <CFormSelect 
                  value={chassisNumber} 
                  onChange={(e) => setChassisNumber(e.target.value)} 
                  required
                >
                  <option value="">Select a chassis number</option>
                  {availableChassisData.map((chassis) => (
                    <option key={chassis.chassisNumber} value={chassis.chassisNumber}>
                      {getChassisDisplayText(chassis)}
                    </option>
                  ))}
                </CFormSelect>
              </>
            ) : (
              <CFormInput
                type="text"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                placeholder="Enter chassis number"
                required
              />
            )}
          </div>

          {showNonFifoNote && (
            <div className="mb-3">
              <CFormLabel htmlFor="nonFifoReason">
                Note<span className="text-danger">*</span>
              </CFormLabel>
              <CFormTextarea
                id="nonFifoReason"
                value={nonFifoReason}
                onChange={(e) => setNonFifoReason(e.target.value)}
                required
                rows={3}
                placeholder="Please provide a reason for selecting a newer chassis while older chassis are available"
              />
            </div>
          )}

          {isUpdate && (
            <div className="mb-3">
              <CFormLabel htmlFor="reason">Reason for Update</CFormLabel>
              <CFormTextarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Enter reason for changing chassis number"
              />
            </div>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </CButton>
        <CButton
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading || (loadingChassisNumbers && availableChassisNumbers.length === 0)}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SubDealerChassisNumberModal;