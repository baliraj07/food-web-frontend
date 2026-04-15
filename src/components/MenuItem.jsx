import { useState } from 'react';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    onAddToCart({ ...item, quantity: 1 });
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
      />
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-500">₹{item.price}</span>
          {quantity > 0 ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setQuantity(q => Math.max(0, q - 1))}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
