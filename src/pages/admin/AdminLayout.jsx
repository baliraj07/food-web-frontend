import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-gray-200">
        <div className="h-full py-6 px-6 flex flex-col">
          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-4">
            <Link
              to="/admin/dashboard"
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/restaurants"
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Manage Restaurants
            </Link>
            <Link
              to="/admin/orders"
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              Manage Orders
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
