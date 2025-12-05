import '../../../css/table.css'
import {
  React,
  useState,
  useEffect,
  getDefaultSearchFields,
  useTableFilter,
  axiosInstance,
} from '../../../utils/tableImports'
import CIcon from '@coreui/icons-react'
import { 
  cilCheckCircle, 
  cilXCircle,
  cilSettings
} from '@coreui/icons'
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
  CAlert, 
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormTextarea,
  CModalFooter,
} from '@coreui/react'

const SelfInsurance = () => {
  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [actionType, setActionType] = useState('')
  const [note, setNote] = useState('')
  const [processing, setProcessing] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuId, setMenuId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/bookings?status=FREEZZED')

      const selfInsuranceBookings = response.data.data.bookings.filter(
        (booking) => booking.selfInsurance === true
      )
      setData(selfInsuranceBookings)
      setFilteredData(selfInsuranceBookings)
    } catch (error) {
      console.log('Error fetching data', error)
      setError('Failed to fetch self insurance bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    handleFilter(value, getDefaultSearchFields('booking'))
  }

  const handleApproveReject = (booking, decision) => {
    setSelectedBooking(booking)
    setActionType(decision)
    setNote('')
    setModalVisible(true)
    handleClose()
  }

  const handleSubmitDecision = async () => {
    if (!selectedBooking || !note.trim()) {
      setError('Please enter a note for the decision')
      return
    }

    try {
      setProcessing(true)
      
      const payload = {
        bookingId: selectedBooking._id,
        decision: actionType,
        note: note.trim()
      }

      await axiosInstance.post('/freeze/freeze-decision', payload)
      
      await fetchData()
      
      setModalVisible(false)
      setSelectedBooking(null)
      setActionType('')
      setNote('')
      setError(null)
      
      setError({
        type: 'success',
        message: `Self insurance request ${actionType.toLowerCase()}d successfully`
      })
      
      setTimeout(() => {
        setError(null)
      }, 3000)
      
    } catch (err) {
      console.error('Error submitting decision:', err)
      setError(`Failed to ${actionType.toLowerCase()} request: ${err.response?.data?.message || err.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setMenuId(id)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setMenuId(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FREEZZED':
        return (
          <CBadge color="warning">
            <CIcon icon={cilXCircle} className="me-1" />
            Frozen
          </CBadge>
        )
      case 'PENDING_APPROVAL':
        return (
          <CBadge color="info">
            <CIcon icon={cilXCircle} className="me-1" />
            Pending Approval
          </CBadge>
        )
      case 'ALLOCATED':
        return (
          <CBadge color="success">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Allocated
          </CBadge>
        )
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const getCancellationBadge = (cancellationStatus) => {
    switch (cancellationStatus) {
      case 'PENDING':
        return (
          <CBadge color="warning">
            <CIcon icon={cilXCircle} className="me-1" />
            Pending
          </CBadge>
        )
      case 'APPROVED':
        return (
          <CBadge color="success">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Approved
          </CBadge>
        )
      case 'REJECTED':
        return (
          <CBadge color="danger">
            <CIcon icon={cilXCircle} className="me-1" />
            Rejected
          </CBadge>
        )
      default:
        return (
          <CBadge color="secondary">
            <CIcon icon={cilCheckCircle} className="me-1" />
            Not Requested
          </CBadge>
        )
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="title">Self Insurance Bookings</div>

      {error && (
        <CAlert 
          color={error.type === 'success' ? 'success' : 'danger'} 
          className="mb-3"
          dismissible={error.type === 'success'}
          onClose={() => setError(null)}
        >
          {error.message || error}
        </CAlert>
      )}

      <CCard className="table-container mt-4">
        <CCardHeader className="card-header d-flex justify-content-between align-items-center">
          <div></div>
          <div className="d-flex">
            <CFormLabel className="mt-1 m-1">Search:</CFormLabel>
            <CFormInput
              type="text"
              className="d-inline-block square-search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search bookings..."
            />
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className="responsive-table">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Booking ID</CTableHeaderCell>
                  <CTableHeaderCell>Model Name</CTableHeaderCell>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  <CTableHeaderCell>Booking Date</CTableHeaderCell>
                  <CTableHeaderCell>Booking Status</CTableHeaderCell>
                  <CTableHeaderCell>Insurance Status</CTableHeaderCell>
                  <CTableHeaderCell>Cancellation Status</CTableHeaderCell>
                  <CTableHeaderCell>Total Amount</CTableHeaderCell>
                  <CTableHeaderCell>Balance Amount</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((booking, index) => (
                    <CTableRow key={booking._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{booking.bookingNumber}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{booking.model?.model_name || ''}</CTableDataCell>
                      <CTableDataCell>
                        {booking.customerDetails?.name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {booking.customerDetails?.mobile1 || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </CTableDataCell>
                      <CTableDataCell>{getStatusBadge(booking.status)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={booking.insuranceStatus === 'AWAITING' ? 'warning' : 'info'}>
                          {booking.insuranceStatus === 'AWAITING' ? (
                            <CIcon icon={cilXCircle} className="me-1" />
                          ) : (
                            <CIcon icon={cilCheckCircle} className="me-1" />
                          )}
                          {booking.insuranceStatus}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getCancellationBadge(booking.cancellationRequest?.status)}
                      </CTableDataCell>
                      <CTableDataCell>
                        ₹{booking.discountedAmount?.toLocaleString('en-IN') || '0'}
                      </CTableDataCell>
                      <CTableDataCell>
                        ₹{booking.balanceAmount?.toLocaleString('en-IN') || '0'}
                      </CTableDataCell>
                      <CTableDataCell style={{ position: 'relative' }}>
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={(event) => handleClick(event, booking._id)}
                        >
                          <CIcon icon={cilSettings} />
                          Options
                        </CButton>
                        
                        {/* Dropdown Menu */}
                        {menuId === booking._id && (
                          <div 
                            className="dropdown-menu show" 
                            style={{ 
                              position: 'absolute', 
                              top: '100%', 
                              left: 0, 
                              zIndex: 1000,
                              backgroundColor: 'white',
                              border: '1px solid rgba(0,0,0,.15)',
                              borderRadius: '0.25rem',
                              boxShadow: '0 6px 12px rgba(0,0,0,.175)',
                              minWidth: '160px',
                              padding: '5px 0',
                              margin: '2px 0 0'
                            }}
                          >
                            <button
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleApproveReject(booking, 'APPROVE')}
                              style={{ 
                                border: 'none', 
                                background: 'none', 
                                color: 'black',
                                padding: '8px 16px',
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <CIcon icon={cilCheckCircle} className="me-2" style={{ color: '#198754' }} />
                              Approve
                            </button>
                            <button
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleApproveReject(booking, 'REJECT')}
                              style={{ 
                                border: 'none', 
                                background: 'none', 
                                color: 'black',
                                padding: '8px 16px',
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <CIcon icon={cilXCircle} className="me-2" style={{ color: '#dc3545' }} />
                              Reject
                            </button>
                            <div 
                              style={{ 
                                height: '1px', 
                                backgroundColor: '#e9ecef', 
                                margin: '4px 0'
                              }}
                            />
                            <button
                              className="dropdown-item d-flex align-items-center"
                              onClick={handleClose}
                              style={{ 
                                border: 'none', 
                                background: 'none', 
                                color: '#6c757d',
                                padding: '8px 16px',
                                width: '100%',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="12" className="text-center">
                      No self insurance bookings found.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Decision Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>
            {actionType === 'APPROVE' ? 'Approve' : 'Reject'} Self Insurance Request
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <strong>Booking Details:</strong>
            <div className="mt-2">
              <p><strong>Booking ID:</strong> {selectedBooking?.bookingNumber}</p>
              <p><strong>Customer:</strong> {selectedBooking?.customerDetails?.name}</p>
              <p><strong>Model:</strong> {selectedBooking?.model?.model_name}</p>
              <p><strong>Total Amount:</strong> ₹{selectedBooking?.discountedAmount?.toLocaleString('en-IN')}</p>
              <p><strong>Cancellation Status:</strong> {selectedBooking?.cancellationRequest?.status || 'Not Requested'}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <CFormLabel htmlFor="note">
              <strong>Note *</strong> 
              <span className="text-muted ms-1">
                (Please provide reason for {actionType === 'APPROVE' ? 'approval' : 'rejection'})
              </span>
            </CFormLabel>
            <CFormTextarea
              id="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                actionType === 'APPROVE' 
                  ? "Enter note for approval. Example: Customer will arrange their own insurance policy..."
                  : "Enter note for rejection. Example: Insurance must be purchased through dealer as per policy..."
              }
              required
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              setModalVisible(false)
              setSelectedBooking(null)
              setNote('')
            }}
            disabled={processing}
          >
            Cancel
          </CButton>
          <CButton 
            color={actionType === 'APPROVE' ? 'success' : 'danger'}
            onClick={handleSubmitDecision}
            disabled={!note.trim() || processing}
          >
            {processing ? (
              <>
                <CSpinner component="span" size="sm" />
                <span className="ms-1">Processing...</span>
              </>
            ) : (
              <>
                <CIcon icon={actionType === 'APPROVE' ? cilCheckCircle : cilXCircle} className="me-2" />
                {actionType === 'APPROVE' ? 'Approve Request' : 'Reject Request'}
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default SelfInsurance