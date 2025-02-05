

import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import '../accordion/Accordion.css'; // Import custom styles
import { useForm } from 'react-hook-form'; // Correct import from react-hook-form
import { CButton, CCol, CFormLabel, CRow } from '@coreui/react';
import Select from 'react-select';
import instance from '../../../axios/axiosInstance';

const Carousels = () => {
  const [ProductID, setProductID] = useState(null); // State for selected ProductID
  const [allProduct, setAllProduct] = useState([]); // State for AllProduct
  const [productList, setProductList] = useState([]); // State for the list of selected products
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const { handleSubmit, reset } = useForm(); // Use useForm hook

  const onSubmit = async (data) => {
    // Handle form submission if needed
  };

  const handleAddProduct = () => {
    if (ProductID) {
      console.log('Add Product ' + JSON.stringify(ProductID, null, 2));

      const existingProduct = productList.find(item => item.id === ProductID.value);
      if (!existingProduct) {
        const selectedProduct = allProduct.find(product => product.value === ProductID.value);
        if (selectedProduct) {
          setProductList([...productList, {
            id: selectedProduct.value,
            Item_Name: selectedProduct.label,
            Categories_Name: selectedProduct.Categories_Name,
            Image: selectedProduct.Image
          }]);
          reset(); // Reset the form after adding
          setProductID(null); // Clear the selected product
        }
      } else {
        alert('Product already added to the list.');
      }
    } else {
      alert('Please select a product before adding.');
    }
  };

  useEffect(() => {
    const fetchCategories = async (search = '') => {
      try {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjcxNjQ3NjUsImV4cCI6MTcyNzE2ODM2NX0.-ar4RAtLj9Q3tM7Axj24dDWVW6LxO6s1GzIrTgCBYgA'; // Replace with your token

        const response = await instance.get(`/getAllProduct/${search}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formattedProduct = response.data.map(category => ({
          value: category.id,
          label: category.Item_Name,
          Categories_Name: category.Categories_Name,
          Image: category.Image
        }));
        setAllProduct(formattedProduct);



        console.log('Fetching categories  -- ' + search);



      } catch (error) {
        console.error('Error fetching categories:', error);
      }

    };

    fetchCategories(); // Initial fetch

    // Fetch products on search term change
    if (searchTerm) {
      fetchCategories(searchTerm);
    }
  }, [searchTerm]); // Run on searchTerm change





  return (
    <div>
      <h1>Product Entry</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CRow className="mb-3">
          <CFormLabel htmlFor="ProductID" className="col-sm-2 col-form-label">Product</CFormLabel>
          <CCol sm={10}>
            <Select
              id="ProductID"
              value={ProductID}
              onChange={setProductID}
              options={allProduct}
              placeholder="Select a product"
              required
              onInputChange={(inputValue) => setSearchTerm(inputValue)} // Update search term on input change
            />
          </CCol>
        </CRow>

        <CButton type="button" color="primary" onClick={handleAddProduct}>Add</CButton>
        <CButton type="submit" color="primary">Submit</CButton>
      </form>

      {/* Display the list of selected products */}
      <h2>Selected Products</h2>
      <ul>
        {productList.map((product, index) => (
          <li key={index}>
            <img src={product.Image} alt={product.Item_Name} style={{ width: '50px', marginRight: '10px' }} />
            {product.Item_Name} (Category: {product.Categories_Name})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Carousels;
