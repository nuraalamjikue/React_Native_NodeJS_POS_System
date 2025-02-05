import React, { useState } from 'react'
import CommonButton from '../../common_components/common_button/common_button'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import InputField from '../../common_components/common_inputfield/common_input_field'
import "../../css/app.css"
import { showToast } from '../../common_components/common_toast notification/Connon_toast_notification'
import CommonDropdown from '../../common_components/common_dropdown/common_dropdown'
import CommonTextLabel from '../../common_components/CommonTextLabel/Common_textLabel_bold'
import { AiOutlineCheck } from 'react-icons/ai'


const Breadcrumbs = () => {
  //#region Input Area
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  //#endregion

  //#region  Button Area
  const handleClick = () => {
    showToast(`This is a success message! ${selectedValues.value}`, "success");
    console.log('handleClick');
    return false;
  }
  //#endregion

  //#region Dropdowns Area
  const [selectedValues, setSelectedValues] = useState(null);

  const options = [
    { value: '1', label: 'snowtex 1' },
    { value: '2', label: 'snowtex 2' },
    { value: '3', label: 'snowtex 3' },
    { value: '4', label: 'snowtex 4' },
    { value: '5', label: 'snowtex 5' },
    { value: '6', label: 'snowtex 6' },
    { value: '7', label: 'snowtex 7' },
    { value: '8', label: 'snowtex 8' },
    { value: '9', label: 'snowtex 9' },
    { value: '10', label: 'snowtex 10' },
    { value: '11', label: 'snowtex 11' },
    { value: '12', label: 'snowtex 12' },
    { value: '13', label: 'snowtex 13' },
  ]

  const handleChange = (values) => {
    setSelectedValues(values);
  };

  //#endregion

  return (
    <CRow>


      <div className="d-grid gap-2 d-md-flex justify-content-md-start">


        <CommonButton
          color="primary"
          shape="rounded"
          // height="50px"
          // width="150px"
          onClick={handleClick}
          // icon={AiOutlineCheck}
          // iconStyle={{ color: '#fff', width: '24px', height: '24px', marginRight: '1px' }}
          textColor="#fff"
        >
          Button
        </CommonButton>


      </div>




      <CForm className="row g-3">
        <CCol xs="auto">
          <CommonDropdown
            options={options}
            selectedValues={selectedValues}
            onChange={handleChange}
            height="20px"  // Set the height here
            width="300px"  // Set the width here
          />
        </CCol>

        <CommonTextLabel
          text="snowtex sportswear ltd"
          className="Roboto-Bold"
          style={{ color: 'blue', fontSize: '20px' }}
        />

        <CommonTextLabel
          text="Nura Alam Jikue"
          className="Roboto-Bold"
          textTransform="uppercase"
          style={{ color: 'blue', fontSize: '20px' }}
        />



        <CCol xs="auto">
          <InputField
            type="email"
            id="emailInput"
            label="Email address"
            placeholder="name@example.com"
            text="Must be 8-20 characters long."
            ariaDescribedBy="emailHelp"
            value={email}
            onChange={handleEmailChange}
          />
        </CCol>

        <CCol xs="auto">
          <CommonButton
            color="primary"
            shape="rounded"
            // height="50px"
            // width="150px"
            onClick={handleClick}
            icon={AiOutlineCheck}
            iconStyle={{ color: '#fff', width: '24px', height: '24px', marginRight: '1px' }}
            textColor="#fff"
          >
            Confirm identity
          </CommonButton>
        </CCol>



      </CForm>
    </CRow>
  )
}

export default Breadcrumbs
