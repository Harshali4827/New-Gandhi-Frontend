import React, { useState, useEffect } from 'react';
import { 
  CCard,
  CCardBody,
  CCol,
  CRow,
  CBadge,
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
  const [dashboardData, setDashboardData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState({ dashboard: true, bookings: true });
  const [error, setError] = useState({ dashboard: null, bookings: null });

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
      
      {/* Summary Cards */}
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

      {/* Process Cards */}
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

      {/* Error Messages */}
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
    </div>
  );
};

export default RTODashboard;