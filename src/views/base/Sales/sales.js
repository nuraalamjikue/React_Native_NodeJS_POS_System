import React, { useState, useEffect } from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CFormInput,
    CForm
} from '@coreui/react';
import instance from '../../../axios/axiosInstance';
import { showToast } from '../../common_components/common_toast notification/Connon_toast_notification'
import { cilMinus, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AnimatedNumbers from "react-animated-numbers";
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import InvoiceModal from './InvoiceModal';

const Sales = () => {
    const [productList, setProductlist] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [nextInvoice, setNextInvoice] = useState('');


    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [recalculate, setRecalculate] = useState(false);

    useEffect(() => {
        if (recalculate) {
            const newSubtotal = cart.reduce((acc, item) => acc + item.Item_Price * item.qty, 0);
            const newTax = newSubtotal * 0.21; // 5% Tax
            const newGrandTotal = newSubtotal + newTax;

            setSubtotal(newSubtotal);
            setTax(newTax);
            setGrandTotal(newGrandTotal);
            setRecalculate(false); // Reset trigger
        }
    }, [recalculate, cart]);



    const token = localStorage.getItem('authToken');
    console.log('Retrieved Token:', token);
    const navigate = useNavigate();
    //#region  Model creation
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    // const closeModal = () => setIsOpen(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fetch product list
    const handleProductList = async () => {
        if (!token) {
            console.error('Authorization token is missing.');
            navigate('/login');
            // return;
        }
        try {
            const response = await instance.get('/getAllProductListBySales', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setProductlist(response.data);
                console.log('Product list' + JSON.stringify(response.data));

            } else {
                console.error('Failed to fetch product list:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching product list:', error);
        }
    };

    const getLastInvoiceNo = async () => {
        try {
            const response = await instance.get('/GetLastInvoiceNo', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const lastInvoice = response.data[0]?.Invoice || 'INV0000';
                setNextInvoice(lastInvoice)
                // return nextInvoice;
            } else {
                console.error('Failed to fetch last invoice number:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching last invoice number:', error);
        }
        return 'INV0001'; // Default invoice number in case of error
    };


    // Add product to cart
    const handleAddToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                )
            );
        } else {
            setCart((prevCart) => [...prevCart, { ...product, qty: 1 }]);
        }
        setRecalculate(true); // Trigger total recalculation
    };

    // Increment quantity
    const incrementQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, qty: item.qty + 1 } : item
            )
        );
        setRecalculate(true); // Prevent immediate recalculation
    };

    // Decrement quantity
    const decrementQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
        setRecalculate(true); // Prevent immediate recalculation
    };

    // Remove from cart
    const handleRemoveFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(({ id }) => id !== productId));
        setRecalculate(true); // Prevent immediate recalculation
    };

    // Filter products
    const filteredProducts = productList.filter((product) =>
        product.Item_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        handleProductList();
        getLastInvoiceNo();
    }, []);

    // const handleRemoveFromCart = (productId) => {
    //     setCart(cart.filter((item) => item.id !== productId));
    // };
    // const handleRemoveFromCart = (productId) => {
    //     setCart((prevCart) => prevCart.filter(({ id }) => id !== productId));
    // };

    const totalPrice = cart.reduce((acc, item) => acc + item.Item_Price * item.qty, 0);

    const handleSubmit = async () => {
        if (cart.length === 0) {
            console.error('Cart is empty.');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Authorization token is missing.');
            return;
        }

        // Prepare the data for POS_Sales (Summary)
        const saleData = {
            Invoice: 'INV12345', // Example invoice number, you might want to generate this dynamically
            TotalAmount: totalPrice, // Total price from the cart
            Create_By: 1, // Replace with the actual user ID

        };

        try {
            // Submit the sale (POS_Sales)
            const response = await instance.post('/createSale', saleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const saleId = response.data.Id; // Assuming response returns the sale's Id

                // Prepare data for POS_Sales_Details (Detail line items)
                const saleDetailsData = cart.map((item) => ({
                    salesId: saleId,
                    ItemId: item.id,
                    Create_By: 1, // Replace with the actual user ID

                }));

                // Submit the sale details (POS_Sales_Details)
                const detailsResponse = await instance.post('/createSaleDetails', saleDetailsData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (detailsResponse.status === 200) {

                    showToast(`Sale and Sale Details successfully submitted!`, "info");

                    //setCart([]);
                    getLastInvoiceNo();
                    openModal();
                    setIsModalOpen(true);
                    // setTotalPrice(0); 

                } else {

                    showToast(`Failed to submit sale details ${detailsResponse.statusText}`, "danger");
                }
            } else {
                showToast(`Failed to submit sale ${response.statusText}`, "danger");

            }
        } catch (error) {

            showToast(`Error submitting sale ${error}`, "danger");
        }
    };






    return (
        <CContainer>
            <CRow>
                {/* Search Bar */}
                <CCol xs={12} md={8} className="mb-2">
                    <CForm>
                        <CFormInput
                            type="text"
                            placeholder="Search for a product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control-lg"
                        />
                    </CForm>


                </CCol>

                {/* Product List */}
                <CCol xs={12} md={8}>
                    <CCard className="shadow-sm">
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <h5>Product List</h5>
                            <small className="text-muted">{filteredProducts.length} items</small>
                        </CCardHeader>
                        <CCardBody>
                            {filteredProducts.length === 0 ? (
                                <p>No products found</p>
                            ) : (
                                <CRow>
                                    {filteredProducts.slice(0, 12).map((product) => (
                                        <CCol md={4} sm={6} xs={12} key={product.id} className="mb-3">
                                            <CCard
                                                className="p-3 shadow-lg rounded"
                                                onClick={() => handleAddToCart(product)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: '#f5f5f5',
                                                    borderRadius: '12px', // Smooth rounded corners
                                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', // Subtle, deeper shadow for card
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect with box-shadow
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
                                                }}
                                            >
                                                <div className="d-flex flex-column align-items-center">
                                                    <img
                                                        src={`http://localhost:5000/${product.Image}`}
                                                        alt={product.Item_Name}
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            borderRadius: '50%',
                                                            marginBottom: '15px',
                                                            border: '3px solid #fff', // Border around the image for a clean look
                                                        }}
                                                    />
                                                    <h6 className="text-center font-weight-bold" style={{ color: '#026EC1', fontSize: '1.1rem', marginBottom: '10px' }}>
                                                        {product.Item_Name}
                                                    </h6>
                                                    <div className="text-center">
                                                        <p className="mb-0 " style={{ fontSize: '0.9rem', color: '#000' }}>
                                                            Category: {product.Categories_Name}
                                                        </p>
                                                        <p className="mb-0 " style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>
                                                            Price: ${product.Item_Price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CCard>
                                        </CCol>
                                    ))}
                                </CRow>



                            )}
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Cart and Date Picker */}
                <CCol xs={12} md={4}>
                    <CCard>
                        <CCardHeader>
                            <h5>Sales Cart</h5>
                        </CCardHeader>
                        <CCardBody>

                            <div>
                                {cart.length === 0 ? (
                                    <p style={{ color: 'red', textAlign: 'center' }}>Your cart is empty</p>

                                ) : (
                                    <CRow>
                                        {cart.map((item) => (
                                            <CCol md={12} key={item.id}>
                                                <CCard className="mb-3 p-2">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h6>{item.Item_Name}</h6>
                                                            <p className="mb-0 text-muted">
                                                                Price: ${item.Item_Price} x {item.qty}
                                                            </p>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <CButton
                                                                color="info"
                                                                onClick={() => decrementQuantity(item.id)}
                                                                className="btn-sm mx-1"
                                                                disabled={item.qty === 1}
                                                            >
                                                                <CIcon icon={cilMinus} style={{ '--ci-primary-color': '#fff' }} />
                                                            </CButton>

                                                            {/* AnimatedNumbers with previous quantity */}


                                                            <span style={{
                                                                fontSize: 16,
                                                                color: "#107C41",
                                                                fontWeight: 'bold',
                                                                marginRight: "10px",
                                                                marginLeft: "10px",
                                                            }}>{item.qty}</span>
                                                            <CButton
                                                                color="success"
                                                                onClick={() => incrementQuantity(item.id)}
                                                                className="btn-sm mx-1"
                                                            >
                                                                <CIcon icon={cilPlus} style={{ '--ci-primary-color': '#fff' }} />
                                                            </CButton>

                                                            <CButton
                                                                color="danger"
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                                className="btn-sm mx-1"
                                                            >
                                                                <CIcon icon={cilTrash} style={{ '--ci-primary-color': '#fff' }} />
                                                            </CButton>


                                                        </div>
                                                    </div>
                                                </CCard>
                                            </CCol>
                                        ))}
                                    </CRow>
                                )}
                            </div>

                            {/* Cart Total Footer */}
                            <CCol md={12}>
                                <CCard className="p-3 mt-4">
                                    {/* Subtotal */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5>Subtotal</h5>
                                        <div
                                            style={{
                                                fontSize: 20,
                                                color: "#107C41",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {subtotal.toFixed(2)}
                                        </div>
                                        {/* <AnimatedNumbers
                                            includeComma
                                            transitions={(index) => ({
                                                type: "spring",
                                                duration: index + 0.3, // Add slight delay based on index
                                            })}
                                            animateToNumber={subtotal.toFixed(2)} // The number to animate
                                            fontStyle={{
                                                fontSize: 20,
                                                color: "#107C41",
                                                fontWeight: "bold",
                                            }}
                                            renderNumber={(number) => <h5>${number}</h5>}
                                        /> */}
                                    </div>

                                    {/* Tax Calculation */}
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <h5>Tax (21%)</h5>
                                        <div
                                            style={{
                                                fontSize: 20,
                                                color: "#E67E22",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {tax.toFixed(2)}
                                        </div>
                                        {/* <AnimatedNumbers
                                            includeComma
                                            transitions={(index) => ({
                                                type: "spring",
                                                duration: index + 0.3,
                                            })}
                                            animateToNumber={tax.toFixed(2)} // Tax calculation
                                            fontStyle={{
                                                fontSize: 20,
                                                color: "#E67E22",
                                                fontWeight: "bold",
                                            }}
                                            renderNumber={(number) => <h5>${number}</h5>}
                                        /> */}
                                    </div>

                                    {/* Grand Total */}
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <h5>Grand Total</h5>
                                        <AnimatedNumbers
                                            includeComma
                                            transitions={(index) => ({
                                                type: "spring",
                                                duration: index + 0.3,
                                            })}
                                            animateToNumber={grandTotal.toFixed(2)} // Grand total calculation (subtotal + tax)
                                            fontStyle={{
                                                fontSize: 20,
                                                color: "#107C41",
                                                fontWeight: "bold",
                                            }}
                                            renderNumber={(number) => <h5>${number}</h5>}
                                        />
                                    </div>

                                    <h5>{grandTotal.toFixed(2)}</h5>
                                </CCard>
                            </CCol>


                            <CRow>
                                <CCol md={6}>
                                    <CButton color="primary" onClick={handleSubmit} className="mt-4">
                                        Submit Order
                                    </CButton>
                                </CCol>
                                <CCol md={6}>
                                    <div style={{ marginTop: '20%' }}>
                                        <p className="mt-4" style={{ color: '#1E8CD0', textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>Invoice No : {nextInvoice.split('-').pop() || 'Loading...'}</p>

                                    </div>

                                </CCol>
                            </CRow>
                            {/* Submit Order Button */}


                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* ---------------Model---------------------------- */}


            <InvoiceModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                cart={cart}
                totalPrice={totalPrice}
                InvoiceNo={nextInvoice.split('-').pop() || 'Loading...'}
            />




        </CContainer>
    );
};

export default Sales;
