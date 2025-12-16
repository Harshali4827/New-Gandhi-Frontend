import React, { useEffect, useState } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBike, cilCheckCircle, cilDollar, cilTag } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddModel() {
  const [formData, setFormData] = useState({
    model_name: '',
    type: '',
    model_discount: '',
    verticle_id: ''
  });
  const [errors, setErrors] = useState({});
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState(null);
  const [allVerticles, setAllVerticles] = useState([]);
  const [userVerticles, setUserVerticles] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

    fetchUserProfile();
    
    if (id) {
      fetchModel(id);
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const userData = response.data.data;

      const role = userData.roles?.[0]?.name || '';
      setUserRole(role);
      
      const userVerticleIds = userData.verticles || [];
      await fetchAllVerticles(userVerticleIds, role);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchAllVerticles = async (userVerticleIds, role) => {
    try {
      const response = await axiosInstance.get('/verticle-masters');
      const verticlesData = response.data.data?.verticleMasters || response.data.data || [];
      setAllVerticles(verticlesData);
      const filteredVerticles = role === 'SUPERADMIN' 
        ? verticlesData 
        : verticlesData.filter(verticle => 
            userVerticleIds.includes(verticle._id)
          );
      
      setUserVerticles(filteredVerticles);
    } catch (error) {
      console.error('Error fetching verticles:', error);
    }
  };
  const fetchModel = async (id) => {
    try {
      const res = await axiosInstance.get(`/models/id/${id}`);
      const modelData = res.data.data.model;
      const verticleId = modelData.verticle_id || modelData.verticle || '';
      
      setFormData({
        model_name: modelData.model_name || '',
        type: modelData.type || '',
        model_discount: modelData.model_discount || '',
        verticle_id: verticleId 
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
    if (!formData.verticle_id) formErrors.verticle_id = 'Verticle is required'; 

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      model_name: formData.model_name,
      type: formData.type,
      model_discount: formData.model_discount,
      verticle_id: formData.verticle_id 
    };

    console.log('Payload being sent:', payload);

    try {
      if (id) {
        await axiosInstance.patch(`/models/base-models/${id}`, payload);
        await showFormSubmitToast('Model updated successfully!', () => navigate('/model/model-list'));
      } else {
        await axiosInstance.post('/models', payload);
        await showFormSubmitToast('Model added successfully!', () => navigate('/model/model-list'));
      }
    } catch (error) {
      const message = showError(error); 
      if (message) setError(message);
    }
  };

  const handleCancel = () => {
    navigate('/model/model-list');
  };

  return (
    <div className="form-container">
     <div className="title">{id ? 'Edit' : 'Add'} Model</div>
     {error && <CAlert color="danger">{error}</CAlert>}
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
            name="verticle_id"
            value={formData.verticle_id}
            onChange={handleChange}
          >
            <option value="">-Select Verticle-</option>
            {userVerticles
              .filter(vertical => vertical.status === 'active')
              .map((vertical) => (
                <option key={vertical._id} value={vertical._id}>
                  {vertical.name}
                </option>
              ))}
          </CFormSelect>
                </CInputGroup>
                {errors.verticle_id && <p className="error">{errors.verticle_id}</p>}
                {userVerticles.filter(v => v.status === 'active').length === 0 && (
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