


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import instance from '../../../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault(); // Prevent default form submission behavior
  //   setError('');

  //   try {
  //     const response = await instance.post('/login', { username, password });
  //     const { token } = response.data;
  //     console.log('Token: ' + JSON.stringify(response.data, null, 2));

  //     let role = 'admin';
  //     // Save token securely
  //     localStorage.setItem('authToken', token);
  //     localStorage.setItem("roleId", role);


  //     // Redirect to dashboard
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     setError('Invalid username or password');
  //   }
  // };


  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');
    localStorage.removeItem('roleId')
    try {
      const response = await instance.post('/login', { username, password });
      const { token, roleId } = response.data;
      console.log('Token:', token);


      let role = roleId === 0 ? 'admin' : 'user';

      // let role = 'user';
      console.log('RoleID:', role);
      // Save token and RoleID securely
      localStorage.setItem('authToken', token);
      localStorage.setItem("roleId", role);


      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign in to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Create a new account to access exclusive features and manage your dashboard.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
