import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import "./../../views/base/language/i18n";

const AppHeaderDropdown = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Change language handler
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);

  };

  // Logout function to clear the token and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    localStorage.removeItem('roleId')
    console.log('Token removed: user logged out');

    // Redirect to login page
    navigate('/login'); // Assuming '/login' is the route for your login page
  };



  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#" onClick={() => changeLanguage("en")}>
          <CIcon icon={cilBell} className="me-2" />
          English
        </CDropdownItem>
        <CDropdownItem href="#" onClick={() => changeLanguage("fr")}>
          <CIcon icon={cilBell} className="me-2" />
          French
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => handleLogout()}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>


      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
