import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FiFileText, FiPieChart, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { BsFileEarmarkCheck, BsFileEarmarkX } from 'react-icons/bs';
import axiosInstance from '../../../axiosInstance';
import '../../../css/dashboard.css';

const InsuranceDashboard = () => {
  const [bookingData, setBookingData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState({ bookings: true, financials: true });
  const [error, setError] = useState({ bookings: null, financials: null });

  useEffect(() => {
    const fetchBookingCounts = async () => {
      try {
        console.log('Fetching booking counts...');
        const response = await axiosInstance.get('ledger/booking-counts');
        console.log('Booking API Response:', response.data);
        
        if (response.data.status === 'success') {
          setBookingData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
        }
      } catch (err) {
        console.error('Booking API Error:', err);
        setError((prev) => ({ ...prev, bookings: err.message || 'Failed to fetch booking data' }));
      } finally {
        setLoading((prev) => ({ ...prev, bookings: false }));
      }
    };

    fetchBookingCounts();
  }, []);

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        console.log('Fetching financial summary...');
        const response = await axiosInstance.get('ledger/summary/branch');
        console.log('Financial API Response:', response.data);
        
        if (response.data.status === 'success') {
          setFinancialData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
        }
      } catch (err) {
        console.error('Financial API Error:', err);
        setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
      } finally {
        setLoading((prev) => ({ ...prev, financials: false }));
      }
    };

    fetchFinancialSummary();
  }, []);

  // Debug current state
  console.log('Current State:', { bookingData, financialData, loading, error });

  // Show loading only if both are loading
  if (loading.bookings && loading.financials) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="mt-2 text-muted small">Loading dashboard data...</p>
      </div>
    );
  }

  // Check if we have any data to display
  const hasData = bookingData || financialData;
  const hasErrors = error.bookings || error.financials;

  return (
    <div className="insurance-dashboard">
      {/* Header */}
      <div className="dashboard-header mb-3">
        <h4 className="fw-bold text-dark mb-1">Insurance Dashboard</h4>
        <p className="text-secondary mb-0 small">Overview of insurance applications and status</p>
      </div>

      {/* Error Alerts */}
      {error.bookings && (
        <Alert variant="danger" className="my-2 py-2 small">
          <strong>Booking Data Error:</strong> {error.bookings}
        </Alert>
      )}
      {error.financials && (
        <Alert variant="danger" className="my-2 py-2 small">
          <strong>Financial Data Error:</strong> {error.financials}
        </Alert>
      )}

      {/* Show message if no data and no errors */}
      {!hasData && !hasErrors && !loading.bookings && !loading.financials && (
        <Alert variant="info" className="my-2 py-2 small">
          <strong>No Data Available:</strong> The dashboard is currently empty.
        </Alert>
      )}

      {/* Main Cards Row - Only show if we have data */}
      {(hasData || loading.bookings || loading.financials) && (
        <Row className="g-3">
          {/* Total Applications Card */}
          <Col xl={6} lg={6}>
            <Card className="dashboard-card h-100 shadow border-0" style={{ borderLeft: '3px solid #2c5aa0' }}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="text-uppercase text-secondary fw-semibold small">Total Applications</h6>
                    <h3 className="fw-bold text-dark mb-0">
                      {loading.bookings ? (
                        <Spinner animation="border" size="sm" className="me-1" />
                      ) : (
                        (bookingData?.totalBookings || 0).toLocaleString()
                      )}
                    </h3>
                  </div>
                  <div className="bg-primary p-2 rounded-circle" style={{ backgroundColor: '#2c5aa0' }}>
                    <FiFileText size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-info text-white rounded small">
                    <div className="d-flex align-items-center">
                      <BsFileEarmarkCheck size={14} className="me-1" />
                      <span>PF Applications</span>
                    </div>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {(bookingData?.pfBookings || 0).toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-secondary text-white rounded small">
                    <div className="d-flex align-items-center">
                      <BsFileEarmarkX size={14} className="me-1" />
                      <span>NPF Applications</span>
                    </div>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {(bookingData?.npfBookings || 0).toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center p-2 bg-success text-white rounded small">
                    <div className="d-flex align-items-center">
                      <FiCheckCircle size={14} className="me-1" />
                      <span>Completed</span>
                    </div>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {(bookingData?.completedBookings || 0).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Insurance Status Card */}
          <Col xl={6} lg={6}>
            <Card className="dashboard-card h-100 shadow border-0" style={{ borderLeft: '3px solid #17a2b8' }}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="text-uppercase text-secondary fw-semibold small">Insurance Status</h6>
                    <h3 className="fw-bold text-dark mb-0">
                      {((bookingData?.draftBookings || 0) + (bookingData?.rejectedBookings || 0)).toLocaleString()}
                    </h3>
                  </div>
                  <div className="bg-info p-2 rounded-circle">
                    <FiPieChart size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-success text-white rounded small">
                    <div className="d-flex align-items-center">
                      <FiCheckCircle size={14} className="me-1" />
                      <span>Approved</span>
                    </div>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {(bookingData?.draftBookings || 0).toLocaleString()}
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center p-2 bg-warning text-white rounded small">
                    <div className="d-flex align-items-center">
                      <FiClock size={14} className="me-1" />
                      <span>Awaiting Approval</span>
                    </div>
                    <Badge bg="light" text="dark" className="px-2 py-1">
                      {(bookingData?.rejectedBookings || 0).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InsuranceDashboard;
