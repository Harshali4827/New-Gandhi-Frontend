import React, { useState, useEffect } from 'react';
import '../../css/invoice.css';
import { CFormInput, CInputGroup, CInputGroupText, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCarAlt, cilPrint, cilReload } from '@coreui/icons';
import axiosInstance from '../../axiosInstance';
import '../../css/form.css';
import { Api } from '@mui/icons-material';

function HelmetInvoice() {
  const [formData, setFormData] = useState({
    chassisNumber: '',
    amount: ''
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Static values for helmet invoice
  const helmetStaticData = {
    particulars: 'TVS HELMET',
    hsnCode: '000000',
    quantity: 2,
    unitCost: 1500.00,
    taxableValue: 1271.20,
    cgstRate: 9,
    cgstAmount: 114.40,
    sgstRate: 9,
    sgstAmount: 114.40,
    totalTaxable: 1271.20,
    totalGST: 228.80,
    grandTotal: 1500.00,
    roundOff: 0.00,
    netTotal: 1500
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const fetchInvoiceDetails = async (chassisNumber) => {
    if (!chassisNumber) {
      setError('Please enter a chassis number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(`bookings/chassis/${chassisNumber}`);
      if (response.data.success) {
        setInvoiceData(response.data.data);
      } else {
        setError('No booking found for this chassis number');
        setInvoiceData(null);
      }
    } catch (err) {
      setError('Failed to fetch invoice details');
      setInvoiceData(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'chassisNumber') {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(
        setTimeout(() => {
          if (value.trim().length > 0) {
            fetchInvoiceDetails(value);
          } else {
            setInvoiceData(null);
            setError('');
          }
        }, 500)
      );
    }
  };

  const handleClear = () => {
    setFormData({ chassisNumber: '', amount: '' });
    setInvoiceData(null);
    setError('');
  };

  const generateHelmetInvoiceHTML = (data) => {
    const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-GB');

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Helmet Invoice</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .invoice-wrapper {
            width: 210mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .invoice-body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10mm;
            font-size: 12px;
            color: #000;
        }
        .header-container {
            display: flex;
            justify-content: space-between;
        }
        .left-header {
            display: flex;
            flex-direction: column;
        }
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-align: right;
            align-self: flex-start;
        }
        .info-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3mm;
        }
        .dealer-info, .customer-info {
            text-align: left;
            line-height: 1.2;
            font-size: 14px;
            width: 48%;
        }
        .divider {
            border-top: 2px solid #AAAAAA;
            margin: 1mm 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2mm 0;
            font-size: 12px;
        }
        th, td {
            border: none;
            padding: 1mm 2mm;
            text-align: left;
        }
        .table-border thead tr {
            border-bottom: 2px solid #AAAAAA;
        }
        .table-border tbody tr:nth-child(2) {
            border-top: 2px solid #AAAAAA;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .bold {
            font-weight: bold;
        }
        .part-details {
            margin-top: 5mm;
            font-size: 12px;
        }
        .signature {
            margin-top: 10mm;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }
        .last-text {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
        }
        .footer {
            margin-top: 5mm;
            font-size: 14px;
        }
        .logo {
            height: 70px;
        }
        @page {
            size: A4;
            margin: 0;
        }
        @media print {
            html, body {
                background: none;
                display: block;
            }
            .invoice-wrapper {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-wrapper">
        <div class="invoice-body">
            <div class="header-container">
                <div class="left-header">
                    <img src="https://c.ndtvimg.com/2025-01/t7f4o1kg_tvs_625x300_17_January_25.jpg?im=FaceCrop,algorithm=dnn,width=545,height=307" class="logo" alt="Dealer Logo">
                    <div>Invoice No: ${data.bookingNumber || '21731'}</div>
                    <div>Invoice Date: ${invoiceDate}</div>
                </div>
                <div class="invoice-title">TAX Invoice</div>
            </div>
        
            <div class="divider"></div>
        
            <div class="info-container">
                <div class="dealer-info">
                    <div class="bold">GANDHI MOTORS</div>
                    <div>'JOGPREET' ASHER ESTATE UPNAGAR, NASHIK ROAD, NASHIK 422101.</div>
                    <div>Phone:</div>
                    <div>GSTIN NO.-27AATC68896K1ZN</div>
                </div>
                <div class="customer-info">
                    <div>${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || ''}</div>
                    <div>Address: ${data.customerDetails.address || ''}</div>
                    <div>Mobile: ${data.customerDetails.mobile1 || ''}</div>
                    <div>Aadhar: ${data.customerDetails.aadharNumber || ''}</div>
                    <div>Bill Type: ${data.payment?.type || ''}</div>
                </div>
            </div>
        
            <div class="divider"></div>
        
            <table class="table-border">
                <thead>
                    <tr>
                        <th>Particulars</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>Unit Cost</th>
                        <th>Taxable</th>
                        <th>CGST%</th>
                        <th>CGST Amount</th>
                        <th>SGST%</th>
                        <th>SGST Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${helmetStaticData.particulars}</td>
                        <td>${helmetStaticData.hsnCode}</td>
                        <td class="text-right">${helmetStaticData.quantity}</td>
                        <td class="text-right">${helmetStaticData.unitCost.toFixed(2)}</td>
                        <td class="text-right">${helmetStaticData.taxableValue.toFixed(2)}</td>
                        <td class="text-right">${helmetStaticData.cgstRate.toFixed(0)}%</td>
                        <td class="text-right">${helmetStaticData.cgstAmount.toFixed(2)}</td>
                        <td class="text-right">${helmetStaticData.sgstRate.toFixed(0)}%</td>
                        <td class="text-right">${helmetStaticData.sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="bold">Total</td>
                        <td class="text-right bold">${helmetStaticData.totalTaxable.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${helmetStaticData.cgstAmount.toFixed(2)}</td>
                        <td class="text-right bold"></td>
                        <td class="text-right bold">${helmetStaticData.sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">GRAND TOTAL</td>
                        <td class="text-right bold">${helmetStaticData.grandTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" >ROUND OFF</td>
                        <td class="text-right">${helmetStaticData.roundOff >= 0 ? '+' : ''}${helmetStaticData.roundOff.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="8" class="text-right bold">NET TOTAL</td>
                        <td class="text-right bold">₹ ${helmetStaticData.netTotal}</td>
                    </tr>
                </tbody>
            </table>
        
            <div class="divider"></div>
            
            <table style="margin-top: 10mm;">
                <tr>
                    <td width="50%"><strong>Description</strong></td>
                    <td width="50%" class="text-right"><strong>Amount</strong></td>
                </tr>
                <tr>
                    <td>Total Taxable</td>
                    <td class="text-right">₹${helmetStaticData.totalTaxable.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total GST</td>
                    <td class="text-right">₹${helmetStaticData.totalGST.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Grand Total (${helmetStaticData.totalTaxable.toFixed(2)} + ${helmetStaticData.totalGST.toFixed(2)})</td>
                    <td class="text-right">₹${helmetStaticData.grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Round Off</td>
                    <td class="text-right">${helmetStaticData.roundOff >= 0 ? '+' : ''}${helmetStaticData.roundOff.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>NET TOTAL</strong></td>
                    <td class="text-right"><strong>₹ ${helmetStaticData.netTotal}</strong></td>
                </tr>
            </table>
        
            <div class="divider"></div>
            <table class="table-border">
                <thead>
                    <tr>
                        <th>PART DESCRIPTION</th>
                        <th>FRAME NO</th>
                        <th>ENGINE NO</th>
                        <th>CWI BOOKLET NO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${data.model?.model_name || ''}</td>
                        <td>${data.chassisNumber || ''}</td>
                        <td>${data.engineNumber || ''}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        
            <div class="footer">
                Message from Dealer:- Certified that goods covered by this bill suffered tax at hands of supplier. 
                Vehicle once sold shall not be taken back /replaced for any reason.
            </div>
        
            <div class="divider"></div>
        
            <div class="signature">
                <div>(${data.customerDetails.salutation || 'MR/Mrs/MS.'} ${data.customerDetails.name || ''})</div>
                <div class="bold">For (GANDHI MOTORS)<br> Authorised Signatory</div>
            </div>
            <div class="last-text">Subject To Nashik Jurisdiction</div>
            <div class="divider"></div>
        </div>
    </div>
</body>
</html>
  `;
  };

  const handlePrint = () => {
    if (!invoiceData) {
      setError('Please fetch invoice details first');
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generateHelmetInvoiceHTML(invoiceData));
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div className="invoice-container">
      <h4 className="mb-4">Invoice</h4>

      <div className="p-3">
        <h5>Helmet Invoice</h5>
        <CInputGroup className="mb-3">
          <CInputGroupText>
            <CIcon className="icon" icon={cilCarAlt} />
          </CInputGroupText>
          <CFormInput
            placeholder="Enter Chassis Number"
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleChange}
            disabled={loading}
          />
          {loading && (
            <CInputGroupText>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </CInputGroupText>
          )}
        </CInputGroup>

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="d-flex gap-2">
          <CButton className='submit-button' onClick={handlePrint}>
            <CIcon icon={cilPrint} className="me-2" />
            Print
          </CButton>
          <CButton className='cancel-button' onClick={handleClear} disabled={loading}>
            <CIcon icon={cilReload} className="me-2" />
            Clear
          </CButton>
        </div>
      </div>
    </div>
  );
}

export default HelmetInvoice;