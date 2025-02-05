import React, { useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import '../accordion/Accordion.css'; // Import custom styles
import axios from 'axios';
import { useForm } from 'react-hook-form'; // Correct import from react-hook-form
import { CButton, CCol, CFormInput, CFormLabel, CRow } from '@coreui/react';
import instance from '../../../axios/axiosInstance';

const Accordion = () => {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('Category_Name', data.Category_Name);
    try {
      const response = await instance.post('/Categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product added:', response.data);
      reset();
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  return (

    <div>
      <h1>Categories Entry</h1>
      <form onSubmit={handleSubmit(onSubmit)}>

        <CRow className="mb-3">
          <CFormLabel htmlFor="Category_Name" className="col-sm-2 col-form-label">Category Name</CFormLabel>
          <CCol sm={10}>
            <CFormInput type="text" id="Category_Name" {...register('Category_Name')} required />
          </CCol>
        </CRow>
        <CButton type="submit" color="primary">Submit</CButton>
      </form>
    </div>





  );
}

export default Accordion;
