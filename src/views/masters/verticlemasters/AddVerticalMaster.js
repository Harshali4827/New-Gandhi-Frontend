import React, { useEffect, useState } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CForm } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLayers, cilCheckCircle } from '@coreui/icons'; // Changed cilLayerGroup to cilLayers
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function AddVerticalMaster() {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchVertical(id);
    }
  }, [id]);

  const fetchVertical = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/verticle-masters/${id}`);
      const vertical = res.data.data?.verticleMaster;
      setFormData({
        name: vertical?.name || '',
        status: vertical?.status || 'active'
      });
      setErrors({});
    } catch (error) {
      console.error('Error fetching vertical master:', error);
      showFormSubmitError('Failed to load vertical master details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vertical name is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      if (id) {
        // Update existing vertical master
        await axiosInstance.put(`/verticle-masters/${id}`, formData);
        await showFormSubmitToast('Vertical master updated successfully!', () => 
          navigate('/vertical-master/vertical-master-list')
        );
      } else {
        // Create new vertical master
        await axiosInstance.post('/verticle-masters', formData);
        await showFormSubmitToast('Vertical master added successfully!', () => 
          navigate('/vertical-master/vertical-master-list')
        );
      }
    } catch (error) {
      console.error('Error details:', error);
      
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showFormSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vertical-master/vertical-master-list');
  };

  return (
    <div className="form-container">
      <div className="title">{id ? 'Edit' : 'Add'} Vertical Master</div>
      <div className="form-card">
        <div className="form-body">
          <CForm onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Vertical Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLayers} /> {/* Changed to cilLayers */}
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="Enter vertical name"
                    disabled={loading}
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Status</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilCheckCircle} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-Select Status-</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.status && <p className="error">{errors.status}</p>}
              </div>
            </div>
            <FormButtons 
              onCancel={handleCancel} 
              submitText={id ? 'Update' : 'Save'}
              disabled={loading}
            />
          </CForm>
        </div>
      </div>
    </div>
  );
}

export default AddVerticalMaster;