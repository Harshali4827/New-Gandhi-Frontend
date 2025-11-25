// import React, { useState, useEffect } from 'react';
// import '../../../css/form.css';
// import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilUser } from '@coreui/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
// import axiosInstance from '../../../axiosInstance';
// import FormButtons from '../../../utils/FormButtons';

// function AddFinancer() {
//   const [formData, setFormData] = useState({
//     name: ''
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       fetchFinancer(id);
//     }
//   }, [id]);
//   const fetchFinancer = async (id) => {
//     try {
//       const res = await axiosInstance.get(`/financers/providers/${id}`);
//       setFormData(res.data.data);
//     } catch (error) {
//       console.error('Error fetching financer:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let formErrors = {};

//     if (!formData.name) formErrors.name = 'This field is required';

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/financers/providers/${id}`, formData);
//         await showFormSubmitToast('Financer updated successfully!', () => navigate('/financer/financer-list'));

//         navigate('/financer/financer-list');
//       } else {
//         await axiosInstance.post('/financers/providers', formData);
//         await showFormSubmitToast('Financer added successfully!', () => navigate('/financer/financer-list'));

//         navigate('/financer/financer-list');
//       }
//     } catch (error) {
//       console.error('Error details:', error);
//       showFormSubmitError(error);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/financer/financer-list');
//   };
//   return (
//     <div>
//       <h4>{id ? 'Edit' : 'Add'} Financer</h4>
//       <div className="form-container">
//         <div className="page-header">
//           <form onSubmit={handleSubmit}>
//             <div className="form-note">
//               <span className="required">*</span> Field is mandatory
//             </div>
//             <div className="user-details">
//               <div className="input-box">
//                 <div className="details-container">
//                   <span className="details">Name</span>
//                   <span className="required">*</span>
//                 </div>
//                 <CInputGroup>
//                   <CInputGroupText className="input-icon">
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput type="text" name="name" value={formData.name} onChange={handleChange} />
//                 </CInputGroup>
//                 {errors.name && <p className="error">{errors.name}</p>}
//               </div>
//               <FormButtons onCancel={handleCancel} />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default AddFinancer;


import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CSpinner,
  CInputGroup,
  CRow,
  CCol,
} from '@coreui/react';
import { showError, axiosInstance } from '../../../utils/tableImports';
import '../../../css/form.css';

const AddFinancer = ({ show, onClose, onFinancerSaved, editingFinancer }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingFinancer) {
      setFormData({
        name: editingFinancer.name || ''
      });
    } else {
      resetForm();
    }
  }, [editingFinancer, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Financer name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (editingFinancer) {
        await axiosInstance.put(`/financers/providers/${editingFinancer.id}`, formData);
        onFinancerSaved('Financer updated successfully');
      } else {
        await axiosInstance.post('/financers/providers', formData);
        onFinancerSaved('Financer added successfully');
      }
    } catch (error) {
      console.error('Error saving financer:', error);
      showError(error);
    
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: ''
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CModal size='lg' visible={show} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>{editingFinancer ? 'Edit Financer' : 'Add New Financer'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
        <CRow className="mb-3">
        <CCol md={6}>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Financer Name <span className="required">*</span></CFormLabel>
            <CInputGroup>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter financer name"
                invalid={!!formErrors.name}
              />
            </CInputGroup>
            {formErrors.name && (
              <div className="error-text">
                {formErrors.name}
              </div>
            )}
          </div>
          </CCol>
         </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton 
            className='submit-button'
            type="submit"
            disabled={submitting}
          >
            {submitting ? <CSpinner size="sm" /> : (editingFinancer ? 'Update' : 'Submit')}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default AddFinancer;