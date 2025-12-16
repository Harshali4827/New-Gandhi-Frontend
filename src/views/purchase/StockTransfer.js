import React, { useState, useEffect, useRef } from 'react';
import '../../css/form.css';
import './challan.css';
import {
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck,
  CFormInput,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilSearch} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { showError,showSuccess } from '../../utils/sweetAlerts';
import axiosInstance from '../../axiosInstance';
import TransferChallan from './StockChallan';

function StockTransfer() {
  const [formData, setFormData] = useState({
    fromBranch: '',
    toType: 'branch',
    toBranch: '',
    toSubdealer: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [subdealers, setSubdealers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get('/branches');
        setBranches(response.data.data || []);
      } catch (error) {
        const message = showError(error);
        if (message) {
          setError(message);
        }
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchSubdealers = async () => {
      if (formData.fromBranch) {
        try {
          const response = await axiosInstance.get(`/subdealers/branch/${formData.fromBranch}`);
          setSubdealers(response.data.data?.subdealers || []);
        } catch (error) {
          const message = showError(error); 
          if (message) setError(message);
        }
      } else {
        setSubdealers([]);
      }
    };

    fetchSubdealers();
  }, [formData.fromBranch]);

  const fetchVehiclesForBranch = async (branchId) => {
    try {
      const res = await axiosInstance.get(`/vehicles/branch/${branchId}?locationType=branch`);
      const inStockVehicles = (res.data.data.vehicles || []).filter((vehicle) => vehicle.status === 'in_stock');
      setVehicles(inStockVehicles);
      setFilteredVehicles(inStockVehicles);
      setSelectedVehicles([]);
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = vehicles.filter((vehicle) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (vehicle.chassisNumber && vehicle.chassisNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.engineNumber && vehicle.engineNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.motorNumber && vehicle.motorNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.model?.model_name && vehicle.model.model_name.toLowerCase().includes(searchLower)) ||
          (vehicle.type && vehicle.type.toLowerCase().includes(searchLower)) ||
          (vehicle.batteryNumber && vehicle.batteryNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.keyNumber && vehicle.keyNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.chargerNumber && vehicle.chargerNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.unloadLocation?.name && vehicle.unloadLocation.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'toType') {
      setFormData(prevData => ({ 
        ...prevData, 
        [name]: value,
        toBranch: '',
        toSubdealer: ''
      }));
    } else if (name === 'fromBranch') {
      setFormData(prevData => ({ 
        ...prevData, 
        [name]: value,
        toBranch: '',
        toSubdealer: ''
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'fromBranch' && value) {
      fetchVehiclesForBranch(value);
    } else if (name === 'fromBranch') {
      setVehicles([]);
      setFilteredVehicles([]);
      setSelectedVehicles([]);
      setSubdealers([]);
    }
  };

  const handleVehicleSelect = (vehicleId, isSelected) => {
    setSelectedVehicles((prev) => {
      if (isSelected) {
        return [...prev, vehicleId];
      } else {
        return prev.filter((id) => id !== vehicleId);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {};
    
    if (!formData.fromBranch) newErrors.fromBranch = 'From branch is required';
    if (!formData.toType) newErrors.toType = 'Type is required';
    
    if (formData.toType === 'branch' && !formData.toBranch) {
      newErrors.toBranch = 'To branch is required';
    } else if (formData.toType === 'subdealer' && !formData.toSubdealer) {
      newErrors.toSubdealer = 'Subdealer is required';
    }
    
    if (selectedVehicles.length === 0) newErrors.vehicles = 'Please select at least one vehicle';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        fromBranch: formData.fromBranch,
        toType: formData.toType,
        toBranch: formData.toType === 'branch' ? formData.toBranch : undefined,
        toSubdealer: formData.toType === 'subdealer' ? formData.toSubdealer : undefined,
        items: selectedVehicles.map((vehicleId) => ({ vehicle: vehicleId }))
      };

      const response = await axiosInstance.post('/transfers', payload);

      const fromBranchData = branches.find((b) => b._id === formData.fromBranch);
      
      let toBranchData = null;
      let toSubdealerData = null;
      let destinationName = '';
      
      if (formData.toType === 'branch') {
        toBranchData = branches.find((b) => b._id === formData.toBranch);
        destinationName = toBranchData?.name || '';
      } else {
        toSubdealerData = subdealers.find((s) => s._id === formData.toSubdealer);
        destinationName = toSubdealerData?.name || '';
      }
      
      const selectedVehicleData = vehicles.filter((v) => selectedVehicles.includes(v._id));

      setChallanData({
        transferDetails: response.data,
        fromBranch: fromBranchData,
        toBranch: toBranchData,
        toSubdealer: toSubdealerData,
        toType: formData.toType,
        vehicles: selectedVehicleData,
        destinationName: destinationName
      });

      showSuccess('Stock transferred successfully!').then(() => {
        setShowChallanModal(true);
      });

      setFormData({ 
        fromBranch: formData.fromBranch, 
        toType: 'branch',
        toBranch: '', 
        toSubdealer: '' 
      });
      fetchVehiclesForBranch(formData.fromBranch);
      setSelectedVehicles([]);
    } catch (error) {
      const message = showError(error); 
  if (message) setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/upload-challan');
  };

  const handleCloseModal = () => {
    setShowChallanModal(false);
  };

  return (
    <div className="form-container">
      <div className="title">TRANSFER STOCK TO NETWORK</div>
      {error && <CAlert color="danger">{error}</CAlert>}
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">From Branch</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="fromBranch" 
                    value={formData.fromBranch} 
                    onChange={handleChange} 
                    invalid={!!errors.fromBranch}
                    disabled={isSubmitting}
                  >
                    <option value="">-Select-</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.fromBranch && <div className="invalid-feedback">{errors.fromBranch}</div>}
              </div>

              {/* Type Field (Branch/Subdealer) */}
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Transfer Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="toType" 
                    value={formData.toType} 
                    onChange={handleChange} 
                    invalid={!!errors.toType}
                    disabled={!formData.fromBranch || isSubmitting}
                  >
                    <option value="branch">Branch</option>
                    <option value="subdealer">Subdealer</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.toType && <div className="invalid-feedback">{errors.toType}</div>}
              </div>

              {/* To Branch - Show only when type is 'branch' */}
              {formData.toType === 'branch' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">To Branch</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="toBranch" 
                      value={formData.toBranch} 
                      onChange={handleChange} 
                      invalid={!!errors.toBranch}
                      disabled={!formData.fromBranch || isSubmitting}
                    >
                      <option value="">-Select-</option>
                      {branches
                        .filter(branch => branch._id !== formData.fromBranch) // Exclude from branch
                        .map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.toBranch && <div className="invalid-feedback">{errors.toBranch}</div>}
                </div>
              )}

              {/* Subdealer - Show only when type is 'subdealer' */}
              {formData.toType === 'subdealer' && (
                <div className="input-box">
                  <div className="details-container">
                    <span className="details">To Subdealer</span>
                    <span className="required">*</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect 
                      name="toSubdealer" 
                      value={formData.toSubdealer} 
                      onChange={handleChange} 
                      invalid={!!errors.toSubdealer}
                      disabled={!formData.fromBranch || isSubmitting}
                    >
                      <option value="">-Select-</option>
                      {subdealers.map((subdealer) => (
                        <option key={subdealer._id} value={subdealer._id}>
                          {subdealer.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {errors.toSubdealer && <div className="invalid-feedback">{errors.toSubdealer}</div>}
                </div>
              )}

              {errors.vehicles && <div className="alert alert-danger">{errors.vehicles}</div>}

            </div>
            <div className="form-footer">
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Transferring...' : 'Transfer'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={handleCancel} 
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
          </form>

          {vehicles.length > 0 && formData.fromBranch ? (
            <div className="vehicle-table mt-4 p-3">
              <h5>In-Stock Vehicle Details ({vehicles.length} vehicles available)</h5>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} style={{ width: '20px' }} />
                    </CInputGroupText>
                    <CFormInput
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by chassis, model, type..."
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6} className="text-end">
                  <span className="badge bg-info">
                    Selected: {selectedVehicles.length} vehicles
                  </span>
                </CCol>
              </CRow>

              <CTable striped bordered hover responsive>
                <CTableHead className="table-header-fixed">
                  <CTableRow>
                    <CTableHeaderCell>
                      Select
                    </CTableHeaderCell>
                    <CTableHeaderCell>Sr. No</CTableHeaderCell>
                    <CTableHeaderCell>Unload Location</CTableHeaderCell>
                    <CTableHeaderCell>Inward Date</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Vehicle Model</CTableHeaderCell>
                   <CTableHeaderCell>Color</CTableHeaderCell>
                    <CTableHeaderCell>Chassis No</CTableHeaderCell>
                    <CTableHeaderCell>Current Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                      <CTableRow key={vehicle._id}>
                        <CTableDataCell>
                          <CFormCheck
                            onChange={(e) => handleVehicleSelect(vehicle._id, e.target.checked)}
                            checked={selectedVehicles.includes(vehicle._id)}
                            disabled={isSubmitting}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{vehicle.unloadLocation?.name || ''}</CTableDataCell>
                        <CTableDataCell>{new Date(vehicle.createdAt).toLocaleDateString()}</CTableDataCell>
                        <CTableDataCell>{vehicle.type}</CTableDataCell>
                        <CTableDataCell>{vehicle.modelName || ''}</CTableDataCell>
                        <CTableDataCell>{vehicle.color?.name || ''}</CTableDataCell>
                        <CTableDataCell>{vehicle.chassisNumber}</CTableDataCell>
                        <CTableDataCell>{vehicle.status}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={9} className="text-center">
                        {searchTerm ? 'No vehicles match your search criteria' : 'No in-stock vehicles found'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>
          ) : formData.fromBranch ? (
            <div className="alert alert-info mt-4">No in-stock vehicles found for the selected branch.</div>
          ) : null}
        </div>
      </div>

      <CModal visible={showChallanModal} onClose={handleCloseModal} size="xl" scrollable>
        <CModalHeader closeButton>
          <CModalTitle>Transfer Challan Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {challanData && <TransferChallan {...challanData} />}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default StockTransfer;