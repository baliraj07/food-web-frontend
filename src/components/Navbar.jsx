import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFilter } from '../context/FilterContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { totalItems } = useCart();
  const { search, setSearch, minRating, setMinRating, priceRange, setPriceRange } = useFilter();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  // Update login state from user
  useEffect(() => {
    setIsLoggedIn(!!user);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const baseNavLinks = [
    { to: '/orders', label: 'Orders' },
    { to: '/profile', label: 'Profile' },
  ];

  const navLinks = isAdmin 
    ? [...baseNavLinks, { to: '/add-restaurant', label: 'Add Restaurant' }]
    : baseNavLinks;

  const adminLink = isAdmin ? { to: '/admin', label: 'Admin Panel' } : null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 shadow-2xl'
          : 'bg-white/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              FoodHub 🍔
            </Link>
          </motion.div>

          {/* Search & Filters - Desktop */}
          {!isAuthPage && (
            <div className="flex items-center space-x-4 md:flex">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {/* Filters */}
              <div className="hidden md:flex items-center space-x-2">
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value={0}>All Ratings</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          )}



          {/* Desktop Menu */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-6">

              {isLoggedIn &&
                navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-3 py-2 text-sm font-semibold text-gray-700 group"
                  >
                    {link.label}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}

              {adminLink && (
                <Link
                  to={adminLink.to}
                  className="relative px-3 py-2 text-sm font-semibold text-purple-600 bg-purple-100 group rounded-lg"
                >
                  {adminLink.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}

              {/* Auth Buttons */}
              {isLoggedIn ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-orange-100 hover:bg-orange-200 rounded-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Cart */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative cursor-pointer"
              >
                <Link to="/cart">
                  <FiShoppingCart className="w-7 h-7 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthPage && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && !isAuthPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">

              {isLoggedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-3 text-lg font-medium rounded-xl text-gray-700 hover:bg-orange-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {adminLink && (
                    <Link
                      to={adminLink.to}
                      className="block px-4 py-3 text-lg font-bold text-purple-600 bg-purple-100 rounded-xl hover:bg-purple-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {adminLink.label}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-lg font-medium text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-lg font-medium text-gray-700 bg-orange-100 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingCart className="w-6 h-6" />
                <span>Cart ({totalItems})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
