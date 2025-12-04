import axiosInstance from '../../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { showSuccess, showError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import '../../../css/form.css';
import FormButtons from '../../../utils/FormButtons';
import { CFormInput, CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
import { cilBike, cilDollar, cilTag } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const UpdateModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const branchId = queryParams.get('branch_id') || '';
  const [formData, setFormData] = useState({
    model_name: '',
    model_discount: 0,
    verticle_id: '',  // Added verticle_id field
    prices: []
  });
  const [verticles, setVerticles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVerticles();
    fetchModelDetails();
  }, [id, branchId]);

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setVerticles(verticlesData);
    } catch (error) {
      console.error('Error fetching verticles:', error);
    }
  };

  const fetchModelDetails = async () => {
    try {
      const res = await axiosInstance.get(`/models/${id}/with-prices?branch_id=${branchId}`);
      const model = res.data.data.model;
      
      // Extract verticle_id from model data
      const verticleId = model.verticle_id || model.verticle || '';
      
      setFormData({
        model_name: model.model_name,
        model_discount: model.model_discount || 0,
        verticle_id: verticleId,  // Set verticle_id
        prices: model.prices
      });
    } catch (err) {
      showError('Failed to load model details');
    }
  };

  const handlePriceChange = (headerId, newValue) => {
    setFormData((prev) => ({
      ...prev,
      prices: prev.prices.map((price) => (price.header_id === headerId ? { ...price, value: Number(newValue) } : price))
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate verticle field
    let formErrors = {};
    if (!formData.verticle_id) {
      formErrors.verticle_id = 'Verticle is required';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      const payload = {
        model_name: formData.model_name,
        model_discount: Number(formData.model_discount),
        verticle_id: formData.verticle_id,  // Include verticle_id in payload
        prices: formData.prices.map(({ header_id, value }) => ({
          header_id,
          value,
          branch_id: branchId
        }))
      };

      console.log('Payload being sent:', payload); // Debug log
      
      await axiosInstance.put(`/models/${id}/prices`, payload);
      showFormSubmitToast('Model updated successfully!');
      navigate('/model/model-list');
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Failed to update model');
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };

  return (
    <div className="form-container">
      <div className="title">Edit Model</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Model name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput type="text" name="model_name" value={formData.model_name} onChange={handleChange} readOnly disabled />
                </CInputGroup>
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Verticle</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilTag} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="verticle_id"
                    value={formData.verticle_id}
                    onChange={handleChange}
                  >
                    <option value="">-Select Verticle-</option>
                    {verticles
                      .filter(vertical => vertical.status === 'active')
                      .map((vertical) => (
                        <option key={vertical._id} value={vertical._id}>
                          {vertical.name}
                        </option>
                      ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                {verticles.filter(v => v.status === 'active').length === 0 && (
                  <small className="text-muted">No active verticles available.</small>
                )}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Branch ID</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBike} />
                  </CInputGroupText>
                  <CFormInput type="text" value={branchId} readOnly disabled />
                </CInputGroup>
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Discount</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput type="number" name="model_discount" value={formData.model_discount} onChange={handleChange} />
                </CInputGroup>
              </div>
              
              {formData.prices.map((price, index) => (
                <div className="input-box" key={price.header_id}>
                  <div className="details-container">
                    <span className="details">{price.header_key}</span>
                  </div>
                  <CInputGroup>
                    <CInputGroupText className="input-icon">
                      <CIcon icon={cilBike} />
                    </CInputGroupText>
                    <CFormInput type="number" value={price.value} onChange={(e) => handlePriceChange(price.header_id, e.target.value)} />
                  </CInputGroup>
                </div>
              ))}
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;