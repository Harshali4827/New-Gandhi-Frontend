import React, { useEffect, useState } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBike, cilCheckCircle, cilDollar, cilTag } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddModel() {
  const [formData, setFormData] = useState({
    model_name: '',
    type: '',
    model_discount: '',
    verticle_id: ''  // Changed from 'verticle' to 'verticle_id'
  });
  const [errors, setErrors] = useState({});
  const [verticles, setVerticles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchVerticles();
    if (id) {
      fetchModel(id);
    }
  }, [id]);

  const fetchVerticles = async () => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setVerticles(verticlesData);
    } catch (error) {
      console.error('Error fetching verticles:', error);
    }
  };

  const fetchModel = async (id) => {
    try {
      const res = await axiosInstance.get(`/models/id/${id}`);
      const modelData = res.data.data.model;
      
      // Check if the API returns verticle_id or verticle
      const verticleId = modelData.verticle_id || modelData.verticle || '';
      
      setFormData({
        model_name: modelData.model_name || '',
        type: modelData.type || '',
        model_discount: modelData.model_discount || '',
        verticle_id: verticleId  // Use verticle_id
      });
    } catch (error) {
      console.error('Error fetching model:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!formData.model_name) formErrors.model_name = 'This field is required';
    if (!formData.type) formErrors.type = 'Type is required';
    if (!formData.verticle_id) formErrors.verticle_id = 'Verticle is required';  // Updated error key

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      model_name: formData.model_name,
      type: formData.type,
      model_discount: formData.model_discount,
      verticle_id: formData.verticle_id  // Changed to verticle_id
    };

    console.log('Payload being sent:', payload); // Debug log

    try {
      if (id) {
        await axiosInstance.patch(`/models/base-models/${id}`, payload);
        await showFormSubmitToast('Model updated successfully!', () => navigate('/model/model-list'));
      } else {
        await axiosInstance.post('/models', payload);
        await showFormSubmitToast('Model added successfully!', () => navigate('/model/model-list'));
      }
    } catch (error) {
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data); // Debug log
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };

  return (
    <div className="form-container">
     <div className="title">{id ? 'Edit' : 'Add'} Model</div>
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
                  <CFormInput type="text" name="model_name" value={formData.model_name} onChange={handleChange} />
                </CInputGroup>
                {errors.model_name && <p className="error">{errors.model_name}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Type</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCheckCircle} />
                  </CInputGroupText>
                  <CFormSelect name="type" value={formData.type} onChange={handleChange}>
                    <option value="">-Select-</option>
                    <option value="EV">EV</option>
                    <option value="ICE">ICE</option>
                    <option value="CSD">CSD</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.type && <p className="error">{errors.type}</p>}
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
                    name="verticle_id"  // Changed name to verticle_id
                    value={formData.verticle_id}  // Changed to verticle_id
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
                {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}  {/* Updated error key */}
                {verticles.filter(v => v.status === 'active').length === 0 && (
                  <small className="text-muted">No active verticles available. Please create a verticle first.</small>
                )}
              </div>
              
              <div className="input-box">
                <span className="details">Discount</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilDollar} />
                  </CInputGroupText>
                  <CFormInput type="number" name="model_discount" value={formData.model_discount} onChange={handleChange} />
                </CInputGroup>
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddModel;