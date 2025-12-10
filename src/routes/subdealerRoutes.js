import React from 'react';
const SubdealerList = React.lazy(() => import('../views/subdealer/SubdealerList'))
const SubdealerAuditList = React.lazy(() => import('../views/subdealer/SubdealerAuditList'))
const StockAuditList = React.lazy(() => import('../views/subdealer/StockAuditList'))
const AddSubdealer = React.lazy(() => import('../views/subdealer/AddSubdealer'))
const AddAmount = React.lazy(() => import('../views/subdealer/accounts/AddAmount'))
const AddBalance = React.lazy(() => import('../views/subdealer/accounts/AddBalance'))
const SubdealerCustomerLedger = React.lazy(() => import('../views/subdealer/accounts/CustomerLedger'))
const OnAccountBalance = React.lazy(() => import('../views/subdealer/accounts/OnAccountBalance'))
const SubdealerReceipts = React.lazy(() => import('../views/subdealer/accounts/SubdealerReceipts'))
const SubdealerLedger = React.lazy(() => import('../views/subdealer/accounts/SubdealerLedger'))
const SubdealerSummary = React.lazy(() => import('../views/subdealer/accounts/Summary'))
const SubdealerPayment = React.lazy(() => import('../views/subdealer/accounts/SubdealerPayment'))
const SubdealerPaymentList = React.lazy(() => import('../views/subdealer/accounts/SubdealerPaymentList'))
const PaymentVerification = React.lazy(() => import('../views/subdealer/accounts/PaymentVerification'))
const CommissionList = React.lazy(() => import('../views/subdealer/commission/CommissionList'))
const AddCommission = React.lazy(() => import('../views/subdealer/commission/AddCommission'))
const CalculateCommission = React.lazy(() => import('../views/subdealer/commission/CalculateCommission'))
const SubdealerDeliveryChallan = React.lazy(() => import('../views/subdealer/booking/DeliveryChallan'))
const AllBooking = React.lazy(() => import('../views/subdealer/booking/AllBooking'))
const SubdealerNewBooking = React.lazy(() => import('../views/subdealer/booking/SubdealerNewBooking'))

export const subdealerRoutes = [
    { path:'/subdealer-list', name:'Subdealer List', element:SubdealerList},
    { path:'/add-subdealer', name:'Add Subdealer', element:AddSubdealer},
    { path:'/subdealer-audit-list', name:'Subdealer Audit List', element:SubdealerAuditList},
    { path:'/stock-audit-list', name:'Subdealer Stock Audit List', element:StockAuditList},
    { path:'/update-subdealer/:id', name:'Update Subdealer', element:AddSubdealer},
    { path:'/subdealer-booking', name:'Subdealer Booking', element:SubdealerNewBooking},
    { path:'/update-subdealer-booking/:id', name:'Update Subdealer Booking', element:SubdealerNewBooking},
    { path:'/subdealer-all-bookings', name:'Subdealer All Bookings', element:AllBooking},
    { path:'/subdealer-account/receipt', name:'Subdealer Receipt', element:SubdealerReceipts},
    { path:'/subdealer-account/add-balance', name:'Add Balance', element:AddBalance},
    { path:'/subdealer-account/onaccount-balance', name:'On Account Balance', element:OnAccountBalance},
    { path:'/subdealer-account/add-amount', name:'Add Amount', element:AddAmount},
    { path:'/subdealer-ledger', name:'Subdealer Ledger', element:SubdealerLedger},
    { path:'/subdealer-commission', name:'Subdealer Commission', element:CommissionList},
    { path:'/subdealer/add-commission', name:'Add Commission', element:AddCommission},
    { path:'/subdealer/customer-ledger', name:'Customer Ledger', element:SubdealerCustomerLedger},
    { path:'/subdealer/summary', name:'Subdealer Summary', element:SubdealerSummary},
    { path:'/subdealer/calculate-commission', name:'Calculate Commission', element:CalculateCommission},
    { path:'/subdealer/payment', name:'Subdealer Payment', element:SubdealerPayment},
    { path:'/subdealer/payment-summary', name:'Payment Summary', element:SubdealerPaymentList},
    { path:'/subdealer/payment-verification', name:'Payment Verification', element:PaymentVerification},
    { path:'/subdealer/delivery-challan', name:'Delivery Challan', element:SubdealerDeliveryChallan},
];