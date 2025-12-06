// components/templates/TemplatePreview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CButton, 
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft } from '@coreui/icons';
import axiosInstance from '../../../axiosInstance';
import '../../../css/TemplateForm.css';

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/templates/${id}`);
      setTemplate(response.data.data);
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <CAlert color="danger">
        {error}
      </CAlert>
    );
  }

  return (
    <div className="template-preview">
      <div className="title">Template Preview</div>
      
      <CCard className="form-card">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <CButton color="secondary" size="sm" onClick={() => navigate('/templateform/template-list')}>
            <CIcon icon={cilArrowLeft} /> Back to List
          </CButton>
          <h5 className="mb-0">{template.template_name}</h5>
        </CCardHeader>
        
        <CCardBody>
          {/* Template Information */}
          <div className="mb-4">
            <h6>Template Information</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {template.template_name}</p>
                <p><strong>Status:</strong> 
                  <span className={`badge bg-${template.is_active ? 'success' : 'secondary'} ms-2`}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {template.is_default && (
                    <span className="badge bg-info ms-2">Default</span>
                  )}
                </p>
              </div>
              <div className="col-md-6">
                <p><strong>Headers:</strong> {template.header_ids?.length || 0}</p>
                <p><strong>Variables:</strong> {template.template_variables?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Subject Preview */}
          <div className="mb-4">
            <h6>Subject</h6>
            <div className="alert alert-light" style={{ whiteSpace: 'pre-wrap' }}>
              {template.subject}
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-4">
            <h6>Content Preview</h6>
            <div 
              className="template-content-preview p-3 border rounded bg-light"
              style={{ minHeight: '300px' }}
              dangerouslySetInnerHTML={{ __html: template.content }}
            />
          </div>

          {/* Variables List */}
          {template.template_variables && template.template_variables.length > 0 && (
            <div className="mb-4">
              <h6>Template Variables</h6>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Variable</th>
                      <th>Display Name</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {template.template_variables.map((variable, index) => (
                      <tr key={index}>
                        <td><code>{`{{${variable.name}}}`}</code></td>
                        <td>{variable.display_name}</td>
                        <td>{variable.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TemplatePreview;