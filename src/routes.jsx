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
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
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
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard, // Use AuthGuard for protected routes
    routes: [
      {
        exact: 'true',
        path: '/',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/mobileList',
        element: lazy(() => import('./components/mobileCards/MobileList')) // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/addUser',
        element: lazy(() => import('./layouts/AdminLayout/add-user/add-user')) // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/addShop',
        element: lazy(() => import('./layouts/AdminLayout/add-shop/add-shop')) // Mobile List
      },
      {
        exact: 'true',
        path: '/app/dashboard/mobile-details', // Updated path for mobile details
        element: lazy(() => import('../src/components/mobileCards/MobileDetails')) // Mobile Details
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./components/mobileCards/MobileList'))
      },
      {
        exact: 'true',
        path: '/sales/todaySales',
        element: lazy(() => import('./components/Sales/TodaySales'))
      },
      {
        exact: 'true',
        path: '/subscription/paymentMethod',
        element: lazy(() => import('./components/Subscription/PaymentMethod'))
      },
      {
        exact: 'true',
        path: '/sales/saleInvoices',
        element: lazy(() => import('./components/Sales/SaleInvoices'))
      },
      {
        exact: 'true',
        path: '/setup/shop',
        element: lazy(() => import('./components/ShopDetails/SetupShop'))
      },
      {
        exact: 'true',
        path: '/help/forsupport',
        element: lazy(() => import('./components/ForSupport/ForSupport'))
      },
      {
        exact: 'true',
        path: '/invoice/shop',
        element: lazy(() => import('./components/Invoice/SoldInvoice'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
