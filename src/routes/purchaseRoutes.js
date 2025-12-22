import React from 'react';
const InwardStock = React.lazy(() => import('../views/purchase/InwardStock'))
const RtoChassis = React.lazy(()=> import('../views/purchase/RtoChassis'))
const StockList = React.lazy(() => import('../views/purchase/StockList'))
const StockVerification = React.lazy(() => import('../views/purchase/StockVerification'))
const StockTransfer = React.lazy(() => import('../views/purchase/StockTransfer'))
const UploadChallan = React.lazy(() => import('../views/purchase/UploadChallan'))
export const purchaseRoutes = [
  { path: '/inward-stock', name: 'Inward Stock', element: InwardStock},
  {path:'/rto-chassis', name:'RTO Chassis', element: RtoChassis },
  { path: '/update-inward/:id', name: 'Update Inward Stock', element: InwardStock},
  { path: '/inward-list', name: 'Stock List', element: StockList},
  { path:'/stock-verification',name: 'Stock Verification', element: StockVerification},
  { path:'/stock-transfer',name: 'Stock Transfer', element: StockTransfer},
  { path:'/upload-challan',name: 'Upload Challan', element: UploadChallan},
];