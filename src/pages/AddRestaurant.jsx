import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', image: '' }]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    location: { city: '', area: '' },
    cuisine: 'Indian',
    openingTime: '',
    closingTime: ''
  });

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const cuisines = ['Indian', 'Chinese', 'Italian', 'Fast Food', 'Continental', 'South Indian', 'Mexican', 'Thai'];

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', image: '' }]);
  };

  const removeMenuItem = (index) => {
    if (menuItems.length > 1) {
      const updated = menuItems.filter((_, i) => i !== index);
      setMenuItems(updated);
    }
  };

  const updateMenuItem = (index, field, value) => {
    const updated = menuItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMenuItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate
    if (menuItems.some(item => !item.name || !item.price || !item.image)) {
      alert('Please fill all menu item fields');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        menu: menuItems.map(item => ({
          name: item.name,
          price: parseFloat(item.price),
          image: item.image
        }))
      };

      await restaurantAPI.createRestaurant(submitData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Success! 🎉</h1>
          <p className="text-lg text-gray-600 mb-8">Your restaurant has been registered successfully!</p>
          <p className="text-sm text-green-600 font-medium">Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 mb-8 text-gray-600 hover:text-gray-900 font-medium"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 lg:p-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Register Your Restaurant 🍽️
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join as a restaurant partner and start receiving orders from hungry customers!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                  required
                />
              </div>

              {/* Location & Cuisine */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
                  <input
                    type="text"
                    name="location.area"
                    value={formData.location.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine Type *</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 bg-white"
                    required
                  >
                    {cuisines.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* timings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Time *</label>
                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Time *</label>
                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Menu Items */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-6">Menu Items * (Add at least one)</label>
                <AnimatePresence>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-4 hover:border-orange-200 transition-all duration-200 relative"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                            <input
                              type="text"
                              placeholder="e.g., Biryani"
                              value={item.name}
                              onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-orange-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              placeholder="e.g., 250"
                              value={item.price}
                              onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-orange-400"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                            <input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={item.image}
                              onChange={(e) => updateMenuItem(index, 'image', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-orange-400"
                              required
                            />
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeMenuItem(index)}
                          className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                          disabled={menuItems.length === 1}
                        >
                          <FiTrash2 className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addMenuItem}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 mx-auto"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Menu Item</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-6 px-8 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  '🚀 Register My Restaurant'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddRestaurant;

