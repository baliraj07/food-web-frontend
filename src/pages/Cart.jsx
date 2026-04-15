import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (!user) {
      console.warn("Please login or register first to place an order");
      navigate('/login');
      return;
    }

    // Store cart data temporarily
    const cartData = {
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      totalAmount
    };
    localStorage.setItem('pendingCart', JSON.stringify(cartData));
    
    // Navigate to address instead of placing order directly
    navigate('/address');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <Link to="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button 
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <CartItem key={item.id || item.name} item={item} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 sticky bottom-0">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg"
        >
          {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Cart;

