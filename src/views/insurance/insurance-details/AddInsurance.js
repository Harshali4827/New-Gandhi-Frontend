
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
import '../../../css/receipt.css';
import '../../../css/form.css';
import axiosInstance from '../../../axiosInstance';

const AddInsurance = ({ show, onClose, bookingData, insuranceData, onSuccess }) => {
  const isUpdate = !!insuranceData;

  const [formData, setFormData] = useState({
    booking: bookingData?.id || '',
    insuranceProvider: '',
    policyNumber: '',
    rsaPolicyNumber: '',
    cmsPolicyNumber: '',
    status: 'COMPLETED',
    remarks: '',
    document: null,
    document1: null,
    document2: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [insuranceProviders, setInsuranceProviders] = useState([]);

  useEffect(() => {
    const fetchInsuranceProviders = async () => {
      try {
        const response = await axiosInstance.get('/insurance-providers');
        setInsuranceProviders(response.data.data);
      } catch (error) {
        console.error('Error fetching insurance providers:', error);
      }
    };

    if (show) {
      fetchInsuranceProviders();
      if (isUpdate) {
        setFormData({
          booking: bookingData?.id || '',
          // insuranceProvider: insuranceData.insuranceProvider?.id || '',
          insuranceProvider: insuranceData.insuranceProvider || '',
          policyNumber: insuranceData.policyNumber || '',
          rsaPolicyNumber: insuranceData.rsaPolicyNumber || '',
          cmsPolicyNumber: insuranceData.cmsPolicyNumber || '',
          status: insuranceData.status || 'COMPLETED',
          remarks: insuranceData.remarks || '',
          document: null,
          document1: null,
          document2: null
        });
      } else {
        setFormData({
          booking: bookingData?.id || '',
          insuranceProvider: '',
          policyNumber: '',
          rsaPolicyNumber: '',
          cmsPolicyNumber: '',
          status: 'COMPLETED',
          remarks: '',
          document: null,
          document1: null,
          document2: null
        });
      }
      setErrors({});
      setSuccess(null);
    }
  }, [show, bookingData, insuranceData, isUpdate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider is required';
    if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      const submissionData = { ...formData, status };

      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      if (isUpdate) {
        await axiosInstance.put(`/insurance/${insuranceData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosInstance.post('/insurance', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setSuccess(`Insurance details successfully ${isUpdate ? 'updated' : status === 'COMPLETED' ? 'saved' : 'marked for later update'}!`);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Insurance error:', err);
      setErrors({
        general: err.response?.data?.message || `Failed to ${isUpdate ? 'update' : 'add'} insurance details. Please try again.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CBackdrop visible={show} className="modal-backdrop" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
      <CModal visible={show} onClose={onClose} size="lg" alignment="center">
        <CModalHeader>
          <CModalTitle>{isUpdate ? 'Update' : 'Add'} Insurance Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errors.general && <CAlert color="danger">{errors.general}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          <CRow className="mb-3">
            <CCol md={6}>
              <label className="form-label">Customer Name</label>
              <CFormInput
                type="text"
                value={bookingData?.customerDetails?.name || bookingData?.customerName || ''}
                readOnly
                className="bg-light"
              />
            </CCol>
            <CCol md={6}>
              <label className="form-label">Chassis Number</label>
              <CFormInput type="text" value={bookingData?.chassisNumber || ''} readOnly className="bg-light" />
            </CCol>
          </CRow>

          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Insurance Provider*</label>
                <CFormSelect
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  invalid={!!errors.insuranceProvider}
                >
                  <option value="">Select Provider</option>
                  {insuranceProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.provider_name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.insuranceProvider && <div className="invalid-feedback d-block">{errors.insuranceProvider}</div>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Policy Number*</label>
                <CFormInput
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  invalid={!!errors.policyNumber}
                />
                {errors.policyNumber && <div className="invalid-feedback d-block">{errors.policyNumber}</div>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">RSA Policy Number</label>
                <CFormInput
                  type="text"
                  name="rsaPolicyNumber"
                  value={formData.rsaPolicyNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">CMS Policy Number</label>
                <CFormInput
                  type="text"
                  name="cmsPolicyNumber"
                  value={formData.cmsPolicyNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Remarks</label>
                <CFormInput type="text" name="remarks" value={formData.remarks} onChange={handleChange} disabled={isLoading} />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Document</label>
                <CFormInput type="file" name="document" onChange={handleFileChange} disabled={isLoading} />
                {isUpdate && insuranceData.document && <small className="text-muted">Current file: {insuranceData.document}</small>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Document 1</label>
                <CFormInput type="file" name="document1" onChange={handleFileChange} disabled={isLoading} />
                {isUpdate && insuranceData.document1 && <small className="text-muted">Current file: {insuranceData.document1}</small>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Document 2</label>
                <CFormInput type="file" name="document2" onChange={handleFileChange} disabled={isLoading} />
                {isUpdate && insuranceData.document2 && <small className="text-muted">Current file: {insuranceData.document2}</small>}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between">
          <div>
            <CButton color="primary" onClick={() => handleSubmit('COMPLETED')} className="me-2" disabled={isLoading}>
              {isLoading ? 'Processing...' : isUpdate ? 'Update' : 'Save'}
            </CButton>
            {!isUpdate && (
              <CButton color="warning" onClick={() => handleSubmit('LATER')} className="me-2" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'I will update later'}
              </CButton>
            )}
          </div>
          <CButton color="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AddInsurance;
