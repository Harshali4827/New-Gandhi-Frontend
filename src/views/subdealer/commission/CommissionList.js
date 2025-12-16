import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CSpinner,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react';
import '../../../css/table.css';
import '../../../css/form.css';
import {
  React,
  useState,
  useEffect,
  Link,
  Menu,
  MenuItem,
  useTableFilter,
  confirmDelete,
  showError,
  showSuccess,
  axiosInstance
} from 'src/utils/tableImports';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { hasPermission } from 'src/utils/permissionUtils';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSearch, cilZoomOut } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const CommissionList = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateRangeModalVisible, setDateRangeModalVisible] = useState(false);
  const [subdealers, setSubdealers] = useState([]);
  const [selectedSubdealer, setSelectedSubdealer] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('');
  const [importSubdealer, setImportSubdealer] = useState('');
  const [importModelType, setImportModelType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [commissionData, setCommissionData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedSubdealerName, setSelectedSubdealerName] = useState('');
  const [priceHeaders, setPriceHeaders] = useState([]);
  const [dateRangeSubdealer, setDateRangeSubdealer] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [error, setError] = useState(null);
  const [toDate, setToDate] = useState('');
  const [dateRangeData, setDateRangeData] = useState(null);
  const [loadingDateRange, setLoadingDateRange] = useState(false);
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { permissions} = useAuth();
  const hasEditPermission = hasPermission(permissions,'SUBDEALER_COMMISSION_UPDATE');
  const hasAddPermission = hasPermission(permissions,'SUBDEALER_COMMISSION_CREATE');
  const hasDeletePermission = hasPermission(permissions,'SUBDEALER_COMMISSION_DELETE');
  const showActionColumn = hasEditPermission || hasDeletePermission;

  useEffect(() => {
    fetchSubdealers();
  }, []);

  const fetchSubdealers = async () => {
    try {
      const response = await axiosInstance.get(`/subdealers`);
      setSubdealers(response.data.data.subdealers || []);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
    }
  };

  const fetchCommissionData = async (subdealerId) => {
    try {
      const response = await axiosInstance.get(`/commission-master/subdealer/${subdealerId}`);
      const commissionData = response.data.data.commission_masters || [];
      setCommissionData(commissionData);
      setFilteredData(commissionData);
      setIsFilterApplied(true);
      setFilterModalVisible(false);

      const headers = [];
      const headerMap = new Map();

      commissionData.forEach((commission) => {
        if (commission.commission_rates) {
          commission.commission_rates.forEach((rate) => {
            if (rate.header_id && !headerMap.has(rate.header_id._id)) {
              headerMap.set(rate.header_id._id, rate.header_id);
              headers.push(rate.header_id);
            }
          });
        }
      });

      setPriceHeaders(headers);
      const selected = subdealers.find((s) => s._id === subdealerId);
      if (selected) {
        setSelectedSubdealerName(selected.name || selected.companyName || selected.email);
      }
    } catch (error) {
      console.log('Error fetching commission data', error);
      showError('Failed to load commission details');
    }
  };

  const fetchDateRangeCommission = async () => {
    if (!dateRangeSubdealer) {
      showError('Please select a subdealer');
      return;
    }

    if (!fromDate) {
      showError('Please select a from date');
      return;
    }

    setLoadingDateRange(true);

    try {
      const requestBody = {
        fromDate: fromDate
      };

      if (toDate) {
        requestBody.toDate = toDate;
      }

      const response = await axiosInstance.put(`/commission-master/${dateRangeSubdealer}/date-range-commission`, requestBody);

      if (response.data.status === 'success') {
        showSuccess('Commission applied successfully for the selected date range');
        setDateRangeModalVisible(false);
        setDateRangeSubdealer('');
        setFromDate('');
        setToDate('');
        setDateRangeData(null);
      } else {
        showError('Failed to apply commission for date range');
      }
    } catch (error) {
      console.log('Error applying date range commission', error);
      showError('Failed to apply commission for date range');
    } finally {
      setLoadingDateRange(false);
    }
  };

  const handleApplyFilter = () => {
    if (!selectedSubdealer) {
      showError('Please select a subdealer');
      return;
    }
    fetchCommissionData(selectedSubdealer);
  };

  const handleClearFilter = () => {
    setSelectedSubdealer('');
    setSelectedSubdealerName('');
    setCommissionData([]);
    setFilteredData([]);
    setPriceHeaders([]);
    setIsFilterApplied(false);
  };

  const handleExportCSV = async () => {
    if (!selectedSubdealer || !selectedModelType) {
      showError('Please select both subdealer and model type');
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/commission-master/export-template?subdealer_id=${selectedSubdealer}&model_type=${selectedModelType}`,
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `commission_template_${selectedModelType}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportModalVisible(false);
      setSelectedSubdealer('');
      setSelectedModelType('');
      showSuccess('CSV template downloaded successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showError('Failed to download CSV template');
    }
  };

  const handleImportCSV = async () => {
    if (!importSubdealer || !importModelType || !selectedFile) {
      showError('Please select subdealer, model type, and choose a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('subdealer_id', importSubdealer);
      formData.append('model_type', importModelType);

      const response = await axiosInstance.post(`/commission-master/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImportModalVisible(false);
      setImportSubdealer('');
      setImportModelType('');
      setSelectedFile(null);

      showSuccess('CSV imported successfully');
      if (isFilterApplied && importSubdealer === selectedSubdealer) {
        fetchCommissionData(selectedSubdealer);
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      showError('Failed to import CSV');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/commission-master/${id}`);
        if (isFilterApplied && selectedSubdealer) {
          fetchCommissionData(selectedSubdealer);
        }
        showSuccess();
      } catch (error) {
        console.log(error);
        showError(error);
      }
    }
  };

  const findCommissionRate = (modelId, headerId) => {
    const commission = commissionData.find((c) => c.model_id === modelId);
    if (!commission || !commission.commission_rates) return '-';

    const rate = commission.commission_rates.find((r) => r.header_id && r.header_id._id === headerId);
    return rate ? `${rate.commission_rate}` : '-';
  };

  const handleCommissionSearch = (searchValue) => {
    if (!searchValue) {
      setFilteredData(commissionData);
      return;
    }

    const searchTerm = searchValue.toLowerCase();
    const filtered = commissionData.filter((commission) => {
      if (commission.model_details?.model_name?.toLowerCase().includes(searchTerm)) {
        return true;
      }
      if (commission.model_details?.type?.toLowerCase().includes(searchTerm)) {
        return true;
      }
      if (commission.commission_rates) {
        return commission.commission_rates.some(
          (rate) => rate.header_id?.header_key?.toLowerCase().includes(searchTerm) || String(rate.commission_rate).includes(searchTerm)
        );
      }

      return false;
    });

    setFilteredData(filtered);
  };
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
      {error}
      </div>
    );
  }
  return (
    <div className="form-container">
      <div className="title">{isFilterApplied ? `Subdealer Commission - ${selectedSubdealerName}` : 'Subdealer Commission'}</div>
      
      <CCard className="table-container mt-4">
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasAddPermission && (
              <Link to="/subdealer/add-commission">
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className="me-1" /> Add
                </CButton>
              </Link>
            )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setFilterModalVisible(true)}
            >
              <CIcon icon={cilSearch} className="me-1" /> Filter
            </CButton>
            
            {isFilterApplied && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleClearFilter}
              >
                <CIcon icon={cilZoomOut} className="me-1" /> Reset Search
              </CButton>
            )}
            
            {hasEditPermission && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={() => setDateRangeModalVisible(true)}
              >
                <DateRangeIcon className="me-1" /> Date Range
              </CButton>
            )}

            {hasAddPermission && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={() => setImportModalVisible(true)}
              >
                <FileUploadIcon className="me-1" /> Import
              </CButton>
            )}

            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setExportModalVisible(true)}
            >
              <FileDownloadIcon className="me-1" /> Export
            </CButton>

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
                // value={searchTerm}
                onChange={(e) => handleCommissionSearch(e.target.value)}
              />
            </div>
          </div>

          {!isFilterApplied ? (
            <div className="text-center py-5">
              <p className="text-muted">Please apply a filter to view commission data</p>
            </div>
          ) : (
            <div className="responsive-table-wrapper">
              {priceHeaders.length > 0 ? (
                <CTable striped bordered hover responsive className="responsive-table">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Model Name</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      {priceHeaders.map((header) => (
                        <CTableHeaderCell key={header._id}>{header.header_key} Commission</CTableHeaderCell>
                      ))}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={priceHeaders.length + 2} className="text-center text-muted">
                          No commission data available for this subdealer
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.model_details?.model_name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{item.model_details?.type || 'N/A'}</CTableDataCell>
                          {priceHeaders.map((header) => (
                            <CTableDataCell key={header._id}>{findCommissionRate(item.model_id, header._id)}</CTableDataCell>
                          ))}
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              ) : (
                <CTable striped bordered hover responsive className="responsive-table">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr.no</CTableHeaderCell>
                      <CTableHeaderCell>Model Name</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Commission Rates</CTableHeaderCell>
                      {showActionColumn && <CTableHeaderCell>Action</CTableHeaderCell>}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={showActionColumn ? 5 : 4} className="text-center text-muted">
                          No commission data available for this subdealer
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      filteredData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{item.model_details?.model_name || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{item.model_details?.type || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            {item.commission_rates && item.commission_rates.length > 0 ? (
                              <details>
                                <summary>View Rates ({item.commission_rates.length})</summary>
                                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                  {item.commission_rates.map((rate, idx) => (
                                    <div key={idx} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                                      <strong>{rate.header_id?.header_key || 'N/A'}:</strong> {rate.commission_rate}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            ) : (
                              'No rates'
                            )}
                          </CTableDataCell>
                          {showActionColumn && (
                            <CTableDataCell>
                              <CButton 
                                size="sm" 
                                className="option-button btn-sm"
                                onClick={(event) => handleClick(event, item._id)}
                              >
                                Options
                              </CButton>
                              <Menu id={`action-menu-${item._id}`} anchorEl={anchorEl} open={menuId === item._id} onClose={handleClose}>
                                <Link className="Link" to={`/subdealer/update-commission/${item._id}`}>
                                  <MenuItem>Edit</MenuItem>
                                </Link>
                                <MenuItem onClick={() => handleDelete(item._id)}>Delete</MenuItem>
                              </Menu>
                            </CTableDataCell>
                          )}
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Filter Modal */}
      <CModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)}>
        <CModalHeader onClose={() => setFilterModalVisible(false)}>
          <CModalTitle>Filter by Subdealer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="subdealerFilterSelect">Select Subdealer</CFormLabel>
            <CFormSelect id="subdealerFilterSelect" value={selectedSubdealer} onChange={(e) => setSelectedSubdealer(e.target.value)}>
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={handleApplyFilter}>
            Apply
          </CButton>
        </CModalFooter>
      </CModal>


      <CModal
        visible={dateRangeModalVisible}
        onClose={() => {
          setDateRangeModalVisible(false);
          setDateRangeData(null);
          setDateRangeSubdealer('');
          setFromDate('');
          setToDate('');
        }}
      >
        <CModalHeader
          onClose={() => {
            setDateRangeModalVisible(false);
            setDateRangeData(null);
            setDateRangeSubdealer('');
            setFromDate('');
            setToDate('');
          }}
        >
          <CModalTitle>Apply Date Range Commission</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="dateRangeSubdealerSelect">Select Subdealer</CFormLabel>
            <CFormSelect id="dateRangeSubdealerSelect" value={dateRangeSubdealer} onChange={(e) => setDateRangeSubdealer(e.target.value)}>
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="fromDate">From Date *</CFormLabel>
                <CFormInput type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="toDate">To Date (Optional)</CFormLabel>
                <CFormInput type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </CCol>
          </CRow>

          {loadingDateRange && (
            <div className="text-center">
              <CSpinner />
              <p>Applying commission...</p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={fetchDateRangeCommission} disabled={loadingDateRange}>
            Apply Commission
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)}>
        <CModalHeader onClose={() => setExportModalVisible(false)}>
          <CModalTitle>Export Commission Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="subdealerSelect">Select Subdealer</CFormLabel>
            <CFormSelect id="subdealerSelect" value={selectedSubdealer} onChange={(e) => setSelectedSubdealer(e.target.value)}>
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="modelTypeSelect">Select Model Type</CFormLabel>
            <CFormSelect id="modelTypeSelect" value={selectedModelType} onChange={(e) => setSelectedModelType(e.target.value)}>
              <option value="">Select Model Type</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={handleExportCSV}>
            Generate CSV
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={importModalVisible} onClose={() => setImportModalVisible(false)}>
        <CModalHeader onClose={() => setImportModalVisible(false)}>
          <CModalTitle>Import Commission Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel htmlFor="importSubdealerSelect">Select Subdealer</CFormLabel>
            <CFormSelect id="importSubdealerSelect" value={importSubdealer} onChange={(e) => setImportSubdealer(e.target.value)}>
              <option value="">Select Subdealer</option>
              {subdealers.map((subdealer) => (
                <option key={subdealer._id} value={subdealer._id}>
                  {subdealer.name || subdealer.companyName || subdealer.email}
                </option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="importModelTypeSelect">Select Model Type</CFormLabel>
            <CFormSelect id="importModelTypeSelect" value={importModelType} onChange={(e) => setImportModelType(e.target.value)}>
              <option value="">Select Model Type</option>
              <option value="EV">EV</option>
              <option value="ICE">ICE</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="fileInput">Select CSV File</CFormLabel>
            <CFormInput type="file" id="fileInput" accept=".csv" onChange={handleFileChange} />
            {selectedFile && <div className="mt-2 text-muted">Selected file: {selectedFile.name}</div>}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton className='submit-button' onClick={handleImportCSV}>
            Import CSV
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CommissionList;