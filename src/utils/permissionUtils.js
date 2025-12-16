// export const getUserPermissions = () => {
//   return JSON.parse(localStorage.getItem('userPermissions')) || [];
// };

// export const hasPermission = (moduleName, action) => {
//   const userPermissions = getUserPermissions();
//   return userPermissions.some((perm) => perm.module === moduleName && perm.action === action);
// };


// Permission mapping configuration
export const routePermissions = {
  '/app/dashboard/analytics': 'DASHBOARD_READ',

  '/inward-list': 'VEHICLE_INWARD_READ',
  '/stock-verification': 'VEHICLE_INWARD_APPROVE',
  '/stock-transfer': 'STOCK_TRANSFER_CREATE',
  '/upload-challan': 'STOCK_TRANSFER_UPDATE',

  // Sales
  '/new-booking': 'BOOKING_CREATE',
  '/booking-list': 'BOOKING_READ',
  '/delivery-challan': 'BOOKING_DELIVERY_CHALLAN',
  '/invoice': 'BOOKING_GST_INVOICE',
  '/helmet-invoice': 'BOOKING_HELMET_INVOICE',
  '/deal-form': 'BOOKING_DEAL_FORM',
  '/upload-deal': 'BOOKING_UPLOAD',
  '/sales-report': 'BOOKING_READ',

  // Account
  '/account-dashboard': 'LEDGER_READ',
  '/account/receipt': 'LEDGER_CREATE',
  '/debit-note': 'LEDGER_CREATE',
  '/account/all-receipt': 'LEDGER_READ',
  '/view-ledgers': 'LEDGER_READ',
  '/exchange-ledgers': 'BROKER_LEDGER_READ',

  // Insurance
  '/insurance-dashboard': 'INSURANCE_READ',
  '/insurance-report': 'INSURANCE_CREATE',

  // RTO
  '/rto-dashboard': 'RTO_PROCESS_READ',
  '/rto/application': 'RTO_PROCESS_READ',
  '/rto/rto-paper': 'RTO_PROCESS_READ',
  '/rto/rto-tax': 'RTO_PROCESS_READ',
  '/rto/hsrp-ordering': 'RTO_PROCESS_READ',
  '/rto/hsrp-installation': 'RTO_PROCESS_READ',
  '/rto/rc-confirmation': 'RTO_PROCESS_READ',
  '/rto/report': 'RTO_PROCESS_READ',

  // Fund Management
  '/cash-voucher': 'CASH_VOUCHER_CREATE',
  '/contra-voucher': 'CONTRA_VOUCHER_CREATE',
  '/contra-approval': 'CONTRA_VOUCHER_APPROVE',
  '/workshop-receipt': 'WORKSHOP_RECEIPT_CREATE',
  '/cash-receipt': 'CASH_VOUCHER_READ',
  '/cash-book': 'CASH_VOUCHER_READ',
  '/day-book': 'CASH_VOUCHER_READ',
  '/fund-report': 'CASH_VOUCHER_READ',

  // Masters
  '/branch/branch-list': 'BRANCH_READ',
  '/headers/headers-list': 'HEADER_READ',
  '/model/model-list': ['MODEL_READ', 'SUBDEALERMODEL_READ'],
  '/categories/categories-list': 'ACCESSORY_CATEGORY_READ',
  '/accessories/accessories-list': 'ACCESSORIES_READ',
  '/color/color-list': 'COLOR_READ',
  '/documents/documents-list': 'DOCUMENTS_READ',
  '/conditions/conditions-list': 'TERMS_CONDITION_READ',
  '/offers/offer-list': 'OFFER_READ',
  '/attachments/attachments-list': 'ATTACHMENTS_READ',
  '/declaration-master': 'DECLARATION_READ',
  '/rto/rto-list': 'RTO_READ',
  '/financer/financer-list': 'FINANCE_PROVIDER_READ',
  '/financer-rates/rates-list': 'FINANCE_PROVIDER_READ',
  '/insurance-provider/provider-list': 'INSURANCE_PROVIDER_READ',
  '/broker/broker-list': 'BROKER_READ',
  '/broker/broker-range': 'BROKER_READ',

  // Fund Master
  '/cash-master': 'CASH_LOCATION_READ',
  '/bank-master': 'BANK_READ',
  '/payment-mode': ['BANK_SUB_PAYMENT_MODE_CREATE', 'BANK_SUB_PAYMENT_MODE_READ'],
  '/expense': 'EXPENSE_ACCOUNT_READ',
  '/opening-balance': 'BRANCH_CREATE',
  '/accessories-billing': 'ACCESSORY_BILLING_CREATE',

  // Subdealer masters
  '/subdealer-list': 'SUBDEALER_READ',
  '/subdealer-commission': 'SUBDEALER_COMMISSION_READ',
  '/subdealer/calculate-commission': 'SUBDEALER_COMMISSION_READ',

  // Subdealer booking
  '/subdealer-booking': 'BOOKING_CREATE',
  '/subdealer-all-bookings': 'BOOKING_READ',
  '/subdealer/delivery-challan': 'BOOKING_DELIVERY_CHALLAN',
  '/subdealer/invoice': 'BOOKING_GST_INVOICE',
  '/subdealer/deal-form': 'BOOKING_DEAL_FORM',

  // Subdealer account
  '/subdealer-account/add-balance': 'SUBDEALER_ON_ACCOUNT_CREATE',
  '/subdealer-account/onaccount-balance': 'SUBDEALER_ON_ACCOUNT_READ',
  '/subdealer-account/receipt': 'FINANCE_DISBURSEMENT_READ',
  '/subdealer-ledger': 'SUBDEALER_READ',
  '/subdealer/customer-ledger': 'LEDGER_VIEW',
  '/subdealer/summary': 'SUBDEALER_READ',
  '/subdealer/payment': 'COMMISSION_PAYMENT_CREATE',
  '/subdealer/payment-summary': 'COMMISSION_PAYMENT_READ',

  // User Management
  '/roles/create-role': 'ROLE_CREATE',
  '/roles/all-role': 'ROLE_READ',
  '/users/add-user': 'USER_CREATE',
  '/users/users-list': 'USER_READ',
  '/buffer/buffer-list': 'USER_BUFFER_READ',
  '/customers/customers-list': 'CUSTOMER_READ',
  '/manager-deviation': 'USER_READ'
};

// Helper functions
export const hasPermission = (userPermissions, requiredPermissions) => {
  // Get permissions from context or localStorage
  const permissions = userPermissions || JSON.parse(localStorage.getItem('permissions') || '[]');
  
  // Check if user is superadmin
  const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
  if (isSuperAdmin) {
    return true;
  }

  if (!permissions || permissions.length === 0) return false;
  
  // If requiredPermissions is an array, check if user has any of them
  if (Array.isArray(requiredPermissions)) {
    return requiredPermissions.some(permission => 
      permissions.some(userPerm => userPerm.name === permission)
    );
  }
  
  // If requiredPermissions is a string, check for that specific permission
  return permissions.some(perm => perm.name === requiredPermissions);
};

export const isSuperAdmin = () => {
  return localStorage.getItem('isSuperAdmin') === 'true';
};

export const getUserPermissions = () => {
  return JSON.parse(localStorage.getItem('permissions') || '[]');
};