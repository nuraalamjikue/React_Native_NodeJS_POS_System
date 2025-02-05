import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// Helper function to filter navigation items based on user role
const filterNavByRole = (navItems, role) => {
  return navItems
    .filter(item => hasRolePermission(item, role)) // Filter based on role permissions
    .map(item => {
      if (item.items) {
        return { ...item, items: filterNavByRole(item.items, role) }; // Recursive filtering for groups
      }
      return item;
    });
};

// Check if the current item has role-based restrictions
const hasRolePermission = (item, role) => {
  // If the item has the `rolesAllowed` property, check if the role is allowed
  if (item.rolesAllowed) {
    return item.rolesAllowed.includes(role);
  }
  // If no role restrictions are set, include the item
  return true;
};

// Define the navigation items with role-based permissions
const navigationItems = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    rolesAllowed: ['admin', 'user'],
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Product',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Category',
        to: '/base/Category/Category',
        rolesAllowed: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Product',
        to: '/base/Product/product',
        rolesAllowed: ['admin'],
      },
      {
        component: CNavItem,
        name: 'Sales',
        to: '/base/sales/sales',
        rolesAllowed: ['admin', 'user'],
      },
      {
        component: CNavItem,
        name: 'Language Change',
        to: '/base/language/languageChange',
        rolesAllowed: ['admin'],
      },
      // {
      //   component: CNavItem,
      //   name: 'Breadcrumb',
      //   to: '/base/breadcrumbs',
      //   rolesAllowed: ['admin'],
      // },
      // {
      //   component: CNavItem,
      //   name: 'Cards',
      //   to: '/base/cards',
      //   rolesAllowed: ['admin'],
      // },
      // {
      //   component: CNavItem,
      //   name: 'Carousel',
      //   to: '/base/carousels',
      //   rolesAllowed: ['admin'],
      // },
      {
        component: CNavItem,
        name: 'userstatus',
        to: '/base/userstatus/userstatus',
        rolesAllowed: ['admin'],
      },
      // {
      //   component: CNavItem,
      //   name: 'Daily Sales Report',
      //   to: '/base/Report/Daily_Sales_Report',
      //   rolesAllowed: ['admin'],
      // },




    ],
  },

  {
    component: CNavGroup,
    name: 'Report',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [


      {
        component: CNavItem,
        name: 'Daily Sales Report',
        to: '/base/Report/Daily_Sales_Report',
        rolesAllowed: ['admin'],
      },




    ],
  },
];

// Get the user's role from localStorage, default to 'user' if not set
const userRole = localStorage.getItem('roleId') || 'user';

// console.log('User role:', userRole);

// Filter navigation items based on the user's role
const filteredNav = filterNavByRole(navigationItems, userRole);

export default filteredNav;
