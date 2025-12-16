

import React from 'react'
import classNames from 'classnames'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilZoomOut } from '@coreui/icons'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { useState, useEffect } from 'react'
import axiosInstance from 'src/axiosInstance' // Fixed: removed curly braces
import ViewBooking from '../sales/booking/BookingDetails' // Import the ViewBooking modal

const Dashboard = () => {
  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const [pendingBookings, setPendingBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchPendingBookings()
  }, [])

  const fetchPendingBookings = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/bookings`)
      // Filter for pending bookings (adjust filter condition as needed)
      const pendingBookings = response.data.data.bookings.filter(
        (booking) => booking.status === 'PENDING_APPROVAL' || 
                   booking.status === 'PENDING_APPROVAL (Discount_Exceeded)'
      )
      setPendingBookings(pendingBookings)
      setLoading(false)
    } catch (error) {
      console.log('Error fetching pending bookings', error)
      setLoading(false)
    }
  }

  const handleViewBooking = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`)
      setSelectedBooking(response.data.data)
      setViewModalVisible(true)
    } catch (error) {
      console.log('Error fetching booking details', error)
    }
  }

  // Filter pending bookings based on search term
  const filteredPendingBookings = pendingBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (booking.bookingNumber || '').toLowerCase().includes(searchLower) ||
      (booking.customerDetails?.name || '').toLowerCase().includes(searchLower) ||
      (booking.customerDetails?.mobile1 || '').toLowerCase().includes(searchLower) ||
      (booking.model?.model_name || '').toLowerCase().includes(searchLower)
    )
  })

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      
      {/* Pending Bookings Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={6}>
              <h4 className="card-title mb-0">
                Pending Bookings
              </h4>
              <div className="small text-body-secondary">Recent pending booking approvals</div>
            </CCol>
            <CCol sm={6} className="d-flex justify-content-end">
              <CFormInput
                type="text"
                placeholder="Search bookings..."
                style={{ maxWidth: '250px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>
          </CRow>

          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
              <p className="mt-2">Loading pending bookings...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPendingBookings.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center">
                        No pending bookings found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredPendingBookings.slice(0, 5).map((booking, index) => (
                      <CTableRow key={booking._id || index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{booking.bookingNumber || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{booking.model?.model_name || booking.model?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{booking.customerDetails?.mobile1 || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge ${booking.status.includes('PENDING') ? 'bg-warning' : 'bg-secondary'}`}>
                            {booking.status}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="info"
                            onClick={() => handleViewBooking(booking._id || booking.id)}
                            title="View Booking Details"
                          >
                            <CIcon icon={cilZoomOut} className="me-1" />
                            View
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
              
              {filteredPendingBookings.length > 5 && (
                <div className="text-end mt-2">
                  <small className="text-muted">
                    Showing 5 of {filteredPendingBookings.length} pending bookings
                  </small>
                </div>
              )}
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Original Traffic Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - July 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      
      <WidgetsBrand className="mb-4" withCharts />

      {/* View Booking Modal */}
      <ViewBooking 
        open={viewModalVisible} 
        onClose={() => {
          setViewModalVisible(false);
          setSelectedBooking(null);
        }} 
        booking={selectedBooking} 
        refreshData={fetchPendingBookings} 
      />
    </>
  )
}

export default Dashboard
