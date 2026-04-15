import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();

  const updateItemQuantity = (newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(item.id || item.restaurantId || item.name, newQuantity);
    } else {
      removeItem(item.id || item.restaurantId || item.name);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex items-center space-x-4">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg text-gray-900 truncate">{item.name}</h3>
        <p className="text-orange-500 font-bold text-lg">₹{item.price}</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
          <button 
            onClick={() => updateItemQuantity(item.quantity - 1)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            -
          </button>
          <span className="font-bold w-6 text-center">{item.quantity}</span>
          <button 
            onClick={() => updateItemQuantity(item.quantity + 1)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(0)}</p>
          <button 
            onClick={() => removeItem(item.id || item.restaurantId || item.name)}
            className="text-red-500 hover:text-red-700 text-sm font-medium mt-1"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
