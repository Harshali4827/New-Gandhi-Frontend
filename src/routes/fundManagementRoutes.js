import React from 'react';
const CashVoucher = React.lazy(() => import('../views/fund-management/CashVoucher'))
const ContraVoucher = React.lazy(() => import('../views/fund-management/ContraVoucher'))
const ContraApproval = React.lazy(() => import('../views/fund-management/ContraApproval'))
const WorkshopReceipt = React.lazy(() => import('../views/fund-management/WorkshopReceipt'))
const CashReceipt = React.lazy(() => import('../views/fund-management/CashReceipt'))
const CashBook = React.lazy(() => import('../views/fund-management/CashBook'))
const DayBook = React.lazy(() => import('../views/fund-management/DayBook'))
const FundReport = React.lazy(() => import('../views/fund-management/FundReport'))
export const fundManagementRoutes = [
    { path:'/cash-voucher', name:'Cash Voucher', element:CashVoucher},
    { path:'/contra-voucher', name:'Contra Voucher', element:ContraVoucher},
    { path:'/contra-approval', name:'Contra Approval', element:ContraApproval},
    { path:'/workshop-receipt', name:'Workshop Receipt', element:WorkshopReceipt},
    { path:'/cash-receipt', name:'Cash Receipt', element:CashReceipt},
    { path:'/cash-book', name:'Cash Book', element:CashBook},
    { path:'/day-book', name:'Day Book', element:DayBook},
    { path:'/fund-report', name:'Fund Reportk', element:FundReport},
];