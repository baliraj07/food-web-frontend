import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiInstagram, 
  FiFacebook, 
  FiTwitter 
} from 'react-icons/fi';

const Footer = () => {
  return (
    <>
      {/* Main Footer Sections */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* A. Brand Section */}
            <div>
              <h3 className="text-2xl font-bold text-orange-500 mb-4">FoodHub</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Discover the best food & drinks near you.
                Order from your favorite restaurants with fast delivery.
              </p>
              <div className="h-10 w-32 bg-orange-500/20 rounded-lg flex items-center px-4">
                <span className="text-orange-400 text-sm font-medium">FoodHub</span>
              </div>
            </div>

            {/* B. Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 flex items-center">
                  Home
                </Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 flex items-center">
                  Cart
                </Link></li>
                <li><Link to="/orders" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 flex items-center">
                  Orders
                </Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 flex items-center">
                  Profile
                </Link></li>
              </ul>
            </div>

            {/* C. Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@foodhub.com" className="text-gray-400 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    support@foodhub.com
                  </a>
                </li>
                <li>
                  <a href="tel:+12345678900" className="text-gray-400 hover:text-orange-400 transition-all duration-300 flex items-center group">
                    +1-234-567-8900
                  </a>
                </li>
                <li className="text-gray-400">Your City, State</li>
              </ul>
            </div>

            {/* D. Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/zomato/?hl=en" className="w-12 h-12 bg-white/10 hover:bg-orange-500/20 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
                  <FiInstagram className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/zomato/" className="w-12 h-12 bg-white/10 hover:bg-orange-500/20 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
                  <FiFacebook className="w-6 h-6" />
                </a>
                <a href="https://x.com/zomato" className="w-12 h-12 bg-white/10 hover:bg-orange-500/20 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
                  <FiTwitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 FoodHub. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
