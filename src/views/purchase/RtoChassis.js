import React, { useState, useEffect } from 'react';
import '../../css/table.css';
import {
  Link,
  Menu,
  MenuItem,
  getDefaultSearchFields,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from '../../utils/tableImports';
import '../../css/form.css';
import { 
  CButton, 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CFormInput, 
  CFormLabel, 
  CTable, 
  CTableBody, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CTableDataCell,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CProgress,
  CCard as Card,
  CCardBody as CardBody,
  CCardHeader as CardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCloudDownload, 
  cilCloudUpload, 
  cilSettings, 
  cilTrash, 
  cilCheckCircle, 
  cilXCircle, 
  cilWarning, 
  cilFile, 
  cilUser, 
  cilCalendar, 
  cilList, 
  cilInfo,
  cilArrowCircleBottom,
  cilFilter
} from '@coreui/icons';

const RtoChassis = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  
  // Upload states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  
  // Download template states
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [rows, setRows] = useState(10);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // View details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  // Export loading state
  const [exportingId, setExportingId] = useState(null);

  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [batchNames, setBatchNames] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    fetchImports();
  }, []);

  // Fetch imports from API
  const fetchImports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/csvchassis/imports');
      const importsData = response.data.data || [];
      setData(importsData);
      setFilteredData(importsData);
      
      // Extract unique batch names for filter dropdown
      const uniqueBatchNames = [...new Set(importsData
        .map(importItem => importItem.batchName)
        .filter(batchName => batchName && batchName.trim() !== '')
      )].sort();
      
      setBatchNames(uniqueBatchNames);
      
    } catch (error) {
      console.error('Error fetching imports:', error);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle download template
  const handleDownloadTemplate = async () => {
    if (!rows || rows < 1) {
      showError('Number of rows must be at least 1');
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);
      
      const response = await axiosInstance.get(
        `/csvchassis/export-empty-template?rows=${rows}`,
        {
          responseType: 'blob'
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Chassis_Template_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess('Template downloaded successfully!');
      setDownloadModalOpen(false);
      setRows(10);
      
    } catch (error) {
      console.error('Error downloading template:', error);
      const message = showError(error);
      if (message) setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        setFile(null);
        return;
      }

      // Check file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(selectedFile.type) && 
          !selectedFile.name.endsWith('.csv') && 
          !selectedFile.name.endsWith('.xlsx')) {
        showError('Please upload a CSV or Excel file');
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      showError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await axiosInstance.post('/csvchassis/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadResult(response.data);
      showSuccess(`Successfully processed ${response.data.processed} records`);
      
      // Refresh imports list after upload
      setTimeout(() => {
        fetchImports();
      }, 1000);
      
      // Reset progress after 2 seconds
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setFile(null);
        setUploadModalOpen(false);
      }, 2000);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error('Error uploading file:', error);
      const message = showError(error);
      if (message) setError(message);
    }
  };

  const handleClick = (event, importId) => {
    setAnchorEl(event.currentTarget);
    setMenuId(importId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleViewDetails = (importRecord) => {
    setSelectedImport(importRecord);
    setActiveTab('summary');
    setDetailsModalOpen(true);
    handleClose();
  };

  const handleDelete = async (importId) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        // Delete using importId
        await axiosInstance.delete(`/csvchassis/imports/${importId}`);
        // Filter out the deleted record by importId
        setData(data.filter((record) => record.importId !== importId));
        setFilteredData(filteredData.filter((record) => record.importId !== importId));
        showSuccess('Import record deleted successfully!');
      } catch (error) {
        console.log('Delete error:', error);
        showError(error);
      }
    }
  };

  // Handle export CSV
 // Handle export to Excel (not CSV)
const handleExportExcel = async (importId) => {
  try {
    setExportingId(importId);
    setError(null);
    
    const response = await axiosInstance.get(
      `/csvchassis/export-csv/${importId}`,
      {
        responseType: 'blob',
        // Add headers if needed (depends on your backend)
        // headers: {
        //   'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // }
      }
    );

    // Check the content type from response
    const contentType = response.headers['content-type'] || response.headers['Content-Type'];
    
    // Determine file type and extension based on content type or backend response
    let fileType, extension;
    
    if (contentType?.includes('excel') || contentType?.includes('spreadsheetml')) {
      // Excel format
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      extension = 'xlsx';
    } else if (contentType?.includes('vnd.ms-excel')) {
      // Older Excel format
      fileType = 'application/vnd.ms-excel';
      extension = 'xls';
    } else {
      // Default to Excel format even if backend returns CSV
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      extension = 'xlsx';
    }

    // Create a blob with the appropriate MIME type
    const blob = new Blob([response.data], {
      type: fileType
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exported_Data_${importId}_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showSuccess(`Excel file exported successfully!`);
    handleClose();
    
  } catch (error) {
    console.error('Error exporting Excel:', error);
    const message = showError(error);
    if (message) setError(message);
  } finally {
    setExportingId(null);
  }
};

  // Apply batch filter
  const applyBatchFilter = () => {
    if (selectedBatch) {
      const filtered = data.filter(item => item.batchName === selectedBatch);
      setFilteredData(filtered);
      setIsFilterApplied(true);
    } else {
      setFilteredData(data);
      setIsFilterApplied(false);
    }
    setFilterModalOpen(false);
  };

  // Clear batch filter
  const clearBatchFilter = () => {
    setSelectedBatch('');
    setFilteredData(data);
    setIsFilterApplied(false);
    setFilterModalOpen(false);
  };

  // Reset filter modal
  const resetFilterModal = () => {
    setSelectedBatch('');
    setFilterModalOpen(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, ['importedBy.name', 'importedBy.email', 'batchName']);
  };

  const resetUploadModal = () => {
    setFile(null);
    setUploadResult(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadModalOpen(false);
  };

  const resetDownloadModal = () => {
    setRows(10);
    setIsDownloading(false);
    setDownloadModalOpen(false);
  };

  const resetDetailsModal = () => {
    setSelectedImport(null);
    setActiveTab('summary');
    setDetailsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'FAILED': return 'danger';
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return cilCheckCircle;
      case 'FAILED': return cilXCircle;
      case 'PENDING': return cilWarning;
      default: return cilWarning;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getVehicleStatusBadge = (status) => {
    switch (status) {
      case 'sold': return 'success';
      case 'not_approved': return 'warning';
      case 'pending': return 'info';
      default: return 'secondary';
    }
  };

  const formatBatchName = (batchName) => {
    if (!batchName) return 'No Batch Name';
    // Display only first 20 characters with ellipsis if longer
    if (batchName.length > 20) {
      return batchName.substring(0, 20) + '...';
    }
    return batchName;
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
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>RTO Chassis Management</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setDownloadModalOpen(true)}
            >
              <CIcon icon={cilCloudDownload} className='icon' /> Download Template
            </CButton>
            
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setUploadModalOpen(true)}
            >
              <CIcon icon={cilCloudUpload} className='icon' /> Upload CSV
            </CButton>

            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setFilterModalOpen(true)}
            >
              <CIcon icon={cilFilter} className='icon' /> Filter by Batch
            </CButton>

            {isFilterApplied && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={clearBatchFilter}
              >
                Clear Filter
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by imported by, batch name..."
              />
            </div>
          </div>

          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Batch Name</CTableHeaderCell>
                  <CTableHeaderCell>Imported By</CTableHeaderCell>
                  <CTableHeaderCell>Import Date</CTableHeaderCell>
                  <CTableHeaderCell>Total Records</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      No import history available. Upload a CSV file to see records.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredData.map((importRecord, index) => (
                    <CTableRow key={importRecord.importId}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div title={importRecord.batchName || 'No Batch Name'}>
                          {formatBatchName(importRecord.batchName)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <div>
                            <div className="fw-medium">{importRecord.importedBy?.name || '-'}</div>
                            <small className="text-muted">{importRecord.importedBy?.email || ''}</small>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(importRecord.importedAt)}</CTableDataCell>
                      <CTableDataCell>
                        <div className="text-center">
                          <span className="badge bg-primary rounded-pill" style={{ fontSize: '14px', padding: '6px 12px' }}>
                            {importRecord.totalRecords || 0}
                          </span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(importRecord.status)} className="d-flex align-items-center" style={{ gap: '6px' }}>
                          <CIcon icon={getStatusIcon(importRecord.status)} />
                          {importRecord.status || 'Unknown'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, importRecord.importId)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        <Menu 
                          id={`action-menu-${importRecord.importId}`} 
                          anchorEl={anchorEl} 
                          open={menuId === importRecord.importId} 
                          onClose={handleClose}
                        >
                          <MenuItem onClick={() => handleViewDetails(importRecord)}>
                            View Details
                          </MenuItem>
                          
                          <MenuItem onClick={() => handleExportExcel(importRecord.importId)}>
  <CIcon icon={cilArrowCircleBottom} className="me-2" />
  {exportingId === importRecord.importId ? 'Exporting...' : 'Export to Excel'}
</MenuItem>
                          
                          <MenuItem onClick={() => handleDelete(importRecord.importId)}>
                            <CIcon icon={cilTrash} className="me-2" />Delete
                          </MenuItem>
                        </Menu>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Upload CSV Modal */}
      <CModal visible={uploadModalOpen} onClose={resetUploadModal} size="lg">
        <CModalHeader>
          <CModalTitle>Upload CSV File</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Select CSV/Excel File<span className='required'>*</span></label>
            <CFormInput
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && (
              <div className="mt-2">
                <small>
                  Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </small>
              </div>
            )}
            <div className="mt-2">
              <small className="text-muted">
                • Max file size: 5MB<br/>
                • Supported formats: CSV, Excel (.xlsx, .xls)
              </small>
            </div>
          </div>

          {isUploading && (
            <div className="mb-3">
              <label className="form-label">Upload Progress</label>
              <div className="progress-container">
                <CProgress 
                  value={uploadProgress} 
                  color={uploadProgress < 100 ? "info" : "success"}
                  animated={uploadProgress < 100}
                />
                <div className="text-center mt-1">
                  <small>{uploadProgress}% {uploadProgress < 100 ? 'Uploading...' : 'Complete!'}</small>
                </div>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="alert alert-success">
              <strong>Success!</strong> {uploadResult.message}
              <br/>
              <small>
                Processed: {uploadResult.processed} records | 
                Errors: {uploadResult.errors} | 
                Total: {uploadResult.data?.length || 0} records
              </small>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetUploadModal}
            disabled={isUploading}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              'Upload & Process'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Download Template Modal */}
      <CModal visible={downloadModalOpen} onClose={resetDownloadModal}>
        <CModalHeader>
          <CModalTitle>Download Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Number of Empty Rows<span className='required'>*</span></label>
            <CFormInput
              type="number"
              min="1"
              max="100"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              disabled={isDownloading}
            />
          </div>
          
          <div className="alert alert-info">
            <small>
              <strong>Template includes headers:</strong><br/>
              CHASSIS NUMBERS, DATE OF INWARD, DATE OF SALE, AGEING FROM INWARD TO SALE,<br/>
              AGEING FROM INWARD TO REGISTRATION, SELLING DEALER LOCATION, SALES EXE,<br/>
              CUSTOMER NAME, FINANCER NAME, LEDGER BALANCE
            </small>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetDownloadModal}
            disabled={isDownloading}
          >
            Cancel
          </CButton>
          <CButton 
            className='submit-button'
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Downloading...
              </>
            ) : (
              'Download Template'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Batch Filter Modal */}
      <CModal visible={filterModalOpen} onClose={resetFilterModal}>
        <CModalHeader>
          <CModalTitle>Filter by Batch Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Select Batch Name:</label>
            <CFormSelect
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">-- All Batches --</option>
              {batchNames.map((batchName, index) => (
                <option key={index} value={batchName}>
                  {batchName}
                </option>
              ))}
            </CFormSelect>
          </div>
          
          {selectedBatch && (
            <div className="alert alert-info">
              <small>
                Selected: <strong>{selectedBatch}</strong><br/>
                Showing imports from this batch only
              </small>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={resetFilterModal}
          >
            Cancel
          </CButton>
          {selectedBatch && (
            <CButton 
              color="warning" 
              onClick={clearBatchFilter}
            >
              Clear Filter
            </CButton>
          )}
          <CButton 
            className='submit-button'
            onClick={applyBatchFilter}
            disabled={!selectedBatch}
          >
            Apply Filter
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Import Details Modal with Tabs */}
      <CModal visible={detailsModalOpen} onClose={resetDetailsModal} size="xl" fullscreen="lg">
        <CModalHeader>
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilInfo} className="me-2" />
            Import Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedImport && (
            <div className="import-details-container">
              {/* Import ID and Status Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
                <div>
                  <h6 className="mb-0 text-muted">Import ID</h6>
                  <h5 className="mb-0 fw-bold">{selectedImport.importId || '-'}</h5>
                  {selectedImport.batchName && (
                    <div>
                      <h6 className="mb-0 text-muted">Batch Name</h6>
                      <h6 className="mb-0 fw-bold">{selectedImport.batchName}</h6>
                    </div>
                  )}
                </div>
                <div className="text-end">
                  <h6 className="mb-0 text-muted">Status</h6>
                  <CBadge color={getStatusBadge(selectedImport.status)} className="px-3 py-2">
                    <CIcon icon={getStatusIcon(selectedImport.status)} className="me-1" />
                    {selectedImport.status || 'Unknown'}
                  </CBadge>
                </div>
              </div>

              {/* Tabs Navigation */}
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'summary'}
                    onClick={() => setActiveTab('summary')}
                  >
                    <CIcon icon={cilInfo} className="me-1" />
                    Summary
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'records'}
                    onClick={() => setActiveTab('records')}
                    disabled={!selectedImport.processedData || selectedImport.processedData.length === 0}
                  >
                    Processed Records ({selectedImport.processedData?.length || 0})
                  </CNavLink>
                </CNavItem>
              </CNav>

              {/* Tab Content */}
              <CTabContent className="mt-3">
                {/* Summary Tab */}
                <CTabPane visible={activeTab === 'summary'}>
                  <div className="row">
                    {/* Left Column - Basic Info */}
                    <div className="col-md-6">
                      <Card className="mb-3">
                        <CardHeader className="bg-light d-flex align-items-center">
                          <CIcon icon={cilFile} className="me-2" />
                          <span className="fw-medium">File Information</span>
                        </CardHeader>
                        <CardBody>
                          <div className="mb-2">
                            <small className="text-muted d-block">Batch Name</small>
                            <div className="fw-medium">{selectedImport.batchName || 'No Batch Name'}</div>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">Filename</small>
                            <div className="fw-medium">{selectedImport.originalFilename || selectedImport.filename || '-'}</div>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">File Type</small>
                            <div className="fw-medium">{selectedImport.fileType || '-'}</div>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">Total Records</small>
                            <div className="fw-medium">{selectedImport.totalRecords || 0}</div>
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="mb-3">
                        <CardHeader className="bg-light d-flex align-items-center">
                          <CIcon icon={cilUser} className="me-2" />
                          <span className="fw-medium">Import Details</span>
                        </CardHeader>
                        <CardBody>
                          <div className="mb-2">
                            <small className="text-muted d-block">Imported By</small>
                            <div className="fw-medium">{selectedImport.importedBy?.name || '-'}</div>
                            <small className="text-muted">{selectedImport.importedBy?.email || ''}</small>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">Import Date</small>
                            <div className="fw-medium">{formatDate(selectedImport.importedAt)}</div>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">Created At</small>
                            <div className="fw-medium">{formatDate(selectedImport.createdAt)}</div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Right Column - Statistics and Results */}
                    <div className="col-md-6">
                      <Card className="mb-3">
                        <CardHeader className="bg-light d-flex align-items-center">
                          <CIcon icon={cilList} className="me-2" />
                          <span className="fw-medium">Processing Statistics</span>
                        </CardHeader>
                        <CardBody>
                          <div className="row text-center">
                            <div className="col-4">
                              <div className="border rounded p-3">
                                <div className="display-6 fw-bold text-primary">{selectedImport.totalRecords || 0}</div>
                                <small className="text-muted">Total Records</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="border rounded p-3">
                                <div className="display-6 fw-bold text-success">{selectedImport.processedRecords || 0}</div>
                                <small className="text-muted">Processed</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="border rounded p-3">
                                <div className="display-6 fw-bold text-danger">{selectedImport.errorRecords || 0}</div>
                                <small className="text-muted">Errors</small>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small>Success Rate</small>
                              <small>
                                {selectedImport.totalRecords > 0 
                                  ? Math.round((selectedImport.processedRecords / selectedImport.totalRecords) * 100) 
                                  : 0}%
                              </small>
                            </div>
                            <CProgress 
                              value={selectedImport.totalRecords > 0 
                                ? (selectedImport.processedRecords / selectedImport.totalRecords) * 100 
                                : 0} 
                              color="success"
                              className="mb-3"
                            />
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="mb-3">
                        <CardHeader className="bg-light d-flex align-items-center">
                          <CIcon icon={cilCalendar} className="me-2" />
                          <span className="fw-medium">Export Information</span>
                        </CardHeader>
                        <CardBody>
                          <div className="mb-2">
                            <small className="text-muted d-block">Exported</small>
                            <div className="d-flex align-items-center">
                              <div className={`badge ${selectedImport.exported ? 'bg-success' : 'bg-secondary'} me-2`}>
                                {selectedImport.exported ? 'Yes' : 'No'}
                              </div>
                              {selectedImport.exported && (
                                <small className="text-muted">({selectedImport.exportCount || 0} times)</small>
                              )}
                            </div>
                          </div>
                          {selectedImport.exportedAt && (
                            <div className="mb-2">
                              <small className="text-muted d-block">Last Exported At</small>
                              <div className="fw-medium">{formatDate(selectedImport.exportedAt)}</div>
                            </div>
                          )}
                          <div className="mb-2">
                            <small className="text-muted d-block">Last Updated</small>
                            <div className="fw-medium">{formatDate(selectedImport.updatedAt)}</div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>

                  {/* Errors Section (if any) */}
                  {selectedImport.errors && selectedImport.errors.length > 0 && (
                    <Card className="border-danger">
                      <CardHeader className="bg-danger text-white d-flex align-items-center">
                        <CIcon icon={cilWarning} className="me-2" />
                        <span className="fw-medium">Errors Found ({selectedImport.errors.length})</span>
                      </CardHeader>
                      <CardBody>
                        <ul className="list-unstyled mb-0">
                          {selectedImport.errors.map((error, index) => (
                            <li key={index} className="mb-2">
                              <div className="alert alert-danger py-2 mb-2">
                                <small className="d-flex align-items-center">
                                  <span className="badge bg-danger me-2">{index + 1}</span>
                                  {error.error}
                                </small>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  )}
                </CTabPane>

                {/* Processed Records Tab */}
<CTabPane visible={activeTab === 'records'}>
  {selectedImport.processedData && selectedImport.processedData.length > 0 ? (
    <div className="processed-records-section">
      <div className="alert alert-info mb-3">
        Showing {selectedImport.processedData.length} processed records
      </div>
      
      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <CTable striped bordered hover responsive className="processed-records-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Sr.no</CTableHeaderCell>
              <CTableHeaderCell>Chassis Number</CTableHeaderCell>
              {/* <CTableHeaderCell>Vehicle ID</CTableHeaderCell> */}
              <CTableHeaderCell>Model Name</CTableHeaderCell>
              <CTableHeaderCell>Date of Inward</CTableHeaderCell>
              <CTableHeaderCell>Date of Sale</CTableHeaderCell>
              <CTableHeaderCell>Ageing (Inward to Sale)</CTableHeaderCell>
              <CTableHeaderCell>Ageing (Inward to Registration)</CTableHeaderCell>
              <CTableHeaderCell>Selling Dealer Location</CTableHeaderCell>
              <CTableHeaderCell>Sales EXE</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Financer Name</CTableHeaderCell>
              <CTableHeaderCell>Ledger Balance</CTableHeaderCell>
              {/* <CTableHeaderCell>Booking ID</CTableHeaderCell> */}
              <CTableHeaderCell>Vehicle Status</CTableHeaderCell>
              {/* <CTableHeaderCell>Has Error</CTableHeaderCell> */}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {selectedImport.processedData.map((record, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <strong>{record.chassisNumber || '-'}</strong>
                </CTableDataCell>
                {/* <CTableDataCell>
                  <small className="text-muted">{record.vehicleId || '-'}</small>
                </CTableDataCell> */}
                <CTableDataCell>{record.modelName || '-'}</CTableDataCell>
                <CTableDataCell>{formatDate(record.dateOfInward)}</CTableDataCell>
                <CTableDataCell>{formatDate(record.dateOfSale)}</CTableDataCell>
                <CTableDataCell>{record.ageingFromInwardToSale || '-'}</CTableDataCell>
                <CTableDataCell>{record.ageingFromInwardToRegistration || '-'}</CTableDataCell>
                <CTableDataCell>{record.sellingDealerLocation || '-'}</CTableDataCell>
                <CTableDataCell>{record.salesExe || '-'}</CTableDataCell>
                <CTableDataCell>{record.customerName || '-'}</CTableDataCell>
                <CTableDataCell>{record.financerName || '-'}</CTableDataCell>
                <CTableDataCell>
                  {record.ledgerBalance !== null && record.ledgerBalance !== undefined 
                    ? `₹${record.ledgerBalance}` 
                    : '-'}
                </CTableDataCell>
                {/* <CTableDataCell>
                  <small className="text-muted">{record.bookingId || '-'}</small>
                </CTableDataCell> */}
                <CTableDataCell>
                  <CBadge color={getVehicleStatusBadge(record.vehicleStatus)}>
                    {record.vehicleStatus ? record.vehicleStatus.replace('_', ' ') : '-'}
                  </CBadge>
                </CTableDataCell>
                {/* <CTableDataCell>
                  <CBadge color={record.hasError ? 'danger' : 'success'}>
                    {record.hasError ? 'Yes' : 'No'}
                  </CBadge>
                </CTableDataCell> */}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {/* Summary Statistics */}
      <div className="row mt-4">
        <div className="col-md-6">
          <Card className="mb-3">
            <CardHeader className="bg-light">
              <small className="fw-medium">Records Summary</small>
            </CardHeader>
            <CardBody>
              <div className="row">
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Total Records</small>
                  <div className="fw-medium">{selectedImport.processedData.length}</div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">With Errors</small>
                  <div className="fw-medium">
                    {selectedImport.processedData.filter(r => r.hasError).length}
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Sold Vehicles</small>
                  <div className="fw-medium">
                    {selectedImport.processedData.filter(r => r.vehicleStatus === 'sold').length}
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Not Approved</small>
                  <div className="fw-medium">
                    {selectedImport.processedData.filter(r => r.vehicleStatus === 'not_approved').length}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="mb-3">
            <CardHeader className="bg-light">
              <small className="fw-medium">Financial Summary</small>
            </CardHeader>
            <CardBody>
              <div className="row">
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Total Ledger Balance</small>
                  <div className="fw-medium">
                    ₹{selectedImport.processedData
                      .filter(r => r.ledgerBalance !== null && r.ledgerBalance !== undefined)
                      .reduce((sum, r) => sum + r.ledgerBalance, 0)}
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Records with Balance</small>
                  <div className="fw-medium">
                    {selectedImport.processedData.filter(r => r.ledgerBalance !== null && r.ledgerBalance !== undefined).length}
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Avg Balance</small>
                  <div className="fw-medium">
                    ₹{(() => {
                      const recordsWithBalance = selectedImport.processedData
                        .filter(r => r.ledgerBalance !== null && r.ledgerBalance !== undefined);
                      if (recordsWithBalance.length === 0) return 0;
                      const total = recordsWithBalance.reduce((sum, r) => sum + r.ledgerBalance, 0);
                      return Math.round(total / recordsWithBalance.length);
                    })()}
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <small className="text-muted d-block">Max Balance</small>
                  <div className="fw-medium">
                    ₹{Math.max(...selectedImport.processedData
                      .filter(r => r.ledgerBalance !== null && r.ledgerBalance !== undefined)
                      .map(r => r.ledgerBalance), 0)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <div className="alert alert-warning text-center py-5">
      <CIcon icon={cilWarning} className="me-2" />
      No processed records available for this import.
    </div>
  )}
</CTabPane>
              </CTabContent>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetDetailsModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default RtoChassis;