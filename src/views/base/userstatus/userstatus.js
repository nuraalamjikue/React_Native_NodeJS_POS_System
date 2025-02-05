import React, { useState, useEffect } from 'react';
import { CContainer, CRow, CCol, CButton } from '@coreui/react';
import DataTable from 'react-data-table-component';

import { showToast } from '../../common_components/common_toast notification/Connon_toast_notification';
import { useTranslation } from 'react-i18next';
import "../language/i18n";
import instance from '../../../axios/axiosInstance';

const UserStatus = () => {
    const [userstatus, setUserstatus] = useState([]);
    const token = localStorage.getItem('authToken');
    console.log('Retrieved Token:', token);

    const { t, i18n } = useTranslation();

    // Fetch all user statuses
    const fetchUserstatus = async () => {
        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }
        try {
            const response = await instance.get('/GetUserstatus', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setUserstatus(response.data);
                console.log('User status:', JSON.stringify(response.data, null, 2));
            } else {
                console.error('Failed to fetch user statuses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user statuses:', error);
        }
    };

    useEffect(() => {
        fetchUserstatus();
    }, []);

    const handleToggleStatus = async (userId, currentStatus) => {
        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }

        try {
            // Toggle the 'IsActive' status
            const newStatus = currentStatus === 1 ? 0 : 1;

            // Make the API call to update the status
            const response = await instance.put(`/UpdateUserStatus/${userId}`, {
                isActive: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                // Update the user status locally after a successful API call
                const updatedUserStatus = userstatus.map(user =>
                    user.Id === userId ? { ...user, IsActive: newStatus } : user
                );
                setUserstatus(updatedUserStatus);
                showToast('Status updated successfully!', 'success');
            } else {
                console.error('Failed to update status:', response.statusText);
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Error updating status', 'error');
        }
    };


    // Define columns for DataTable
    const columns = [
        { name: 'Id', selector: row => row.Id, sortable: true },
        { name: 'User Name', selector: row => row.UserName, sortable: true },
        { name: 'Roll', selector: row => row.Roll_id, sortable: true },
        {
            name: 'Roll',
            selector: row => row.Roll_id,
            sortable: true,
            cell: row => (row.IsActive === 1 ? 'Admin' : 'User'),
        },
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
                <CButton
                    color={row.IsActive === 1 ? "danger" : "success"}
                    onClick={() => handleToggleStatus(row.Id, row.IsActive)}
                >
                    {row.IsActive === 1 ? t("Deactivate") : t("Activate")}
                </CButton>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <CContainer>
            <CRow>
                <CCol xs={12}>
                    <DataTable
                        columns={columns}
                        data={userstatus}
                        pagination
                        highlightOnHover
                        keyField="Id"
                    />
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default UserStatus;
