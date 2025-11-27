import React from 'react';
const AddCash = React.lazy(() => import('../views/fund-master/AddCash'))
const CashList = React.lazy(() => import('../views/fund-master/CashList'))
const AddBank = React.lazy(() => import('../views/fund-master/AddBank'))
const BankList = React.lazy(() => import('../views/fund-master/BankList'))
const AddExpense = React.lazy(() => import('../views/fund-master/AddExpense'))
const ExpenseList = React.lazy(() => import('../views/fund-master/ExpenseList'))
const AddOpeningBalance = React.lazy(() => import('../views/fund-master/AddOpeningBalance'))
const OpeningBalanceList = React.lazy(() => import('../views/fund-master/OpeningBalanceList'))
const AccessoriesBilling = React.lazy(() => import('../views/accessories-billing/AccessoriesBilling'))
const AllCustomersLedger = React.lazy(() => import('../views/all-customers/AllCustomers'))
const AddPaymentMode = React.lazy(() => import('../views/fund-master/payment-mode/PaymentMode'))
const PaymentModeList = React.lazy(() => import('../views/fund-master/payment-mode/PaymentModeList'))

export const fundMasterRoutes = [
    { path:'/add-cash', name:'Add Cash Location', element:AddCash},
    { path:'/cash-master', name:'Workshop Receipt', element:CashList},
    { path:'/add-bank', name:'Add Bank Location', element:AddBank},
    { path:'/bank-master', name:'Cash Receipt', element:BankList},
    { path:'/payment-mode', name:'Cash Book', element:AddPaymentMode},
    { path:'/expense', name:'Expense List', element:ExpenseList},
    { path:'/opening-balance', name:'Add Opening Balance', element:OpeningBalanceList},
    { path:'/add-balance', name:'Add Balance', element:AddOpeningBalance},
    { path:'/payment-mode', name:'Payment Mode', element:PaymentModeList},
    { path:'/accessories-billing', name:'Accessories Billing', element:AccessoriesBilling},
    { path:'/all-customers', name:'All Customers', element:AllCustomersLedger},
];