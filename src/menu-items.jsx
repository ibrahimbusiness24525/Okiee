const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Okiiee',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: ''
        },
      ]
    },
    {
      id: 'adduser',
      title: 'Okiiee Corner',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'adduser',
          title: 'Add New Shop',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/addUser'
        },
        {
          id: 'shop',
          title: 'Shop Records',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/addShop'
        }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile Stocks',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'mobile',
          title: 'New Phones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/newMobileList'
        },
        {
          id: 'mobile',
          title: 'Bulk Phones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/bulkPhones'
        },
        {
          id: 'mobile',
          title: 'Used Phones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/usedMobileList'
        },
        {
          id: 'mobile',
          title: 'Scan Device Details',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/scanDeviceDetails'
        },
        {
          id: 'mobile',
          title: 'Dispatch Phones',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/DispachmobileList'
        },
        {
          id: 'mobile',
          title: 'Get Customer Record',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/getCustomerRecord'
        },
      ]
    },
    {
      id: 'mobile',
      title: 'Ledger',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'mobile',
          title: 'My Wallet',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/wallet'
        },
        // {
        //   id: 'mobile',
        //   title: 'Pocket Cash',
        //   type: 'item',
        //   icon: 'feather icon-server',
        //   url: '/app/dashboard/pocketCash'
        // },
        {
          id: 'mobile',
          title: 'Shop Ledger',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/addLedger'
        },
        {
          id: 'mobile',
          title: 'Party Ledger',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/partyLedger'
        },
        {
          id: 'mobile',
          title: 'Commety Ledger',
          type: 'item',
          icon: 'feather icon-server',
          url: '/app/dashboard/commetyLedger'
        },
        {
          id: 'mobile',
          title: 'Ledger Records',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/app/dashboard/ledgerRecords'
        },
      ]
    },
    {
      id: 'ui-forms',
      title: 'Shop Details',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'My Shop',
          type: 'item',
          icon: 'feather icon-server',
          url: '/setup/shop'
        },
        {
          id: 'tabel',
          title: 'Shop Invoice',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/invoice/shop'
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'Purchase',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Today Purchase',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/purchase/todayPurchase'
        },
        {
          id: 'tabel',
          title: 'Purchase Records',
          type: 'item',
          icon: 'feather icon-server',
          url: '/purchase/purchaseRecords'
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'Sales',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Today Sale',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/sales/todaySales'
        },
        {
          id: 'tabel',
          title: 'Sale Records',
          type: 'item',
          icon: 'feather icon-server',
          url: '/sales/saleInvoices'
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'Subscription',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Payment Methods',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/subscription/paymentMethod'
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'Help',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'For Support',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/help/forsupport'
        }
      ]
    }
    // {
    //   id: 'ui-element',
    //   title: 'UI ELEMENT',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'component',
    //       title: 'Component',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'Button',
    //           type: 'item',
    //           url: '/basic/button'
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Badges',
    //           type: 'item',
    //           url: '/basic/badges'
    //         },
    //         {
    //           id: 'breadcrumb',
    //           title: 'Breadcrumb & Pagination',
    //           type: 'item',
    //           url: '/basic/breadcrumb-paging'
    //         },
    //         {
    //           id: 'collapse',
    //           title: 'Collapse',
    //           type: 'item',
    //           url: '/basic/collapse'
    //         },
    //         {
    //           id: 'tabs-pills',
    //           title: 'Tabs & Pills',
    //           type: 'item',
    //           url: '/basic/tabs-pills'
    //         },
    //         {
    //           id: 'typography',
    //           title: 'Typography',
    //           type: 'item',
    //           url: '/basic/typography'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'ui-forms',
    //   title: 'FORMS & TABLES',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'forms',
    //       title: 'Form Elements',
    //       type: 'item',
    //       icon: 'feather icon-file-text',
    //       url: '/forms/form-basic'
    //     },
    //     {
    //       id: 'table',
    //       title: 'Table',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/tables/bootstrap'
    //     }
    //   ]
    // },
    // {
    //   id: 'chart-maps',
    //   title: 'Chart & Maps',
    //   type: 'group',
    //   icon: 'icon-charts',
    //   children: [
    //     {
    //       id: 'charts',
    //       title: 'Charts',
    //       type: 'item',
    //       icon: 'feather icon-pie-chart',
    //       url: '/charts/nvd3'
    //     },
    //     {
    //       id: 'maps',
    //       title: 'Maps',
    //       type: 'item',
    //       icon: 'feather icon-map',
    //       url: '/maps/google-map'
    //     }
    //   ]
    // },
    // {
    //   id: 'pages',
    //   title: 'Pages',
    //   type: 'group',
    //   icon: 'icon-pages',
    //   children: [
    //     {
    //       id: 'auth',
    //       title: 'Authentication',
    //       type: 'collapse',
    //       icon: 'feather icon-lock',
    //       badge: {
    //         title: 'New',
    //         type: 'label-danger'
    //       },
    //       children: [
    //         {
    //           id: 'signup-1',
    //           title: 'Sign up',
    //           type: 'item',
    //           url: '/auth/signup-1',
    //           target: true,
    //           breadcrumbs: false
    //         },
    //         {
    //           id: 'signin-1',
    //           title: 'Sign in',
    //           type: 'item',
    //           url: '/auth/signin-1',
    //           target: true,
    //           breadcrumbs: false
    //         }
    //       ]
    //     },
    //     {
    //       id: 'sample-page',
    //       title: 'Sample Page',
    //       type: 'item',
    //       url: '/sample-page',
    //       classes: 'nav-item',
    //       icon: 'feather icon-sidebar'
    //     },
    //     {
    //       id: 'documentation',
    //       title: 'Documentation',
    //       type: 'item',
    //       icon: 'feather icon-book',
    //       classes: 'nav-item',
    //       url: "",
    //       target: true,
    //       external: true
    //     },
    //     {
    //       id: 'menu-level',
    //       title: 'Menu Levels',
    //       type: 'collapse',
    //       icon: 'feather icon-menu',
    //       children: [
    //         {
    //           id: 'menu-level-1.1',
    //           title: 'Menu Level 1.1',
    //           type: 'item',
    //           url: '#!'
    //         },
    //         {
    //           id: 'menu-level-1.2',
    //           title: 'Menu Level 2.2',
    //           type: 'collapse',
    //           children: [
    //             {
    //               id: 'menu-level-2.1',
    //               title: 'Menu Level 2.1',
    //               type: 'item',
    //               url: '#'
    //             },
    //             {
    //               id: 'menu-level-2.2',
    //               title: 'Menu Level 2.2',
    //               type: 'collapse',
    //               children: [
    //                 {
    //                   id: 'menu-level-3.1',
    //                   title: 'Menu Level 3.1',
    //                   type: 'item',
    //                   url: '#'
    //                 },
    //                 {
    //                   id: 'menu-level-3.2',
    //                   title: 'Menu Level 3.2',
    //                   type: 'item',
    //                   url: '#'
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       id: 'disabled-menu',
    //       title: 'Disabled Menu',
    //       type: 'item',
    //       url: '#',
    //       classes: 'nav-item disabled',
    //       icon: 'feather icon-power'
    //     }
    //   ]
    // }
  ]
};

export default menuItems;
