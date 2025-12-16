// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBank,
//   cilCarAlt,
//   cilCart,
//   cilChartLine,
//   cilDescription,
//   cilDollar,
//   cilLibrary,
//   cilMoney,
//   cilShieldAlt,
//   cilSpeedometer,
//   cilUser,
//   cilPeople,
//   cilSettings,
//   cilApps,
//   cilWarning,
//   cilInbox,
// } from '@coreui/icons'
// import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// const _nav = [
//   {
//     component: CNavItem,
//     name: 'Dashboard',
//     to: '/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//   },
//   {
//     component: CNavTitle,
//     name: 'Components',
//   },
//   {
//     component: CNavGroup,
//     name: 'Purchase',
//     to: '/purchase',
//     icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
//     visible: true,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Inward Stock',
//         to: '/inward-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Stock Verification',
//         to: '/stock-verification',
//       },
//       {
//         component: CNavItem,
//         name: 'Stock Transfer',
//         to: '/stock-transfer',
//       },
//       {
//         component: CNavItem,
//         name: 'Upload Challan',
//         to: '/upload-challan',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Sales',
//     to: '/sales',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'New Booking',
//         to: '/new-booking',
//       },
//       {
//         component: CNavItem,
//         name: 'All Booking',
//         to: '/booking-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Self Insurance',
//         to: '/self-insurance',
//       },
//       {
//         component: CNavItem,
//         name: 'Delivery Challan',
//         to: '/delivery-challan',
//       },
//       {
//         component: CNavItem,
//         name: 'GST Invoice',
//         to: '/gst-invoice',
//       },
//       {
//         component: CNavItem,
//         name: 'Helmet Invoice',
//         to: '/helmet-invoice',
//       },
//       {
//         component: CNavItem,
//         name: 'Deal Form',
//         to: '/deal-form',
//       },
//       {
//         component: CNavItem,
//         // name: 'Upload Deal Form & Delivery Challan',
//         name: <>
//     Upload Deal Form <br /> & Delivery Challan
//   </>,
//         to: '/upload-deal',
//       },
      
      
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Sales Report',
//     to: '/purchase',
//     icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
//     visible: true,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Sales Person Wise',
//         to: '/sales-report',
//       },
//       {
//         component: CNavItem,
//         name: 'Periodic Report',
//         to: '/periodic-report',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Quotation',
//     to: '/quotation-list',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'GM Deviation',
//     to: '/gm-deviation',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavGroup,
//     name: 'Account',
//     icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'PF/NPF Dashboard',
//         to: '/account-dashboard',
//       },
//       {
//         component: CNavItem,
//         name: 'Receipts',
//         to: '/account/receipt',
//       },
//       {
//         component: CNavItem,
//         name: 'Debit Note',
//         to: '/debit-note',
//       },
//       {
//         component: CNavItem,
//         name: 'Refund',
//         to: '/refund',
//       },
//       {
//         component: CNavItem,
//         name: 'Cancelled Booking',
//         to: '/cancelled-booking',
//       },
//       {
//         component: CNavItem,
//         name: 'All Receipts',
//         to: '/account/all-receipt',
//       },
//       {
//         component: CNavItem,
//         name: 'Ledgers',
//         to: '/view-ledgers',
//       },
//       {
//         component: CNavItem,
//         name: 'Exchange Ledger',
//         to: '/exchange-ledgers',
//       },
//       {
//         component: CNavItem,
//         // name: 'Broker Payment Verification',
//         name: <>
//         Broker Payment <br /> Verification
//       </>,
//         to: '/broker-payment',
//       },
//       {
//         component: CNavItem,
//         name: 'Report',
//         to: '/receipt-report',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Insurance',
//     to: '/purchase',
//     icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
//     visible: true,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Dashboard',
//         to: '/insurance-dashboard',
//       },
//       {
//         component: CNavItem,
//         name: 'Insurance Details',
//         to: '/insurance-details',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'RTO',
//     icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Dashboard',
//         to: '/rto-dashboard',
//       },
//       {
//         component: CNavItem,
//         name: 'Application',
//         to: '/rto/application',
//       },
//       {
//         component: CNavItem,
//         name: 'RTO Paper',
//         to: '/rto/rto-paper',
//       },
//       {
//         component: CNavItem,
//         name: 'RTO Tax',
//         to: '/rto/rto-tax',
//       },
//       {
//         component: CNavItem,
//         name: 'HSRP Ordering',
//         to: '/rto/hsrp-ordering',
//       },
//       {
//         component: CNavItem,
//         name: 'HSRP Installation',
//         to: '/rto/hsrp-installation',
//       },
//       {
//         component: CNavItem,
//         name: 'RC Confirmation',
//         to: '/rto/rc-confirmation',
//       },
//       {
//         component: CNavItem,
//         name: 'Report',
//         to: '/rto/rto-report',
//       }
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Fund Management',
//     icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Cash Voucher',
//         to: '/cash-voucher',
//       },
//       {
//         component: CNavItem,
//         name: 'Contra Voucher',
//         to: '/contra-voucher',
//       },
//       {
//         component: CNavItem,
//         name: 'Contra Approval',
//         to: '/contra-approval',
//       },
//       {
//         component: CNavItem,
//         name: 'Workshop Cash Receipt',
//         to: '/workshop-receipt',
//       },
//       {
//         component: CNavItem,
//         name: 'All Cash Receipt',
//         to: '/cash-receipt',
//       },
//       {
//         component: CNavItem,
//         name: 'Cash Book',
//         to: '/cash-book',
//       },
//       {
//         component: CNavItem,
//         name: 'Day Book',
//         to: '/day-book',
//       },
//       {
//         component: CNavItem,
//         name: 'Report',
//         to: '/fund-report',
//       }
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Masters',
//     icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Location',
//         to: '/branch/branch-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Headers',
//         to: '/headers/headers-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Vehicles',
//         to: '/model/model-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Minimum Booking Amount',
//         to: '/minimumbookingamount/minimum-booking-amount-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Template List',
//         to: '/templateform/template-list',
//       },
//       // {
//       //   component: CNavItem,
//       //   name: 'Template Form',
//       //   to: '/templateform/template-list/create',
//       // },
//       // {
//       //   component: CNavItem,
//       //   name: 'Template Edit',
//       //   to: '/templateform/template-list/edit/:id',
//       // },
//       // {
//       //   component: CNavItem,
//       //   name: 'Template Preview',
//       //   to: '/templateform/template-list/preview/:id',
//       // },
//       {
//         component: CNavItem,
//         name: 'Accessories',
//         to: '/accessories/accessories-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Colour',
//         to: '/color/color-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Documents',
//         to: '/documents/documents-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Terms & Conditions',
//         to: '/conditions/conditions-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Offer',
//         to: '/offers/offer-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Attachments',
//         to: '/attachments/attachments-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Declaration',
//         to: '/declaration-master',
//       },
//       {
//         component: CNavItem,
//         name: 'RTO',
//         to: '/rto/rto-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Financer',
//         to: '/financer/financer-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Finance Rates',
//         to: '/financer-rates/rates-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Insurance Providers',
//         to: '/insurance-provider/provider-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Brokers',
//         to: '/broker/broker-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Broker Commission Range',
//         to: '/broker/commission-range',
//       },
//       {
//         component: CNavItem,
//         name: 'Vertical Masters',
//         to: '/vertical-master/vertical-master-list',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Fund Master',
//     icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Cash Account Master',
//         to: '/cash-master',
//       },
//       {
//         component: CNavItem,
//         name: 'Bank Account Master',
//         to: '/bank-master',
//       },
//       {
//         component: CNavItem,
//         name: 'Payment Mode',
//         to: '/payment-mode',
//       },
//       {
//         component: CNavItem,
//         name: 'Expense Master',
//         to: '/expense',
//       },
//       {
//         component: CNavItem,
//         name: 'Add Opening Balance',
//         to: '/opening-balance',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Accessories Billing',
//     to: '/accessories-billing',
//     icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Customers',
//     to: '/all-customers',
//     icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavTitle,
//     name: 'SUBDEALER',
//   },
//   {
//     component: CNavItem,
//     name: 'Subdealer Stock Audit',
//     to: '/stock-audit-list',
//     icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavGroup,
//     name: 'Master',
//     icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Subdealer List',
//         to: '/subdealer-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Subdealer Audit List',
//         to: '/subdealer-audit-list',
//       },
//       {
//         component: CNavItem,
//         name: 'Subdealer Commission',
//         to: '/subdealer-commission',
//       },
//       {
//         component: CNavItem,
//         name: 'Calculate Commission',
//         to: '/subdealer/calculate-commission',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Booking',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'New Booking',
//         to: '/subdealer-booking',
//       },
//       {
//         component: CNavItem,
//         name: 'All Booking',
//         to: '/subdealer-all-bookings',
//       },
//       {
//         component: CNavItem,
//         name: 'Delivery Challan',
//         to: '/subdealer/delivery-challan',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Account',
//     icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Add Balance',
//         to: '/subdealer-account/add-balance',
//       },
//       {
//         component: CNavItem,
//         name: 'OnAccount Balance',
//         to: '/subdealer-account/onaccount-balance',
//       },
//       {
//         component: CNavItem,
//         name: 'Add Amount',
//         to: '/subdealer-account/add-amount',
//       },
//       {
//         component: CNavItem,
//         name: 'Finance Payment',
//         to: '/subdealer-account/receipt',
//       },
//       {
//         component: CNavItem,
//         name: 'Payment Verification',
//         to: '/subdealer/payment-verification',
//       },
//       {
//         component: CNavItem,
//         name: 'Subdealer Commission',
//         to: '/subdealer/payment',
//       },
//       {
//         component: CNavItem,
//         name: 'Payment Summary',
//         to: '/subdealer/payment-summary',
//       },
//       {
//         component: CNavItem,
//         name: 'Subdealer Ledger',
//         to: '/subdealer-ledger',
//       },
//       {
//         component: CNavItem,
//         name: 'Customer Ledger',
//         to: '/subdealer/customer-ledger',
//       },
//       {
//         component: CNavItem,
//         name: 'Summary',
//         to: '/subdealer/summary',
//       },
//     ],
//   },
//   {
//     component: CNavTitle,
//     name: 'USER MANAGEMENT',
//   },
//   {
//     component: CNavGroup,
//     name: 'Roles',
//     icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Create Role',
//         to: '/roles/create-role',
//       },
//       {
//         component: CNavItem,
//         name: 'All Role',
//         to: '/roles/all-role',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'User',
//     icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Add User',
//         to: '/users/add-user',
//       },
//       {
//         component: CNavItem,
//         name: 'User List',
//         to: '/users/users-list',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Buffer Report',
//     to: '/buffer/buffer-list',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Manager Deviation',
//     to: '/users/manager-deviation',
//     icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
//   },
  
// ]

// export default _nav


import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBank,
  cilCarAlt,
  cilCart,
  cilChartLine,
  cilDescription,
  cilDollar,
  cilLibrary,
  cilMoney,
  cilShieldAlt,
  cilSpeedometer,
  cilUser,
  cilPeople,
  cilSettings,
  cilApps,
  cilWarning,
  cilInbox,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { routePermissions, hasPermission, isSuperAdmin } from './utils/permissionUtils'

const getNav = (userPermissions = []) => {
  const _nav = []

  const token = localStorage.getItem('token');
  if (!token) {
    return [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      }
    ];
  }

  const superAdmin = isSuperAdmin();

  // Dashboard
  if (superAdmin || hasPermission(userPermissions, routePermissions['/app/dashboard/analytics'])) {
    _nav.push({
      component: CNavItem,
      name: 'Dashboard',
      to: '/app/dashboard/analytics',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info',
        text: 'NEW',
      },
    });
  }

  _nav.push({
    component: CNavTitle,
    name: 'Components',
  });

  // Purchase Group
  const purchaseItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/inward-list'])) {
    purchaseItems.push({
      component: CNavItem,
      name: 'Inward Stock',
      to: '/inward-list',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/stock-verification'])) {
    purchaseItems.push({
      component: CNavItem,
      name: 'Stock Verification',
      to: '/stock-verification',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/stock-transfer'])) {
    purchaseItems.push({
      component: CNavItem,
      name: 'Stock Transfer',
      to: '/stock-transfer',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/upload-challan'])) {
    purchaseItems.push({
      component: CNavItem,
      name: 'Upload Challan',
      to: '/upload-challan',
    });
  }

  if (purchaseItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Purchase',
      to: '/purchase',
      icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
      items: purchaseItems,
    });
  }

  // Sales Group
  const salesItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/new-booking'])) {
    salesItems.push({
      component: CNavItem,
      name: 'New Booking',
      to: '/new-booking',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/booking-list'])) {
    salesItems.push({
      component: CNavItem,
      name: 'All Booking',
      to: '/booking-list',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'BOOKING_READ')) {
    salesItems.push({
      component: CNavItem,
      name: 'Self Insurance',
      to: '/self-insurance',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/delivery-challan'])) {
    salesItems.push({
      component: CNavItem,
      name: 'Delivery Challan',
      to: '/delivery-challan',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/invoice'])) {
    salesItems.push({
      component: CNavItem,
      name: 'GST Invoice',
      to: '/invoice',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/helmet-invoice'])) {
    salesItems.push({
      component: CNavItem,
      name: 'Helmet Invoice',
      to: '/helmet-invoice',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/deal-form'])) {
    salesItems.push({
      component: CNavItem,
      name: 'Deal Form',
      to: '/deal-form',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/upload-deal'])) {
    salesItems.push({
      component: CNavItem,
      name: 'Upload Deal Form & Delivery Challan',
      to: '/upload-deal',
    });
  }

  if (salesItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Sales',
      to: '/sales',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      items: salesItems,
    });
  }

  // Sales Report Group
  const salesReportItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/sales-report'])) {
    salesReportItems.push({
      component: CNavItem,
      name: 'Sales Person Wise',
      to: '/sales-report',
    });
  }

  if (salesReportItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Sales Report',
      to: '/sales-report',
      icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
      items: salesReportItems,
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'BOOKING_READ')) {
    salesReportItems.push({
      component: CNavItem,
      name: 'Periodic Report',
      to: '/periodic-report',
    });
  }

  if (superAdmin || hasPermission(userPermissions, 'QUOTATION_READ')) { 
    _nav.push({
      component: CNavItem,
      name: 'Quotation',
      to: '/quotation-list',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    });
  }

  const accountItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/account-dashboard'])) {
    accountItems.push({
      component: CNavItem,
      name: 'Dashboard',
      to: '/account-dashboard',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/account/receipt'])) {
    accountItems.push({
      component: CNavItem,
      name: 'Receipts',
      to: '/account/receipt',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/debit-note'])) {
    accountItems.push({
      component: CNavItem,
      name: 'Debit Note',
      to: '/debit-note',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'LEDGER_CREATE')) {
    accountItems.push({
      component: CNavItem,
      name: 'Refund',
      to: '/refund',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'BOOKING_READ')) {
    accountItems.push({
      component: CNavItem,
      name: 'Cancelled Booking',
      to: '/cancelled-booking',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/account/all-receipt'])) {
    accountItems.push({
      component: CNavItem,
      name: 'All Receipts',
      to: '/account/all-receipt',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/view-ledgers'])) {
    accountItems.push({
      component: CNavItem,
      name: 'Ledgers',
      to: '/view-ledgers',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/exchange-ledgers'])) {
    accountItems.push({
      component: CNavItem,
      name: 'Exchange Ledger',
      to: '/exchange-ledgers',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'BROKER_LEDGER_APPROVE')) {
    accountItems.push({
      component: CNavItem,
      name: 'Broker Payment Verification',
      to: '/broker-payment',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'LEDGER_READ')) {
    accountItems.push({
      component: CNavItem,
      name: 'Report',
      to: '/receipt-report',
    });
  }
  if (accountItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Account',
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      items: accountItems,
    });
  }

  const insuranceItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/insurance-dashboard'])) {
    insuranceItems.push({
      component: CNavItem,
      name: 'Dashboard',
      to: '/insurance-dashboard',
    });
  }
  if (superAdmin || hasPermission(userPermissions, 'INSURANCE_READ')) {
    insuranceItems.push({
      component: CNavItem,
      name: 'Insurance Details',
      to: '/insurance-details',
    });
  }

  if (insuranceItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Insurance',
      to: '/insurance',
      icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
      items: insuranceItems,
    });
  }
   // RTO Group
   const rtoItems = []
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto-dashboard'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'Dashboard',
       to: '/rto-dashboard',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/application'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'Application',
       to: '/rto/application',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/rto-paper'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'RTO Paper',
       to: '/rto/rto-paper',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/rto-tax'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'RTO Tax',
       to: '/rto/rto-tax',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/hsrp-ordering'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'HSRP Ordering',
       to: '/rto/hsrp-ordering',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/hsrp-installation'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'HSRP Installation',
       to: '/rto/hsrp-installation',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/rc-confirmation'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'RC Confirmation',
       to: '/rto/rc-confirmation',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/report'])) {
     rtoItems.push({
       component: CNavItem,
       name: 'Report',
       to: '/rto/rto-report',
     });
   }
 
   if (rtoItems.length > 0) {
     _nav.push({
       component: CNavGroup,
       name: 'RTO',
       icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
       items: rtoItems,
     });
   }

  // Fund Management Group
  const fundManagementItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/cash-voucher'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Cash Voucher',
      to: '/cash-voucher',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/contra-voucher'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Contra Voucher',
      to: '/contra-voucher',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/contra-approval'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Contra Approval',
      to: '/contra-approval',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/workshop-receipt'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Workshop Cash Receipt',
      to: '/workshop-receipt',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/cash-receipt'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'All Cash Receipt',
      to: '/cash-receipt',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/cash-book'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Cash Book',
      to: '/cash-book',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/day-book'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Day Book',
      to: '/day-book',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/fund-report'])) {
    fundManagementItems.push({
      component: CNavItem,
      name: 'Report',
      to: '/fund-report',
    });
  }

  if (fundManagementItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Fund Management',
      icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
      items: fundManagementItems,
    });
  }
 

   // Masters Group
   const mastersItems = []
   if (superAdmin || hasPermission(userPermissions, routePermissions['/branch/branch-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Location',
       to: '/branch/branch-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/headers/headers-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Headers',
       to: '/headers/headers-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/model/model-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Vehicles',
       to: '/model/model-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, 'MODEL_READ')) {
     mastersItems.push({
       component: CNavItem,
       name: 'Minimum Booking Amount',
       to: '/minimumbookingamount/minimum-booking-amount-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, 'TEMPLATE_READ')) {
     mastersItems.push({
       component: CNavItem,
       name: 'Template List',
       to: '/templateform/template-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/accessories/accessories-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Accessories',
       to: '/accessories/accessories-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/color/color-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Colour',
       to: '/color/color-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/documents/documents-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Documents',
       to: '/documents/documents-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/conditions/conditions-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Terms & Conditions',
       to: '/conditions/conditions-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/offers/offer-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Offer',
       to: '/offers/offer-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/attachments/attachments-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Attachments',
       to: '/attachments/attachments-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/declaration-master'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Declaration',
       to: '/declaration-master',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/rto/rto-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'RTO',
       to: '/rto/rto-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/financer/financer-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Financer',
       to: '/financer/financer-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/financer-rates/rates-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Finance Rates',
       to: '/financer-rates/rates-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/insurance-provider/provider-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Insurance Providers',
       to: '/insurance-provider/provider-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/broker/broker-list'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Brokers',
       to: '/broker/broker-list',
     });
   }
   if (superAdmin || hasPermission(userPermissions, routePermissions['/broker/broker-range'])) {
     mastersItems.push({
       component: CNavItem,
       name: 'Broker Commission Range',
       to: '/broker/commission-range',
     });
   }
   if (superAdmin || hasPermission(userPermissions, 'VERTICLE_MASTER_READ')) {
     mastersItems.push({
       component: CNavItem,
       name: 'Vertical Masters',
       to: '/vertical-master/vertical-master-list',
     });
   }
 
   if (mastersItems.length > 0) {
     _nav.push({
       component: CNavGroup,
       name: 'Masters',
       icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
       items: mastersItems,
     });
   }
 

     // Fund Master Group
  const fundMasterItems = []
  if (superAdmin || hasPermission(userPermissions, routePermissions['/cash-master'])) {
    fundMasterItems.push({
      component: CNavItem,
      name: 'Cash Account Master',
      to: '/cash-master',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/bank-master'])) {
    fundMasterItems.push({
      component: CNavItem,
      name: 'Bank Account Master',
      to: '/bank-master',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/payment-mode'])) {
    fundMasterItems.push({
      component: CNavItem,
      name: 'Payment Mode',
      to: '/payment-mode',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/expense'])) {
    fundMasterItems.push({
      component: CNavItem,
      name: 'Expense Master',
      to: '/expense',
    });
  }
  if (superAdmin || hasPermission(userPermissions, routePermissions['/opening-balance'])) {
    fundMasterItems.push({
      component: CNavItem,
      name: 'Add Opening Balance',
      to: '/opening-balance',
    });
  }

  if (fundMasterItems.length > 0) {
    _nav.push({
      component: CNavGroup,
      name: 'Fund Master',
      icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
      items: fundMasterItems,
    });
  }

  // Accessories Billing
  if (superAdmin || hasPermission(userPermissions, routePermissions['/accessories-billing'])) {
    _nav.push({
      component: CNavItem,
      name: 'Accessories Billing',
      to: '/accessories-billing',
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    });
  }

  // Customers
  if (superAdmin || hasPermission(userPermissions, routePermissions['/customers/customers-list'])) {
    _nav.push({
      component: CNavItem,
      name: 'Customers',
      to: '/all-customers',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    });
  }
  const hasSubdealerPermission = superAdmin || 
    hasPermission(userPermissions, 'SUBDEALER_READ') ||
    hasPermission(userPermissions, 'SUBDEALER_COMMISSION_READ') ||
    hasPermission(userPermissions, 'BOOKING_CREATE') ||
    hasPermission(userPermissions, 'SUBDEALER_ON_ACCOUNT_CREATE');

  if (hasSubdealerPermission) {
    _nav.push({
      component: CNavTitle,
      name: 'SUBDEALER',
    });
    
     // Subdealer Stock Audit
    if (superAdmin || hasPermission(userPermissions, 'SUBDEALER_READ')) {
      _nav.push({
        component: CNavItem,
        name: 'Subdealer Stock Audit',
        to: '/stock-audit-list',
        icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
      });
    }
     // Subdealer Master Group
     const subdealerMasterItems = []
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-list'])) {
       subdealerMasterItems.push({
         component: CNavItem,
         name: 'Subdealer List',
         to: '/subdealer-list',
       });
     }
     if (superAdmin || hasPermission(userPermissions, 'SUBDEALER_READ')) {
       subdealerMasterItems.push({
         component: CNavItem,
         name: 'Subdealer Audit List',
         to: '/subdealer-audit-list',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-commission'])) {
       subdealerMasterItems.push({
         component: CNavItem,
         name: 'Subdealer Commission',
         to: '/subdealer-commission',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/calculate-commission'])) {
       subdealerMasterItems.push({
         component: CNavItem,
         name: 'Calculate Commission',
         to: '/subdealer/calculate-commission',
       });
     }
 
     if (subdealerMasterItems.length > 0) {
       _nav.push({
         component: CNavGroup,
         name: 'Master',
         icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
         items: subdealerMasterItems,
       });
     }
 
     // Subdealer Booking Group
     const subdealerBookingItems = []
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-booking'])) {
       subdealerBookingItems.push({
         component: CNavItem,
         name: 'New Booking',
         to: '/subdealer-booking',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-all-bookings'])) {
       subdealerBookingItems.push({
         component: CNavItem,
         name: 'All Booking',
         to: '/subdealer-all-bookings',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/delivery-challan'])) {
       subdealerBookingItems.push({
         component: CNavItem,
         name: 'Delivery Challan',
         to: '/subdealer/delivery-challan',
       });
     }
 
     if (subdealerBookingItems.length > 0) {
       _nav.push({
         component: CNavGroup,
         name: 'Booking',
         icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
         items: subdealerBookingItems,
       });
     }
 
     // Subdealer Account Group
     const subdealerAccountItems = []
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-account/add-balance'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Add Balance',
         to: '/subdealer-account/add-balance',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-account/onaccount-balance'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'OnAccount Balance',
         to: '/subdealer-account/onaccount-balance',
       });
     }
     if (superAdmin || hasPermission(userPermissions, 'SUBDEALER_ON_ACCOUNT_CREATE')) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Add Amount',
         to: '/subdealer-account/add-amount',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-account/receipt'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Finance Payment',
         to: '/subdealer-account/receipt',
       });
     }
     if (superAdmin || hasPermission(userPermissions, 'FINANCE_DISBURSEMENT_READ')) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Payment Verification',
         to: '/subdealer/payment-verification',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/payment'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Subdealer Commission',
         to: '/subdealer/payment',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/payment-summary'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Payment Summary',
         to: '/subdealer/payment-summary',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer-ledger'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Subdealer Ledger',
         to: '/subdealer-ledger',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/customer-ledger'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Customer Ledger',
         to: '/subdealer/customer-ledger',
       });
     }
     if (superAdmin || hasPermission(userPermissions, routePermissions['/subdealer/summary'])) {
       subdealerAccountItems.push({
         component: CNavItem,
         name: 'Summary',
         to: '/subdealer/summary',
       });
     }
 
     if (subdealerAccountItems.length > 0) {
       _nav.push({
         component: CNavGroup,
         name: 'Account',
         icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
         items: subdealerAccountItems,
       });
     }

  }

  // USER MANAGEMENT Title
  const hasUserManagementPermission = superAdmin ||
    hasPermission(userPermissions, 'ROLE_CREATE') ||
    hasPermission(userPermissions, 'ROLE_READ') ||
    hasPermission(userPermissions, 'USER_CREATE') ||
    hasPermission(userPermissions, 'USER_READ');

  if (hasUserManagementPermission) {
    _nav.push({
      component: CNavTitle,
      name: 'USER MANAGEMENT',
    });

    // Roles Group
    const rolesItems = []
    if (superAdmin || hasPermission(userPermissions, routePermissions['/roles/create-role'])) {
      rolesItems.push({
        component: CNavItem,
        name: 'Create Role',
        to: '/roles/create-role',
      });
    }
    if (superAdmin || hasPermission(userPermissions, routePermissions['/roles/all-role'])) {
      rolesItems.push({
        component: CNavItem,
        name: 'All Role',
        to: '/roles/all-role',
      });
    }

    if (rolesItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: 'Roles',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
        items: rolesItems,
      });
    }

    // User Group
    const userItems = []
    if (superAdmin || hasPermission(userPermissions, routePermissions['/users/add-user'])) {
      userItems.push({
        component: CNavItem,
        name: 'Add User',
        to: '/users/add-user',
      });
    }
    if (superAdmin || hasPermission(userPermissions, routePermissions['/users/users-list'])) {
      userItems.push({
        component: CNavItem,
        name: 'User List',
        to: '/users/users-list',
      });
    }

    if (userItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: 'User',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        items: userItems,
      });
    }

    // Buffer Report
    if (superAdmin || hasPermission(userPermissions, routePermissions['/buffer/buffer-list'])) {
      _nav.push({
        component: CNavItem,
        name: 'Buffer Report',
        to: '/buffer/buffer-list',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      });
    }

    // Manager Deviation
    if (superAdmin || hasPermission(userPermissions, routePermissions['/manager-deviation'])) {
      _nav.push({
        component: CNavItem,
        name: 'Manager Deviation',
        to: '/manager-deviation',
        icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
      });
    }
  }

  return _nav;
}

export default getNav;