import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addressAPI, orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const Address = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingCart, setPendingCart] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const cartData = localStorage.getItem('pendingCart');
    if (cartData) {
      setPendingCart(JSON.parse(cartData));
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.house.trim()) newErrors.house = 'House/Flat No is required';
    if (!formData.area.trim()) newErrors.area = 'Area/Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm() || !pendingCart) return;

    setLoading(true);
    try {
      // Create address
      const addressRes = await addressAPI.create(formData);
      const addressId = addressRes.data.address._id;

      // Create order with addressId
      await orderAPI.create({
        ...pendingCart,
        addressId
      });

      // Cleanup
      localStorage.removeItem('pendingCart');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order placement failed:', error);
      if (error.response?.status === 401) {
        setSubmitError('Please login or register first to place an order');
        localStorage.removeItem('pendingCart');
        navigate('/login');
        return;
      }
      setSubmitError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!pendingCart) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Delivery Address
          </h1>
          <p className="text-gray-600">Enter your delivery details to complete order</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                errors.name ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                errors.phone ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="9876543210"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House/Flat No. *</label>
            <input
              type="text"
              name="house"
              value={formData.house}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                errors.house ? 'border-red-300 focus:ring-red-500' : ''
              }`}
              placeholder="Flat 4B, Sunshine Apartments"
            />
            {errors.house && <p className="mt-1 text-sm text-red-600">{errors.house}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area/Street *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.area ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="MG Road"
              />
              {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.city ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="Bangalore"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.state ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="Karnataka"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.pincode ? 'border-red-300 focus:ring-red-500' : ''
                }`}
                placeholder="560001"
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-6 rounded-2xl transition-all duration-200"
            >
              Change Cart
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              {loading ? 'Placing Order...' : 'Deliver Here →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;

