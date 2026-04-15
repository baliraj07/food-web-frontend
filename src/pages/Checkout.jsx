import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressAPI, orderAPI, paymentAPI } from '../services/api';
import { FaTruck, FaCreditCard, FaBoxOpen } from 'react-icons/fa';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses ] = useState([]);
  const [selectedAddress, setSelectedAddress ] = useState('');
  const [loading, setLoading ] = useState(true);
  const [paymentMethod, setPaymentMethod ] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder ] = useState(false);

  const deliveryCharge = 50;
  const grandTotal = totalAmount + deliveryCharge;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await addressAPI.getUserAddresses();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0]._id);
        }
      } catch (error) {
        console.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      console.error('Please select delivery address');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        items: cart,
        totalAmount,
        addressId: selectedAddress
      };
      const { data: orderDataRes } = await orderAPI.create(orderData);

      const paymentRes = await paymentAPI.process({
        orderId: orderDataRes.order._id,
        method: paymentMethod
      });

      if (paymentRes.data.payment.status === 'paid') {
        clearCart();
        console.log('Order placed successfully! Order ID: ' + orderDataRes.order._id);
        navigate('/orders');
      } else {
        console.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Order placement failed: ' + error.response?.data?.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <FaBoxOpen className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to cart to checkout</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Review your order and complete payment</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Order Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Summary ({cart.length} items)</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-3">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Address & Payment */}
        <div className="space-y-6">
          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaTruck className="h-5 w-5" />
              Delivery Address
            </h2>
            <select 
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPlacingOrder}
            >
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.name} | {address.house}, {address.area}, {address.city} - {address.pincode}
                </option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCreditCard className="h-5 w-5" />
              Payment Method
            </h2>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-blue-600"
                  disabled={isPlacingOrder}
                />
                <span>Cash on Delivery (Free)</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-blue-600"
                  disabled={isPlacingOrder}
                />
                <span>Online Payment (Stripe)</span>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cart.length === 0}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPlacingOrder ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Placing Order...
              </>
            ) : (
              `Place Order - ₹${grandTotal.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
