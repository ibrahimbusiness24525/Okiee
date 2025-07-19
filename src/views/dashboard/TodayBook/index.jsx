import { useEffect, useState } from 'react';
import Table from 'components/Table/Table';
import { dateFormatter } from 'utils/dateFormatter';
import { StyledHeading } from 'components/StyledHeading/StyledHeading';
import { Button } from '@mui/material';
import { Card } from 'react-bootstrap';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from '../../../constant/weather';
import { PieChart } from '@mui/x-charts/PieChart';
import { api } from '../../../../api/api';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  DollarSign,
  Smartphone,
  TrendingUp,
  Wallet,
  CreditCard,
  Receipt,
  ShoppingCart,
  Package,
  ShoppingBag,
  Boxes,
} from 'lucide-react';
import Modal from 'components/Modal/Modal';
const TodayBook = () => {
  const [todayBookData, setTodayBookData] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [date, setDate] = useState('');
  const [totalCash, setTotalCash] = useState(0);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [accessoryTransactions, setAccessoryTransactions] = useState([]); // Load your accessory data here

  const getTodayBook = async () => {
    try {
      const response = await api.get(`/api/dayBook/todayBook`, {
        params: { date },
      });

      setTodayBookData(response?.data?.data || []);
    } catch (error) { }
  };
  const fetchTotalCash = async () => {
    try {
      const res = await api.get('/api/pocketCash/total');
      setTotalCash(res.data.total);
    } catch (error) {
      console.error('Failed to fetch total cash:', error);
    }
  };
  const [accessoriesData, setAccessoryData] = useState({
    totalProfit: 0,
    totalSales: 0,
    totalPurchase: 0,
  });
  const getAccessoriesProfit = async () => {
    try {
      const response = await api.get('/api/accessory/data');

      setAccessoryData({
        totalProfit: response?.data?.totalProfit || 0,
        totalSales: response?.data?.totalSales || 0,
        totalPurchase: response?.data?.totalPurchase || 0,
      });
    } catch (error) {
      console.error('Error fetching accessories profit:', error);
    }
  };
  console.log('accessoriesData', accessoriesData);

  const getAllBanks = async () => {
    try {
      const response = await api.get('/api/banks/getAllBanks'); // your get all banks endpoint
      setBankData(response?.data?.banks); // Set the banks state with the fetched data
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };
  useEffect(() => {
    getAllBanks(); // Fetch all banks when the component mounts
    fetchTotalCash();
    getTodayBook();
    getAccessoriesProfit();
  }, []);

  const uniqueSoldBulkPhones = todayBookData?.soldBulkPhone
    ? Object.values(
      todayBookData.soldBulkPhone.reduce((acc, phone) => {
        acc[phone.bulkPhonePurchaseId] = phone; // override duplicates
        return acc;
      }, {})
    )
    : [];

  const totalPurchasePrice =
    (todayBookData?.purchasedSinglePhone?.reduce(
      (acc, phone) =>
        acc +
        (Number(phone.price?.purchasePrice) ||
          Number(phone.purchasePrice) ||
          0),
      0
    ) || 0) +
    (todayBookData?.purchaseBulkPhone?.reduce((price, phone) => {
      const phoneCount = phone?.ramSimDetails?.reduce((sum, ramSim) => {
        return sum + (ramSim?.imeiNumbers?.length || 0);
      }, 0);

      const perPhonePrice = Number(phone.prices?.buyingPrice) || 0;

      return price + perPhonePrice * phoneCount;
    }, 0) || 0);

  const uniqueBulkSales = new Map();

  const totalBulkSalePrice =
    todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
      if (!phone.bulkPhonePurchaseId) return acc;

      if (!uniqueBulkSales.has(phone.bulkPhonePurchaseId)) {
        uniqueBulkSales.set(phone.bulkPhonePurchaseId, true);
        return acc + (phone.salePrice || 0);
      }

      return acc;
    }, 0) || 0;
  console.log('todayBookData', todayBookData);

  // const totalInvoicesWithoutAccessory =
  //   (todayBookData?.soldSinglePhone?.reduce(
  //     (acc, phone) => acc + (phone.salePrice || 0),
  //     0
  //   ) || 0) +
  //   Number(
  //     todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
  //       if (!phone.bulkPhonePurchaseId) return acc;

  //       if (!uniqueBulkSales.has(phone.bulkPhonePurchaseId)) {
  //         uniqueBulkSales.set(phone.bulkPhonePurchaseId, true);
  //         // Calculate perimeter as total IMEI count for this bulk sale
  //         const imeiCount = Array.isArray(phone.imeiNumbers)
  //           ? phone.imeiNumbers.length
  //           : phone.ramSimDetails?.reduce(
  //               (sum, ramSim) => sum + (ramSim?.imeiNumbers?.length || 0),
  //               0
  //             ) || 1;
  //         // Multiply salePrice by perimeter (IMEI count)
  //         return acc + (phone.salePrice || 0) * imeiCount;
  //       }

  //       return acc;
  //     }, 0) || 0
  //   );
  const totalInvoicesWithoutAccessory =
    (todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (phone.salePrice || 0),
      0
    ) || 0) +
    Number(
      todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
        if (!phone.bulkPhonePurchaseId) {
          // If no bulkPhonePurchaseId, treat as single phone sale
          return acc + (phone.salePrice || 0);
        }

        if (!uniqueBulkSales.has(phone.bulkPhonePurchaseId._id)) {
          uniqueBulkSales.set(phone.bulkPhonePurchaseId._id, true);

          // Calculate perimeter based on IMEI count
          const imeiCount = Array.isArray(phone.imei1) ? phone.imei1.length : 1; // Default to 1 if not an array

          // Multiply salePrice by IMEI count (perimeter)
          return acc + (phone.salePrice || 0) * imeiCount;
        }

        return acc;
      }, 0) || 0
    );
  const totalInvoices =
    (todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (phone.totalInvoice || 0),
      0
    ) || 0) +
    (todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
      if (!phone.bulkPhonePurchaseId) return acc;

      if (!uniqueBulkSales.has(phone.bulkPhonePurchaseId)) {
        uniqueBulkSales.set(phone.bulkPhonePurchaseId, true);
        return acc + (phone.totalInvoice || 0);
      }

      return acc;
    }, 0) || 0);
  // Calculate total profit from soldSinglePhone and soldBulkPhone "profit" fields
  // Calculate total profit including accessories profit
  const profit =
    (todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (Number(phone.profit) || 0),
      0
    ) || 0) +
    (todayBookData?.soldBulkPhone?.reduce(
      (acc, phone) => acc + (Number(phone.profit) || 0),
      0
    ) || 0) +
    (Number(todayBookData?.totalAccessoriesProfit) || 0);
  console.log('todayBookData', todayBookData);

  // Calculate profit without accessories
  const profitWithoutAccessory =
    (todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (Number(phone.profit) || 0),
      0
    ) || 0) +
    (todayBookData?.soldBulkPhone?.reduce(
      (acc, phone) => acc + (Number(phone.profit) || 0),
      0
    ) || 0);
  // (todayBookData?.soldBulkPhone?.reduce((acc, phone) => acc + (phone.totalInvoice || 0), 0) || 0)

  const totalSingleSalePrice =
    todayBookData?.soldSinglePhone?.reduce(
      (acc, phone) => acc + (phone.salePrice || 0),
      0
    ) || 0;

  const totalSalesPrice = totalSingleSalePrice + totalBulkSalePrice;

  const extractedAccessoriesTotalProfile = 0;
  // const extractedAccessoriesTotalProfile = Math.max(0, (totalSalesPrice - totalPurchasePrice));

  // Calculate all metrics properly
  const totalProfit = totalInvoices - totalPurchasePrice;

  // Calculate accessories sales (from sold phones accessories)
  // const accessoriesSales =
  //   (todayBookData?.soldSinglePhone?.reduce((acc, phone) => {
  //     return (
  //       acc +
  //       (phone.accessories?.reduce((accAcc, accessory) => {
  //         return accAcc + (Number(accessory.price) || 0)
  //       }, 0) || 0)
  //     )
  //   }, 0) || 0) +
  //   (todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
  //     return (
  //       acc +
  //       (phone.accessories?.reduce((accAcc, accessory) => {
  //         return accAcc + (Number(accessory.price) || 0)
  //       }, 0) || 0)
  //     )
  //   }, 0) || 0)

  const accessoriesSales =
    // Single phone sales
    (todayBookData?.soldSinglePhone?.reduce((acc, phone) => {
      const phoneTotal =
        phone.accessories?.reduce((accAcc, accessory) => {
          return (
            accAcc +
            Number(accessory.price || 0) * Number(accessory.quantity || 1)
          );
        }, 0) || 0;
      return acc + phoneTotal;
    }, 0) || 0) +
    // Bulk phone sales (with unique bulkPhonePurchaseId check)
    (() => {
      const seenBulkIds = new Set();
      return (
        todayBookData?.soldBulkPhone?.reduce((acc, phone) => {
          if (seenBulkIds.has(phone.bulkPhonePurchaseId)) return acc;
          seenBulkIds.add(phone.bulkPhonePurchaseId);

          const phoneTotal =
            phone.accessories?.reduce((accAcc, accessory) => {
              return (
                accAcc +
                Number(accessory.price || 0) * Number(accessory.quantity || 1)
              );
            }, 0) || 0;

          return acc + phoneTotal;
        }, 0) || 0
      );
    })();

  // Calculate opening balance from banks
  const openingBalance =
    bankData?.reduce((acc, bank) => acc + (Number(bank.accountCash) || 0), 0) +
    totalCash || 0 + totalCash;
  const bankTotalBalance =
    bankData?.reduce((acc, bank) => acc + (Number(bank.accountCash) || 0), 0) ||
    0;

  // Calculate cash amount from ledger
  const cashAmount =
    todayBookData?.ledger?.reduce(
      (acc, entry) => acc + (Number(entry.openingCash) || 0),
      0
    ) || 0;
  const pocketCash = totalCash;
  // Calculate expenses from ledger
  const totalExpenses =
    todayBookData?.ledger?.reduce(
      (acc, entry) => acc + (Number(entry.expense) || 0),
      0
    ) || 0;

  // Calculate total amount (sales + opening balance - expenses)
  const totalAmount = totalInvoices + openingBalance - totalExpenses;

  const formatCurrency = (amount, pkr = true) => {
    return `${amount}${pkr ? ' PKR' : ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const metrics = [
    {
      title: 'Sales Profit',
      value: formatCurrency(profit.toFixed(0), false),
      icon: TrendingUp,
      color: totalProfit >= 0 ? '#16a34a' : '#dc2626', // green-600 or red-600
      bgColor: totalProfit >= 0 ? '#f0fdf4' : '#fef2f2', // green-50 or red-50
      route: '/reports/profit',
    },
    {
      title: 'Mobile Sales',
      value: formatCurrency(totalInvoicesWithoutAccessory.toFixed(0)),
      icon: Smartphone,
      color: '#2563eb', // blue-600
      bgColor: '#eff6ff', // blue-50
      route: '/sales',
    },
    {
      title: 'Accessories Transactions',
      value: formatCurrency(
        todayBookData?.totalAccesoriesTransactionLength,
        false
      ),
      icon: Package,
      color: '#7c3aed', // purple-600
      bgColor: '#f5f3ff', // purple-50
      route: '/sales/accessories',
    },
    {
      title: 'Accessories Profit',
      value: formatCurrency(todayBookData?.totalAccessoriesProfit && todayBookData?.totalAccessoriesProfit.toFixed(0), false),
      icon: Package,
      color: '#7c3aed', // purple-600
      bgColor: '#f5f3ff', // purple-50
      route: '/sales/accessories',
    },
    {
      title: 'Expenses',
      value: formatCurrency(totalExpenses.toFixed(0)),
      icon: Receipt,
      color: '#dc2626', // red-600
      bgColor: '#fef2f2', // red-50
      route: '/accounts/expenses',
    },
    {
      title: 'Opening Balance',
      value: formatCurrency(openingBalance.toFixed(0)),
      icon: Wallet,
      color: '#ea580c', // orange-600
      bgColor: '#fff7ed', // orange-50
      route: '/accounts/balance',
    },
    {
      title: 'Cash Amount',
      value: formatCurrency(pocketCash.toFixed(0)),
      icon: DollarSign,
      color: '#16a34a', // green-600
      bgColor: '#f0fdf4', // green-50
      route: '/accounts/cash',
    },
    {
      title: 'Bank Amount',
      value: formatCurrency(bankTotalBalance.toFixed(0)),
      icon: CreditCard,
      color: '#2563eb', // blue-600
      bgColor: '#eff6ff', // blue-50
      route: '/accounts/banks',
    },

    {
      title: 'Total Amount',
      value: formatCurrency(totalAmount.toFixed(0)),
      icon: DollarSign,
      color: '#059669', // emerald-600
      bgColor: '#ecfdf5', // emerald-50
      route: '/reports/total',
    },

    {
      title: 'Sale Track',
      icon: ShoppingBag, // 🛍️ For tracking sales
      color: '#059669', // emerald-600
      bgColor: '#ecfdf5', // emerald-50
      route: '/reports/total',
      extraInfo: [
        {
          label: 'Sold Single Phones',
          value: todayBookData?.soldSinglePhone?.length ?? 0,
        },
        {
          label: 'Sold Bulk Phones',
          value: todayBookData?.soldBulkPhone?.length ?? 0,
        },
      ],
    },
    {
      title: 'Purchase Track',
      icon: ShoppingCart, // 🛒 For tracking purchases
      color: '#059669',
      bgColor: '#ecfdf5',
      route: '/reports/total',
      extraInfo: [
        {
          label: 'Purchased Single Phones',
          value: todayBookData?.purchasedSinglePhone?.length ?? 0,
        },
        {
          label: 'Purchased Bulk Phones',
          value:
            todayBookData?.purchaseBulkPhone?.reduce((total, bulk) => {
              const count = bulk?.ramSimDetails?.reduce((sum, ramSim) => {
                return sum + (ramSim?.imeiNumbers?.length || 0);
              }, 0);
              return total + count;
            }, 0) ?? 0,
        },
      ],
    },
    {
      title: 'Total Stock',
      icon: Boxes, // 📦 Represents total inventory/stock
      // value: formatCurrency(
      //   (todayBookData?.purchaseBulkPhone?.length ?? 0) +
      //   (todayBookData?.purchasedSinglePhone?.length ?? 0)
      // ),
      value: formatCurrency(todayBookData?.totalStockCount || 0, false),
      color: '#059669',
      bgColor: '#ecfdf5',
      route: '/reports/total',
    },
    {
      title: 'Total Stock Amount',
      icon: Wallet, // 👛 For total financial value of the stock
      color: '#059669',
      // value: formatCurrency(totalPurchasePrice),
      value: formatCurrency(todayBookData?.totalStockAmount && todayBookData?.totalStockAmount?.toFixed(0) || 0),
      bgColor: '#ecfdf5',
      route: '/reports/total',
    },
    {
      title: 'Total Payables',
      icon: Wallet, // 👛 For total financial value of the stock
      color: '#059669',
      // value: formatCurrency(totalPurchasePrice),
      value: formatCurrency(todayBookData?.creditSummary?.totalPayable.toFixed(0) || 0),
      bgColor: '#ecfdf5',
      route: '/reports/total',
    },
    {
      title: 'Total Receivables',
      icon: Wallet, // 👛 For total financial value of the stock
      color: '#059669',
      // value: formatCurrency(totalPurchasePrice),
      value: formatCurrency(todayBookData?.creditSummary?.totalReceivable.toFixed(0) || 0),
      bgColor: '#ecfdf5',
      route: '/reports/total',
    },
  ];
  console.log('todayBookData', todayBookData);

  const [data, setData] = useState({
    totalPurchased: 1250,
    totalSold: 890,
    totalRemaining: 360,
  });

  // Simulate real-time updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData((prevData) => {
  //       const newSold = prevData.totalSold + Math.floor(Math.random() * 3)
  //       const newPurchased = prevData.totalPurchased + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0)
  //       const newRemaining = newPurchased - newSold

  //       return {
  //         totalPurchased: newPurchased,
  //         totalSold: newSold,
  //         totalRemaining: Math.max(0, newRemaining),
  //       }
  //     })
  //   }, 3000) // Update every 3 seconds

  //   return () => clearInterval(interval)
  // }, [])

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
  };

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  };

  const numberStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    lineHeight: '1',
    marginBottom: '8px',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const containerStyle = {
    minHeight: '20vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
    borderRadius: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '48px',
  };

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#e5e7eb',
    fontWeight: '400',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    width: '1200px',
    margin: '0 auto',
  };

  const statusDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'inline-block',
    marginRight: '8px',
    animation: 'pulse 2s infinite',
  };

  const liveIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '24px',
  };

  const navigation = useNavigate();
  const [showAccessoryTrackModal, setShowAccessoryTrackModal] = useState(false);
  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <Modal
        size="lg"
        show={showAccessoryTrackModal}
        toggleModal={() => setShowAccessoryTrackModal(!showAccessoryTrackModal)}
      >
        <div
          style={{
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#111827',
            }}
          >
            Track Accessory
          </h2>

          {todayBookData?.todayPersonsOfAccessories?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {todayBookData.todayPersonsOfAccessories.map((accessory) => (
                <li
                  key={accessory.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '16px',
                    color: '#374151',
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{accessory.accessoryName}</span>
                  <span style={{ color: '#10b981', fontWeight: '500' }}>
                    Profit {accessory.profit}PKR
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                fontSize: '16px',
                color: '#6b7280',
                backgroundColor: '#fef3c7',
                padding: '12px',
                borderRadius: '6px',
              }}
            >
              No accessories found for tracking.
            </p>
          )}
        </div>
      </Modal>

      <Modal
        size="lg"
        show={showProfitModal}
        onClose={() => setShowProfitModal(false)}
        toggleModal={() => setShowProfitModal(!showProfitModal)}
      >
        <div style={{ padding: '24px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#111827',
              textAlign: 'center',
            }}
          >
            Today's Profit Breakdown
          </h2>

          {/* Single Phone Profit */}
          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#374151',
              }}
            >
              Single Phone Sales
            </h3>
            {todayBookData?.soldSinglePhone?.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: '200px',
                  gap: '8px',
                  padding: '16px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                {todayBookData.soldSinglePhone.map((phone, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: `${Math.min(100, (phone.profit / Math.max(...todayBookData.soldSinglePhone.map((p) => p.profit))) * 100)}px`,
                        width: '24px',
                        backgroundColor: '#10b981',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                    <span
                      style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                      }}
                    >
                      {phone.profit?.toLocaleString() || '0'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                No single phone sales today
              </p>
            )}
          </div>

          {/* Bulk Phone Profit */}
          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#374151',
              }}
            >
              Bulk Phone Sales
            </h3>
            {todayBookData?.soldBulkPhone?.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: '200px',
                  gap: '8px',
                  padding: '16px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                {todayBookData.soldBulkPhone.map((phone, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: `${Math.min(100, (phone.profit / Math.max(1, ...todayBookData.soldBulkPhone.filter((p) => p.profit > 0).map((p) => p.profit))) * 100)}px`,
                        width: '24px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                    <span
                      style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                      }}
                    >
                      {phone.profit?.toLocaleString() || '0'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                No bulk phone sales today
              </p>
            )}
          </div>

          {/* Accessory Profit */}
          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#374151',
              }}
            >
              Accessory Sales
            </h3>
            {accessoriesData?.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${accessoriesData.totalProfit}%`,
                      backgroundColor: '#8b5cf6',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Total Profit:{' '}
                    {accessoriesData
                      .reduce((sum, t) => sum + (t.totalProfit || 0), 0)
                      .toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Total Sales:{' '}
                    {accessoriesData
                      .reduce((sum, t) => sum + (t.totalPrice || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                No accessory sales today
              </p>
            )}
          </div>

          {/* Summary Section */}
          <div
            style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#374151',
              }}
            >
              Today's Profit Summary
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Single Phones
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  {(
                    todayBookData?.soldSinglePhone?.reduce(
                      (sum, p) => sum + (p.profit || 0),
                      0
                    ) || 0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Bulk Phones
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#3b82f6',
                  }}
                >
                  {(
                    todayBookData?.soldBulkPhone?.reduce(
                      (sum, p) => sum + (p.profit || 0),
                      0
                    ) || 0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Accessories
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#8b5cf6',
                  }}
                >
                  {todayBookData?.totalAccessoriesProfit?.toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Total Profit
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                  }}
                >
                  {(
                    (todayBookData?.soldSinglePhone?.reduce(
                      (sum, p) => sum + (p.profit || 0),
                      0
                    ) || 0) +
                    (todayBookData?.soldBulkPhone?.reduce(
                      (sum, p) => sum + (p.profit || 0),
                      0
                    ) || 0) +
                    (todayBookData?.totalAccessoriesProfit || 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            margin: 0,
            flex: 1,
          }}
        >
          Today Book
        </h1>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            onChange={(e) => setDate(e.target.value)}
            type="date"
            value={date}
            name="date"
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: '#fff',
              color: '#333',
              cursor: 'pointer',
              minWidth: '160px',
            }}
          />
          <button
            onClick={getTodayBook}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#115293')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
          >
            Get
          </button>
        </div>
      </div>

      {/* Add these cards between your existing cards and pie chart */}
      <div className="responsive-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                cursor: 'pointer',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onClick={() => {
                if (metric.title === 'Accessories Profit') {
                  setShowAccessoryTrackModal(true);
                } else {
                  setShowProfitModal(true);
                }
              }}
              // onClick={() => (window.location.href = metric.route)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow =
                  '0 10px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#4b5563',
                        marginBottom: '8px',
                      }}
                    >
                      {metric.title}
                    </p>
                    <p
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: metric.color,
                        wordBreak: 'break-word',
                      }}
                    >
                      {metric.value}
                    </p>

                    {/* Optional Extra Info */}
                    {metric.extraInfo?.length > 0 &&
                      metric.extraInfo.map((info, idx) => (
                        <p
                          key={idx}
                          style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            marginTop: '4px',
                          }}
                        >
                          {info.label}: {info.value}
                        </p>
                      ))}
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '9999px',
                      backgroundColor: metric.bgColor,
                      marginLeft: '12px',
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      style={{
                        height: '24px',
                        width: '24px',
                        color: metric.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          width: '80%', // Adjust width
          maxWidth: '750px', // Prevents it from becoming too large
          backgroundColor: '#fff', // Card background
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Soft shadow effect
          borderRadius: '12px', // Rounded corners
          padding: '20px', // Padding inside card
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '145px auto', // Center it horizontally
        }}
      >
        <h3 style={{ marginBottom: '10px', color: '#333' }}>
          Today's Sales & Purchases
        </h3>
        <PieChart
          series={[
            {
              data: [
                {
                  id: 0,
                  value:
                    todayBookData?.purchasedSinglePhone?.reduce(
                      (acc, phone) =>
                        acc +
                        (Number(phone.price?.purchasePrice) ||
                          Number(phone.purchasePrice) ||
                          0),
                      0
                    ) || 0,
                  label: 'Today Single Purchase',
                },
                {
                  id: 1,
                  value:
                    todayBookData?.purchaseBulkPhone?.reduce(
                      (price, phone) =>
                        price + (Number(phone.prices?.buyingPrice) || 0),
                      0
                    ) || 0,
                  label: 'Today Bulk Purchase',
                },
                {
                  id: 2,
                  value:
                    todayBookData?.soldSinglePhone?.reduce(
                      (acc, phone) => acc + (phone.totalInvoice || 0),
                      0
                    ) || 0,
                  label: 'Today Single Sale',
                },
                {
                  id: 3,
                  value:
                    todayBookData?.soldBulkPhone?.reduce(
                      (acc, phone) => acc + (phone.totalInvoice || 0),
                      0
                    ) || 0,
                  label: 'Today Bulk Sale',
                },
              ],
            },
          ]}
          width={700}
          height={250}
        />
      </div>
      <div style={{ marginTop: '50px' }}></div>
      <StyledHeading>Today Ledger</StyledHeading>
      <Table
        array={todayBookData.ledger}
        keysToDisplay={[
          'openingCash',
          'cashPaid',
          'cashReceived',
          'expense',
          'closingCash',
          'createdAt',
        ]}
        label={[
          'Opening Cash',
          'Cash Paid',
          'Cash Received',
          'Expense',
          'Closing Cash',
          'Created At',
          // "Actions",
        ]}
        customBlocks={[
          {
            index: 5,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
      // extraColumns={[
      //     () => {
      //         return (
      //             <MdEdit

      //                 className="text-[#ccccc] text-[1.3rem]" />
      //         );
      //     },
      // ]}
      />
      <div style={{ marginTop: '50px' }}></div>
      <StyledHeading>Today Purchased Single Phones</StyledHeading>
      <Table
        routes={['/purchase/purchaseRecords']}
        array={todayBookData.purchasedSinglePhone}
        search={'imei1'}
        keysToDisplay={[
          'modelName',
          'companyName',
          'color',
          'phoneCondition',
          'warranty',
        ]}
        label={['Model Name', 'Company Name', 'Color', 'Condition', 'Warranty']}
      />
      <div style={{ marginTop: '50px' }}></div>
      <StyledHeading>Today Purchased Bulk Phones</StyledHeading>
      <Table
        routes={['/purchase/purchaseRecords/bulkPurchase']}
        array={todayBookData.purchaseBulkPhone}
        search={'imei1'}
        keysToDisplay={['partyName', 'status', 'createdAt']}
        label={['Party Name', 'Status', 'Date']}
        customBlocks={[
          {
            index: 2,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
      />
      <div style={{ marginTop: '50px' }}></div>
      <StyledHeading>Today Sold Single Phones</StyledHeading>
      <Table
        routes={['/sales/sales']}
        array={todayBookData.soldSinglePhone}
        search={'imei1'}
        keysToDisplay={[
          'customerName',
          'companyName',
          'sellingPaymentType',
          'purchasePrice',
          'salePrice',
          'saleDate',
        ]}
        label={[
          'Customer Name',
          'Company Name',
          'Selling Payment Type',
          'Purchase Price',
          'Sale Price',
          'Date Sold',
          'Profit/Loss',
        ]}
        customBlocks={[
          {
            index: 2,
            component: (sellingType) => {
              return sellingType ? sellingType : 'Not mentioned';
            },
          },
          {
            index: 4,
            component: (salePrice) => {
              return salePrice ? salePrice : 'Not Mentioned';
            },
          },
          {
            index: 5,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
        extraColumns={[
          (obj) => {
            const salePrice = Number(obj.salePrice) || 0;
            const purchasePrice = Number(obj.purchasePrice) || 0;
            const profitOrLoss = salePrice - purchasePrice;

            return (
              <p>
                {profitOrLoss < 0 ? `Loss of ${-profitOrLoss}` : profitOrLoss}
              </p>
            );
          },
        ]}
      />
      <div style={{ marginTop: '50px' }}></div>
      <StyledHeading>Today Sold Bulk Phones</StyledHeading>
      <Table
        routes={['/sales/BulkSales']}
        array={todayBookData.soldBulkPhone}
        search={'imei1'}
        keysToDisplay={[
          'sellingPaymentType',
          // "modelName",
          // "companyName",
          // "partyName",
          'salePrice',
          'sellingPaymentType',
          'warranty',
          'dateSold',
        ]}
        label={[
          // "Model Name",
          // "Company",
          // "Party Name",
          'Type of Sale',
          'Price',
          'Selling Payment Type',
          'Warranty',
          'Invoice Date',
        ]}
        customBlocks={[
          {
            index: 2,
            component: (sellingType) => {
              return sellingType ? sellingType : 'Not mentioned';
            },
          },
          {
            index: 4,
            component: (date) => {
              return dateFormatter(date);
            },
          },
        ]}
      />
    </div>
  );
};

export default TodayBook;
