

import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import instance from '../../../axios/axiosInstance'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select';

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rollsetup, setRollsetup] = useState(null);
  const navigate = useNavigate();

  const roll = [
    { value: '0', label: 'Admin' },
    { value: '1', label: 'User' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation: Check if passwords match
    if (password !== repeatPassword) {
      setError('Passwords do not match')
      return
    }

    console.log('Checking password ' + rollsetup.value);

    // Prepare the user data
    const userData = { username, password, rollsetup: rollsetup.value }

    try {
      setLoading(true)
      // Send the registration data to the backend API
      const response = await instance.post('/register', userData)

      // Handle success
      if (response.data.message === 'User registered successfully') {

        alert('Registration successful!')
        // Redirect user or clear form if necessary
        navigate('/login');

      }
    } catch (err) {
      console.error('Error registering user:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">



                    <CCol xs={12}>
                      <Select
                        id="IsActive"
                        value={rollsetup}
                        onChange={setRollsetup} // Update state on selection
                        options={roll} // Provide Active/IsActive options
                        placeholder="Select Roll"
                        required
                      />
                    </CCol>


                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Registering...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
