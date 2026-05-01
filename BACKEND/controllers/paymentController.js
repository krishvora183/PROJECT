const Razorpay = require('razorpay');
const crypto = require('crypto');

// Note: Ensure you put your real Razorpay Keys in the .env file
// When you make a real Razorpay account, replace these!
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_dummy_key_here',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_dummy_secret_here',
  });
};

// @desc    Create a Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    // Amount is in smallest currency unit (paise for INR, meaning multiply by 100)
    const options = {
      amount: parseInt(amount * 100), 
      currency: currency || 'INR',
      receipt: 'receipt_' + Date.now(),
      payment_capture: 1 // auto capture
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).send('Some error occurred while creating order');
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay Error: ', error);
    res.status(500).json({ message: 'Error creating Razorpay order. (Check your API Keys)', error: error.message });
  }
};

// @desc    Verify Payment Signature from Razorpay
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create our own signature using the order_id, payment_id and our secret
    const secret = process.env.RAZORPAY_KEY_SECRET || 'your_dummy_secret_here';
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    
    // Generate HMAC SHA256 signature
    const expectedSign = crypto
      .createHmac('sha256', secret)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createOrder, verifyPayment };
