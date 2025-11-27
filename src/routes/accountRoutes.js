import React from 'react';
const AccountDashboard = React.lazy(() => import('../views/account/AccountDashboard'))
const Receipts = React.lazy(() => import('../views/account/Receipt'))
const DebitNote = React.lazy(() => import('../views/account/debit-note/DebitNote'))
const CustomerRefund = React.lazy(() => import('../views/account/Refund'))
const AllReceipts = React.lazy(() => import('../views/account/AllReceipt'))
const CustomerLedger = React.lazy(() => import('../views/account/ViewLedger'))
const ExchangeLedger = React.lazy(() => import('../views/account/ExchangeLedger'))
const BrokerPayment = React.lazy(() => import('../views/account/broker-payment/PaymentVerification'))
const VoucherReport = React.lazy(() => import('../views/account/ReceiptReport'))

export const accountRoutes = [
    { path:'/account-dashboard', name:'Account Dashboard', element:AccountDashboard},
    { path:'/account/receipt', name:'Account Receipt', element:Receipts},
    { path:'/debit-note', name:'Debit Note', element:DebitNote},
    { path:'/refund', name:'Customer Refund', element:CustomerRefund},
    { path:'/account/all-receipt', name:'All Receipt', element:AllReceipts},
    { path:'/view-ledgers', name:'View Ledger', element:CustomerLedger},
    { path:'/exchange-ledgers', name:'Exchange Ledger', element:ExchangeLedger},
    { path:'/broker-payment', name:'Broker Payment', element:BrokerPayment},
    { path:'/receipt-report', name:'Receipt Report', element:VoucherReport},
];