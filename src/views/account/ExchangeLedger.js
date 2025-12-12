import '../../css/table.css';
import {
  React,
  useState,
  useEffect,
  Menu,
  MenuItem,
  useTableFilter,
  usePagination,
  axiosInstance,
  showError
} from '../../utils/tableImports';
import tvsLogo from '../../assets/images/logo.png';
import '../../css/invoice.css';
import config from '../../config';
import ExchangeLedgerModel from './ExchangeLedgerModel';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSettings,cilSearch, cilZoomOut } from '@coreui/icons';
import { hasPermission } from '../../utils/permissionUtils';

const ExchangeLedger = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedledger, setSelectedledger] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [expandedBrokers, setExpandedBrokers] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState('');

  const { data, setData, filteredData, setFilteredData, handleFilter } = useTableFilter([]);
  const { currentRecords, PaginationOptions } = usePagination(filteredData);

  const hasAddPermission = hasPermission('BROKER_LEDGER', 'CREATE');
  const hasViewPermission = hasPermission('BROKER_LEDGER', 'READ');
  const showActionColumn = hasAddPermission || hasViewPermission;

  useEffect(() => {
    fetchData();
    fetchBranches();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const grouped = groupDataByBroker(data, isFiltered);
      setGroupedData(grouped);
      setFilteredData(grouped);
    }
  }, [data, isFiltered]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get('/branches');
      setBranches(response.data.data);
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    }
  };

  const fetchData = async (branchId = null) => {
    try {
      setLoading(true);
      let url = '/broker-ledger/summary/detailed';
      if (branchId) {
        url = `/broker-ledger/summary/branch/${branchId}`;
      }

      const response = await axiosInstance.get(url);

      if (branchId) {
        const branchName = branches.find((b) => b._id === branchId)?.name || 'Selected Branch';
        setSelectedBranchName(branchName);

        const branchData = response.data.data.brokers.map((broker) => ({
          broker: broker.broker,
          branch: {
            _id: response.data.data.branch,
            name: branchName
          },
          bookings: {
            total: broker.totalBookings,
            details: []
          },
          financials: {
            totalExchangeAmount: broker.totalExchangeAmount,
            ledger: {
              currentBalance: broker.ledger.currentBalance,
              onAccount: broker.ledger.onAccount,
              totalCredit: broker.ledger.totalCredit || 0,
              totalDebit: broker.ledger.totalDebit || 0,
              outstandingAmount: broker.ledger.outstandingAmount || 0,
              transactions: broker.ledger.transactions || 0
            },
            summary: {
              totalReceived: broker.summary?.totalReceived || 0,
              totalPayable: broker.summary?.totalPayable || 0,
              netBalance: broker.ledger.currentBalance
            }
          },
          recentTransactions: [],
          association: {
            isActive: true
          }
        }));

        setData(branchData);
        setIsFiltered(true);
      } else {
        setData(response.data.data.brokers);
        setIsFiltered(false);
        setSelectedBranchName('');
      }
    } catch (error) {
      const message = showError(error);
      if (message) {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBranchFilter = async () => {
    if (selectedBranch) {
      await fetchData(selectedBranch);
    } else {
      await fetchData();
    }
    setShowFilterModal(false);
  };

  const clearFilter = async () => {
    setSelectedBranch('');
    await fetchData();
    setShowFilterModal(false);
  };

  const groupDataByBroker = (brokersData, isFilteredMode = false) => {
    const brokerMap = {};

    brokersData.forEach((item) => {
      const brokerId = item.broker._id;

      if (!brokerMap[brokerId]) {
        brokerMap[brokerId] = {
          broker: item.broker,
          branches: [],
          totalBookings: 0,
          totalExchangeAmount: 0,
          totalCredit: 0,
          totalDebit: 0,
          onAccount: 0,
          currentBalance: 0,
          outstandingAmount: 0
        };
      }

      if (isFilteredMode) {
        brokerMap[brokerId].branches = [
          {
            name: item.branch.name,
            branchId: item.branch._id,
            bookings: item.bookings.total,
            exchangeAmount: item.financials.totalExchangeAmount,
            credit: item.financials.ledger.totalCredit,
            debit: item.financials.ledger.totalDebit,
            onAccount: item.financials.ledger.onAccount,
            currentBalance: item.financials.ledger.currentBalance,
            outstandingAmount: item.financials.ledger.outstandingAmount
          }
        ];

        brokerMap[brokerId].totalBookings = item.bookings.total;
        brokerMap[brokerId].totalExchangeAmount = item.financials.totalExchangeAmount;
        brokerMap[brokerId].totalCredit = item.financials.ledger.totalCredit;
        brokerMap[brokerId].totalDebit = item.financials.ledger.totalDebit;
        brokerMap[brokerId].onAccount = item.financials.ledger.onAccount;
        brokerMap[brokerId].currentBalance = item.financials.ledger.currentBalance;
        brokerMap[brokerId].outstandingAmount = item.financials.ledger.outstandingAmount;
      } else {
        brokerMap[brokerId].branches.push({
          name: item.branch.name,
          branchId: item.branch._id,
          bookings: item.bookings.total,
          exchangeAmount: item.financials.totalExchangeAmount,
          credit: item.financials.ledger.totalCredit,
          debit: item.financials.ledger.totalDebit,
          onAccount: item.financials.ledger.onAccount,
          currentBalance: item.financials.ledger.currentBalance,
          outstandingAmount: item.financials.ledger.outstandingAmount
        });

        brokerMap[brokerId].totalBookings += item.bookings.total;
        brokerMap[brokerId].totalExchangeAmount += item.financials.totalExchangeAmount;
        brokerMap[brokerId].totalCredit += item.financials.ledger.totalCredit;
        brokerMap[brokerId].totalDebit += item.financials.ledger.totalDebit;
        brokerMap[brokerId].onAccount += item.financials.ledger.onAccount;
        brokerMap[brokerId].currentBalance += item.financials.ledger.currentBalance;
        brokerMap[brokerId].outstandingAmount += item.financials.ledger.outstandingAmount;
      }
    });

    return Object.values(brokerMap);
  };

  const toggleBrokerExpansion = (brokerId) => {
    if (!isFiltered) {
      setExpandedBrokers((prev) => ({
        ...prev,
        [brokerId]: !prev[brokerId]
      }));
    }
  };

  const handleClick = (event, id, brokerData = null, branchId = null) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
    if (brokerData) {
      setSelectedledger({ ...brokerData, branchId });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleAddClick = (brokerData, branchId = null) => {
    setSelectedledger({ ...brokerData, branchId });
    setShowModal(true);
    handleClose();
  };

  const handleViewLedger = async (brokerData, branchId = null) => {
    try {
      let url = `/broker-ledger/statement/${brokerData.broker?._id}`;
      if (branchId) {
        url += `?branchId=${branchId}`;
      }

      const res = await axiosInstance.get(url);
      const ledgerData = res.data.data;
      const ledgerUrl = `${config.baseURL}/brokerData.html?ledgerId=${brokerData._id}`;
      let totalCredit = 0;
      let totalDebit = 0;
      const totalOnAccount = ledgerData.summary?.totalOnAccount ?? ledgerData.onAccountBalance ?? 0;

      ledgerData.transactions?.forEach((entry) => {
        if (entry.type === 'CREDIT') {
          totalCredit += entry.amount;
        } else if (entry.type === 'DEBIT') {
          totalDebit += entry.amount;
        }
      });
      const finalBalance = totalDebit - totalCredit;
      const availableOnAccount2 = totalOnAccount - totalCredit;

      const win = window.open('', '_blank');
      win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Customer Ledger</title>
              <style>
                @page {
                  size: A4;
                  margin: 15mm 10mm;
                }
                body {
                  font-family: Arial;
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  font-size: 14px;
                  line-height: 1.3;
                  font-family: Courier New;
                }
                .container {
                  width: 190mm;
                  margin: 0 auto;
                  padding: 5mm;
                }
                .header-container {
                  display: flex;
                  justify-content:space-between;
                  margin-bottom: 3mm;
                }
                .header-text{
                  font-size:20px;
                  font-weight:bold;
                }
                .logo {
                  width: 30mm;
                  height: auto;
                  margin-right: 5mm;
                }
                .header {
                  text-align: left;
                }
                .divider {
                  border-top: 2px solid #AAAAAA;
                  margin: 3mm 0;
                }
                .header h2 {
                  margin: 2mm 0;
                  font-size: 12pt;
                  font-weight: bold;
                }
                .header div {
                  font-size: 14px;
                }
                .customer-info {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 2mm;
                  margin-bottom: 5mm;
                  font-size: 14px;
                }
                .customer-info div {
                  display: flex;
                }
                .customer-info strong {
                  min-width: 30mm;
                  display: inline-block;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 5mm;
                  font-size: 14px;
                  page-break-inside: avoid;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 2mm;
                  text-align: left;
                }
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 10mm;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  font-size: 14px;
                }
                .footer-left {
                  text-align: left;
                }
                .footer-right {
                  text-align: right;
                }
                .qr-code {
                  width: 35mm;
                  height: 35mm;
                }
                .text-right {
                  text-align: right;
                }
                .text-left {
                  text-align: left;
                }
                .text-center {
                  text-align: center;
                }
                @media print {
                  body {
                    width: 190mm;
                    height: 277mm;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header-container">
                  <img src="${tvsLogo}" class="logo" alt="TVS Logo">
                  <div class="header-text"> GANDHI TVS</div>
                </div>
                <div class="header">
                  <div>
                    Authorised Main Dealer: TVS Motor Company Ltd.<br>
                    Registered office: 'JOGPREET' Asher Estate, Near Ichhamani Lawns,<br>
                    Upnagar, Nashik Road, Nashik - 422101<br>
                    Phone: 7498903672
                  </div>
                </div>
                <div class="divider"></div>
                <div class="customer-info">
                  <div><strong>Broker Name:</strong> ${ledgerData.broker?.name || ''}</div>
                  <div><strong>Ledger Date:</strong> ${ledgerData.ledgerDate || new Date().toLocaleDateString('en-GB')}</div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th width="15%">Date</th>
                      <th width="35%">Description</th>
                      <th width="15%">Receipt/VC No</th>
                      <th width="10%" class="text-right">Credit (₹)</th>
                      <th width="10%" class="text-right">Debit (₹)</th>
                      <th width="15%" class="text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ledgerData.transactions
                      ?.map(
                        (entry) => `
                      <tr>
                        <td>${new Date(entry.date).toLocaleDateString()}</td>
                        <td>
                          Booking No: ${entry.booking?.bookingNumber || '-'}<br>
                           Customer: ${entry.booking?.customerName || '-'}<br>
                           Chassis Number:${entry.booking?.chassisNumber || '-'}
                           ${entry.mode}
                        </td>
                        <td>${entry.referenceNumber || ''}</td>
                       <td class="text-right">${entry.type === 'CREDIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
                       <td class="text-right">${entry.type === 'DEBIT' ? entry.amount.toLocaleString('en-IN') : '-'}</td>
                       <td class="text-right">

                       </td>
                      </tr>
                    `
                      )
                      .join('')}
                      <tr>
                      <td colspan="3" class="text-left"><strong>Total OnAccount</strong></td>
                      <td class="text-right"></td>
                      <td class="text-right"></td>
                      <td class="text-right"><strong>${availableOnAccount2.toLocaleString('en-IN')}</strong></td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-left"><strong>Total</strong></td>
                      <td class="text-right"><strong>${totalCredit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${totalDebit.toLocaleString('en-IN')}</strong></td>
                      <td class="text-right"><strong>${finalBalance.toLocaleString('en-IN')}</strong></td>
                    </tr>

                  </tbody>
                </table>

                <div class="footer">
                  <div class="footer-left">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ledgerUrl)}"
                         class="qr-code"
                         alt="QR Code" />
                  </div>
                  <div class="footer-right">
                    <p>For, Gandhi TVS</p>
                    <p>Authorised Signatory</p>
                  </div>
                </div>
              </div>

              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                  }, 300);
                };
              </script>
            </body>
          </html>
        `);
    } catch (err) {
      console.error('Error fetching ledger:', err);
      setError('Failed to load ledger. Please try again.');
    }
    handleClose();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    handleFilter(value, ['broker.name']);
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
      <div className='title'>Exchange Ledger {isFiltered && `- ${selectedBranchName}`}</div>
    
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setShowFilterModal(true)}
            >
              <CIcon icon={cilSearch} className='me-1' />
              Search
            </CButton>
            {isFiltered && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={clearFilter}
              >
                <CIcon icon={cilZoomOut} className='me-1' />
                Clear Filter
              </CButton>
            )}
          </div>
        </CCardHeader>
        
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  {!isFiltered && <CTableHeaderCell></CTableHeaderCell>}
                  <CTableHeaderCell>Sr.no</CTableHeaderCell>
                  <CTableHeaderCell>Exchange Broker Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile</CTableHeaderCell>
                  {!isFiltered && <CTableHeaderCell>Branch</CTableHeaderCell>}
                  <CTableHeaderCell>Total Bookings</CTableHeaderCell>
                  <CTableHeaderCell>Total Exchange Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Received</CTableHeaderCell>
                  <CTableHeaderCell>Total Payable</CTableHeaderCell>
                  <CTableHeaderCell>Opening Balance</CTableHeaderCell>
                  <CTableHeaderCell>Current Balance</CTableHeaderCell>
                  <CTableHeaderCell>Outstanding Amount</CTableHeaderCell>
                  {showActionColumn && <CTableHeaderCell>Actions</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentRecords.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={isFiltered ? 11 : 12} className="text-center">
                      No ledger details available
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentRecords.map((brokerData, index) => (
                    <>
                      <CTableRow key={brokerData.broker._id} className="broker-summary-row">
                        {!isFiltered && (
                          <CTableDataCell>
                            <CButton
                              color="link"
                              size="sm"
                              onClick={() => toggleBrokerExpansion(brokerData.broker._id)}
                            >
                              {expandedBrokers[brokerData.broker._id] ? '▼' : '►'}
                            </CButton>
                          </CTableDataCell>
                        )}
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{brokerData.broker.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{brokerData.broker.mobile || 'N/A'}</CTableDataCell>
                        {!isFiltered && <CTableDataCell>All Branches</CTableDataCell>}
                        <CTableDataCell>{brokerData.totalBookings}</CTableDataCell>
                        <CTableDataCell>{brokerData.totalExchangeAmount.toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>{brokerData.totalCredit.toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>{brokerData.totalDebit.toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>{brokerData.onAccount.toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>{brokerData.currentBalance.toLocaleString('en-IN')}</CTableDataCell>
                        <CTableDataCell>{brokerData.outstandingAmount.toLocaleString('en-IN')}</CTableDataCell>
                        {showActionColumn && (
                          <CTableDataCell>
                            <CButton
                              size="sm"
                              className='option-button btn-sm'
                              onClick={(event) => handleClick(event, brokerData.broker._id, brokerData)}
                            >
                              <CIcon icon={cilSettings} />
                              Options
                            </CButton>
                            <Menu
                              id={`action-menu-${brokerData.broker._id}`}
                              anchorEl={anchorEl}
                              open={menuId === brokerData.broker._id}
                              onClose={handleClose}
                            >
                              {hasPermission('BROKER_LEDGER', 'CREATE') && (
                                <MenuItem onClick={() => handleAddClick(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}>
                                  <CIcon icon={cilPlus} className="me-2" />
                                  Add Payment
                                </MenuItem>
                              )}
                              {hasPermission('BROKER_LEDGER', 'CREATE') && (
                                <MenuItem
                                  onClick={() => handleViewLedger(brokerData, isFiltered ? brokerData.branches[0]?.branchId : null)}
                                >
                                  View Ledger
                                </MenuItem>
                              )}
                            </Menu>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                      {!isFiltered &&
                        expandedBrokers[brokerData.broker._id] &&
                        brokerData.branches.map((branch, branchIndex) => (
                          <CTableRow key={`${brokerData.broker._id}-${branch.branchId}`} className="branch-detail-row">
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell>{branch.name}</CTableDataCell>
                            <CTableDataCell>{branch.bookings}</CTableDataCell>
                            <CTableDataCell>{branch.exchangeAmount.toLocaleString('en-IN')}</CTableDataCell>
                            <CTableDataCell>{branch.credit.toLocaleString('en-IN')}</CTableDataCell>
                            <CTableDataCell>{branch.debit.toLocaleString('en-IN')}</CTableDataCell>
                            <CTableDataCell>{branch.onAccount.toLocaleString('en-IN')}</CTableDataCell>
                            <CTableDataCell>{branch.currentBalance.toLocaleString('en-IN')}</CTableDataCell>
                            <CTableDataCell>{branch.outstandingAmount.toLocaleString('en-IN')}</CTableDataCell>
                            {showActionColumn && (
                              <CTableDataCell>
                                <CButton
                                  size="sm"
                                  className='option-button btn-sm'
                                  onClick={(event) =>
                                    handleClick(event, `${brokerData.broker._id}-${branch.branchId}`, brokerData, branch.branchId)
                                  }
                                >
                                  <CIcon icon={cilSettings} />
                                  Options
                                </CButton>
                                <Menu
                                  id={`action-menu-${brokerData.broker._id}-${branch.branchId}`}
                                  anchorEl={anchorEl}
                                  open={menuId === `${brokerData.broker._id}-${branch.branchId}`}
                                  onClose={handleClose}
                                >
                                  {hasAddPermission && (
                                    <MenuItem onClick={() => handleAddClick(brokerData, branch.branchId)}>
                                      <CIcon icon={cilPlus} className="me-2" />
                                      Add Payment
                                    </MenuItem>
                                  )}
                                  {hasViewPermission && (
                                    <MenuItem onClick={() => handleViewLedger(brokerData, branch.branchId)}>
                                      View Ledger
                                    </MenuItem>
                                  )}
                                </Menu>
                              </CTableDataCell>
                            )}
                          </CTableRow>
                        ))}
                    </>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={showFilterModal} onClose={() => setShowFilterModal(false)}>
        <CModalHeader>
          <CModalTitle>Search</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Select Branch</CFormLabel>
            <CFormSelect value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleBranchFilter}>
           Search
          </CButton>
        </CModalFooter>
      </CModal>
      <ExchangeLedgerModel show={showModal} onClose={() => setShowModal(false)} brokerData={selectedledger} refreshData={fetchData} />
    </div>
  );
};

export default ExchangeLedger;