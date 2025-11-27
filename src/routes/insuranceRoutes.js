import React from 'react';
const InsuranceDashboard = React.lazy(() => import('../views/insurance/insurance-dashboard/InsuranceDashboard'))
const InsuranceDetails = React.lazy(() => import('../views/insurance/insurance-details/InsuranceReport'))
export const insuranceRoutes = [
    { path:'/insurance-dashboard', name:'Insurance Dashboard', element:InsuranceDashboard},
  { path:'/insurance-details', name:'Insurance Details', element:InsuranceDetails},
];