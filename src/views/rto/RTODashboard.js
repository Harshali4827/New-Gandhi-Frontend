
// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
// import { FiFileText, FiCheckCircle, FiDollarSign, FiPackage, FiTruck } from 'react-icons/fi';
// import axiosInstance from '../../axiosInstance';
// import '../../css/dashboard.css';

// const RTODashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [bookingData, setBookingData] = useState(null);
//   const [loading, setLoading] = useState({ dashboard: true, bookings: true });
//   const [error, setError] = useState({ dashboard: null, bookings: null });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axiosInstance.get('/rtoProcess/stats');
//         if (response.data.success) {
//           setDashboardData(response.data.data);
//         } else {
//           setError((prev) => ({ ...prev, dashboard: 'Failed to load dashboard data' }));
//         }
//       } catch (err) {
//         setError((prev) => ({ ...prev, dashboard: err.message || 'Failed to fetch dashboard data' }));
//       } finally {
//         setLoading((prev) => ({ ...prev, dashboard: false }));
//       }
//     };

//     const fetchBookingCounts = async () => {
//       try {
//         const response = await axiosInstance.get('/ledger/booking-counts');
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

//     fetchDashboardData();
//     fetchBookingCounts();
//   }, []);

//   if (loading.dashboard || loading.bookings) {
//     return (
//       <div className="text-center py-4">
//         <Spinner animation="border" variant="primary" />
//         <p>Loading dashboard data...</p>
//       </div>
//     );
//   }

//   const isLoading = (key) => loading[key] && !error[key];
//   const hasError = (key) => error[key] && !loading[key];

//   const ProcessCard = ({ title, total, monthly, daily, icon, color }) => {
//     const IconComponent = icon;
//     return (
//       <Card className="dashboard-card shadow-sm border-0" style={{ minHeight: '180px' }}>
//         <Card.Body className="p-3">
//           <div className="d-flex justify-content-between align-items-start mb-2">
//             <h6 className="text-uppercase text-muted mb-1">{title}</h6>
//             <div className={`bg-${color} p-2 rounded`}>
//               <IconComponent size={18} className="text-white" />
//             </div>
//           </div>
//           <div className="d-flex flex-column gap-1">
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="text-muted">Total</span>
//               <Badge bg={color} className="px-3 py-1">
//                 {total}
//               </Badge>
//             </div>
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="text-muted">Monthly</span>
//               <Badge bg={color} className="px-3 py-1">
//                 {monthly}
//               </Badge>
//             </div>
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="text-muted">Daily</span>
//               <Badge bg={color} className="px-3 py-1">
//                 {daily}
//               </Badge>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     );
//   };

//   const PfnpfCard = () => (
//     <Card className="dashboard-card shadow-sm border-0" style={{ minHeight: '180px' }}>
//       <Card.Body className="p-3">
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <h6 className="text-uppercase text-muted mb-1">Total PF/NPF Applications</h6>
//           <div className="bg-primary p-2 rounded">
//             <FiFileText size={18} className="text-white" />
//           </div>
//         </div>
//         <div className="d-flex flex-column gap-1">
//           <div className="d-flex justify-content-between align-items-center">
//             <span className="text-muted">Total</span>
//             <Badge bg="primary" className="px-3 py-1">
//               {isLoading('bookings') ? <Spinner animation="border" size="sm" /> : bookingData?.totalBookings || 0}
//             </Badge>
//           </div>
//           <div className="d-flex justify-content-between align-items-center">
//             <span className="text-muted">PF</span>
//             <Badge bg="info" className="px-3 py-1">
//               {bookingData?.pfBookings || 0}
//             </Badge>
//           </div>
//           <div className="d-flex justify-content-between align-items-center">
//             <span className="text-muted">NPF</span>
//             <Badge bg="secondary" className="px-3 py-1">
//               {bookingData?.npfBookings || 0}
//             </Badge>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );

//   return (
//     <div className="account-dashboard">
//       <Row className="mb-3">
//         <Col md={12}>
//           <h3>RTO Dashboard</h3>
//         </Col>
//       </Row>

//       {hasError('dashboard') && (
//         <Alert variant="danger" className="my-3">
//           RTO Data Error: {error.dashboard}
//         </Alert>
//       )}
//       {hasError('bookings') && (
//         <Alert variant="danger" className="my-3">
//           Booking Data Error: {error.bookings}
//         </Alert>
//       )}

//       <Row className="g-3 mb-3">
//         <Col md={3}>
//           <PfnpfCard />
//         </Col>
//         <Col md={3}>
//           <ProcessCard
//             title="Total RTO Applications"
//             total={dashboardData?.totalApplications?.total || 0}
//             monthly={dashboardData?.totalApplications?.monthly || 0}
//             daily={dashboardData?.totalApplications?.daily || 0}
//             icon={FiFileText}
//             color="primary"
//           />
//         </Col>
//         <Col md={3}>
//           <ProcessCard
//             title="Paper Verification"
//             total={dashboardData?.rtoPaperVerify?.total || 0}
//             monthly={dashboardData?.rtoPaperVerify?.monthly || 0}
//             daily={dashboardData?.rtoPaperVerify?.daily || 0}
//             icon={FiCheckCircle}
//             color="success"
//           />
//         </Col>
//         <Col md={3}>
//           <ProcessCard
//             title="Tax Update"
//             total={dashboardData?.rtoTaxUpdate?.total || 0}
//             monthly={dashboardData?.rtoTaxUpdate?.monthly || 0}
//             daily={dashboardData?.rtoTaxUpdate?.daily || 0}
//             icon={FiDollarSign}
//             color="warning"
//           />
//         </Col>
//       </Row>

//       <Row className="g-3 mb-3">
//         <Col md={4}>
//           <ProcessCard
//             title="HSRP Ordering"
//             total={dashboardData?.hsrpOrdering?.total || 0}
//             monthly={dashboardData?.hsrpOrdering?.monthly || 0}
//             daily={dashboardData?.hsrpOrdering?.daily || 0}
//             icon={FiPackage}
//             color="danger"
//           />
//         </Col>
//         <Col md={4}>
//           <ProcessCard
//             title="HSRP Installation"
//             total={dashboardData?.hsrpInstallation?.total || 0}
//             monthly={dashboardData?.hsrpInstallation?.monthly || 0}
//             daily={dashboardData?.hsrpInstallation?.daily || 0}
//             icon={FiTruck}
//             color="info"
//           />
//         </Col>
//         <Col md={4}>
//           <ProcessCard
//             title="RC Confirmation"
//             total={dashboardData?.rcConfirmation?.total || 0}
//             monthly={dashboardData?.rcConfirmation?.monthly || 0}
//             daily={dashboardData?.rcConfirmation?.daily || 0}
//             icon={FiCheckCircle}
//             color="success"
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default RTODashboard;



import React, { useState, useEffect } from 'react';
import { 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CFormInput,
  CFormLabel,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert
} from '@coreui/react';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiDollarSign, 
  FiPackage, 
  FiTruck 
} from 'react-icons/fi';
import axiosInstance from '../../axiosInstance';
import '../../css/dashboard.css';

const RTODashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState({ dashboard: true, bookings: true });
  const [error, setError] = useState({ dashboard: null, bookings: null });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/rtoProcess/stats');
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError((prev) => ({ ...prev, dashboard: 'Failed to load dashboard data' }));
        }
      } catch (err) {
        setError((prev) => ({ ...prev, dashboard: err.message || 'Failed to fetch dashboard data' }));
      } finally {
        setLoading((prev) => ({ ...prev, dashboard: false }));
      }
    };

    const fetchBookingCounts = async () => {
      try {
        const response = await axiosInstance.get('/ledger/booking-counts');
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

    fetchDashboardData();
    fetchBookingCounts();
  }, []);

  if (loading.dashboard || loading.bookings) {
    return (
      <div className="text-center py-4">
        <CSpinner color="primary" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const isLoading = (key) => loading[key] && !error[key];
  const hasError = (key) => error[key] && !loading[key];


  const summaryCards = [
    {
      title: 'Total PF/NPF Applications',
      count: bookingData?.totalBookings || 0,
      color: 'primary',
      icon: FiFileText,
      details: {
        pf: bookingData?.pfBookings || 0,
        npf: bookingData?.npfBookings || 0
      }
    },
    {
      title: 'Total RTO Applications',
      count: dashboardData?.totalApplications?.total || 0,
      color: 'info',
      icon: FiFileText,
      details: {
        monthly: dashboardData?.totalApplications?.monthly || 0,
        daily: dashboardData?.totalApplications?.daily || 0
      }
    },
    {
      title: 'Paper Verification',
      count: dashboardData?.rtoPaperVerify?.total || 0,
      color: 'success',
      icon: FiCheckCircle,
      details: {
        monthly: dashboardData?.rtoPaperVerify?.monthly || 0,
        daily: dashboardData?.rtoPaperVerify?.daily || 0
      }
    },
    {
      title: 'Tax Update',
      count: dashboardData?.rtoTaxUpdate?.total || 0,
      color: 'warning',
      icon: FiDollarSign,
      details: {
        monthly: dashboardData?.rtoTaxUpdate?.monthly || 0,
        daily: dashboardData?.rtoTaxUpdate?.daily || 0
      }
    }
  ];

  const processCards = [
    {
      title: 'HSRP Ordering',
      count: dashboardData?.hsrpOrdering?.total || 0,
      color: 'danger',
      icon: FiPackage,
      details: {
        monthly: dashboardData?.hsrpOrdering?.monthly || 0,
        daily: dashboardData?.hsrpOrdering?.daily || 0
      }
    },
    {
      title: 'HSRP Installation',
      count: dashboardData?.hsrpInstallation?.total || 0,
      color: 'info',
      icon: FiTruck,
      details: {
        monthly: dashboardData?.hsrpInstallation?.monthly || 0,
        daily: dashboardData?.hsrpInstallation?.daily || 0
      }
    },
    {
      title: 'RC Confirmation',
      count: dashboardData?.rcConfirmation?.total || 0,
      color: 'success',
      icon: FiCheckCircle,
      details: {
        monthly: dashboardData?.rcConfirmation?.monthly || 0,
        daily: dashboardData?.rcConfirmation?.daily || 0
      }
    }
  ];

  
  const tableData = {
    applications: [
      { id: 1, applicationId: 'APP001', type: 'New Registration', status: 'Pending', customer: 'John Doe', vehicle: 'MH12AB1234', date: '2024-01-15' },
      { id: 2, applicationId: 'APP002', type: 'Tax Update', status: 'Completed', customer: 'Jane Smith', vehicle: 'MH12CD5678', date: '2024-01-14' },
      { id: 3, applicationId: 'APP003', type: 'HSRP Order', status: 'In Progress', customer: 'Bob Johnson', vehicle: 'MH12EF9012', date: '2024-01-13' }
    ],
    pendingTasks: [
      { id: 1, taskId: 'TASK001', type: 'Document Verification', assignedTo: 'RTO Officer 1', priority: 'High', deadline: '2024-01-20' },
      { id: 2, taskId: 'TASK002', type: 'Tax Calculation', assignedTo: 'RTO Officer 2', priority: 'Medium', deadline: '2024-01-22' }
    ],
    completedTasks: [
      { id: 1, taskId: 'TASK003', type: 'RC Generation', completedBy: 'RTO Officer 3', completionDate: '2024-01-10', status: 'Success' },
      { id: 2, taskId: 'TASK004', type: 'HSRP Installation', completedBy: 'RTO Officer 4', completionDate: '2024-01-11', status: 'Success' }
    ]
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
   
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'warning',
      'Completed': 'success',
      'In Progress': 'info',
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'secondary',
      'Success': 'success'
    };
    return statusConfig[status] || 'secondary';
  };

 
  const DashboardCard = ({ title, count, color, icon: Icon, details }) => (
    <CCard className={`text-center bg-${color} text-white`}>
      <CCardBody>
   
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-start">
            <h4 className="mb-0">{count}</h4>
            <p className="mb-0 small">{title}</p>
          </div>
          <div>
            <Icon size={32} className="text-white" />
          </div>
        </div>
        
      
        <div className="d-flex justify-content-around mt-3 pt-2 border-top border-white border-opacity-25">
          {details.pf !== undefined && (
            <>
              <div>
                <small className="d-block">PF</small>
                <strong>{details.pf}</strong>
              </div>
              <div>
                <small className="d-block">NPF</small>
                <strong>{details.npf}</strong>
              </div>
            </>
          )}
          {details.monthly !== undefined && (
            <>
              <div>
                <small className="d-block">Monthly</small>
                <strong>{details.monthly}</strong>
              </div>
              <div>
                <small className="d-block">Daily</small>
                <strong>{details.daily}</strong>
              </div>
            </>
          )}
        </div>
      </CCardBody>
    </CCard>
  );

  return (
    <div>
      <div className='title'>RTO Dashboard</div>
      
   
      <CRow className="mb-4">
        {summaryCards.map((card, index) => (
          <CCol md={3} key={index}>
            <DashboardCard
              title={card.title}
              count={card.count}
              color={card.color}
              icon={card.icon}
              details={card.details}
            />
          </CCol>
        ))}
      </CRow>

   
      <CRow className="mb-4">
        {processCards.map((card, index) => (
          <CCol md={4} key={index}>
            <DashboardCard
              title={card.title}
              count={card.count}
              color={card.color}
              icon={card.icon}
              details={card.details}
            />
          </CCol>
        ))}
      </CRow>

 
      {hasError('dashboard') && (
        <CAlert color="danger" className="my-3">
          RTO Data Error: {error.dashboard}
        </CAlert>
      )}
      {hasError('bookings') && (
        <CAlert color="danger" className="my-3">
          Booking Data Error: {error.bookings}
        </CAlert>
      )}

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header'>
          <CNav variant="tabs" role="tablist" className="border-0">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => setActiveTab(0)}
                className={`fw-bold ${activeTab === 0 ? 'text-primary' : 'text-muted'}`}
              >
                Applications
                <CBadge color="primary" className="ms-2">
                  {tableData.applications.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                className={`fw-bold ${activeTab === 1 ? 'text-primary' : 'text-muted'}`}
              >
                Pending Tasks
                <CBadge color="warning" className="ms-2">
                  {tableData.pendingTasks.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                className={`fw-bold ${activeTab === 2 ? 'text-primary' : 'text-muted'}`}
              >
                Completed Tasks
                <CBadge color="success" className="ms-2">
                  {tableData.completedTasks.length}
                </CBadge>
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardHeader>
        
        <CCardBody>
          <CTabContent>
            {/* Applications Tab */}
            <CTabPane visible={activeTab === 0} className="p-0">
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search applications..."
                  />
                </div>
              </div>
              
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr.no</CTableHeaderCell>
                      <CTableHeaderCell>Application ID</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Customer</CTableHeaderCell>
                      <CTableHeaderCell>Vehicle No</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tableData.applications.map((app, index) => (
                      <CTableRow key={app.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{app.applicationId}</CTableDataCell>
                        <CTableDataCell>{app.type}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(app.status)}>
                            {app.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{app.customer}</CTableDataCell>
                        <CTableDataCell>{app.vehicle}</CTableDataCell>
                        <CTableDataCell>{app.date}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Pending Tasks Tab */}
            <CTabPane visible={activeTab === 1} className="p-0">
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search pending tasks..."
                  />
                </div>
              </div>
              
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr.no</CTableHeaderCell>
                      <CTableHeaderCell>Task ID</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Assigned To</CTableHeaderCell>
                      <CTableHeaderCell>Priority</CTableHeaderCell>
                      <CTableHeaderCell>Deadline</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tableData.pendingTasks.map((task, index) => (
                      <CTableRow key={task.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{task.taskId}</CTableDataCell>
                        <CTableDataCell>{task.type}</CTableDataCell>
                        <CTableDataCell>{task.assignedTo}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(task.priority)}>
                            {task.priority}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{task.deadline}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>

            {/* Completed Tasks Tab */}
            <CTabPane visible={activeTab === 2} className="p-0">
              <div className="d-flex justify-content-between mb-3">
                <div></div>
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search completed tasks..."
                  />
                </div>
              </div>
              
              <div className="responsive-table-wrapper">
                <CTable striped bordered hover className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Sr.no</CTableHeaderCell>
                      <CTableHeaderCell>Task ID</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Completed By</CTableHeaderCell>
                      <CTableHeaderCell>Completion Date</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {tableData.completedTasks.map((task, index) => (
                      <CTableRow key={task.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{task.taskId}</CTableDataCell>
                        <CTableDataCell>{task.type}</CTableDataCell>
                        <CTableDataCell>{task.completedBy}</CTableDataCell>
                        <CTableDataCell>{task.completionDate}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(task.status)}>
                            {task.status}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default RTODashboard;
