import { useState, useEffect } from 'react';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    location: { city: '', area: '' },
    cuisine: '',
    openingTime: '',
    closingTime: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    fetch('/api/admin/restaurants', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setRestaurants(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/admin/restaurants/${editingId}`
        : '/api/admin/restaurants';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      fetchRestaurants();
      setFormData({ name: '', image: '', description: '', location: { city: '', area: '' }, cuisine: '', openingTime: '', closingTime: '' });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (restaurant) => {
    setFormData(restaurant);
    setEditingId(restaurant._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this restaurant?')) {
      await fetch(`/api/admin/restaurants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRestaurants();
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Restaurants</h1>
        <button
          onClick={() => {
            setFormData({ name: '', image: '', description: '', location: { city: '', area: '' }, cuisine: '', openingTime: '', closingTime: '' });
            setEditingId(null);
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Cuisine"
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="City"
            value={formData.location.city}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Area"
            value={formData.location.area}
            onChange={(e) => setFormData({ ...formData, location: { ...formData.location, area: e.target.value } })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
          />
          <input
            placeholder="Opening Time"
            value={formData.openingTime}
            onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Closing Time"
            value={formData.closingTime}
            onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
          >
            {editingId ? 'Update' : 'Create Restaurant'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {restaurant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {restaurant.cuisine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {restaurant.location.city}, {restaurant.location.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurants;

