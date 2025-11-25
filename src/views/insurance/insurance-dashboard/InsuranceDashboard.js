import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert,Badge } from 'react-bootstrap';
import { FiFileText, FiPieChart } from 'react-icons/fi';
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
        const response = await axiosInstance.get('ledger/booking-counts');
        if (response.data.status === 'success') {
          setBookingData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
        }
      } catch (err) {
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
        const response = await axiosInstance.get('ledger/summary/branch');
        if (response.data.status === 'success') {
          setFinancialData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
      } finally {
        setLoading((prev) => ({ ...prev, financials: false }));
      }
    };

    fetchFinancialSummary();
  }, []);

  if (loading.bookings || loading.financials) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const isLoading = (key) => loading[key] && !error[key];
  const hasError = (key) => error[key] && !loading[key];

  return (
    <div className="account-dashboard">
      {/* Header */}
      <Row className="mb-4">
        <Col md={12}>
          <h3>Insurance Dashboard</h3>
        </Col>
      </Row>
      {hasError('bookings') && (
        <Alert variant="danger" className="my-3">
          Booking Data Error: {error.bookings}
        </Alert>
      )}
      {hasError('financials') && (
        <Alert variant="danger" className="my-3">
          Financial Data Error: {error.financials}
        </Alert>
      )}

      <Row className="mb-4">
        {/* Total Bookings Card */}
        <Col md={4}>
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total PF/NPF Application</h6>
                  <h3 className="mb-0">
                    {isLoading('bookings') ? <Spinner animation="border" size="sm" /> : bookingData?.totalBookings || 0}
                  </h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <FiFileText size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-3 d-flex flex-column gap-1">
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2" style={{ width: '80px' }}>
                    PF:
                  </span>
                  <Badge bg="info" className="flex-grow-1 text-start ps-2">
                    {bookingData?.pfBookings || 0}
                  </Badge>
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2" style={{ width: '80px' }}>
                    NPF:
                  </span>
                  <Badge bg="secondary" className="flex-grow-1 text-start ps-2">
                    {bookingData?.npfBookings || 0}
                  </Badge>
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2" style={{ width: '80px' }}>
                    Complete:
                  </span>
                  <Badge bg="success" className="flex-grow-1 text-start ps-2">
                    {bookingData?.completedBookings || 0}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Summary Card */}
        <Col md={4}>
          <Card className="dashboard-card shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-2">Total Insurance</h6>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center">
                      <span className="text-muted me-2" style={{ width: '80px' }}>
                        Approved:
                      </span>
                      <Badge bg="success" className="flex-grow-1 text-start ps-2">
                        {bookingData?.draftBookings || 0}
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-muted me-2" style={{ width: '80px' }}>
                        Awaiting:
                      </span>
                      <Badge bg="danger" className="flex-grow-1 text-start ps-2">
                        {bookingData?.rejectedBookings || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="bg-info bg-opacity-10 p-2 rounded">
                  <FiPieChart size={24} className="text-white" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InsuranceDashboard;
