// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'

// import {
//   CCloseButton,
//   CSidebar,
//   CSidebarBrand,
//   CSidebarFooter,
//   CSidebarHeader,
//   CSidebarToggler,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'

// import { AppSidebarNav } from './AppSidebarNav'

// import { logo } from 'src/assets/brand/logo'
// import { sygnet } from 'src/assets/brand/sygnet'

// // sidebar nav config
// import navigation from '../_nav'

// const AppSidebar = () => {
//   const dispatch = useDispatch()
//   const unfoldable = useSelector((state) => state.sidebarUnfoldable)
//   const sidebarShow = useSelector((state) => state.sidebarShow)

//   return (
//     <CSidebar
//       className="border-end"
//       colorScheme="dark"
//       position="fixed"
//       unfoldable={unfoldable}
//       visible={sidebarShow}
//       onVisibleChange={(visible) => {
//         dispatch({ type: 'set', sidebarShow: visible })
//       }}
//     >
//       <CSidebarHeader className="border-bottom">
//         <CSidebarBrand to="/">
//           <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
//           <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
//         </CSidebarBrand>
//         <CCloseButton
//           className="d-lg-none"
//           dark
//           onClick={() => dispatch({ type: 'set', sidebarShow: false })}
//         />
//       </CSidebarHeader>
//       <AppSidebarNav items={navigation} />
//       <CSidebarFooter className="border-top d-none d-lg-flex">
//         <CSidebarToggler
//           onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
//         />
//       </CSidebarFooter>
//     </CSidebar>
//   )
// }

// export default React.memo(AppSidebar)



import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

import navigation from '../_nav'

// Function to filter navigation based on roles
const filterNavByRole = (navItems, role) => {
  return navItems
    .filter(item => {
      // Check if the item has rolesAllowed property
      if (item.rolesAllowed) {
        return item.rolesAllowed.includes(role);
      }
      // If no rolesAllowed is defined, include the item
      return true;
    })
    .map(item => {
      // If the item has children (CNavGroup), filter its items recursively
      if (item.items) {
        return { ...item, items: filterNavByRole(item.items, role) };
      }
      return item;
    });
};

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const userRole = localStorage.getItem('roleId') || 'user'; // Default to 'user' if no role is set

  // Apply the filtering logic to the navigation array
  const filteredNav = filterNavByRole(navigation, userRole);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}

        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Pass filtered navigation to AppSidebarNav */}
      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
