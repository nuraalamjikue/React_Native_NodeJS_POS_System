import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import '../accordion/Accordion.css'; // Import custom styles
import { useForm } from 'react-hook-form'; // Correct import from react-hook-form
import { CButton, CCol, CContainer, CFormInput, CFormLabel, CRow } from '@coreui/react';
import Select from 'react-select';
import instance from '../../../axios/axiosInstance';
import DataTable from 'react-data-table-component';
import { showToast } from '../../common_components/common_toast notification/Connon_toast_notification'
import CIcon from '@coreui/icons-react';
import { cilPencil, cilSpeedometer } from '@coreui/icons'; // Import the icon
import { useTranslation } from 'react-i18next';

// Define columns for the DataTable



const Product = () => {
    const [categoryID, setCategoryID] = useState(null); // State for selected Category ID
    const [IsActive, setIsActive] = useState(null); // State for IsActive status
    const [categories, setCategories] = useState([]); // State for categories
    const { register, handleSubmit, reset } = useForm(); // Use useForm hook
    const [image, setImage] = useState(null); // State for image file
    const [productlist, setProductlist] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Track whether editing
    const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product for editing
    const token = localStorage.getItem('authToken');
    console.log('Retrieved Token:', token);
    const { t, i18n } = useTranslation();
    // Handle image selection
    const onImageChange = (e) => {
        setImage(e.target.files[0]);
    };


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('Item_Name', data.Item_Name);
        formData.append('Item_Price', data.Item_Price);
        // formData.append('Barcode', data.Barcode);
        formData.append('CategoryID', categoryID?.value);
        formData.append('IsActive', IsActive?.value);
        formData.append('Image', image); // Attach the image file only if it's selected
        formData.append('Create_By', 1); // Assuming user ID 1

        // console.log('Uploading product ' + JSON.stringify(categoryID?.value, null, 2));



        try {
            if (isEditing) {
                // Update existing product
                const response = await instance.put(`/products/${selectedProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                showToast(`${response.data.message}`, "info");
                reset({
                    Item_Name: "",
                    Item_Price: "",
                });

            } else {
                // Add new product
                const response = await instance.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // console.log('Product added:', response.data);
                showToast(`${response.data.message}`, "info");
            }
            reset();
            setImage(null);
            setCategoryID(null);
            setIsActive(null);
            setSelectedProduct(null);
            setIsEditing(false); // Reset edit mode
            handleProductList(); // Refresh the product list
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const fetchCategories = async () => {
        try {


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
    const handleProductList = async () => {

        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }
        try {
            const response = await instance.get('/getAllProductList', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                console.log('Product list ' + JSON.stringify(response.data, null, 2));

                setProductlist(response.data);
            } else {
                console.error('Failed to fetch product list:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching product list:', error);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {

        handleProductList();
        fetchCategories();
    }, []);

    // Options for the IsActive status select
    const IsActiveOptions = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'IsActive' },
    ];

    const columns = [
        { name: 'Id', selector: row => row.id, sortable: true },
        { name: 'Item Name', selector: row => row.Item_Name, sortable: true },
        { name: 'Item Price', selector: row => row.Item_Price, sortable: true },
        { name: 'Category Name', selector: row => row.Categories_Name, sortable: true },
        // {
        //     cell: row => (
        //         <span >
        //             {row.CategoryID === 0 ? '' : ''}
        //         </span>
        //     ),
        // },

        {
            name: 'Active',
            selector: row => row.IsActive,
            sortable: true,
            cell: row => (
                <span style={{ color: row.IsActive === 0 ? 'red' : 'green' }}>
                    {row.IsActive === 0 ? 'Inactive' : 'Active'}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: row => (

                <CIcon icon={cilPencil} size="sm" onClick={() => handleEdit(row)} />

            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // const handleEdit = (product) => {
    //     setSelectedProduct(product);
    //     setUpdatedData({
    //         Item_Name: product.Item_Name,
    //         Categories_Name: product.Categories_Name,
    //     });
    //     setModalVisible(true);
    // };
    const handleCancelEdit = () => {
        reset({
            Item_Name: "",
            Item_Price: "",
            CategoryID: "",
        });

        setImage(null);
        setCategoryID(null);
        setIsActive(null);
        setSelectedProduct(null);
        setIsEditing(false);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        reset({
            Item_Name: product.Item_Name,
            Item_Price: product.Item_Price,
            CategoryID: product.CategoryID,
        });
        setCategoryID({ value: product.CategoryID, label: product.Categories_Name });
        setIsActive({ value: product.IsActive, label: product.IsActive === 1 ? 'Active' : 'IsActive' });
    };


    return (
        <CContainer>
            <CRow>
                <CCol xs={5}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="Item_Name" className="col-sm-4 col-form-label">{t('Item_Name')}</CFormLabel>
                            <CCol xs={8}>
                                <CFormInput type="text" id="Item_Name" {...register('Item_Name')} required />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="Item_Price" className="col-sm-4 col-form-label">
                                {t('Item_Price')}
                            </CFormLabel>
                            <CCol xs={8}>
                                <CFormInput
                                    type="text"
                                    id="Item_Price"
                                    {...register('Item_Price', {
                                        required: 'Item Price is required',
                                        pattern: {
                                            value: /^\d*\.?\d*$/, // Allows integers and decimals
                                            message: 'Enter a valid price',
                                        },
                                    })}
                                    required
                                    onKeyPress={(e) => {
                                        if (!/^\d*\.?\d*$/.test(e.key)) {
                                            e.preventDefault(); // Prevent non-numeric characters
                                        }
                                    }}
                                />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="Product_CategoryID" className="col-sm-4 col-form-label">{t('Product_CategoryID')}</CFormLabel>
                            <CCol xs={8}>
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
                            <CFormLabel htmlFor="Product_IsActive" className="col-sm-4 col-form-label">{t('Product_IsActive')}</CFormLabel>
                            <CCol xs={8}>
                                <Select
                                    id="IsActive"
                                    value={IsActive}
                                    onChange={setIsActive} // Update state on selection
                                    options={IsActiveOptions} // Provide Active/IsActive options
                                    placeholder="Select status"
                                    required
                                />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CFormLabel htmlFor="Product_ImageUpload" className="col-sm-4 col-form-label">{t('Product_ImageUpload')}</CFormLabel>
                            <CCol xs={8}>
                                <CFormInput type="file" id="ImageUpload" onChange={onImageChange} accept="image/*" />
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol xs={8} offset={4}>
                                <CButton type="submit" color="primary">
                                    {isEditing ? t("Update") : t("Submit")}
                                </CButton>
                                {isEditing && (
                                    <CButton color="secondary" onClick={handleCancelEdit} className="ms-2">
                                        {t("Product_Cancle_btn")}
                                    </CButton>
                                )}
                            </CCol>
                        </CRow>
                    </form>
                </CCol>

                <CCol sm={7}>
                    <DataTable
                        columns={columns}
                        data={productlist}
                        pagination // Optional: Add pagination if needed
                        highlightOnHover // Optional: Highlight row on hover
                    />
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default Product;
