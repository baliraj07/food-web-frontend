import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import MenuItem from '../components/MenuItem';
import { useCart } from '../context/CartContext';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await restaurantAPI.getById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-64 object-cover rounded-xl mb-6" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
                ★ {restaurant.rating}
              </div>
              <span className="text-gray-600">• 30-40 min • ₹50 delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurant.menu.map((item) => (
          <MenuItem key={item._id || item.name} item={{ ...item, restaurantId: id }} onAddToCart={addItem} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
