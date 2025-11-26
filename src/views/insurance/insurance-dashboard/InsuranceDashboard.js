// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert,Badge } from 'react-bootstrap';
// import { FiFileText, FiPieChart } from 'react-icons/fi';
// import axiosInstance from '../../../axiosInstance';
// import '../../../css/dashboard.css';

// const InsuranceDashboard = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [financialData, setFinancialData] = useState(null);
//   const [loading, setLoading] = useState({ bookings: true, financials: true });
//   const [error, setError] = useState({ bookings: null, financials: null });

//   useEffect(() => {
//     const fetchBookingCounts = async () => {
//       try {
//         const response = await axiosInstance.get('ledger/booking-counts');
//         if (response.data.status === 'success') {
//           setBookingData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, bookings: 'Failed to load booking data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, bookings: err.message || 'Failed to fetch booking data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, bookings: false }));
//       }
//     };

//     fetchBookingCounts();
//   }, []);

//   useEffect(() => {
//     const fetchFinancialSummary = async () => {
//       try {
//         const response = await axiosInstance.get('ledger/summary/branch');
//         if (response.data.status === 'success') {
//           setFinancialData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, financials: 'Failed to load financial data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, financials: err.message || 'Failed to fetch financial data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, financials: false }));
//       }
//     };

//     fetchFinancialSummary();
//   }, []);

//   if (loading.bookings || loading.financials) {
//     return (
//       <div className="text-center py-4">
//         <Spinner animation="border" variant="primary" />
//         <p>Loading dashboard data...</p>
//       </div>
//     );
//   }

//   const isLoading = (key) => loading[key] && !error[key];
//   const hasError = (key) => error[key] && !loading[key];

//   return (
//     <div className="account-dashboard">
//       {/* Header */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <h3>Insurance Dashboard</h3>
//         </Col>
//       </Row>
//       {hasError('bookings') && (
//         <Alert variant="danger" className="my-3">
//           Booking Data Error: {error.bookings}
//         </Alert>
//       )}
//       {hasError('financials') && (
//         <Alert variant="danger" className="my-3">
//           Financial Data Error: {error.financials}
//         </Alert>
//       )}

//       <Row className="mb-4">
//         {/* Total Bookings Card */}
//         <Col md={4}>
//           <Card className="dashboard-card shadow-sm border-0">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2">Total PF/NPF Application</h6>
//                   <h3 className="mb-0">
//                     {isLoading('bookings') ? <Spinner animation="border" size="sm" /> : bookingData?.totalBookings || 0}
//                   </h3>
//                 </div>
//                 <div className="bg-primary bg-opacity-10 p-2 rounded">
//                   <FiFileText size={24} className="text-white" />
//                 </div>
//               </div>
//               <div className="mt-3 d-flex flex-column gap-1">
//                 <div className="d-flex align-items-center">
//                   <span className="text-muted me-2" style={{ width: '80px' }}>
//                     PF:
//                   </span>
//                   <Badge bg="info" className="flex-grow-1 text-start ps-2">
//                     {bookingData?.pfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex align-items-center">
//                   <span className="text-muted me-2" style={{ width: '80px' }}>
//                     NPF:
//                   </span>
//                   <Badge bg="secondary" className="flex-grow-1 text-start ps-2">
//                     {bookingData?.npfBookings || 0}
//                   </Badge>
//                 </div>
//                 <div className="d-flex align-items-center">
//                   <span className="text-muted me-2" style={{ width: '80px' }}>
//                     Complete:
//                   </span>
//                   <Badge bg="success" className="flex-grow-1 text-start ps-2">
//                     {bookingData?.completedBookings || 0}
//                   </Badge>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Status Summary Card */}
//         <Col md={4}>
//           <Card className="dashboard-card shadow-sm border-0">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <h6 className="text-uppercase text-muted mb-2">Total Insurance</h6>
//                   <div className="d-flex flex-column gap-1">
//                     <div className="d-flex align-items-center">
//                       <span className="text-muted me-2" style={{ width: '80px' }}>
//                         Approved:
//                       </span>
//                       <Badge bg="success" className="flex-grow-1 text-start ps-2">
//                         {bookingData?.draftBookings || 0}
//                       </Badge>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       <span className="text-muted me-2" style={{ width: '80px' }}>
//                         Awaiting:
//                       </span>
//                       <Badge bg="danger" className="flex-grow-1 text-start ps-2">
//                         {bookingData?.rejectedBookings || 0}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-info bg-opacity-10 p-2 rounded">
//                   <FiPieChart size={24} className="text-white" />
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default InsuranceDashboard;



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
          <Col xl={4} lg={6}>
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
          <Col xl={4} lg={6}>
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

          {/* Financial Summary Card */}
          <Col xl={4} lg={6}>
            <Card className="dashboard-card h-100 shadow border-0" style={{ borderLeft: '3px solid #28a745' }}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="text-uppercase text-secondary fw-semibold small">Financial Overview</h6>
                    <h3 className="fw-bold text-dark mb-0">
                      {financialData ? (
                        `₹${(financialData.totalAmount || 0).toLocaleString()}`
                      ) : (
                        loading.financials ? (
                          <Spinner animation="border" size="sm" className="me-1" />
                        ) : '₹0'
                      )}
                    </h3>
                  </div>
                  <div className="bg-success p-2 rounded-circle">
                    <FiDollarSign size={18} className="text-white" />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="row text-center small">
                    <div className="col-6 border-end">
                      <div className="p-2">
                        <h5 className="fw-bold mb-1" style={{ color: '#2c5aa0' }}>
                          {(financialData?.totalTransactions || 0).toLocaleString()}
                        </h5>
                        <small className="text-secondary">Total Transactions</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2">
                        <h5 className="fw-bold mb-1" style={{ color: '#17a2b8' }}>
                          {(financialData?.activePolicies || 0).toLocaleString()}
                        </h5>
                        <small className="text-secondary">Active Policies</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-2 rounded small" style={{ backgroundColor: '#e8f5e8' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary">Monthly Average</span>
                      <strong className="text-success">
                        {financialData ? `₹${Math.round((financialData.totalAmount || 0) / 12).toLocaleString()}` : '₹0'}
                      </strong>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Stats Row - Only show if we have booking data */}
      {bookingData && (
        <Row className="g-2 mt-2">
          <Col md={3}>
            <div className="p-2 rounded text-center text-white small" style={{ backgroundColor: '#2c5aa0' }}>
              <h6 className="fw-bold mb-1">{(bookingData?.pendingBookings || 0).toLocaleString()}</h6>
              <small>Pending Review</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-2 rounded text-center text-white small" style={{ backgroundColor: '#17a2b8' }}>
              <h6 className="fw-bold mb-1">{(bookingData?.inProgressBookings || 0).toLocaleString()}</h6>
              <small>In Progress</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-2 rounded text-center text-white small" style={{ backgroundColor: '#ffc107' }}>
              <h6 className="fw-bold mb-1">{(bookingData?.cancelledBookings || 0).toLocaleString()}</h6>
              <small>Cancelled</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="p-2 rounded text-center text-white small" style={{ backgroundColor: '#28a745' }}>
              <h6 className="fw-bold mb-1">{(bookingData?.completedBookings || 0).toLocaleString()}</h6>
              <small>Completed Today</small>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InsuranceDashboard;
