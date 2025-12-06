// import React from 'react';
// const AddBranch = React.lazy(() => import('../views/masters/branch/AddBranch'))
// const BranchList = React.lazy(() => import('../views/masters/branch/BranchList'))
// const AddHeader = React.lazy(() => import('../views/masters/headers/AddHeader'))
// const HeadersList = React.lazy(() => import('../views/masters/headers/HeaderList'))
// const AddModel = React.lazy(() => import('../views/masters/model/AddModel'))
// const ModelList = React.lazy(() => import('../views/masters/model/ModelList'))
// const UpdateModel = React.lazy(() => import('../views/masters/model/UpdateModel'))
// const AddAccessories = React.lazy(() => import('../views/masters/accessories/AddAccessories'))
// const AccessoriesList = React.lazy(() => import('../views/masters/accessories/AccessoriesList'))
// const ColorList = React.lazy(() => import('../views/masters/color/ColorList'))
// const AddColor = React.lazy(() => import('../views/masters/color/AddColor'))
// const AddDocuments = React.lazy(() => import('../views/masters/documents/AddDocument'))
// const DocumentsList = React.lazy(() => import('../views/masters/documents/DocumentsList'))
// const AddCondition = React.lazy(() => import('../views/masters/terms&conditions/AddCondition'))
// const ConditionList = React.lazy(() => import('../views/masters/terms&conditions/ConditionList'))

// const AddOffers = React.lazy(() => import('../views/masters/offer/AddOffers'))
// const OffersList = React.lazy(() => import('../views/masters/offer/OffersList'))
// const AddAttachments = React.lazy(() => import('../views/masters/attachments/AddAttachments'))
// const AttachmentsList = React.lazy(() => import('../views/masters/attachments/AttachmentsList'))
// const AddDeclaration = React.lazy(() => import('../views/masters/declaration/AddDeclaration'))
// const DeclarationList = React.lazy(() => import('../views/masters/declaration/DeclarationList'))

// const AddRto = React.lazy(() => import('../views/masters/rto/AddRto'))
// const RtoList = React.lazy(() => import('../views/masters/rto/RtoList'))

// const AddFinancer = React.lazy(() => import('../views/masters/financer/AddFinancer'))
// const FinancerList = React.lazy(() => import('../views/masters/financer/FinancerList'))
// const AddFinanceRates = React.lazy(() => import('../views/masters/financeRates/AddRates'))
// const FinanceRatesList = React.lazy(() => import('../views/masters/financeRates/RatesList'))
// const AddInsuranceProviders = React.lazy(() => import('../views/masters/insuranceProviders/AddProvider'))
// const InsuranceProvidersList = React.lazy(() => import('../views/masters/insuranceProviders/ProvidersList'))
// const AddBroker = React.lazy(() => import('../views/masters/broker/AddBroker'))
// const BrokerList = React.lazy(() => import('../views/masters/broker/BrokerList'))

// const BrokerCommissionRange = React.lazy(() => import('../views/masters/commission-range/BrokerRange'))
// const CommissionRangeList = React.lazy(() => import('../views/masters/commission-range/RangeList')) 

// export const masterRoutes = [
//     { path:'/branch/branch-list',name: 'Branch List', element: BranchList},
//     { path:'/branch/add-branch',name: 'Add Branch', element: AddBranch},
//     { path:'/branch/update-branch/:id',name: 'Add Branch', element: AddBranch},
  
//     { path:'/headers/headers-list', name:'Headers List', element:HeadersList},
//     { path:'/headers/add-header', name:'Add Headers', element:AddHeader},
//     { path:'/headers/update-header/:id', name:'Add Headers', element:AddHeader},
//     { path:'/model/model-list', name:"model List", element:ModelList},
//     { path:'/model/add-model', name:"Add Model", element:AddModel},
//     { path:'/model/update-model/:id', name:'Update Model', element:UpdateModel},
  
//     { path:'/accessories/add-accessories', name:"Add Accessories", element:AddAccessories},
//     { path:'/accessories/update-accessories/:id', name:"Add Accessories", element:AddAccessories},
//     { path:'/accessories/accessories-list', name:"Accessories List", element:AccessoriesList},
//     { path:'/color/color-list',name:"Color List", element:ColorList},
//     { path:'/color/add-color',name:"Add Color", element:AddColor},
//     { path:'/color/update-color/:id',name:"Update Color", element:AddColor},
//     { path:'/documents/add-document', name:"Add Document", element:AddDocuments},
//     { path:'/documents/update-document/:id', name:"Add Accessories", element:AddDocuments},
//     { path:'/documents/documents-list', name:"documents List", element:DocumentsList},
  
//     { path:'/conditions/conditions-list',name:"Color List", element:ConditionList},
//     { path:'/conditions/add-condition',name:"Add Color", element:AddCondition},
//     { path:'/conditions/update-condition/:id',name:"Update Color", element:AddCondition},
  
//     { path:'/offers/offer-list', name:'Offers List', element:OffersList},
//     { path:'/offers/add-offer', name:'Add Offers', element:AddOffers},
//     { path:'/offers/update-offer/:id', name:'Update Offers', element:AddOffers},
  
//     { path:'/attachments/attachments-list', name:'Attachments List', element:AttachmentsList},
//     { path:'/attachments/add-attachments', name:'Add Attachments', element:AddAttachments},
//     { path:'/attachments/update-attachments/:id', name:'Update Attachments', element:AddAttachments},
    
//     { path:'/add-declaration', name:'Add Declaration', element:AddDeclaration},
//     { path:'/update-declaration/:id', name:'Edit Declaration', element:AddDeclaration},
//     { path:'/declaration-master', name:'Declaration List', element:DeclarationList},
  
//     { path:'/rto/rto-list', name:'Rto List', element:RtoList},
//     { path:'/rto/add-rto', name:'Add RTO', element:AddRto},
//     { path:'/rto/update-rto/:id', name:'Edit RTO', element:AddRto},
  
//     { path:'/financer/financer-list', name:'Financer List', element:FinancerList},
//     { path:'/financer/add-financer', name:'Add Financer', element:AddFinancer},
//     { path:'/financer/update-financer/:id', name:'Edit Financer', element:AddFinancer},
  
//     { path:'/financer-rates/rates-list', name:'Financer Rates', element:FinanceRatesList},
//     { path:'/financer-rates/add-rates', name:'Add Finance Rates', element:AddFinanceRates},
//     { path:'/financer-rates/update-rates/:id', name:'Edit Finance Rates', element:AddFinanceRates},
  
//     { path:'/insurance-provider/provider-list', name:'Insurance Providers List', element:InsuranceProvidersList},
//     { path:'/insurance-provider/add-provider', name:'Add Insurance Provider', element:AddInsuranceProviders},
//     { path:'/insurance-provider/update-provider/:id', name:'Edit Insurance Provider', element:AddInsuranceProviders},
   
//     { path:'/broker/broker-list', name:'Brokers', element:BrokerList},
//     { path:'/broker/add-broker', name:'Add Broker', element:AddBroker},
//     { path:'/broker/update-broker/:id', name:'Edit Broker', element:AddBroker},
  
//     { path:'/broker/commission-range', name:'Broker Commission', element:CommissionRangeList},
//     { path:'/broker/add-range', name:'Add Commission Range', element:BrokerCommissionRange},
  
// ];



import React from 'react';

const AddBranch = React.lazy(() => import('../views/masters/branch/AddBranch'))
const BranchList = React.lazy(() => import('../views/masters/branch/BranchList'))
const AddHeader = React.lazy(() => import('../views/masters/headers/AddHeader'))
const HeadersList = React.lazy(() => import('../views/masters/headers/HeaderList'))
const AddModel = React.lazy(() => import('../views/masters/model/AddModel'))
const ModelList = React.lazy(() => import('../views/masters/model/ModelList'))
const UpdateModel = React.lazy(() => import('../views/masters/model/UpdateModel'))
const AddAccessories = React.lazy(() => import('../views/masters/accessories/AddAccessories'))
const AccessoriesList = React.lazy(() => import('../views/masters/accessories/AccessoriesList'))
const ColorList = React.lazy(() => import('../views/masters/color/ColorList'))
const AddColor = React.lazy(() => import('../views/masters/color/AddColor'))
const AddDocuments = React.lazy(() => import('../views/masters/documents/AddDocument'))
const DocumentsList = React.lazy(() => import('../views/masters/documents/DocumentsList'))
const AddCondition = React.lazy(() => import('../views/masters/terms&conditions/AddCondition'))
const ConditionList = React.lazy(() => import('../views/masters/terms&conditions/ConditionList'))

const TemplateList = React.lazy(() => import('../views/masters/templateform/TemplateList'))
const TemplateForm = React.lazy(() => import('../views/masters/templateform/TemplateForm'))
const TemplatePreview = React.lazy(() => import('../views/masters/templateform/TemplatePreview'))

const AddOffers = React.lazy(() => import('../views/masters/offer/AddOffers'))
const OffersList = React.lazy(() => import('../views/masters/offer/OffersList'))
const AddAttachments = React.lazy(() => import('../views/masters/attachments/AddAttachments'))
const AttachmentsList = React.lazy(() => import('../views/masters/attachments/AttachmentsList'))
const AddDeclaration = React.lazy(() => import('../views/masters/declaration/AddDeclaration'))
const DeclarationList = React.lazy(() => import('../views/masters/declaration/DeclarationList'))

const AddRto = React.lazy(() => import('../views/masters/rto/AddRto'))
const RtoList = React.lazy(() => import('../views/masters/rto/RtoList'))

const AddFinancer = React.lazy(() => import('../views/masters/financer/AddFinancer'))
const FinancerList = React.lazy(() => import('../views/masters/financer/FinancerList'))
const AddFinanceRates = React.lazy(() => import('../views/masters/financeRates/AddRates'))
const FinanceRatesList = React.lazy(() => import('../views/masters/financeRates/RatesList'))
const AddInsuranceProviders = React.lazy(() => import('../views/masters/insuranceProviders/AddProvider'))
const InsuranceProvidersList = React.lazy(() => import('../views/masters/insuranceProviders/ProvidersList'))
const AddBroker = React.lazy(() => import('../views/masters/broker/AddBroker'))
const BrokerList = React.lazy(() => import('../views/masters/broker/BrokerList'))

const BrokerCommissionRange = React.lazy(() => import('../views/masters/commission-range/BrokerRange'))
const CommissionRangeList = React.lazy(() => import('../views/masters/commission-range/RangeList')) 

// Add Vertical Master imports
const AddVerticalMaster = React.lazy(() => import('../views/masters/verticlemasters/AddVerticalMaster'))
const VerticalMasterList = React.lazy(() => import('../views/masters/verticlemasters/VerticalMasterList'))
const UpdateVerticalMaster = React.lazy(() => import('../views/masters/verticlemasters/UpdateVerticalMaster'))

const MinimumBookingAmountList = React.lazy(() => import('../views/masters/minimumbookingamount/MinimumBookingAmountList'))

export const masterRoutes = [
    { path:'/branch/branch-list',name: 'Branch List', element: BranchList},
    { path:'/branch/add-branch',name: 'Add Branch', element: AddBranch},
    { path:'/branch/update-branch/:id',name: 'Add Branch', element: AddBranch},
  
    { path:'/headers/headers-list', name:'Headers List', element:HeadersList},
    { path:'/headers/add-header', name:'Add Headers', element:AddHeader},
    { path:'/headers/update-header/:id', name:'Add Headers', element:AddHeader},
    { path:'/model/model-list', name:"model List", element:ModelList},
    { path:'/model/add-model', name:"Add Model", element:AddModel},
    { path:'/model/update-model/:id', name:'Update Model', element:UpdateModel},

    { path:'/templateform/template-list', name:'Template List', element:TemplateList},
    { path:'/templateform/template-list/create', name:'Template Form', element:TemplateForm},
    { path:'/templateform/template-list/edit/:id', name:'Template Edit', element:TemplateForm},
    { path:'/templateform/template-list/preview/:id', name:'Template Preview', element:TemplatePreview},

    { path:'/minimumbookingamount/minimum-booking-amount-list', name:"Minimum Booking Amount List", element:MinimumBookingAmountList},
    
  
    { path:'/accessories/add-accessories', name:"Add Accessories", element:AddAccessories},
    { path:'/accessories/update-accessories/:id', name:"Add Accessories", element:AddAccessories},
    { path:'/accessories/accessories-list', name:"Accessories List", element:AccessoriesList},
    { path:'/color/color-list',name:"Color List", element:ColorList},
    { path:'/color/add-color',name:"Add Color", element:AddColor},
    { path:'/color/update-color/:id',name:"Update Color", element:AddColor},
    { path:'/documents/add-document', name:"Add Document", element:AddDocuments},
    { path:'/documents/update-document/:id', name:"Add Accessories", element:AddDocuments},
    { path:'/documents/documents-list', name:"documents List", element:DocumentsList},
  
    { path:'/conditions/conditions-list',name:"Color List", element:ConditionList},
    { path:'/conditions/add-condition',name:"Add Color", element:AddCondition},
    { path:'/conditions/update-condition/:id',name:"Update Color", element:AddCondition},
  
    { path:'/offers/offer-list', name:'Offers List', element:OffersList},
    { path:'/offers/add-offer', name:'Add Offers', element:AddOffers},
    { path:'/offers/update-offer/:id', name:'Update Offers', element:AddOffers},
  
    { path:'/attachments/attachments-list', name:'Attachments List', element:AttachmentsList},
    { path:'/attachments/add-attachments', name:'Add Attachments', element:AddAttachments},
    { path:'/attachments/update-attachments/:id', name:'Update Attachments', element:AddAttachments},
    
    { path:'/add-declaration', name:'Add Declaration', element:AddDeclaration},
    { path:'/update-declaration/:id', name:'Edit Declaration', element:AddDeclaration},
    { path:'/declaration-master', name:'Declaration List', element:DeclarationList},
  
    { path:'/rto/rto-list', name:'Rto List', element:RtoList},
    { path:'/rto/add-rto', name:'Add RTO', element:AddRto},
    { path:'/rto/update-rto/:id', name:'Edit RTO', element:AddRto},
  
    { path:'/financer/financer-list', name:'Financer List', element:FinancerList},
    { path:'/financer/add-financer', name:'Add Financer', element:AddFinancer},
    { path:'/financer/update-financer/:id', name:'Edit Financer', element:AddFinancer},
  
    { path:'/financer-rates/rates-list', name:'Financer Rates', element:FinanceRatesList},
    { path:'/financer-rates/add-rates', name:'Add Finance Rates', element:AddFinanceRates},
    { path:'/financer-rates/update-rates/:id', name:'Edit Finance Rates', element:AddFinanceRates},
  
    { path:'/insurance-provider/provider-list', name:'Insurance Providers List', element:InsuranceProvidersList},
    { path:'/insurance-provider/add-provider', name:'Add Insurance Provider', element:AddInsuranceProviders},
    { path:'/insurance-provider/update-provider/:id', name:'Edit Insurance Provider', element:AddInsuranceProviders},
   
    { path:'/broker/broker-list', name:'Brokers', element:BrokerList},
    { path:'/broker/add-broker', name:'Add Broker', element:AddBroker},
    { path:'/broker/update-broker/:id', name:'Edit Broker', element:AddBroker},
  
    { path:'/broker/commission-range', name:'Broker Commission', element:CommissionRangeList},
    { path:'/broker/add-range', name:'Add Commission Range', element:BrokerCommissionRange},
  
    // Add Vertical Master routes
    { path:'/vertical-master/vertical-master-list', name:'Vertical Master List', element: VerticalMasterList},
    { path:'/vertical-master/add-vertical-master', name:'Add Vertical Master', element: AddVerticalMaster},
    { path:'/vertical-master/update-vertical-master/:id', name:'Update Vertical Master', element: UpdateVerticalMaster},
];