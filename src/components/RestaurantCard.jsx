const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      <img 
        src={restaurant.image} 
        alt={restaurant.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            ★ {restaurant.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {restaurant.cuisine}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            ₹ {restaurant.avgPrice ? restaurant.avgPrice.toFixed(0) : 'N/A'}
          </span>
          {restaurant.locationString && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              {restaurant.locationString}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
