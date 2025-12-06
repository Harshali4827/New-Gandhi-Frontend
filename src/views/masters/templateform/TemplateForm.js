// components/templates/TemplateForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CInputGroup, 
  CInputGroupText, 
  CFormInput, 
  CFormSelect, 
  CFormCheck, 
  CButton, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CAlert,
  CSpinner,
  CBadge,
  CFormLabel,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilSave,
  cilArrowLeft,
  cilPlus,
  cilTrash,
  cilFont,
  cilBold,
  cilItalic,
  cilAlignLeft,
  cilList,
  cilChevronRight,
  cilChevronLeft,
  cilTag,
  cilPaperclip
} from '@coreui/icons';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axiosInstance from '../../../axiosInstance';
import { showFormSubmitError, showFormSubmitToast } from '../../../utils/sweetAlerts';
import '../../../css/TemplateForm.css';

// Import TinyMCE
import { Editor } from '@tinymce/tinymce-react';

// Fixed template variables
const FIXED_TEMPLATE_VARIABLES = [
  { name: 'special_notes', display_name: 'Special Notes', source: 'dynamic_field', is_required: false },
  { name: 'customer_name', display_name: 'Customer Name', source: 'booking', booking_field_path: 'customerDetails.name', is_required: true },
  { name: 'customer_salutation', display_name: 'Customer Salutation', source: 'booking', booking_field_path: 'customerDetails.salutation', is_required: false, default_value: 'Mr.' },
  { name: 'chassis_number', display_name: 'Chassis Number', source: 'booking', booking_field_path: 'chassisNumber', is_required: true },
  { name: 'model_name', display_name: 'Model Name', source: 'booking', booking_field_path: 'modelDetails.name', is_required: true },
  { name: 'booking_number', display_name: 'Booking Number', source: 'booking', booking_field_path: 'bookingNumber', is_required: true },
  { name: 'vehicle_color', display_name: 'Vehicle Color', source: 'booking', booking_field_path: 'colorDetails.name', is_required: true },
  { name: 'total_amount', display_name: 'Total Amount', source: 'booking', booking_field_path: 'totalAmount', is_required: true, default_value: 0 },
  { name: 'balance_amount', display_name: 'Balance Amount', source: 'booking', booking_field_path: 'balanceAmount', is_required: true, default_value: 0 },
  { name: 'received_amount', display_name: 'Received Amount', source: 'booking', booking_field_path: 'receivedAmount', is_required: true, default_value: 0 },
  { name: 'customer_mobile', display_name: 'Customer Mobile', source: 'booking', booking_field_path: 'customerDetails.mobile1', is_required: true },
  { name: 'customer_address', display_name: 'Customer Address', source: 'booking', booking_field_path: 'customerDetails.address', is_required: true },
  { name: 'customer_pan', display_name: 'Customer PAN', source: 'booking', booking_field_path: 'customerDetails.panNo', is_required: true },
  { name: 'customer_aadhaar', display_name: 'Customer Aadhaar', source: 'booking', booking_field_path: 'customerDetails.aadharNumber', is_required: true },
  { name: 'current_date', display_name: 'Current Date', source: 'system', system_variable: 'current_date', is_required: false },
  { name: 'current_time', display_name: 'Current Time', source: 'system', system_variable: 'current_time', is_required: false }
];

const TemplateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    template_name: '',
    header_ids: [],
    subject: '',
    content: '',
    template_variables: [],
    is_active: true,
    is_default: false
  });

  // Component state
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHeaders, setLoadingHeaders] = useState(false);
  const [errors, setErrors] = useState({});
  const [customVariables, setCustomVariables] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [headerSearch, setHeaderSearch] = useState('');

  // Add new custom variable form
  const [newVariable, setNewVariable] = useState({
    name: '',
    display_name: '',
    source: 'dynamic_field',
    is_required: false
  });

  // TinyMCE API Key
  const TINYMCE_API_KEY = 'vuj23uxel40osrwcszrejqoyg35ykdf7kyrr81hm6t952kgy';

  const isInitialLoad = useRef(false);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    fetchHeaders();
    
    if (isEditMode && !isInitialLoad.current) {
      isInitialLoad.current = true;
      fetchTemplate();
    }
  }, [id]);

  const fetchHeaders = async () => {
    try {
      setLoadingHeaders(true);
      const response = await axiosInstance.get('/headers?sort=priority');
      setHeaders(response.data.data.headers || []);
    } catch (error) {
      console.error('Error fetching headers:', error);
    } finally {
      setLoadingHeaders(false);
    }
  };

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/templates/${id}`);
      const template = response.data.data;
      
      const headerIds = template.header_ids?.map(h => h._id) || [];
      setFormData({
        template_name: template.template_name || '',
        header_ids: headerIds,
        subject: template.subject || '',
        content: template.content || '',
        template_variables: template.template_variables || [],
        is_active: template.is_active !== undefined ? template.is_active : true,
        is_default: template.is_default || false
      });

      // Set selected headers
      if (template.header_ids) {
        setSelectedHeaders(template.header_ids.map(header => header._id));
      }

      // Separate custom variables
      const customVars = template.template_variables?.filter(variable => 
        !FIXED_TEMPLATE_VARIABLES.some(fixed => fixed.name === variable.name)
      ) || [];
      
      setCustomVariables(customVars);
    } catch (error) {
      console.error('Error fetching template:', error);
      showFormSubmitError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHeaderToggle = (headerId) => {
    setSelectedHeaders(prev => {
      if (prev.includes(headerId)) {
        return prev.filter(id => id !== headerId);
      } else {
        return [...prev, headerId];
      }
    });
  };

  const handleAllHeadersToggle = () => {
    if (selectedHeaders.length === filteredHeaders.length) {
      setSelectedHeaders([]);
    } else {
      setSelectedHeaders(filteredHeaders.map(header => header._id));
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      header_ids: selectedHeaders
    }));
  }, [selectedHeaders]);

  const handleEditorChange = (content, editor) => {
    const fieldName = editor.targetElm.getAttribute('data-field') || 'content';
    setFormData(prev => ({
      ...prev,
      [fieldName]: content
    }));
  };

  const handleAddCustomVariable = () => {
    if (!newVariable.name.trim()) {
      showFormSubmitError('Please enter variable name');
      return;
    }

    if (!newVariable.display_name.trim()) {
      showFormSubmitError('Please enter display name');
      return;
    }

    // Validate variable name format
    const nameRegex = /^[a-z][a-z0-9_]*$/;
    if (!nameRegex.test(newVariable.name)) {
      showFormSubmitError('Variable name must start with a letter and contain only lowercase letters, numbers, and underscores');
      return;
    }

    // Check for duplicates
    if (customVariables.some(v => v.name === newVariable.name) || 
        FIXED_TEMPLATE_VARIABLES.some(v => v.name === newVariable.name)) {
      showFormSubmitError('Variable name must be unique');
      return;
    }

    setCustomVariables(prev => [...prev, { ...newVariable }]);
    setNewVariable({ 
      name: '', 
      display_name: '', 
      source: 'dynamic_field',
      is_required: false 
    });
  };

  const handleRemoveCustomVariable = (index) => {
    setCustomVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewVariableChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariable(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const insertVariable = (variableName, editorField = 'content') => {
    const variableTag = `{{${variableName}}}`;
    
    // Insert into active TinyMCE editor
    if (window.tinymce && window.tinymce.activeEditor) {
      const editor = window.tinymce.activeEditor;
      editor.insertContent(variableTag);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.template_name.trim()) {
      newErrors.template_name = 'Template name is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Combine fixed and custom variables
    const selectedFixedVars = FIXED_TEMPLATE_VARIABLES.map(variable => ({
      name: variable.name,
      display_name: variable.display_name,
      source: variable.source,
      data_type: 'string',
      ...(variable.booking_field_path && { booking_field_path: variable.booking_field_path }),
      ...(variable.system_variable && { system_variable: variable.system_variable }),
      is_required: variable.is_required || false,
      ...(variable.default_value !== undefined && { default_value: variable.default_value })
    }));

    const allVariables = [...selectedFixedVars, ...customVariables];

    const payload = {
      ...formData,
      template_variables: allVariables
    };

    // Clean up empty values
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    try {
      setLoading(true);
      let response;
      
      if (isEditMode) {
        response = await axiosInstance.put(`/templates/${id}`, payload);
      } else {
        response = await axiosInstance.post('/templates', payload);
      }

      if (response.data.success) {
        const message = isEditMode ? 'Template updated successfully!' : 'Template created successfully!';
        showFormSubmitToast(message, () => navigate('/templateform/template-list'));
      } else {
        showFormSubmitError(response.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error submitting template';
      showFormSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter headers based on search
  const filteredHeaders = headers.filter(header => 
    header.header_key.toLowerCase().includes(headerSearch.toLowerCase()) ||
    header.type.toLowerCase().includes(headerSearch.toLowerCase())
  );

  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="title">{isEditMode ? 'Edit Template' : 'Create New Template'}</div>
      
      <div className="form-note mb-3">
        <span className="required">*</span> Field is mandatory
      </div>

      <div className="form-card">
        <div className="form-body">
          <form onSubmit={handleSubmit} id="templateForm">
            
            {/* Basic Information */}
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Basic Information</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={6}>
                    <div className="input-box mb-3">
                      <div className="details-container">
                        <span className="details">Template Name</span>
                        <span className="required">*</span>
                      </div>
                      <CInputGroup>
                        <CInputGroupText className="input-icon">
                          <CIcon icon={cilFont} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          name="template_name"
                          value={formData.template_name}
                          onChange={handleInputChange}
                          placeholder="Enter template name"
                          className={errors.template_name ? 'is-invalid' : ''}
                        />
                      </CInputGroup>
                      {errors.template_name && <p className="error">{errors.template_name}</p>}
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <div className="input-box">
                      <div className="details-container">
                        <span className="details">Status Settings</span>
                      </div>
                      <div className="d-flex gap-4 mt-2">
                        <CFormCheck
                          type="checkbox"
                          id="is_active"
                          label="Active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="form-check-input-lg"
                        />
                        <CFormCheck
                          type="checkbox"
                          id="is_default"
                          label="Set as Default Template"
                          checked={formData.is_default}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                          className="form-check-input-lg"
                        />
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            {/* Headers Section */}
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Email Headers</h5>
              </CCardHeader>
              <CCardBody>
                <CAlert color="info" className="p-3 mb-3">
                  Select headers to include in emails sent using this template. Headers will be displayed in the email header section.
                </CAlert>
                
                {/* Header search and select all */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="w-50">
                    <CInputGroup>
                      <CInputGroupText className="input-icon">
                        <CIcon icon={cilFont} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Search headers..."
                        value={headerSearch}
                        onChange={(e) => setHeaderSearch(e.target.value)}
                      />
                    </CInputGroup>
                  </div>
                  <div>
                    <CButton
                      color="outline-primary"
                      size="sm"
                      onClick={handleAllHeadersToggle}
                      className="d-flex align-items-center gap-2"
                    >
                      <CFormCheck
                        type="checkbox"
                        checked={selectedHeaders.length === filteredHeaders.length && filteredHeaders.length > 0}
                        onChange={handleAllHeadersToggle}
                        className="me-0"
                      />
                      {selectedHeaders.length === filteredHeaders.length ? 'Deselect All' : 'Select All'}
                    </CButton>
                  </div>
                </div>

                {/* Headers grid */}
                <div className="row mb-3">
                  {filteredHeaders.map((header) => (
                    <div key={header._id} className="col-md-4 mb-3">
                      <div className={`header-item p-3 border rounded ${selectedHeaders.includes(header._id) ? 'selected' : ''}`}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <CFormCheck
                              id={`header-${header._id}`}
                              checked={selectedHeaders.includes(header._id)}
                              onChange={() => handleHeaderToggle(header._id)}
                              className="me-2"
                            />
                            <div>
                              <strong className="d-block">{header.header_key}</strong>
                              <small className="text-muted">
                                Type: <CBadge color="info" className="ms-1">{header.type}</CBadge>
                              </small>
                            </div>
                          </div>
                          <CBadge color={header.is_active ? 'success' : 'secondary'}>
                            {header.is_active ? 'Active' : 'Inactive'}
                          </CBadge>
                        </div>
                        {header.header_value && (
                          <CFormText className="d-block mt-2">
                            <small className="text-muted">Value: {header.header_value}</small>
                          </CFormText>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredHeaders.length === 0 && (
                    <div className="col-12">
                      <div className="text-center p-5 border rounded">
                        <CIcon icon={cilPaperclip} size="xl" className="text-muted mb-3" />
                        <p className="text-muted mb-0">No headers found{headerSearch ? ' matching your search' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CBadge color="primary" className="fs-6 p-2">
                    {selectedHeaders.length} {selectedHeaders.length === 1 ? 'Header' : 'Headers'} Selected
                  </CBadge>
                  <small className="text-muted">Click on headers to select/deselect them</small>
                </div>
              </CCardBody>
            </CCard>

            {/* Template Variables Section */}
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Template Variables</h5>
              </CCardHeader>
              <CCardBody>
                
                {/* Fixed Variables */}
                <div className="mb-4">
                  <h6 className="mb-3">Fixed Variables</h6>
                  <CAlert color="info" className="p-3 mb-3">
                    These variables will be automatically replaced with actual data when the template is used.
                  </CAlert>
                  <div className="row mb-3">
                    {FIXED_TEMPLATE_VARIABLES.map((variable) => (
                      <div key={variable.name} className="col-md-4 mb-3">
                        <div className="variable-item p-3 border rounded">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div>
                              <strong className="d-block">{variable.display_name}</strong>
                              <small className="text-muted">
                                <code>{`{{${variable.name}}}`}</code>
                              </small>
                            </div>
                            <CBadge color={variable.is_required ? 'danger' : 'secondary'}>
                              {variable.is_required ? 'Required' : 'Optional'}
                            </CBadge>
                          </div>
                          <CFormText className="d-block mb-2">
                            <small>Source: <CBadge color="info">{variable.source}</CBadge></small>
                          </CFormText>
                          <div className="d-flex gap-1">
                            <CButton
                              size="sm"
                              color="outline-primary"
                              onClick={() => insertVariable(variable.name, 'subject')}
                              className="flex-fill d-flex align-items-center justify-content-center gap-1"
                            >
                              <CIcon icon={cilItalic} /> Insert in Subject
                            </CButton>
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={() => insertVariable(variable.name, 'content')}
                              className="flex-fill d-flex align-items-center justify-content-center gap-1"
                            >
                              <CIcon icon={cilBold} /> Insert in Content
                            </CButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Variables */}
                <div className="mb-4">
                  <h6 className="mb-3">Custom Variables</h6>
                  <CAlert color="info" className="p-3 mb-3">
                    Add custom variables that users can fill when using this template.
                  </CAlert>
                  
                  {/* Add new custom variable form */}
                  <CCard className="mb-4">
                    <CCardHeader>
                      <h6 className="mb-0">Add New Variable</h6>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol md={3}>
                          <div className="input-box mb-3">
                            <div className="details-container">
                              <span className="details">Variable Name</span>
                              <span className="required">*</span>
                            </div>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilTag} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="name"
                                value={newVariable.name}
                                onChange={handleNewVariableChange}
                                placeholder="e.g., delivery_date"
                                className="text-lowercase"
                              />
                            </CInputGroup>
                            <small className="text-muted">lowercase_with_underscores</small>
                          </div>
                        </CCol>

                        <CCol md={3}>
                          <div className="input-box mb-3">
                            <div className="details-container">
                              <span className="details">Display Name</span>
                              <span className="required">*</span>
                            </div>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilFont} />
                              </CInputGroupText>
                              <CFormInput
                                type="text"
                                name="display_name"
                                value={newVariable.display_name}
                                onChange={handleNewVariableChange}
                                placeholder="e.g., Delivery Date"
                              />
                            </CInputGroup>
                          </div>
                        </CCol>

                        <CCol md={3}>
                          <div className="input-box mb-3">
                            <div className="details-container">
                              <span className="details">Source</span>
                            </div>
                            <CInputGroup>
                              <CInputGroupText className="input-icon">
                                <CIcon icon={cilList} />
                              </CInputGroupText>
                              <CFormSelect
                                name="source"
                                value={newVariable.source}
                                onChange={handleNewVariableChange}
                              >
                                <option value="dynamic_field">Dynamic Field</option>
                                <option value="booking">Booking</option>
                                <option value="system">System</option>
                              </CFormSelect>
                            </CInputGroup>
                          </div>
                        </CCol>

                        <CCol md={2}>
                          <div className="input-box mb-3">
                            <div className="details-container">
                              <span className="details">Required</span>
                            </div>
                            <div className="mt-2">
                              <CFormCheck
                                type="checkbox"
                                name="is_required"
                                checked={newVariable.is_required}
                                onChange={handleNewVariableChange}
                                label="Required"
                              />
                            </div>
                          </div>
                        </CCol>

                        <CCol md={1} className="d-flex align-items-end">
                          <CButton 
                            color="primary" 
                            onClick={handleAddCustomVariable} 
                            className="w-100"
                            title="Add Variable"
                          >
                            <CIcon icon={cilPlus} />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  {/* Custom variables list */}
                  {customVariables.length > 0 && (
                    <>
                      <div className="row mb-3">
                        {customVariables.map((variable, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <div className="variable-item p-3 border rounded">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                  <strong className="d-block">{variable.display_name}</strong>
                                  <small className="text-muted">
                                    <code>{`{{${variable.name}}}`}</code>
                                  </small>
                                </div>
                                <CBadge color={variable.is_required ? 'danger' : 'secondary'}>
                                  {variable.is_required ? 'Required' : 'Optional'}
                                </CBadge>
                              </div>
                              <CFormText className="d-block mb-2">
                                <small>Source: <CBadge color="info">{variable.source}</CBadge></small>
                              </CFormText>
                              <div className="d-flex gap-1">
                                <CButton
                                  size="sm"
                                  color="outline-primary"
                                  onClick={() => insertVariable(variable.name, 'subject')}
                                  className="flex-fill d-flex align-items-center justify-content-center gap-1"
                                >
                                  <CIcon icon={cilItalic} /> Subject
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="primary"
                                  onClick={() => insertVariable(variable.name, 'content')}
                                  className="flex-fill d-flex align-items-center justify-content-center gap-1"
                                >
                                  <CIcon icon={cilBold} /> Content
                                </CButton>
                                <CButton
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleRemoveCustomVariable(index)}
                                  className="px-3"
                                  title="Remove"
                                >
                                  <CIcon icon={cilTrash} />
                                </CButton>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CCardBody>
            </CCard>

            {/* Subject Field with TinyMCE */}
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Email Subject</h5>
              </CCardHeader>
              <CCardBody>
                <div className="input-box mb-3">
                  <div className="details-container">
                    <span className="details">Subject Line</span>
                    <span className="required">*</span>
                  </div>
                  <div className="tiny-editor-wrapper">
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={formData.subject}
                      onEditorChange={(content, editor) => handleEditorChange(content, editor)}
                      init={{
                        height: 150,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                                 'alignleft aligncenter alignright alignjustify | ' +
                                 'bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                        placeholder: 'Enter subject line. Use {{variable_name}} for variables...',
                        setup: (editor) => {
                          editor.on('init', () => {
                            editor.targetElm.setAttribute('data-field', 'subject');
                          });
                        },
                        width: '100%'
                      }}
                    />
                  </div>
                  {errors.subject && <p className="error">{errors.subject}</p>}
                  <small className="text-muted">Use &#123;&#123;variable_name&#125;&#125; format for variables</small>
                </div>
              </CCardBody>
            </CCard>

            {/* Content Field with TinyMCE */}
            <CCard className="mb-4">
              <CCardHeader>
                <h5 className="mb-0">Template Content</h5>
              </CCardHeader>
              <CCardBody>
                <div className="input-box mb-3">
                  <div className="details-container">
                    <span className="details">Content</span>
                    <span className="required">*</span>
                  </div>
                  <div className="tiny-editor-wrapper">
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      value={formData.content}
                      onEditorChange={(content, editor) => handleEditorChange(content, editor)}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount',
                          'table'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                                 'bold italic forecolor backcolor | alignleft aligncenter ' +
                                 'alignright alignjustify | bullist numlist outdent indent | ' +
                                 'link image media table | removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        placeholder: 'Enter template content. Use {{variable_name}} for variables...',
                        images_upload_url: '/api/upload',
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        file_picker_callback: (cb, value, meta) => {
                          const input = document.createElement('input');
                          input.setAttribute('type', 'file');
                          input.setAttribute('accept', 'image/*');
                          
                          input.onchange = function () {
                            const file = this.files[0];
                            const reader = new FileReader();
                            
                            reader.onload = function () {
                              const id = 'blobid' + (new Date()).getTime();
                              const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                              const base64 = reader.result.split(',')[1];
                              const blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };
                          
                          input.click();
                        },
                        setup: (editor) => {
                          editor.on('init', () => {
                            editor.targetElm.setAttribute('data-field', 'content');
                          });
                        },
                        width: '100%'
                      }}
                    />
                  </div>
                  {errors.content && <p className="error">{errors.content}</p>}
                  <small className="text-muted">Use &#123;&#123;variable_name&#125;&#125; format for variables</small>
                </div>
              </CCardBody>
            </CCard>

            {/* Form Actions */}
            <div className="form-footer d-flex gap-3">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => navigate('/templateform/template-list')}
              >
                <CIcon icon={cilArrowLeft} /> Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} /> {isEditMode ? 'Update Template' : 'Create Template'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;