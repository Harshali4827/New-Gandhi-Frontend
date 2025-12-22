import React, { useState, useEffect } from 'react';
import '../../../css/form.css';
import { CInputGroup, CInputGroupText, CFormInput, CFormSelect, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilLocationPin, cilUser } from '@coreui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import axiosInstance from '../../../axiosInstance';
import FormButtons from '../../../utils/FormButtons';
import '../../../css/offer.css';

function AddAccessories() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    part_number: '',
    applicable_models: [],
    part_number_status: 'active',
    status: 'active',
    gst_rate: ''
  });
  const [errors, setErrors] = useState({});
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Service functions
  const fetchAccessoryByIdService = async (id) => {
    try {
      const response = await axiosInstance.get(`/accessories/${id}`);
      return response.data.data.accessory;
    } catch (error) {
      throw error;
    }
  };

  const updateAccessoryService = async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/accessories/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createAccessoryService = async (payload) => {
    try {
      const response = await axiosInstance.post('/accessories', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      fetchAccessory(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axiosInstance.get('/models');
        setModels(response.data.data.models);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/headers');
        
        const allCategories = response.data.data.headers || [];
        const accessoriesCategories = allCategories.filter(category => 
          category.category_key && 
          category.category_key.toLowerCase() === "accesories"
        );
        
        setCategories(accessoriesCategories);
        console.log('Filtered accessories categories:', accessoriesCategories);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
        showFormSubmitError(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      
      if (selectedCategory && selectedCategory.type) {
        const matchingModels = models.filter(model => 
          model.type && model.type === selectedCategory.type
        );
        setFilteredModels(matchingModels);
        if (formData.applicable_models.length > 0) {
          const validModelIds = matchingModels.map(model => model._id || model.id);
          const filteredApplicableModels = formData.applicable_models.filter(modelId => 
            validModelIds.includes(modelId)
          );
          
          if (filteredApplicableModels.length !== formData.applicable_models.length) {
            setFormData(prev => ({
              ...prev,
              applicable_models: filteredApplicableModels
            }));
          }
        }
      } else {
        setFilteredModels(models);
      }
    } else {
      setFilteredModels(models);
    }
  }, [formData.category, categories, models, formData.applicable_models]);

  const fetchAccessory = async (id) => {
    try {
      setLoading(true);
      const accessory = await fetchAccessoryByIdService(id);
      setFormData({
        ...accessory,
        applicable_models: accessory.applicable_models || [],
      });
    } catch (error) {
      showFormSubmitError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    if (name === 'category') {
      setFormData(prevData => ({ ...prevData, applicable_models: [] }));
    }
  };

  const handleModelSelect = (modelId) => {
    setFormData((prevData) => {
      const isSelected = prevData.applicable_models.includes(modelId);
      return {
        ...prevData,
        applicable_models: isSelected ? prevData.applicable_models.filter((id) => id !== modelId) : [...prevData.applicable_models, modelId]
      };
    });
    // Clear error when user selects at least one model
    if (errors.applicable_models) {
      setErrors(prev => ({ ...prev, applicable_models: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    
    let formErrors = {};

    if (!formData.name.trim()) formErrors.name = 'This field is required';
    if (!formData.price || formData.price <= 0) formErrors.price = 'Valid price is required';
    if (!formData.part_number.trim()) formErrors.part_number = 'This field is required';
    if (!formData.gst_rate || formData.gst_rate < 0) formErrors.gst_rate = 'Valid GST rate is required';
    if (!formData.category) formErrors.category = 'This field is required';
    if (formData.applicable_models.length === 0) {
      formErrors.applicable_models = 'Please select at least one compatible model';
    }

    if (Object.keys(formErrors).length > 0) {
      console.log('Form errors:', formErrors); // Debug log
      setErrors(formErrors);
      
      // Scroll to first error
      const firstErrorKey = Object.keys(formErrors)[0];
      const element = document.querySelector(`[name="${firstErrorKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      gst_rate: parseFloat(formData.gst_rate),
      category: formData.category,
      part_number: formData.part_number.trim(),
      applicable_models: formData.applicable_models,
      part_number_status: 'active',
      status: 'active'
    };

    console.log('Submitting payload:', payload); // Debug log

    try {
      setLoading(true);
      if (id) {
        await updateAccessoryService(id, payload);
        showFormSubmitToast('Accessory updated successfully!');
      } else {
        await createAccessoryService(payload);
        showFormSubmitToast('Accessory added successfully!');
      }
      navigate('/accessories/accessories-list');
    } catch (error) {
      console.error('Submit error:', error); // Debug log
      showFormSubmitError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/accessories/accessories-list');
  };

  const getSelectedCategoryType = () => {
    if (formData.category) {
      const selectedCategory = categories.find(cat => cat._id === formData.category);
      return selectedCategory ? selectedCategory.type : null;
    }
    return null;
  };


  const renderButtons = () => (
    <div className="form-buttons" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      <CButton 
        type="submit" 
        color="primary" 
        disabled={loading}
        style={{ minWidth: '100px' }}
      >
        {loading ? 'Processing...' : (id ? 'Update' : 'Submit')}
      </CButton>
      <CButton 
        type="button" 
        color="secondary" 
        onClick={handleCancel}
        disabled={loading}
        style={{ minWidth: '100px' }}
      >
        Cancel
      </CButton>
    </div>
  );

  if (loading && id) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h4>{id ? 'Edit' : 'Add'} Accessories</h4>
      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Name</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter accessory name"
                  />
                </CInputGroup>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="input-box">
                <span className="details">Description</span>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter description"
                  />
                </CInputGroup>
              </div>

              <div className="input-box">
                <div className="details-container">
                  <span className="details">Price</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </CInputGroup>
                {errors.price && <p className="error">{errors.price}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Category</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilLocationPin} />
                  </CInputGroupText>
                  <CFormSelect 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-Select-</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.header_key} ({category.type})
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
                {errors.category && <p className="error">{errors.category}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">Part Number</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput 
                    type="text" 
                    name="part_number" 
                    value={formData.part_number} 
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter part number"
                  />
                </CInputGroup>
                {errors.part_number && <p className="error">{errors.part_number}</p>}
              </div>
              <div className="input-box">
                <div className="details-container">
                  <span className="details">GST Rate (%)</span>
                  <span className="required">*</span>
                </div>
                <CInputGroup>
                  <CInputGroupText className="input-icon">
                    <CIcon icon={cilBuilding} />
                  </CInputGroupText>
                  <CFormInput 
                    type="number" 
                    name="gst_rate" 
                    value={formData.gst_rate} 
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter GST rate"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </CInputGroup>
                {errors.gst_rate && <p className="error">{errors.gst_rate}</p>}
              </div>
            </div>

            <div className="offer-container">
              <div className="permissions-form">
                <h4>
                  Compatible Models <span className="required">* </span>
                  {getSelectedCategoryType() && (
                    <span className="category-type-info">
                      (Showing {getSelectedCategoryType()} type models)
                    </span>
                  )}
                </h4>
                <div className="permissions-grid">
                  {filteredModels.length === 0 ? (
                    <div className="no-models-message">
                      {formData.category 
                        ? `No ${getSelectedCategoryType()} models found. Please select a different category.`
                        : 'Please select a category first to see compatible models.'}
                    </div>
                  ) : (
                    filteredModels.map((model) => {
                      const modelId = model._id || model.id;
                      const isSelected = formData.applicable_models.includes(modelId);
                      return (
                        <div key={modelId} className="permission-item">
                          <label style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => !loading && handleModelSelect(modelId)}
                              disabled={loading}
                            />
                            {model.model_name}
                            <span className="model-type"> ({model.type})</span>
                          </label>
                        </div>
                      );
                    })
                  )}

                  {errors.applicable_models && <p className="error">{errors.applicable_models}</p>}
                </div>
              </div>
            </div>

     
            {renderButtons()}
            
  
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAccessories;