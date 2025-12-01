import React, { useEffect, useState } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLayerGroup, cilCheckCircle } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import FormButtons from '../../../utils/FormButtons';
import axiosInstance from '../../../axiosInstance';

function UpdateVerticalMaster() {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchVertical(id);
    }
  }, [id]);

  const fetchVertical = async (id) => {
    try {
      const res = await axiosInstance.get(`/verticle-masters/${id}`);
      const vertical = res.data.data?.verticleMaster;
      setFormData({
        name: vertical?.name || '',
        status: vertical?.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching vertical master:', error);
      showFormSubmitError('Failed to load vertical master details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let formErrors = {};
    
    if (!formData.name.trim()) {
      formErrors.name = 'Vertical name is required';
    }
    
    if (!formData.status) {
      formErrors.status = 'Status is required';
    }
    
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axiosInstance.put(`/verticle-masters/${id}`, formData);
      await showFormSubmitToast('Vertical master updated successfully!', () => 
        navigate('/vertical-master/vertical-master-list')
      );
    } catch (error) {
      console.error('Error details:', error);
      showFormSubmitError(error);
    }
  };

  const handleCancel = () => {
    navigate('/vertical-master/vertical-master-list');
  };

  return (
    <div className="form-container">
      <div className="title">Edit Vertical Master</div>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Vertical Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLayerGroup} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="Enter vertical name"
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
                  >
                    <option value="">-Select Status-</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CInputGroup>
                {errors.status && <p className="error">{errors.status}</p>}
              </div>
            </div>
            <FormButtons onCancel={handleCancel} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateVerticalMaster;