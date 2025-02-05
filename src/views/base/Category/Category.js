import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CForm, CFormInput, CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';
import instance from '../../../axios/axiosInstance';
import { showToast } from '../../common_components/common_toast notification/Connon_toast_notification'
import { useTranslation } from 'react-i18next';
import "../language/i18n";
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
const Category = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category
    const token = localStorage.getItem('authToken');
    console.log('Retrieved Token:', token);

    const { t, i18n } = useTranslation();

    // Fetch all categories
    const fetchCategories = async () => {

        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }
        try {
            const response = await instance.get('/CategoriesList', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setCategories(response.data);
            } else {
                console.error('Failed to fetch categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Add or update a category
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            showToast(`Category name is required`, "info");
            return;
        }

        try {
            if (selectedCategory) {
                // Update category if one is selected
                const response = await instance.put(`/Categories/${selectedCategory.Id}`, { Category_Name: newCategoryName });
                //alert(response.data.message);
                showToast(`${response.data.message}`, "info");
            } else {
                // Add new category if none is selected
                const response = await instance.post('/Categories', { Category_Name: newCategoryName });
                // alert(response.data.message);
                showToast(`${response.data.message}`, "info");
            }
            setNewCategoryName('');
            setSelectedCategory(null); // Reset selected category
            fetchCategories();
        } catch (err) {
            console.error('Error adding/updating category:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const columns = [
        { name: 'Id', selector: row => row.Id, sortable: true },
        { name: t("category_name"), selector: row => row.Categories_Name, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                // <CButton color="info" onClick={() => handleEdit(row)}>Edit</CButton>
                <CIcon icon={cilPencil} size="sm" onClick={() => handleEdit(row)} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // Handle category selection for edit
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.Categories_Name); // Pre-fill input field with category name
    };

    const handleCancelEdit = () => {
        setSelectedCategory(null),
            setNewCategoryName('');
    };

    return (
        <CContainer>
            <CRow>
                <CCol xs={5}>
                    <CForm onSubmit={handleCategorySubmit}>
                        <CFormInput
                            type="text"
                            placeholder={selectedCategory ? t("Edit_category_name") : t("Enter_category_name")}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="mb-3"
                        />
                        <CButton type="submit" color="primary">
                            {selectedCategory ? t("UpdateCategory") : t("addCategory")}
                        </CButton>
                        {selectedCategory && (
                            <CButton color="secondary" onClick={handleCancelEdit} className="ms-2">
                                {t("btnCancel")}
                            </CButton>
                        )}
                    </CForm>
                </CCol>

                <CCol xs={7}>
                    <h5>{t("CategoryList")}</h5>
                    <DataTable
                        columns={columns}
                        data={categories}
                        pagination
                        highlightOnHover
                    />
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default Category;
