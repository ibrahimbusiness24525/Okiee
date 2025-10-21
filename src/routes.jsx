import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';
import AuthGuard from './components/PrivateRoute/AuthGuard';

// Function to render routes with lazy loading
export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Element props={true} />
                  )}
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

// Route configuration
const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1')),
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1')),
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1')),
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard, // Use AuthGuard for protected routes
    routes: [
      {
        exact: 'true',
        path: '/*',
        element: lazy(() => import('./views/dashboard')),
      },
      {
        exact: 'true',
        path: '/todayBook',
        element: lazy(() => import('./views/dashboard/TodayBook/index')),
      },
      {
        exact: 'true',
        path: '/todayBook/pruchaseDetail/:id',
        element: lazy(
          () => import('./views/dashboard/TodayBook/PurchaseDetail')
        ),
      },
      {
        exact: 'true',
        path: '/todayBook/saleDetail/:id',
        element: lazy(() => import('./views/dashboard/TodayBook/SalesDetails')),
      },
      {
        exact: 'true',
        path: '/stockList',
        element: lazy(() => import('./views/dashboard/StockList')),
      },
      {
        exact: 'true',
        path: '/app/dashboard/newMobileList',
        element: lazy(() => import('./components/mobileCards/NewMobileList')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/bulkPhones',
        element: lazy(() => import('./components/mobileCards/BulkPhones')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/bulkPhoneDetail/:id',
        element: lazy(() => import('./components/mobileCards/BulkPhoneDetail')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/addAccessory',
        element: lazy(() => import('./components/mobileCards/AddAccessory')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/getCustomerRecord',
        element: lazy(() => import('./components/mobileCards/CustomerRecord')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/usedMobileList',
        element: lazy(() => import('./components/mobileCards/UsedMobileList')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/scanDeviceDetails',
        element: lazy(
          () => import('./components/mobileCards/ScanDeviceDetails')
        ), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/availablePhones',
        element: lazy(
          () => import('./components/mobileCards/DispachMobileList')
        ), // Available Phones
      },
      {
        exact: 'true',
        path: '/app/dashboard/DispachmobileList',
        element: lazy(
          () => import('./components/mobileCards/DispachMobileList')
        ), // Dispach Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/wallet',
        element: lazy(() => import('./components/Ledger/Wallet')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/PayablesAndReceivables',
        element: lazy(
          () => import('./components/Ledger/PayablesAndReceivables')
        ), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/PayablesAndReceivables/:id',
        element: lazy(
          () => import('./components/Ledger/PayablesAndReceivablesRecords')
        ), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/bankTransaction/:id',
        element: lazy(() => import('./components/Ledger/BankTransations')), // Mobile List
      },
      // {
      //   exact: 'true',
      //   path: '/app/dashboard/pocketCash',
      //   element: lazy(() => import('./components/Ledger/PocketCash')) // Mobile List
      // },
      {
        exact: 'true',
        path: '/app/dashboard/addLedger',
        element: lazy(() => import('./components/Ledger/AddLedger')), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/pocketCashTransactions/:id',
        element: lazy(
          () => import('./components/Ledger/PocketCashTransactions')
        ), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/partyLedger',
        element: lazy(() => import('./components/Ledger/PartyLedger')), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/balanceSheet',
        element: lazy(() => import('../src/views/dashboard/BalanceSheet')), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/partyLedger/:id',
        element: lazy(() => import('./components/Ledger/PartyLedgerDetail')), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/commetyLedger',
        element: lazy(() => import('./components/Ledger/CommetyLedger')), // Ledger
      },
      {
        exact: 'true',
        path: '/app/dashboard/ledgerRecords',
        element: lazy(() => import('./components/Ledger/LedgerRecords')), // Ledger Records
      },
      {
        exact: 'true',
        path: '/app/dashboard/ledgerRecords/:id',
        element: lazy(() => import('./components/Ledger/LedgerDetail')), // Ledger Records
      },
      {
        exact: 'true',
        path: '/app/dashboard/addUser',
        element: lazy(() => import('./layouts/AdminLayout/add-user/add-user')), // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/addShop',
        element: lazy(() => import('./layouts/AdminLayout/add-shop/add-shop')), // Mobile List
      },

      {
        exact: 'true',
        path: '/app/dashboard/mobile-details', // Updated path for mobile details
        element: lazy(
          () => import('../src/components/mobileCards/MobileDetails')
        ), // Mobile Details
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton')),
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges')),
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(
          () => import('./views/ui-elements/basic/BasicBreadcrumb')
        ),
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse')),
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills')),
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(
          () => import('./views/ui-elements/basic/BasicTypography')
        ),
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./components/mobileCards/NewMobileList')),
      },
      {
        exact: 'true',
        path: '/purchase/todayPurchase',
        element: lazy(() => import('./components/Purchase/TodayPurchase')),
      },
      {
        exact: 'true',
        path: '/purchase/purchaseRecords',
        element: lazy(() => import('./components/Purchase/PurchaseRecords')),
      },
      {
        exact: 'true',
        path: '/purchase/todayPurchase/:id',
        element: lazy(() => import('./components/Purchase/PurchaseDetail')),
      },
      {
        exact: 'true',
        path: '/purchase/purchaseRecords/:id',
        element: lazy(() => import('./components/Purchase/PurchaseDetail')),
      },
      {
        exact: 'true',
        path: '/purchase/todayPurchase/bulkPurchase/:id',
        element: lazy(() => import('./components/Purchase/BulkPurchaseDetail')),
      },
      {
        exact: 'true',
        path: '/purchase/purchaseRecords/bulkPurchase/:id',
        element: lazy(() => import('./components/Purchase/BulkPurchaseDetail')),
      },
      {
        exact: 'true',
        path: '/sales/todaySales/:id',
        element: lazy(() => import('./components/Sales/SalesDetail')),
      },
      {
        exact: 'true',
        path: '/sales/sales/:id',
        element: lazy(() => import('./components/Sales/SalesDetail')),
      },
      {
        exact: 'true',
        path: '/sales/todaySales',
        element: lazy(() => import('./components/Sales/TodaySales')),
      },
      {
        exact: 'true',
        path: '/sales/todayBulkSales/:id',
        element: lazy(() => import('./components/Sales/BulkSalesDetail')),
      },
      {
        exact: 'true',
        path: '/sales/BulkSales/:id',
        element: lazy(() => import('./components/Sales/BulkSalesDetail')),
      },
      {
        exact: 'true',
        path: '/subscription/paymentMethod',
        element: lazy(() => import('./components/Subscription/PaymentMethod')),
      },
      {
        exact: 'true',
        path: '/sales/saleInvoices',
        element: lazy(() => import('./components/Sales/SaleInvoices')),
      },
      {
        exact: 'true',
        path: '/sales/saleInvoices/:id',
        element: lazy(() => import('./components/Sales/SalesDetail')),
      },
      {
        exact: 'true',
        path: '/sales/bulkSaleInvoices/:id',
        element: lazy(() => import('./components/Sales/BulkSalesDetail')),
      },
      {
        exact: 'true',
        path: '/setup/shop',
        element: lazy(() => import('./components/ShopDetails/SetupShop')),
      },
      {
        exact: 'true',
        path: '/help/forsupport',
        element: lazy(() => import('./components/ForSupport/ForSupport')),
      },
      {
        exact: 'true',
        path: '/invoice/shop',
        element: lazy(() => import('./components/Invoice/SoldInvoice')),
      },
      {
        exact: 'true',
        path: '/invoice/accessory',
        element: lazy(() => import('./components/Invoice/AccessoryInvoice')),
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={'/'} />,
      },
    ],
  },
];

export default routes;
