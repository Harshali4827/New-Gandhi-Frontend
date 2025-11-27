import React from 'react';
const RTODashboard = React.lazy(() => import('../views/rto/RTODashboard'))
const Application = React.lazy(() => import('../views/rto/Application'))
const RTOPaper = React.lazy(() => import('../views/rto/RTOPaper'))
const RTOTax = React.lazy(() => import('../views/rto/RTOTax'))
const HSRPOrdering = React.lazy(() => import('../views/rto/HSRPOrdering'))
const HSRPInstallation = React.lazy(() => import('../views/rto/HSRPInstallation'))
const RCConfirmation = React.lazy(() => import('../views/rto/RCConfirmation'))
const RTOReport = React.lazy(() => import('../views/rto/RTOReport'))
export const rtoRoutes = [
    { path:'/rto-dashboard', name:'RTO Dashboard', element:RTODashboard},
    { path:'/rto/application', name:'RTO Application', element:Application},
    { path:'/rto/rto-paper', name:'RTO Paper', element:RTOPaper},
    { path:'/rto/rto-tax', name:'RTO Tax', element:RTOTax},
    { path:'/rto/hsrp-ordering', name:'HSRP Ordering', element:HSRPOrdering},
    { path:'/rto/hsrp-installation', name:'HSRP Installation', element:HSRPInstallation},
    { path:'/rto/rc-confirmation', name:'RC Confirmation', element:RCConfirmation},
    { path:'/rto/rto-report', name:'RTO Report', element:RTOReport},  
];