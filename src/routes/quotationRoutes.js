import React from 'react';

const AddQuotation = React.lazy(() => import('../views/quotation/AddQuotation'))
const QuotationList = React.lazy(() => import('../views/quotation/QuotationList'))
export const quotationRoutes = [
 { path:'/add-quotation', name:'Add Quotation', element:AddQuotation},
  { path:'/quotation-list', name:'Quotation List', element:QuotationList},
];