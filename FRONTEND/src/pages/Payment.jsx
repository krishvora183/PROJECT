import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './Payment.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  
  const orderData = location.state?.orderData || {};

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = async (razorpayResult = null) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image || '',
          price: item.price,
          product: item.id || item._id
        })),
        shippingAddress: {
          address: orderData.address || 'Default Address',
          city: orderData.city || 'Default City',
          postalCode: orderData.zipCode || '000000',
          country: 'IN'
        },
        paymentMethod: orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Online',
        totalPrice: total
      };

      if (razorpayResult) {
        payload.paymentResult = {
          razorpayOrderId: razorpayResult.razorpay_order_id,
          razorpayPaymentId: razorpayResult.razorpay_payment_id,
          razorpaySignature: razorpayResult.razorpay_signature
        };
        payload.isPaid = true;
      }

      await api.post('/api/orders', payload, config);
      
      clearCart();
      setPaymentStatus('success');
    } catch (error) {
      console.error(error);
      setErrorDetails(error.response?.data?.message || 'Error processing your order');
      setPaymentStatus('failure');
    }
  };

  const initPayment = async () => {
    setIsProcessing(true);
    setErrorDetails('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      alert("Please login first to place an order");
      navigate('/customer/login');
      return;
    }

    if (orderData.paymentMethod === 'cod') {
      // Direct checkout for COD
      await handlePlaceOrder();
      setIsProcessing(false);
      return;
    }
    
    // Razorpay Integration
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setErrorDetails('Failed to load Razorpay payment gateway. Please check your internet connection.');
      setPaymentStatus('failure');
      setIsProcessing(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // 1. Create order on backend
      const { data: orderDataResponse } = await api.post('/api/payment/create-order', {
        amount: total,
        currency: 'INR'
      }, config);

      if (!orderDataResponse || !orderDataResponse.id) {
         setErrorDetails('Server failed to generate a secure order ID. Check Razorpay configurations.');
         setPaymentStatus('failure');
         setIsProcessing(false);
         return;
      }

      // 2. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: orderDataResponse.amount,
        currency: orderDataResponse.currency,
        name: 'Electrical Store',
        description: 'E-commerce Purchase',
        order_id: orderDataResponse.id,
        handler: async function (response) {
          // 3. Verify Signature
          try {
            await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, config);
            
            // 4. Verification Successful, save to DB
            await handlePlaceOrder(response);
          } catch (verificationError) {
            setErrorDetails('Payment verification failed after checkout.');
            setPaymentStatus('failure');
          }
        },
        prefill: {
          name: orderData.fullName,
          email: orderData.email,
          contact: orderData.phone
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response){
        setErrorDetails(response.error.description);
        setPaymentStatus('failure');
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      setErrorDetails(error.response?.data?.message || 'Error communicating with secure payment gateway');
      setPaymentStatus('failure');
    }
    setIsProcessing(false);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-result card success">
            <div className="result-icon">✓</div>
            <h1>Payment Successful!</h1>
            <p>Your order has been placed securely</p>
            <div className="order-details">
              <p><strong>Amount Paid:</strong> ₹{total.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / Razorpay'}</p>
            </div>
            <div className="result-actions">
              <button onClick={() => navigate('/customer/home')} className="btn btn-primary">
                Go to Dashboard
              </button>
              <button onClick={() => navigate('/customer/products')} className="btn btn-outline">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failure') {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-result card failure">
            <div className="result-icon">✗</div>
            <h1>Payment Failed</h1>
            <p>We couldn't process your order.</p>
            <div className="error-details">
              <p>{errorDetails || 'An unexpected error occurred.'}</p>
            </div>
            <div className="result-actions">
              <button onClick={() => setPaymentStatus('processing')} className="btn btn-primary">
                Try Again
              </button>
              <button onClick={() => navigate('/customer/cart')} className="btn btn-outline">
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-container card">
          <div className="secure-badge">🔒 Secure Gateway</div>
          <h1>Complete Your Order</h1>
          
          <div className="payment-summary-block">
            <p>You are about to pay <strong>₹{total.toFixed(2)}</strong> to Electrical Store.</p>
            <p className="sub-text">Please ensure your shipping information is correct before proceeding.</p>
          </div>

          <div className="payment-actions">
            <button onClick={initPayment} className="btn btn-primary btn-large btn-block" disabled={isProcessing}>
              {isProcessing ? 'Connecting to Secure Server...' : 
                (orderData.paymentMethod === 'cod' ? 'Complete Cash on Delivery Order' : 'Pay Securely with Razorpay')
              }
            </button>
          </div>
          
          <div className="trust-badges">
            <span>✓ Encrypted connection</span>
            <span>✓ Verified merchants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
