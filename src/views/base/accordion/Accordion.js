// import React, { useEffect, useState } from 'react';
// import 'aos/dist/aos.css'; // Import AOS styles
// import '../accordion/Accordion.css'; // Import custom styles
// import axios from 'axios';
// import { useForm } from 'react-hook-form'; // Correct import from react-hook-form
// import { CButton, CCol, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';
// import Select from 'react-select';

// const Accordion = () => {
//   const [categoryID, setCategoryID] = useState(null); // State for CategoryID
//   const [inActive, setInActive] = useState(null); // State for InActive
//   const { register, handleSubmit, reset } = useForm(); // Use useForm hook
//   const [image, setImage] = useState(null);

//   const onImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const onSubmit = async (data) => {
//     const formData = new FormData();
//     formData.append('Item_Name', data.Item_Name);
//     formData.append('Barcode', data.Barcode);
//     formData.append('CategoryID', data.CategoryID);
//     formData.append('InActive', data.InActive);
//     formData.append('Create_By', 1); // Assuming user ID 1
//     formData.append('Create_Date', new Date().toISOString());
//     formData.append('Image', image); // Attach the image file

//     try {
//       const response = await axios.post('http://192.168.15.24:5000/api/products', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       console.log('Product added:', response.data);
//       reset();
//       setImage(null); // Reset image input after successful upload
//     } catch (error) {
//       console.error('Error uploading product:', error);
//     }
//   };
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('http://192.168.15.24:5000/api/CategoriesList');
//         const formattedCategories = response.data.map(category => ({
//           value: category.Id,
//           label: category.Categories_Name,
//         }));
//         setCategories(formattedCategories);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   })


//   const inActiveOptions = [
//     { value: '0', label: 'Active' },
//     { value: '1', label: 'Inactive' },
//   ];

//   return (

//     <div>
//       <h1>Product Entry</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>

//         <CRow className="mb-3">
//           <CFormLabel htmlFor="Item_Name" className="col-sm-2 col-form-label">Item Name</CFormLabel>
//           <CCol sm={10}>
//             <CFormInput type="text" id="Item_Name" {...register('Item_Name')} required />
//           </CCol>
//         </CRow>



//         <CRow className="mb-3">
//           <CFormLabel htmlFor="CategoryID" className="col-sm-2 col-form-label">Category</CFormLabel>
//           <CCol sm={10}>
//             <Select
//               id="CategoryID"
//               value={categoryID}
//               onChange={setCategoryID} // Update state on selection
//               options={categories} // Provide fetched category options
//               placeholder="Select a category"
//               required
//             />
//           </CCol>
//         </CRow>

//         <CRow className="mb-3">
//           <CFormLabel htmlFor="InActive" className="col-sm-2 col-form-label">Inactive</CFormLabel>
//           <CCol sm={10}>
//             <Select
//               id="InActive"
//               value={inActive}
//               onChange={setInActive} // Update state on selection
//               options={inActiveOptions} // Provide Active/Inactive options
//               placeholder="Select status"
//               required
//             />
//           </CCol>
//         </CRow>

//         <CRow className="mb-3">
//           <CFormLabel htmlFor="ImageUpload" className="col-sm-2 col-form-label">Upload Image</CFormLabel>
//           <CCol sm={10}>
//             <CFormInput type="file" id="ImageUpload" onChange={onImageChange} accept="image/*" required />
//           </CCol>
//         </CRow>

//         <CButton type="submit" color="primary">Submit</CButton>
//       </form>
//     </div>





//   );
// }

// export default Accordion;


import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import '../accordion/Accordion.css'; // Import custom styles
import axios from 'axios';
import { useForm } from 'react-hook-form'; // Correct import from react-hook-form
import { CButton, CCol, CFormInput, CFormLabel, CRow } from '@coreui/react';
import Select from 'react-select';
import instance from '../../../axios/axiosInstance';

const Accordion = () => {
  const [categoryID, setCategoryID] = useState(null); // State for CategoryID
  const [inActive, setInActive] = useState(null); // State for InActive
  const [categories, setCategories] = useState([]); // State for categories
  const { register, handleSubmit, reset } = useForm(); // Use useForm hook
  const [image, setImage] = useState(null);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('Item_Name', data.Item_Name);
    formData.append('Barcode', data.Barcode);
    formData.append('CategoryID', categoryID?.value); // Use selected category value
    formData.append('InActive', inActive?.value); // Use selected status value
    formData.append('Create_By', 1); // Assuming user ID 1
    formData.append('Create_Date', new Date().toISOString());
    formData.append('Image', image); // Attach the image file

    try {
      const response = await instance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product added:', response.data);
      reset();
      setImage(null); // Reset image input after successful upload
      setCategoryID(null); // Reset category selection
      setInActive(null); // Reset inActive selection
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace 'your_token_here' with your actual token
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjcxNjQ3NjUsImV4cCI6MTcyNzE2ODM2NX0.-ar4RAtLj9Q3tM7Axj24dDWVW6LxO6s1GzIrTgCBYgA'; // Get this token from your authentication process

        const response = await instance.get('/CategoriesList', {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming Bearer token is used
          },
        });

        const formattedCategories = response.data.map(category => ({
          value: category.Id,
          label: category.Categories_Name,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run only on mount


  const inActiveOptions = [
    { value: '0', label: 'Active' },
    { value: '1', label: 'Inactive' },
  ];

  return (
    <div>
      <h1>Product Entry</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CRow className="mb-3">
          <CFormLabel htmlFor="Item_Name" className="col-sm-2 col-form-label">Item Name</CFormLabel>
          <CCol sm={10}>
            <CFormInput type="text" id="Item_Name" {...register('Item_Name')} required />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CFormLabel htmlFor="CategoryID" className="col-sm-2 col-form-label">Category</CFormLabel>
          <CCol sm={10}>
            <Select
              id="CategoryID"
              value={categoryID}
              onChange={setCategoryID} // Update state on selection
              options={categories} // Provide fetched category options
              placeholder="Select a category"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CFormLabel htmlFor="InActive" className="col-sm-2 col-form-label">Inactive</CFormLabel>
          <CCol sm={10}>
            <Select
              id="InActive"
              value={inActive}
              onChange={setInActive} // Update state on selection
              options={inActiveOptions} // Provide Active/Inactive options
              placeholder="Select status"
              required
            />
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CFormLabel htmlFor="ImageUpload" className="col-sm-2 col-form-label">Upload Image</CFormLabel>
          <CCol sm={10}>
            <CFormInput type="file" id="ImageUpload" onChange={onImageChange} accept="image/*" required />
          </CCol>
        </CRow>

        <CButton type="submit" color="primary">Submit</CButton>
      </form>
    </div>
  );
}

export default Accordion;
