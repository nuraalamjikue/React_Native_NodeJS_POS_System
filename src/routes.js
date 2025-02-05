import React from 'react'


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const product = React.lazy(() => import('./views/base/Product/product'))
const Category = React.lazy(() => import('./views/base/Category/Category'))
const sales = React.lazy(() => import('./views/base/Sales/sales'))
const userstatus = React.lazy(() => import('./views/base/userstatus/userstatus'))
const Daily_Sales_Report = React.lazy(() => import('./views/base/Report/Daily_Sales_Report'))


//Forms
//const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },


  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/Category/Category', name: 'Category', element: Category },
  { path: '/base/Product/product', name: 'product', element: product },
  { path: '/base/Sales/sales', name: 'sales', element: sales },
  { path: '/base/userstatus/userstatus', name: 'userstatus', element: userstatus },
  { path: '/base/Report/Daily_Sales_Report', name: 'Daily_Sales_Report', element: Daily_Sales_Report },


  //{ path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
