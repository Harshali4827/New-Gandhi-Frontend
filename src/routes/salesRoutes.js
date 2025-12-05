import React from 'react';
const NewBooking = React.lazy(() => import('../views/sales/booking/NewBooking'))
const SelfInsurance = React.lazy(() => import('../views/sales/booking/SelfInsurance'))
const BookingList = React.lazy(() => import('../views/sales/booking/BookingList'))
const DeliveryChallan = React.lazy(() => import('../views/sales/delivery-challan/DeliveryChallan'))
const GSTInvoice = React.lazy(() => import('../views/sales/Invoice'))
const HelmetInvoice = React.lazy(() => import('../views/sales/HelmetInvoice'))
const DealForm = React.lazy(() => import('../views/sales/DealForm'))
const UploadDealForm = React.lazy(() => import('../views/sales/UploadDealForm'))
const UploadFinance = React.lazy(() => import('../views/sales/UploadFinance'))
const uploadKYC = React.lazy(() => import('../views/sales/UploadKYC'))
const SalesReport = React.lazy(() => import('../views/sales-report/SalesReport'))
const PeriodicReport = React.lazy(() => import('../views/sales-report/PeriodicReport'))
export const salesRoutes = [
    { path:'/new-booking', name:'New Booking', element:NewBooking},
    { path:'/self-insurance', name:'Self Insurance', element:SelfInsurance},
    { path:'/booking-form/:id', name:'Edit Booking', element:NewBooking},
    { path:'/booking-list', name:'Booking List', element:BookingList},
    { path:'/update-booking/:id', name:'Edit Booking', element:NewBooking},
    { path:'/upload-finance/:id', name:'Upload Finance', element:UploadFinance},
    { path:'/upload-kyc/:id', name:'Upload KYC', element:uploadKYC},
  
    { path:'/delivery-challan', name:'Delivery Challan', element:DeliveryChallan},
    { path:'/gst-invoice', name:'GST Invoice', element:GSTInvoice},
    { path:'/helmet-invoice', name:'Helmet Invoice', element:HelmetInvoice},
    { path:'/deal-form', name:'Deal Form', element:DealForm},
    { path:'/upload-deal', name:'Upload Deal', element:UploadDealForm},
    
    { path:'/sales-report', name:'Sales Report', element:SalesReport},
    { path:'/periodic-report', name:'Periodic Report', element:PeriodicReport},
  
];