import React from 'react'
import { purchaseRoutes } from './routes/purchaseRoutes'
import { masterRoutes } from './routes/masterRoutes'
import { salesRoutes } from './routes/salesRoutes'
import { rtoRoutes } from './routes/rtoRoutes'
import { fundMasterRoutes } from './routes/fundMasterRoutes'
import { accountRoutes } from './routes/accountRoutes'
import { fundManagementRoutes } from './routes/fundManagementRoutes'
import { userManagementRoutes } from './routes/userManagementRoutes'
import { subdealerRoutes } from './routes/subdealerRoutes'
import { quotationRoutes } from './routes/quotationRoutes'
import { insuranceRoutes } from './routes/insuranceRoutes'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  //purchase
   ...purchaseRoutes,
   
  //Masters
  ...masterRoutes,
  //Sales
   ...salesRoutes,
  //RTO

   ...rtoRoutes,
  //Fund Management
   ...fundManagementRoutes,
   //Acount
   ...accountRoutes,
  //Fund-Master
  ...fundMasterRoutes,

  //Quotation
  ...quotationRoutes,

  //insurance
  ...insuranceRoutes,

  // Subdealer
  ...subdealerRoutes,

  //User Management
  ...userManagementRoutes,
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
