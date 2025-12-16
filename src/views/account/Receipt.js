import React, { useState, useEffect } from 'react';
import { 
  CBadge, 
  CNav, 
  CNavItem, 
  CNavLink, 
  CTabContent, 
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CSpinner,
  CFormLabel
} from '@coreui/react';
import { axiosInstance, getDefaultSearchFields, showError, showSuccess } from '../../utils/tableImports';
import '../../css/invoice.css';
import '../../css/table.css';
import ReceiptModal from './ReceiptModal';
import { confirmVerify } from '../../utils/sweetAlerts';
import { hasPermission } from '../../utils/permissionUtils';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilPrint, cilSettings, cilPlus } from '@coreui/icons';
import { numberToWords } from '../../utils/numberToWords';
import { Menu, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function Receipt() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [pendingPaymentsData, setPendingPaymentsData] = useState([]);
  const [verifiedPaymentsData, setVerifiedPaymentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuBookingId, setMenuBookingId] = useState(null);
  const { permissions} = useAuth();
  useEffect(() => {
    fetchData();
    fetchPendingPayments();
    fetchVerifiedPayments();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings`);
      const branchBookings = response.data.data.bookings.filter((booking) => booking.bookingType === 'BRANCH');
      setBookingsData(branchBookings);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await axiosInstance.get(`/ledger/pending`);
      setPendingPaymentsData(response.data.data.ledgerEntries);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchVerifiedPayments = async () => {
    try {
      const response = await axiosInstance.get(`/payment/verified/bank/ledger`);
      setVerifiedPaymentsData(response.data.data.ledgerEntries);
    } catch (error) {
      const message = showError(error);
  if (message) {
    setError(message);
  }
    }
  };

  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data;

    const searchFields = getDefaultSearchFields('receipts');
    const term = searchTerm.toLowerCase();

    return data.filter((row) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => {
          if (!obj) return '';
          if (key.match(/^\d+$/)) return obj[parseInt(key)];
          return obj[key];
        }, row);

        if (value === undefined || value === null) return false;

        if (typeof value === 'boolean') {
          return (value ? 'yes' : 'no').includes(term);
        }
        if (field === 'createdAt' && value instanceof Date) {
          return value.toLocaleDateString('en-GB').includes(term);
        }
        if (typeof value === 'number') {
          return String(value).includes(term);
        }
        return String(value).toLowerCase().includes(term);
      })
    );
  };

  const filteredBookings = filterData(bookingsData, searchTerm);
  const completePayments = filterData(
    bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) === 0),
    searchTerm
  );
  const pendingPayments = filterData(
    bookingsData.filter((booking) => parseFloat(booking.balanceAmount || 0) !== 0),
    searchTerm
  );
  const filteredPendingLedgerEntries = filterData(pendingPaymentsData, searchTerm);
  const filteredVerifiedLedgerEntries = filterData(verifiedPaymentsData, searchTerm);

  const handleMenuClick = (event, bookingId) => {
    setAnchorEl(event.currentTarget);
    setMenuBookingId(bookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuBookingId(null);
  };

  const handleAddClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    handleMenuClose();
  };

  const handleVerifyPayment = async (entry) => {
    try {
      const result = await confirmVerify({
        title: 'Confirm Payment Verification',
        text: `Are you sure you want to verify the payment of ₹${entry.amount} for booking ${entry.bookingDetails.bookingNumber}?`,
        confirmButtonText: 'Yes, verify it!'
      });

      if (result.isConfirmed) {
        await axiosInstance.patch(`/ledger/approve/${entry._id}`, {
          remark: ''
        });
        await showSuccess('Payment verified successfully!');
        fetchPendingPayments();
        fetchVerifiedPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showError(error, 'Failed to verify payment');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const printInvoice = async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/bookings/booking-payment-status/${bookingId}`);
      const bookingData = response.data.data.bookingDetails;
      const finalStatus = response.data.data.finalStatus || '';
      const paymentInfo = response.data.data.paymentInfo || {};

      const recentPayment = paymentInfo.paymentHistory && paymentInfo.paymentHistory.length > 0 
      ? paymentInfo.paymentHistory[paymentInfo.paymentHistory.length - 1] 
      : null;

      const transformedData = {
        bookingNumber: bookingData.bookingNumber,
        bookingType: bookingData.bookingType,
        rto: bookingData.rto,
        hpa: bookingData.hpa,
        hypothecationCharges: bookingData.hypothecationCharges || 0,
        gstin: bookingData.gstin || '',
        model: {
          model_name: bookingData.model.model_name
        },
        chassisNumber: bookingData.chassisNumber,
        engineNumber: bookingData.vehicle?.engineNumber || bookingData.engineNumber,
        batteryNumber: bookingData.vehicle?.batteryNumber || '',
        keyNumber: bookingData.vehicle?.keyNumber || '',
        color: {
          name: bookingData.color?.name || ''
        },
        customerDetails: {
          name: bookingData.customerDetails.name,
          address: bookingData.customerDetails.address,
          taluka: bookingData.customerDetails.taluka,
          district: bookingData.customerDetails.district,
          pincode: bookingData.customerDetails.pincode,
          mobile1: bookingData.customerDetails.mobile1,
          dob: bookingData.customerDetails.dob,
          aadharNumber: bookingData.customerDetails.aadharNumber
        },
        exchange: bookingData.exchange,
        exchangeDetails: bookingData.exchangeDetails,
        payment: {
          type: bookingData.payment?.type || 'CASH',
          financer: bookingData.payment?.financer
        },
        salesExecutive: bookingData.salesExecutive,
        branch: {
          gst_number: bookingData.branch?.gst_number || ''
        },
        accessories: bookingData.accessories || [],
        priceComponents: bookingData.priceComponents || [],
        subdealer: bookingData.subdealer || '',
        receivedAmount: bookingData.receivedAmount || 0,
        finalStatus: finalStatus || '',
        recentPayment: recentPayment, 
      };
  
      const invoiceHTML = generateInvoiceHTML(transformedData);
      

      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
      };
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      showError(error, 'Failed to generate invoice');
    }
  };

  const generateInvoiceHTML = (data) => {
    const exchangeBrokerName = data.exchange ? data.exchangeDetails?.broker?.name || '' : '';

    const exchangeVehicleNumber = data.exchange ? data.exchangeDetails?.vehicleNumber || '' : '';

    const currentDate = new Date().toLocaleDateString('en-GB');
    const dob = data.customerDetails.dob ? new Date(data.customerDetails.dob).
    toLocaleDateString('en-GB') : 'N/A';
    const recentPaymentAmount = data.recentPayment?.amount || 0;
    const recentPaymentAmountInWords = numberToWords(recentPaymentAmount);

    const recentPaymentDate = data.recentPayment?.date 
    ? new Date(data.recentPayment.date).toLocaleDateString('en-GB')
    : currentDate;

    const filteredPriceComponents = data.priceComponents.filter((comp) => {
      const headerKey = comp.header.header_key.toUpperCase();

      const isInsurance = /INSURANCE|INSURCANCE|INSUR|COVER|PREMIUM|INSURANCE CHARGES	/i.test(headerKey);
      const isRTO = /RTO|ROAD TAX|RTO TAX & REGISTRATION CHARGES/i.test(headerKey);
      const isHypothecation = /HYPOTHECATION|HPA|HP CHARGES|HPA (if applicable)|HYPOTHECATION CHARGES (IF APPLICABLE)/i.test(headerKey);

      return !(isInsurance || isRTO || isHypothecation);
    });

    const priceComponentsWithGST = filteredPriceComponents.map((component) => {
    const gstRatePercentage = parseFloat(component.header.metadata.gst_rate) || 0;

      const unitCost = component.originalValue;
      const discount = component.discountedValue < component.originalValue ? component.originalValue - component.discountedValue : 0;
      const lineTotal = component.discountedValue;

      const taxableValue = (lineTotal * 100) / (100 + gstRatePercentage);

      const totalGST = lineTotal - taxableValue;
      const cgstAmount = totalGST / 2;
      const sgstAmount = totalGST / 2;
      const gstAmount = cgstAmount + sgstAmount;

      return {
        ...component,
        unitCost,
        taxableValue,
        cgstAmount,
        sgstAmount,
        gstAmount,
        gstRatePercentage: gstRatePercentage,
        discount,
        lineTotal
      };
    });
    const findComponentByKeywords = (keywords) => {
      return data.priceComponents.find((comp) => {
        const headerKey = comp.header.header_key.toUpperCase();
        return keywords.some((keyword) => headerKey.includes(keyword));
      });
    };

    const insuranceComponent = findComponentByKeywords([
      'INSURANCE',
      'INSURCANCE',
      'INSURANCE CHARGES',
      'INSURANCE 4+1 INCLUSIVE OF ADDITIONAL COVERS'
    ]);
    const insuranceCharges = insuranceComponent ? insuranceComponent.originalValue : 0;

    const rtoComponent = findComponentByKeywords(['RTO', 'RTO TAX & REGISTRATION CHARGES']);
    const rtoCharges = rtoComponent ? rtoComponent.originalValue : 0;

    const hpComponent = findComponentByKeywords(['HYPOTHECATION', 'HPA', 'HPA (if applicable)']);
    const hpCharges = hpComponent ? hpComponent.originalValue : data.hypothecationCharges || 0;

    const totalA = priceComponentsWithGST.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalB = insuranceCharges + rtoCharges + hpCharges;
    const grandTotal = totalA + totalB;

    return `
 <!DOCTYPE html>
<html>
<head>
  <title>GST Invoice</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 10mm;
      font-size: 14px;
      color: ##555555;;
    }
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2mm;
    }
    .header-left {
      width: 70%;
    }
    .header-right {
      width: 30%;
      text-align: right;
    }
    .logo {
      height: 50px;
      margin-bottom: 2mm;
    }
    .dealer-info {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
    .rto-type {
      text-align: left;
      margin: 1mm 0;
      font-weight: bold;
    }
    .customer-info-container {
      display: flex;
      font-size:14px;
    }

    .customer-info-left {
      width: 50%;
    }
    .customer-info-right {
      width: 50%;
    }
    .customer-info-row {
      margin: 1mm 0;
      line-height: 1.2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin: 2mm 0;
    }
    th, td {
      padding: 1mm;
      border: 1px solid #000;
      vertical-align: top;
    }
    .no-border { 
      border: none !important; 
      font-size:14px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .bold { 
    font-weight: bold; 
    }
    .section-title {
      font-weight: bold;
      margin: 1mm 0;
    }
    .signature-box {
      margin-top: 5mm;
      font-size: 9pt;
    }
    .signature-line {
      border-top: 1px dashed #000;
      width: 40mm;
      display: inline-block;
      margin: 0 5mm;
    }
    .footer {
      font-size: 8pt;
      text-align: justify;
      line-height: 1.2;
      margin-top: 3mm;
    }
    .divider {
      border-top: 2px solid #AAAAAA;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    .totals-table td {
      border: none;
      padding: 1mm;
    }
      .total-divider {
      border-top: 2px solid #AAAAAA;
      height: 1px;
      margin: 2px 0;
    }
    .broker-info{
       display:flex;
       justify-content:space-between;
       padding:1px;
    }
    .status-box {
      background-color: #e8f5e8;
      border: 2px solid #c3e6c3;
      border-radius: 4px;
      padding: 15px;
      margin: 10px 0;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      color: #495057;
    }
    .payment-info-title {
      font-weight: bold;
      margin-bottom: 5px;
      color: #155724;
      font-size: 16px;
    }
    .amount-in-words {
      font-style: italic;
      margin-top: 5px;
      color: #333;
      padding: 5px;
    }

    .note{
       padding:1px
       margin:2px;
       }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        padding: 5mm;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h2 style="margin:3;font-size:15pt;">GANDHI MOTORS PVT LTD</h2>
        <div class="dealer-info">
          Authorized Main Dealer: TVS Motor Company Ltd.<br>
          Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
          Upnagar, Nashik Road, Nashik, 7498993672<br>
          GSTIN: ${data.branch?.gst_number || ''}<br>
          GANDHI TVS PIMPALGAON
        </div>
      </div>
      <div class="header-right">
        <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="TVS Logo">
        <div>Date: ${currentDate}</div>

        ${
          data.bookingType === 'SUBDEALER'
            ? `<div><b>Subdealer:</b> ${data.subdealer?.name || ''}</div>
        <div><b>Address:</b> ${data.subdealer?.location || ''}</div>
          
          `
            : ''
        }
        
      </div>
    </div>
    <div class="divider"></div>

    <!-- Customer Information -->
    <div class="customer-info-container">
      <div class="customer-info-left">
        <div class="customer-info-row"><strong>Booking Number:</strong> ${data.bookingNumber}</div>
        <div class="customer-info-row"><strong>Customer Name:</strong> ${data.customerDetails.name}</div>
        <div class="customer-info-row"><strong>Address:</strong> ${data.customerDetails.address}, ${data.customerDetails.taluka},${data.customerDetails.pincode || ''}</div>
        <div class="customer-info-row"><strong>Mobile No.:</strong> ${data.customerDetails.mobile1}</div>
          <div class="customer-info-row"><strong>HPA:</strong> ${data.hpa ? 'YES' : 'NO'}</div>
      </div>
      <div class="customer-info-right">
        <div class="customer-info-row"><strong>Model Name:</strong> ${data.model.model_name}</div>
       <div class="customer-info-row"><strong>Chassis No:</strong></div>
        <div class="customer-info-row"><strong>Payment Mode:</strong> ${data.payment?.type || 'CASH'}</div>
         <div class="customer-info-row"><strong>Financer:</strong> ${data.payment?.financer?.name || ''}</div>
        <div class="customer-info-row"><strong>Sales Executive:</strong> ${data.salesExecutive?.name || 'N/A'}</div>
      </div>
    </div>

    <!-- Received Amount Section -->
    <div class="payment-info-box">
      ${data.recentPayment ? `
        <div><strong>Received Amount (Rs):</strong> ₹${data.recentPayment.amount.toFixed(2)}</div>
      ` : '<div>No payment history available</div>'}
      <div class="amount-in-words">
        <strong>(In Words):</strong> ${recentPaymentAmountInWords} Only
      </div>
    </div>
    <!-- Price Breakdown Table -->
    <table>
      <tr>
        <th style="width:25%">Particulars</th>
        <th style="width:8%">HSN CODE</th>
        <th style="width:8%">Unit Cost</th>
        <th style="width:8%">Taxable</th>
        <th style="width:5%">CGST</th>
        <th style="width:8%">CGST AMOUNT</th>
        <th style="width:5%">SGST</th>
        <th style="width:8%">SGST AMOUNT</th>
        <th style="width:7%">DISCOUNT</th>
        <th style="width:10%">LINE TOTAL</th>
      </tr>

      ${priceComponentsWithGST
        .map(
          (component) => `
        <tr>
          <td>${component.header.header_key}</td>
          <td>${component.header.metadata.hsn_code}</td>
          <td >${component.originalValue.toFixed(2)}</td>
          <td >${component.taxableValue.toFixed(2)}</td>
          <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
          <td >${component.cgstAmount.toFixed(2)}</td>
          <td >${(component.gstRatePercentage / 2).toFixed(2)}%</td>
          <td >${component.sgstAmount.toFixed(2)}</td>
          <td >${Math.round(component.discount || '0.00')}</td>
          <td >${component.lineTotal.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </table>

    <!-- Totals Section - No Borders -->
     <table class="totals-table">
      <tr>
        <td class="no-border" style="width:80%"><strong>Total(A)</strong></td>
        <td class="no-border text-right"><strong>${totalA.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>INSURANCE CHARGES</strong></td>
        <td class="no-border text-right"><strong>${insuranceCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>RTO TAX,REGISTRATION SMART CARD CHARGES AGENT FEES</strong></td>
        <td class="no-border text-right"><strong>${rtoCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>HP CHARGES</strong></td>
        <td class="no-border text-right"><strong>${hpCharges.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td colspan="2" class="no-border"><div class="total-divider"></div></td>
      </tr>
      <tr>
        <td class="no-border"><strong>TOTAL(B)</strong></td>
        <td class="no-border text-right"><strong>${totalB.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td class="no-border"><strong>GRAND TOTAL(A) + (B)</strong></td>
        <td class="no-border text-right"><strong>${grandTotal.toFixed(2)}</strong></td>
      </tr>
    </table>
    <div class="broker-info">
      <div><strong>Ex. Broker/ Sub Dealer:</strong>${exchangeBrokerName}</div>
      <div><strong>Ex. Veh No:</strong>${exchangeVehicleNumber}</div>
    </div>
    <div class="note"><strong>Notes:</strong></div>
   <div class="divider"></div>
   <div style="margin-top:2mm;">
  <div><strong>Booking Status: </strong>
  </div>
  <div class="status-box">
      ${data.finalStatus || 'Status: Not Available'}
    </div>
</div>
    <div class="divider"></div>

    <!-- Removed Declarations Section -->

    <!-- Signature Section - Adjusted to fit properly -->
    <div class="signature-box">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Customer's Signature</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Sales Executive</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Manager</div>
        </div>
        <div style="text-align:center; width: 22%;">
          <div class="signature-line"></div>
          <div>Accountant</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  };

  const renderCustomerTable = () => {
  return (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            <CTableHeaderCell scope="col">Received</CTableHeaderCell>
            <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
            {hasPermission(permissions,'LEDGER_CREATE') && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredBookings.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={hasPermission(permissions,'LEDGER_CREATE') ? "11" : "10"} style={{ color: 'red', textAlign: 'center' }}>
                {searchTerm ? 'No matching bookings found' : 'No booking available'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            filteredBookings.map((booking, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{booking.bookingNumber}</CTableDataCell>
                <CTableDataCell>{booking.model.model_name}</CTableDataCell>
                <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.mobile1}</CTableDataCell>
                <CTableDataCell>
                  {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                    ? (booking.chassisNumber || '')
                    : ''
                  }
                </CTableDataCell>
                <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                <CTableDataCell>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>

                {hasPermission(permissions,'LEDGER_CREATE') && (
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className='option-button btn-sm'
                      onClick={(event) => handleMenuClick(event, booking._id)}
                    >
                      <CIcon icon={cilSettings} />
                      Options
                    </CButton>

                    <Menu
                      id={`action-menu-${booking._id}`}
                      anchorEl={anchorEl}
                      open={menuBookingId === booking._id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={() => {
                        handleAddClick(booking);
                        handleMenuClose();
                      }}>
                        <CIcon icon={cilPlus} className="me-2" />
                        Add Payment
                      </MenuItem>

                      <MenuItem onClick={() => {
                        printInvoice(booking._id);
                        handleMenuClose();
                      }}>
                        <CIcon icon={cilPrint} className="me-2" />
                        Print Invoice
                      </MenuItem>
                    </Menu>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

  const renderPaymentVerificationTable = () => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredPendingLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredPendingLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.bookingNumber || ''}</CTableDataCell>
                  <CTableDataCell>{entry.paymentMode || ''}</CTableDataCell>
                  <CTableDataCell>{entry.amount || ''}</CTableDataCell>
                  <CTableDataCell>{entry.transactionReference || ''}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={entry.approvalStatus === 'Pending' ? 'danger' : 'success'} shape="rounded-pill">
                      {entry.approvalStatus === 'Pending' ? 'PENDING' : 'VERIFIED'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      className="action-btn"
                      onClick={() => handleVerifyPayment(entry)}
                      disabled={entry.approvalStatus !== 'Pending'}
                    >
                      <CIcon icon={cilCheckCircle} className="me-1" />
                      Verify
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

 const renderCompletePaymentTable = () => {
  return (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            <CTableHeaderCell scope="col">Received</CTableHeaderCell>
            <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {completePayments.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
                {searchTerm ? 'No matching complete payments found' : 'No complete payments available'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            completePayments.map((booking, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                <CTableDataCell>{booking.model.model_name}</CTableDataCell>
                <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.mobile1}</CTableDataCell>
                <CTableDataCell>
                  {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                    ? (booking.chassisNumber || '')
                    : ''
                  }
                </CTableDataCell>
                <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                <CTableDataCell style={{ color: 'green' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

const renderPendingListTable = () => {
  return (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Model Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Chassis Number</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            <CTableHeaderCell scope="col">Received</CTableHeaderCell>
            <CTableHeaderCell scope="col">Balance</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {pendingPayments.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="10" style={{ color: 'red', textAlign: 'center' }}>
                {searchTerm ? 'No matching pending payments found' : 'No pending payments available'}
              </CTableDataCell>
            </CTableRow>
          ) : (
            pendingPayments.map((booking, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{booking.bookingNumber || ''}</CTableDataCell>
                <CTableDataCell>{booking.model.model_name}</CTableDataCell>
                <CTableDataCell>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.name}</CTableDataCell>
                <CTableDataCell>{booking.customerDetails.mobile1}</CTableDataCell>
                <CTableDataCell>
                  {booking.chassisAllocationStatus === 'ALLOCATED' && booking.status === 'ALLOCATED' 
                    ? (booking.chassisNumber || '')
                    : ''
                  }
                </CTableDataCell>
                <CTableDataCell>{Math.round(booking.discountedAmount) || '0'}</CTableDataCell>
                <CTableDataCell>{Math.round(booking.receivedAmount) || '0'}</CTableDataCell>
                <CTableDataCell style={{ color: 'red' }}>{Math.round(booking.balanceAmount) || '0'}</CTableDataCell>
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </div>
  );
};

  const renderVerifiedListTable = () => {
    return (
      <div className="responsive-table-wrapper">
        <CTable striped bordered hover className='responsive-table'>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sr.no</CTableHeaderCell>
              <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Payment Mode</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Transaction Reference</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Verified By</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredVerifiedLedgerEntries.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="8" style={{ color: 'red', textAlign: 'center' }}>
                  {searchTerm ? 'No matching verified payments found' : 'No verified payments available'}
                </CTableDataCell>
              </CTableRow>
            ) : (
              filteredVerifiedLedgerEntries.map((entry, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{entry.booking || ''}</CTableDataCell>
                  <CTableDataCell>{entry.bookingDetails?.customerDetails?.name || ''}</CTableDataCell>
                  <CTableDataCell>{entry.paymentMode}</CTableDataCell>
                  <CTableDataCell>{entry.amount}</CTableDataCell>
                  <CTableDataCell>{entry.transactionReference}</CTableDataCell>
                  <CTableDataCell>{entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-GB') : ' '}</CTableDataCell>
                  <CTableDataCell>{entry.receivedByDetails?.name || ''}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
    {error}
      </div>
    );
  }

  return (
    <div>
      <div className='title'>Receipt Management</div>
      
      <CCard className='table-container mt-4'>
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 0}
                onClick={() => handleTabChange(0)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 0 ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none'
                }}
              >
                Customer
              </CNavLink>
            </CNavItem>
            {hasPermission(permissions,'LEDGER_VERIFY') && (
              <CNavItem>
                <CNavLink
                  active={activeTab === 1}
                  onClick={() => handleTabChange(1)}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 1 ? '4px solid #2759a2' : '3px solid transparent',
                    borderBottom: 'none',
                    color: 'black'
                  }}
                >
                  Payment Verification
                </CNavLink>
              </CNavItem>
            )}
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => handleTabChange(2)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 2 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Complete Payment
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => handleTabChange(3)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 3 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Pending List
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 4}
                onClick={() => handleTabChange(4)}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 4 ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Verified List
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 0}>
              {renderCustomerTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 1}>
              {renderPaymentVerificationTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              {renderCompletePaymentTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 3}>
              {renderPendingListTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 4}>
              {renderVerifiedListTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>

      <ReceiptModal show={showModal} onClose={() => setShowModal(false)} bookingData={selectedBooking} />
    </div>
  );
}

export default Receipt;

